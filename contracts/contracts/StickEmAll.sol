// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
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
     * Depicts a request to mint objects out of a booster.
     */
    struct BoosterOpenRequest {
        /**
         * The booster pack rule being opened.
         */
        uint256 ruleId;

        /**
         * The address that will receive the new assets.
         */
        address owner;
    }

    /**
     * The booster open requests.
     */
    mapping(uint256 => BoosterOpenRequest) private boosterOpenRequests;

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

    /**
     * The keyhash to use. Values:
     * Local mock keyhash: 0 / ignored.
     * Polygon Amoy keyhash (500 gwei): 0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899
     * Polygon mainnet keyhashes:
     * - 200 gwei: 0x0ffbbd0c1c18c0263dd778dadd1d64240d7bc338d95fec1cf0473928ca7eaf9e
     * - 500 gwei: 0x719ed7d7664abc3001c18aac8130a2265e1e70b7e036ae20f3ca8b92b3154d86
     * - 1000 gwei: 0x192234a5cda4cc07c0b66dfbcfbb785341cc790edc50032e842667dbb506cada
     */
    bytes32 private keyHash;

    /**
     * The subscription id to use.
     */
    uint256 private subscriptionId;

    constructor(
        address _worldsManagement, address _coordinator,
        bytes32 _keyHash, uint256 _subscriptionId
    ) ERC1155("") VRFConsumerBaseV2Plus(_coordinator) {
        require(_worldsManagement != address(0), "StickEmAll: Invalid management contract");
        worldsManagement = StickEmAllWorldsManagement(worldsManagement);
        keyHash = _keyHash;
        _subscriptionId = subscriptionId;
    }

    /**
     * Decomposes a sticker's ID. It also validates it being a sticker ID.
     */
    function _decomposeSticker(
        uint256 _stickerId
    ) private pure returns (uint256 albumId, uint16 pageId, uint16 slotId) {
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
     * Gets the fiat price of a purchase of a booster pack.
     */
    function getBoosterPackFiatPrice(
        uint256 _albumTypeId, uint16 _ruleId, uint256 _amount
    ) public view returns (uint256) {
        (,bool active,uint32 fiatPrice,,,,,,,) = worldsManagement.albumBoosterPackRules(_albumTypeId, _ruleId);
        if (!active) return 0;
        return _amount * worldsManagement.worlds().params().getNativeCost(fiatPrice);
    }

    /**
     * Gets the native price of a purchase of a booster pack.
     */
    function getBoosterPackNativePrice(
        uint256 _albumTypeId, uint16 _ruleId, uint256 _amount
    ) public view returns (uint256) {
        return worldsManagement.worlds().params().getNativeCost(getBoosterPackFiatPrice(
            _albumTypeId, _ruleId, _amount
        ));
    }

    /**
     * Purchases N booster packs.
     */
    function purchaseBoosterPacks(uint256 _albumTypeId, uint16 _ruleId, uint256 _amount) external payable {
        // 1. Check the amount to be > 0.
        require(_amount > 0, "StickEmAll: The amount cannot be zero");
        // 2. Check the rule to be valid and active.
        require(
            _ruleId < worldsManagement.albumBoosterPackRulesCount(_albumTypeId),
            "StickEmAll: Invalid album / rule id"
        );
        (,bool active,uint32 fiatPrice,uint32 fiatFee,,,,,,) = worldsManagement.albumBoosterPackRules(_albumTypeId, _ruleId);
        require(active, "StickEmAll: The sale of that booster pack is not available");
        // 3. Check the price to be paid.
        uint256 nativePrice = _amount * worldsManagement.worlds().params().getNativeCost(fiatPrice);
        uint256 nativeFee = _amount * worldsManagement.worlds().params().getNativeCost(fiatFee);
        uint256 nativeRemainder = nativePrice - nativeFee;
        require(msg.value >= nativePrice, "StickEmAll: Insufficient payment");
        // 4. Get the world that minted the type.
        (uint256 worldId,,,,,,,,) = worldsManagement.albumDefinitions(_albumTypeId);
        (,,,,,,address earningsReceiver) = worldsManagement.worlds().worlds(worldId);
        // 5. Properly forward the amounts, and mint.
        payable(earningsReceiver).call{value:nativeRemainder}("");
        payable(worldsManagement.worlds().params().earningsReceiver()).call{value:nativeFee}("");
        _mint(msg.sender, (_albumTypeId << 31)|0x40000000|_ruleId, _amount, "");
    }

    /**
     * Opens a booster pack.
     */
    function openBoosterPack(address owner, uint256 _boosterPackAssetId) external {
        // Check to be authorized, and burn the token.
        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "StickEmAll: Not authorized to open booster packs for this address"
        );
        require(
            ((_boosterPackAssetId & 0x40000000) != 0) && ((_boosterPackAssetId & ((1<<255) - 1)) != 0),
            "StickEmAll: Invalid asset id"
        );
        _burn(msg.sender, _boosterPackAssetId, 1);
        // Create the request.
        uint256 requestID = s_vrfCoordinator.requestRandomWords(VRFV2PlusClient.RandomWordsRequest({
            keyHash: keyHash, subId: subscriptionId, requestConfirmations: 3, callbackGasLimit: 250000,
            numWords: 1, extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
        }));
        boosterOpenRequests[requestID] = BoosterOpenRequest({ruleId: _boosterPackAssetId, owner: owner });
    }

    /**
     * Adds the bronze and silver cards (at most pairs 0..13) and perhaps the
     * gold/platinum card (at most pair 14).
     */
    function getStickers(
        uint8 bronzeStickers, uint8 silverStickers, bool hasGoldOrPlatinum,
        uint256 platinumProbability, uint256 albumTypeId, uint256 word
    ) private view returns (uint256[] memory, uint256[] memory) {
        uint256 index = 0;
        uint256 length = bronzeStickers + silverStickers;
        if (hasGoldOrPlatinum) length += 1;
        uint256[] memory keys = new uint256[](length);
        uint256[] memory values = new uint256[](length);
        {
            uint16 bronzeStickersCount = uint16(worldsManagement.albumBronzeStickerIndicesCount(albumTypeId));
            for(uint8 idx = 0; idx < bronzeStickers; idx++)
            {
                values[index] = 1;
                keys[index] = albumTypeId << 31 | worldsManagement.albumBronzeStickerIndices(
                    albumTypeId, ((word & 0xFFFF) % bronzeStickersCount)
                );
                index += 1;
                word = word >> 16;
            }
        }
        {
            uint16 silverStickersCount = uint16(worldsManagement.albumSilverStickerIndicesCount(albumTypeId));
            for(uint8 idx = 0; idx < silverStickersCount; idx++)
            {
                values[index] = 1;
                keys[index] = albumTypeId << 31 | worldsManagement.albumSilverStickerIndices(
                    albumTypeId, ((word & 0xFFFF) % silverStickersCount)
                );
                index += 1;
                word = word >> 16;
            }
        }
        if (hasGoldOrPlatinum)
        {
            uint16 goldStickersCount = uint16(worldsManagement.albumBronzeStickerIndicesCount(albumTypeId));
            uint16 platinumStickersCount = uint16(worldsManagement.albumSilverStickerIndicesCount(albumTypeId));

            values[index] = 1;
            if (goldStickersCount == 0 || ((word & 0xFFFF) % 10000) > (10000 - platinumProbability)) {
                // No gold stickers or the probs chose platinum: pick platinum.
                keys[index] = albumTypeId << 31 | worldsManagement.albumPlatinumStickerIndices(
                    albumTypeId, ((word & 0xFFFF) % platinumStickersCount)
                );
            } else {
                // Pick gold.
                keys[index] = albumTypeId << 31 | worldsManagement.albumGoldStickerIndices(
                    albumTypeId, ((word & 0xFFFF) % goldStickersCount)
                );
            }
        }

        return (keys, values);
    }

    /**
     * Attends opened booster packs (up to 15 words).
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // Get the request.
        BoosterOpenRequest storage request = boosterOpenRequests[requestId];
        // Get the rule's elements.
        uint256 albumTypeId = request.ruleId >> 31;
        uint16 ruleIdx = uint16(request.ruleId & 0xFFFF);
        (
            ,,,,,,
            uint8 bronzeCount, uint8 silverCount, bool hasGoldOrPlatinum, uint16 platinumProbs
        ) = worldsManagement.albumBoosterPackRules(albumTypeId, ruleIdx);
        (uint256[] memory keys, uint256[] memory values) = getStickers(
            bronzeCount, silverCount, hasGoldOrPlatinum, platinumProbs, albumTypeId, randomWords[0]
        );
        _mintBatch(request.owner, keys, values, "");
    }
}
