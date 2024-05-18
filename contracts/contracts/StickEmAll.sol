// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "./StickEmAllWorldsManagement.sol";

/**
 * StickEmAll is the main point where users purchase and
 * manage their albums and stickers, stick them, and get
 * their achievements.
 */
contract StickEmAll is ERC1155, VRFConsumerBaseV2Plus {
    /**
     * Some notes about the IDs of the tokens:
     * - Albums are NFTs:       [1:1bit][albumInstId:225bit].
     * - Booster packs are FTs: [0:1bit][albumTypeId:224bit][1(=BP):1bit][0:14bit][ruleId:16bit].
     * - Stickers are FTs:      [0:1bit][albumTypeId:224bit][0(=ST):1bit][0:14bit][pageIdx:13bit][slotIdx:3bit].
     *
     * Album instances are NFTs and its data will be tracked like this:
     * - Struct field: The id of the underlying album type.
     * - Struct field: How many stickers pasted (contrasts against: type's totalStickers).
     * - mapping[pageIdx<<3|slotIdx]: Whether sticker in that slot is pasted or not
     *   (contrasts against: type's albumPageStickersDefinitions to check which are valid).
     * - mapping[pageIdx]: How many stickers in that page are pasted
     *   (contrasts against: albumPageStickersDefinitionsCount for that page).
     * - Struct field: Completed pages (contrasts against: type's completedPages).
     * - Struct field: Completed (boolean).
     *
     * Achievements are also stored here. They're only stored like this:
     * - array: List of achievement indices (0 .. album's achievement definitions count - 1).
     *
     * Available operations:
     *
     * - Stick(albumInstanceId, stickerId): Pastes a sticker in its slot.
     *   - Checks are:
     *     - albumInstanceId must be a valid album instance owned by the user
     *       (implicit: is NFT of type Album of a valid Album type id) or at
     *       least approved onto it.
     *     - stickerId must be a sticker FT for that album's type and of the
     *       same owner (also, the same user or approved onto it).
     *     - The album must accept the given sticker (decompose it and test it).
     *     - The album must have an empty slot for that sticker.
     *   - Actions are:
     *     - Burn 1 sticker token only, and mark the position as pasted.
     *       - If it has an achievement, grant the achievement to the user.
     *     - Increment the page's completeness and contrast it.
     *     - IF it was completed: Increment the album's completeness (pages)
     *       and contrast it. Otherwise, terminate.
     *       - On completed, grant the page achievement to the user if it has one.
     *     - If the album was completed, grant its achievement to the user.
     *
     * - PurchaseBoosterPacks(typeId, ruleId, amount) payable: Purchases booster packs.
     *   - Checks are:
     *     - ruleId is created & active for typeId (implicit checks: there are at
     *       least [ruleId+1] rules defined for the existing album typeId).
     *     - The amount is at least 1.
     *     - Getting the native price of a booster pack (converting it properly
     *       by using the params), and multiplying it by the amount, the user put /
     *       afforded it properly in native token.
     *   - Actions are:
     *     - Sent the extra money back to the user.
     *     - Get the min price (in MATIC) from the contract / the booster pack rule.
     *       I HAVE TO PROPERLY DETERMINE THIS LATER. Perhaps by a param.
     *     - Send minPrice * amount to the params' earningsReceiver.
     *     - Send rule's price * amount - thePreviousAmount to the earningsReceiver
     *       defined in the album type's world.
     *     - Mint {amount} boosters to the user.
     *
     * - OpenBoosterPack(boosterPackId): Opens a booster pack.
     *   - Checks are:
     *     - The user has at least a booster pack token of that type (implicit checks:
     *       the token is valid and the booster pack rule exists; also the album does
     *       meet the requirements for the pack).
     *   - Actions are:
     *     - Burn one token from the user.
     *     - Send a VRF request for only ONE number.
     * - BoosterPackOpened(requestId, values): Callback.
     *   - Actions are:
     *     - From byte-pairs 0/1 to 26/27 (or perhaps LESS, depending on the booster
     *       pack's stickers amount) take each uint16 number {num} and the category
     *       of rarity it corresponds to. Then compute {num}%N where N is the amount
     *       of stickers of that rarity defined in the album. Keep the resulting value
     *       and mint the proper sticker id with that index to the user. The rarity
     *       here is BRONZE or SILVER only.
     *     - Take word (30/31)%10000. If it is greater than (10000-platinumProbability)
     *       then the next mint will be a platinum sticker. Otherwise, it will be a gold
     *       sticker. Do not do this step if gold or platinum (or both) are not defined.
     *       If exactly one of those rarities is defined, take THAT one and do not take
     *       the probability in consideration.
     *     - If there's a gold/platinum type taken or randomly chosen, take word (28/29)
     *       and compute num%N where N is the amount of stickers of that rarity.
     *     - Mint all the tokens. This implies at most 15 _mint operations with their
     *       corresponding events or, at least, some sort of _mintBatch operation.
     *     - THIS OPERATION WILL BE LINK-EXPENSIVE.
     */

    /**
     * This is the data for the album instance. The NFT
     * data will be extracted from the type and, as extra
     * fields, whether it is completed or not (and also
     * how many pages are completed).
     */
    struct AlbumInstance {
        /**
         * Whether this album instance is valid/created.
         */
        bool created;

        /**
         * The owner of this album.
         */
        address owner;

        /**
         * The type of the album.
         */
        uint256 albumTypeId;

        /**
         * The amount of pasted stickers.
         */
        uint256 pastedStickers;

        /**
         * The amount of completed pages.
         */
        uint256 completedPages;

        /**
         * Whether it is completed or not.
         */
        bool completed;
    }

    /**
     * The album instances.
     */
    mapping(uint256 => AlbumInstance) public albumInstances;

    /**
     * Tells whether a sticker is pasted or not.
     * It does NOT test whether the sticker is valid, but only
     * whether they're pasted. The key is pageIdx<<3|slotIdx.
     */
    mapping(uint256 => mapping(uint16 => bool)) public pastedStickers;

    /**
     * Tells the amount of stickers in a page.
     * The key is pageIdx.
     */
    mapping(uint256 => mapping(uint16 => uint16)) public pastedStickersCount;

    /**
     * Tells which achievements were reached by this album.
     */
    mapping(uint256 => mapping(uint256 => bool)) public achieved;

    /**
     * The Worlds Management contract.
     */
    StickEmAllWorldsManagement public worldsManagement;

    /**
     * Event telling about an achievement.
     */
    event Achievement(uint256 indexed albumId, uint16 indexed achievementId);

    constructor(address _worldsManagement, address _coordinator) ERC1155("") VRFConsumerBaseV2Plus(_coordinator) {
        require(_worldsManagement != address(0), "StickEmAll: Invalid management contract");
        worldsManagement = StickEmAllWorldsManagement(worldsManagement);
    }

    /**
     * Decomposes a sticker's ID. It also validates it being a sticker ID.
     */
    function _decomposeSticker(
        uint256 _stickerId
    ) private view returns (uint256 albumId, uint16 pageId, uint16 slotId){
        require(_stickerId & (1<<0xFF) == 0 && _stickerId & 0x3FFFFFFF == 0, "StickEmAll: Not a sticker id");
        albumId = _stickerId >> 31;
        pageId = uint16((_stickerId >> 3) & 0x1FFF);
        slotId = uint16(_stickerId & 7);
    }

    /**
     * Pastes a sticker into the album.
     */
    function stick(uint256 _albumId, uint256 _stickerId) external {
        AlbumInstance storage instance = albumInstances[_albumId];
        // 1. The album must exist.
        require(instance.created, "StickEmAll: Invalid album");
        // 2. The album's owner must be the sender, or must have
        //    allowed the sender on their assets.
        address albumOwner = instance.owner;
        require(
            msg.sender == albumOwner || isApprovedForAll(albumOwner, msg.sender),
            "StickEmAll: Not authorized to paste on this album"
        );
        // 3. The sticker must be properly decomposed to the album's type.
        (uint256 albumTypeId, uint16 pageId, uint16 slotId) = _decomposeSticker(_stickerId);
        // 4. Check the sticker is valid or this album.
        require(instance.albumTypeId == albumTypeId, "StickEmAll: The sticker is not for this album");
        // 5. Burn exactly one token.
        _burn(albumOwner, _stickerId, 1);
        // 6. Require the token to be NOT set in the album.
        uint16 relativeId = uint16(_stickerId & 0xFFFF);
        require(
            !pastedStickers[_albumId][relativeId],
            "StickEmAll: Sticker already pasted in this album"
        );
        // ... Now:
        // 3. Same for the album. If completed, set its achievement (it will have).

        // 1. Set the sticker in the page. Set the achievement, if any.
        pastedStickers[_albumId][relativeId] = true;
        uint16 count_ = pastedStickersCount[_albumId][pageId] + 1;
        pastedStickersCount[_albumId][pageId] = count_;
        (,,,uint16 stickerAchievementId) = worldsManagement.albumPageStickersDefinitions(albumTypeId, pageId, slotId);
        if (stickerAchievementId > 0) {
            achieved[_albumId][stickerAchievementId] = true;
            emit Achievement(_albumId, stickerAchievementId);
        }
        // 2. Set the pages count in the album, if page completed. Set the achievement, if any.
        (,,,uint8 maxStickers,,,) = worldsManagement.albumPageDefinitions(albumTypeId, pageId);
        if (count_ == maxStickers) {
            instance.completedPages += 1;
            (,,,uint16 pageAchievementId) = worldsManagement.albumPageStickersDefinitions(albumTypeId, pageId, slotId);
            if (pageAchievementId > 0) {
                achieved[_albumId][pageAchievementId] = true;
                emit Achievement(_albumId, pageAchievementId);
            }

            if (instance.completedPages == worldsManagement.albumPageDefinitionsCount(albumTypeId)) {
                instance.completed = true;
                achieved[_albumId][0] = true;
                emit Achievement(_albumId, 0);
            }
        }
    }

    /**
     * Attends opened booster packs (up to 15 words).
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // TODO implement.
    }
}
