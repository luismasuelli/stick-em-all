// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./StickEmAllParams.sol";
import "./StickEmAllWorlds.sol";

/**
 * This contract allows world managers to define albums,
 * stickers, and achievements.
 */
contract StickEmAllWorldsManagement {
    /**
     * The cost parameter to define an achievement.
     */
    bytes32 private constant DefineAchievement = keccak256("Costs::Albums::DefineAchievement");

    /**
     * The cost parameter to define an album.
     */
    bytes32 private constant DefineAlbum = keccak256("Costs::Albums::DefineAlbum");

    /**
     * The cost parameter to define an album page.
     */
    bytes32 private constant DefinePage = keccak256("Costs::Albums::DefinePage");

    /**
     * The cost parameter to define a sticker.
     */
    bytes32 private constant DefineSticker = keccak256("Costs::Albums::DefineSticker");

    /**
     * The maximum amount of defined albums overall.
     */
    uint256 private constant MaxNumberOfDefinedAlbums = 1 << 224;

    /**
     * Achievement definitions stand for albums' achievements.
     * They will be known by their index in the album definition.
     *
     * Defining an achievement has costs.
     *
     * Each album can define up to 2**32 achievements, where the
     * achievement 0 is for the album itself.
     */
    struct AchievementDefinition {
        /**
         * Each achievement has a type. Types will be defined
         * later and will tell how the achievement can be used
         * after being obtained, if any. The type 0 is reserved
         * to mean that it is not a defined/valid achievement.
         *
         * Typically, each type will have its own function or
         * page to make use of it.
         */
        bytes32 type_;

        /**
         * Each achievement has a display name.
         */
        string displayName;

        /**
         * Each achievement has exactly one image (squared one).
         * This pretty much matches what will be defined in the
         * stickers.
         *
         * Recommended size is: 400x400.
         */
        string image;

        /**
         * The data that is associated to the achievement. The
         * format of the data is related to the chosen type for
         * the achievement.
         */
        bytes data;
    }

    /**
     * The rarity type for a defined sticker.
     */
    enum StickerRarity {
        Bronze, // "Common" stickers range
        Silver, // "Uncommon" stickers range
        Gold, // "Rare" stickers range
        Platinum // Platinum is matched in the same range as Gold, but has a distinct probability.
    }

    /**
     * A sticker definition is NOT the same of an achievement.
     * Stickers can be exchanged before they're glued, and they
     * even become fungible tokens to be exchanged. However, a
     * sticker can also imply an achievement (and, like they,
     * it has a name and image).
     *
     * Each album can define up to 2**32 - 1 different stickers
     * and it is NOT forced to use all the stickers' rarities.
     * The id=0 is used to tell that no sticker is defined in a
     * given slot.
     */
    struct StickerDefinition {
        /**
         * Each sticker has a display name.
         */
        string displayName;

        /**
         * Each sticker has exactly one image (squared one).
         * This pretty much matches what will be defined in the
         * matching achievement.
         *
         * Recommended size is: 400x400.
         */
        string image;

        /**
         * The rarity type of the sticker.
         */
        StickerRarity rarity;

        /**
         * The index of the related achievement. If this value is
         * 0, this means there's no achievement set (the achievement
         * 0 is always reserved to the Album, which always has that
         * implicit achievement - so here is used to say "none").
         */
        uint16 achievementId;
    }

    /**
     * All the available layouts for a page. This accounts for the number of pages.
     */
    enum StickerPageLayout {
        OneItem,
        TwoItemsVertical,
        TwoItemsHorizontal,
        TwoItemsDiagonalUp,
        TwoItemsDiagonalDown,
        ThreeItemsVertical,
        ThreeItemsHorizontal,
        ThreeItemsTriangleUp,
        ThreeItemsTriangleDown,
        ThreeItemsDiagonalUp,
        ThreeItemsDiagonalDown,
        FourItemsSquare,
        FourItems1Up,
        FourItems1Down,
        FiveItemsSquare,
        FiveItems3Up,
        FiveItems3Down,
        SixItems
    }

    /**
     * Each album page will have one background image (better if 8:9), a
     * layout, and an OPTIONAL achievement (if zero, then no achievement
     * is assigned to that particular page). It will also have a name,
     * and the chosen layout (and, derived, the amount of slots).
     */
    struct AlbumPageDefinition {
        /**
         * The name. It is only for presentational matters.
         */
        string name;

        /**
         * The background image.
         */
        string backgroundImage;

        /**
         * The layout.
         */
        StickerPageLayout layout;

        /**
         * How many stickers can be defined in this page.
         */
        uint8 maxStickers;

        /**
         * How many stickers were defined so far in this page.
         */
        uint8 currentlyDefinedStickers;

        /**
         * The index of the related achievement. If this value is
         * 0, this means there's no achievement set (the achievement
         * 0 is always reserved to the Album, which always has that
         * implicit achievement - so here is used to say "none").
         */
        uint16 achievementId;

        /**
         * Whether the page is completely defined (i.e. all the slots
         * are defined).
         */
        bool complete;
    }

    /**
     * Each album definition has some data and also the pages.
     * All the albums have their achievement defined automatically.
     */
    struct AlbumDefinition {
        /**
         * The world id for this album.
         */
        uint256 worldId;

        /**
         * The album's name.
         */
        string name;

        /**
         * The album's edition (optional).
         */
        string edition;

        /**
         * The album's front image. Must be 8:9 and highly recommended.
         */
        string frontImage;

        /**
         * The album's front image. Must be 8:9 and highly recommended.
         */
        string backImage;

        /**
         * An image with the rarity icons. Icons should be squared and small,
         * and 4:1 in size ratio. First, the bronze icon. Then, the silver.
         * Then, the gold and finally the platinum one.
         */
        string rarityIcons;

        /**
         * The total amount of stickers in the album.
         */
        uint256 totalStickers;

        /**
         * The amount of pages that are completed (all their stickers defined).
         */
        uint256 completedPages;

        /**
         * Whether the album is released or not. Starts in false and
         * after it is released it cannot be edited anymore and also
         * it is ready to be:
         * - Price-defined, and sold.
         * - Have its booster packs defined.
         */
        bool released;
    }

    /**
     * Each RELEASED album can define SEVERAL booster pack rules. Once
     * a booster pack rule is defined, it can be disabled for sale but
     * cannot be deleted.
     *
     * Booster pack rules always tell how many stickers can be defined
     * for each type (up to 15 in total - suggested: 11/3/1). Also, it
     * will define a probability (expressed in units per 10000) to get
     * a platinum card instead of a gold card (this is ignored when no
     * gold or no platinum -or both- stickers are defined. A last/16th
     * number will be considering for the probability of getting gold
     * vs. platinum stickers. AT MOST 1 GOLD/PLATINUM STICKER IS SERVED.
     *
     * Booster packs will have a different design. They will have their
     * name and an image (in proportion 2:3).
     *
     * Defining a booster pack rule is free: Earnings will be taken from
     * the user's selling a booster pack (i.e. a percentage of the fiat
     * price of a booster pack).
     */
    struct BoosterPackRule {
        /**
         * Tells whether it is valid / exists.
         */
        bool created;

        /**
         * Tells whether this rule is active for sale or not.
         */
        bool active;

        /**
         * The sale price of a booster pack, expressed in USD cents.
         * It cannot be 0.
         */
        uint32 fiatPrice;

        /**
         * The name of the rule.
         */
        string name;

        /**
         * An image for the rule. Ideally a transparent-allowing
         * image of 2:3.
         */
        string image;

        /**
         * How many bronze stickers come. 0 to 15. Recommended: 11.
         * The total number of stickers cannot be 0 and cannot be
         * greater than 15.
         */
        uint8 bronzeStickersCount;

        /**
         * How many silver stickers come. 0 to 15. Recommended: 3.
         * The total number of stickers cannot be 0 and cannot be
         * greater than 15.
         */
        uint8 silverStickersCount;

        /**
         * Whether it contains a gold or platinum sticker. This
         * adds 1 to the count of stickers. After this, the total
         * number of stickers cannot be 0 and cannot be greater
         * than 15.
         */
        bool hasGoldOrPlatinumSticker;

        /**
         * Expressed in units per 10000, the probability of a
         * platinum card to appear instead of a gold card.
         */
        uint16 platinumProbability;
    }

    /**
     * The slots per layout entry.
     */
    mapping(StickerPageLayout => uint8) public slotsPerLayout;

    /**
     * The worlds contract.
     */
    StickEmAllWorlds public worlds;

    /**
     * All the defined albums. At most 1<<224 albums.
     */
    AlbumDefinition[] public albumDefinitions;

    /**
     * The length of all the defined albums.
     */
    function albumDefinitionsCount() public view returns (uint256) {
        return albumDefinitions.length;
    }

    /**
     * The per-album achievements.
     */
    mapping(uint256 => AchievementDefinition[]) public albumAchievementDefinitions;

    /**
     * The length of per-album achievements.
     */
    function albumAchievementDefinitionsCount(uint256 _albumId) public view returns (uint256) {
        return albumAchievementDefinitions[_albumId].length;
    }

    /**
     * The per-album pages.
     */
    mapping(uint256 => AlbumPageDefinition[]) public albumPageDefinitions;

    /**
     * The length of per-album pages.
     */
    function albumPageDefinitionsCount(uint256 _albumId) public view returns (uint256) {
        return albumPageDefinitions[_albumId].length;
    }

    /**
     * The per-album / per-page slots.
     */
    mapping(uint256 => mapping(uint16 => StickerDefinition[])) public albumPageStickersDefinitions;

    /**
     * The length of per-album / per-page slots.
     */
    function albumPageStickersDefinitionsCount(uint256 _albumId, uint16 _pageId) public view returns (uint256) {
        return albumPageStickersDefinitions[_albumId][_pageId].length;
    }

    /**
     * The per-album bronze stickers' indices.
     */
    mapping(uint256 => uint16[]) public albumBronzeStickerIndices;

    /**
     * The per-album count of bronze stickers.
     */
    function albumBronzeStickerIndicesCount(uint256 _albumId) public view returns (uint256) {
        return albumBronzeStickerIndices[_albumId].length;
    }

    /**
     * The per-album silver stickers' indices.
     */
    mapping(uint256 => uint16[]) public albumSilverStickerIndices;

    /**
     * The per-album count of silver stickers.
     */
    function albumSilverStickerIndicesCount(uint256 _albumId) public view returns (uint256) {
        return albumSilverStickerIndices[_albumId].length;
    }

    /**
     * The per-album gold stickers' indices.
     */
    mapping(uint256 => uint16[]) public albumGoldStickerIndices;

    /**
     * The per-album count of gold stickers.
     */
    function albumGoldStickerIndicesCount(uint256 _albumId) public view returns (uint256) {
        return albumGoldStickerIndices[_albumId].length;
    }

    /**
     * The per-album platinum stickers' indices.
     */
    mapping(uint256 => uint16[]) public albumPlatinumStickerIndices;

    /**
     * The per-album count of platinum stickers.
     */
    function albumPlatinumStickerIndicesCount(uint256 _albumId) public view returns (uint256) {
        return albumPlatinumStickerIndices[_albumId].length;
    }

    /**
     * The per-album booster pack rule definitions.
     */
    mapping(uint256 => BoosterPackRule[]) public albumBoosterPackRules;

    /**
     * The per-album booster pack rule definitions count
     * (also includes the inactive rules).
     */
    function albumBoosterPackRulesCount(uint256 _albumId) public view returns (uint256) {
        return albumBoosterPackRules[_albumId].length;
    }

    /**
     * Event that allows enumerating the events of a world.
     */
    event AlbumDefined(uint256 indexed id, uint256 indexed worldId);

    constructor(address _worlds) {
        require(_worlds != address(0), "StickEmAllWorldsManagement: Invalid worlds contract address");
        worlds = StickEmAllWorlds(_worlds);
        slotsPerLayout[StickerPageLayout.OneItem] = 1;
        slotsPerLayout[StickerPageLayout.TwoItemsVertical] = 2;
        slotsPerLayout[StickerPageLayout.TwoItemsHorizontal] = 2;
        slotsPerLayout[StickerPageLayout.TwoItemsDiagonalUp] = 2;
        slotsPerLayout[StickerPageLayout.TwoItemsDiagonalDown] = 2;
        slotsPerLayout[StickerPageLayout.ThreeItemsTriangleUp] = 3;
        slotsPerLayout[StickerPageLayout.ThreeItemsTriangleDown] = 3;
        slotsPerLayout[StickerPageLayout.ThreeItemsVertical] = 3;
        slotsPerLayout[StickerPageLayout.ThreeItemsHorizontal] = 3;
        slotsPerLayout[StickerPageLayout.ThreeItemsDiagonalUp] = 3;
        slotsPerLayout[StickerPageLayout.ThreeItemsDiagonalDown] = 3;
        slotsPerLayout[StickerPageLayout.FourItems1Up] = 4;
        slotsPerLayout[StickerPageLayout.FourItems1Down] = 4;
        slotsPerLayout[StickerPageLayout.FourItemsSquare] = 4;
        slotsPerLayout[StickerPageLayout.FiveItems3Up] = 5;
        slotsPerLayout[StickerPageLayout.FiveItems3Down] = 5;
        slotsPerLayout[StickerPageLayout.FiveItemsSquare] = 5;
        slotsPerLayout[StickerPageLayout.SixItems] = 6;
    }

    /**
     * Checks for a world id to be valid and allowed.
     */
    modifier validWorldId(uint256 _worldId) {
        require(
            worlds.ownerOf(_worldId) == msg.sender || worlds.isWorldEditionAllowed(_worldId, msg.sender),
            "StickEmAllWorldsManagement: Invalid or unauthorized world"
        );
        _;
    }

    /**
     * Checks for an album id to be valid and for the given world,
     * and to not be released.
     */
    modifier validNonReleasedAlbumId(uint256 _worldId, uint256 _albumId) {
        AlbumDefinition storage album = albumDefinitions[_albumId];
        require(
            album.worldId == _worldId && !album.released,
            "StickEmAllWorldsManagement: Invalid (or already released) album for world"
        );
        _;
    }

    /**
     * Checks for an album id to be valid and for the given world,
     * and to be released.
     */
    modifier validReleasedAlbumId(uint256 _worldId, uint256 _albumId) {
        AlbumDefinition storage album = albumDefinitions[_albumId];
        require(
            album.worldId == _worldId && album.released,
            "StickEmAllWorldsManagement: Invalid (or not released) album for world"
        );
        _;
    }

    /**
     * Defines an album (and its achievement).
     */
    function defineAlbum(
        uint256 _worldId, string memory _name, string memory _edition,
        string memory _frontImage, string memory _backImage, string memory _rarityIcons,
        bytes32 _achievementType, string memory _achievementName, string memory _achievementImage,
        bytes memory _achievementData
    ) external validWorldId(_worldId) {
        uint256 _index = albumDefinitions.length;
        albumDefinitions.push(AlbumDefinition({
            worldId: _worldId, name: _name, edition: _edition, frontImage: _frontImage,
            backImage: _backImage, rarityIcons: _rarityIcons, completedPages: 0,
            totalStickers: 0, released: false
        }));
        albumAchievementDefinitions[_index].push(AchievementDefinition({
            type_: _achievementType, displayName: _achievementName,
            image: _achievementImage, data: _achievementData
        }));
        emit AlbumDefined(_index, _worldId);
    }

    /**
     * Adds an achievement to the album's achievements. Returns its index.
     */
    function _addAchievement(
        uint256 _albumId, bytes32 type_, string memory _name, string memory _image, bytes memory _data
    ) private returns (uint16) {
        if (type_ != bytes32(0)) {
            AchievementDefinition[] storage achievements = albumAchievementDefinitions[_albumId];
            uint16 achievementId = uint16(achievements.length);
            achievements.push(AchievementDefinition({
                type_: type_, displayName: _name, image: _image, data: _data
            }));
            return achievementId;
        }
        return 0;
    }

    /**
     * Defines an album page (and its optional achievement).
     */
    function defineAlbumPage(
        uint256 _worldId, uint256 _albumId, string memory _name, string memory _backgroundImage,
        StickerPageLayout _layout, bytes32 _achievementType, string memory _achievementName,
        string memory _achievementImage, bytes memory _achievementData
    ) external validWorldId(_worldId) validNonReleasedAlbumId(_worldId, _albumId) {
        uint16 achievementId = _addAchievement(
            _albumId, _achievementType, _achievementName, _achievementImage, _achievementData
        );
        albumPageDefinitions[_albumId].push(AlbumPageDefinition({
            name: _name, backgroundImage: _backgroundImage, layout: _layout, maxStickers: slotsPerLayout[_layout],
            currentlyDefinedStickers: 0, achievementId: achievementId, complete: false
        }));
    }

    /**
     * Increments the counter of a page's defined slots and also, if the page
     * is completed,
     */
    function _incrementStickerCounters(
        uint256 _albumId, uint16 _pageIdx, uint16 _index, StickerRarity _rarity,
        StickerDefinition[] storage _definitions
    ) private {
        AlbumPageDefinition storage page = albumPageDefinitions[_albumId][_pageIdx];
        AlbumDefinition storage album = albumDefinitions[_albumId];
        if (_definitions.length == page.maxStickers) {
            page.complete = true;
            album.completedPages += 1;
        }
        album.totalStickers += 1;
        if (_rarity == StickerRarity.Bronze) { albumBronzeStickerIndices[_albumId].push(_index); }
        else if (_rarity == StickerRarity.Silver) { albumSilverStickerIndices[_albumId].push(_index); }
        else if (_rarity == StickerRarity.Gold) { albumGoldStickerIndices[_albumId].push(_index); }
        else { albumPlatinumStickerIndices[_albumId].push(_index); }
    }

    /**
     * Adds a sticker to the album's page. If this sticker has an achievement,
     * then it will have the same name and image of the sticker.
     */
    function defineAlbumPageSticker(
        uint256 _worldId, uint256 _albumId, uint16 _pageIdx,
        string memory _name, string memory _image, StickerRarity _rarity,
        bytes32 _achievementType, bytes memory _achievementData
    ) external validWorldId(_worldId) validNonReleasedAlbumId(_worldId, _albumId) {
        require(
            albumPageDefinitionsCount(_albumId) > _pageIdx && !albumPageDefinitions[_albumId][_pageIdx].complete,
            "StickEmAllWorldsManagement: Invalid album page index, or already completed page"
        );
        StickerDefinition[] storage definitions = albumPageStickersDefinitions[_albumId][_pageIdx];
        definitions.push(StickerDefinition({
            displayName: _name, image: _image, rarity: _rarity, achievementId: _addAchievement(
                _albumId, _achievementType, _name, _image, _achievementData
            )
        }));
        _incrementStickerCounters(_albumId, _pageIdx, uint16(definitions.length) - 1, _rarity, definitions);
    }

    // Release things start here.

    /**
     * An event telling the album has been released properly.
     */
    event AlbumReleased(uint256 indexed worldId, uint256 indexed albumId);

    /**
     * Tells whether an album can be released or not.
     */
    function canBeReleased(
        uint256 _worldId, uint256 _albumId
    ) public view returns (bool) {
        AlbumDefinition storage album = albumDefinitions[_albumId];

        // First check: Album exists in the world and it is NOT already released.
        if (album.worldId != _worldId || album.released) return false;

        // Second check: Album has at least 2 pages, and always an
        // even number of pages.
        if (album.completedPages != albumPageDefinitionsCount(_albumId) ||
            (album.completedPages & 1) == 1) return false;
        return true;
    }

    /**
     * Returns the cost of releasing an album, in USD.
     */
    function getAlbumReleaseFiatCost(uint256 _albumId) public view returns (uint256) {
        StickEmAllParams params = worlds.params();
        uint256 albumCost = params.fiatCosts(DefineAlbum);
        uint256 pageCost = params.fiatCosts(DefinePage);
        uint256 stickerCost = params.fiatCosts(DefineSticker);
        uint256 achievementCost = params.fiatCosts(DefineAchievement);
        return (albumCost) + (pageCost * albumPageDefinitionsCount(_albumId)) +
               (stickerCost * albumDefinitions[_albumId].totalStickers) +
               (achievementCost * (albumAchievementDefinitionsCount(_albumId) - 1));
    }

    /**
     * Returns the cost of releasing an album, in MATIC.
     */
    function getAlbumReleaseNativeCost(uint256 _albumId) public view returns (uint256) {
        return worlds.params().getNativeCost(getAlbumReleaseFiatCost(_albumId));
    }

    /**
     * Charges an amount (returns the remainder back to the sender).
     */
    function _chargeAmount(uint256 _cost) private {
        uint256 paid = msg.value;
        require(paid >= _cost, "StickEmAllWorldsManagement: Insufficient payment");
        payable(address(worlds.params())).call{value: paid}("");
        payable(msg.sender).call{value: paid - _cost}("");
    }

    /**
     * Releases an album. This is a PAID operation.
     */
    function releaseAlbum(
        uint256 _worldId, uint256 _albumId
    ) external validWorldId(_worldId) payable {
        require(
            canBeReleased(_worldId, _albumId),
            "StickEmAllWorldsManagement: Invalid, already released, or not ready for release, album for world"
        );
        _chargeAmount(getAlbumReleaseNativeCost(_albumId));
        albumDefinitions[_albumId].released = true;
        emit AlbumReleased(_worldId, _albumId);
    }

    /**
     * Defines a booster pack on a released album.
     */
    function defineBoosterPackRule(
        uint256 _worldId, uint256 _albumId,
        string memory _name, string memory _image, uint32 _fiatPrice,
        uint8 _bronzeStickersCount, uint8 _silverStickersCount,
        bool _hasGoldOrPlatinumSticker, uint16 _platinumStickerProbability
    ) external validWorldId(_worldId) validReleasedAlbumId(_worldId, _albumId) {
        // Check price and prob values.
        BoosterPackRule[] storage rules = albumBoosterPackRules[_albumId];
        require(rules.length <= 65535, "StickEmAllWorldsManagement: No more available rules");
        require(_fiatPrice != 0, "StickEmAllWorldsManagement: The fiat price cannot be 0");
        require(
            _platinumStickerProbability <= 10000,
            "StickEmAllWorldsManagement: The platinum probability must be between 0 and 10000"
        );
        // Check the amount of available stickers.
        require(
            albumBronzeStickerIndicesCount(_albumId) >= _bronzeStickersCount &&
            albumSilverStickerIndicesCount(_albumId) >= _silverStickersCount &&
            (!_hasGoldOrPlatinumSticker ||
             (albumGoldStickerIndicesCount(_albumId) + albumPlatinumStickerIndicesCount(_albumId)) >= 1),
            "StickEmAllWorldsManagement: Not enough stickers of the chosen rarities in the album"
        );
        // Check the per-booster total stickers.
        uint8 totalStickers = _bronzeStickersCount + _silverStickersCount;
        if (_hasGoldOrPlatinumSticker) totalStickers += 1;
        require(
            totalStickers > 0 && totalStickers <= 15,
            "StickEmAllWorldsManagement: The total amount of stickers must be between 1 and 15"
        );
        rules.push(BoosterPackRule({
            created: true, active: true, name: _name, image: _image, fiatPrice: _fiatPrice,
            bronzeStickersCount: _bronzeStickersCount, silverStickersCount: _silverStickersCount,
            hasGoldOrPlatinumSticker: _hasGoldOrPlatinumSticker, platinumProbability: _platinumStickerProbability
        }));
    }

    /**
     * Changes the price, availability and platinum probability
     * of a booster pack rule.
     */
    function updateBoosterPackRule(
        uint256 _worldId, uint256 _albumId, uint256 _ruleId,
        bool _active, uint32 _fiatPrice, uint16 _platinumStickerProbability
    ) external validWorldId(_worldId) validReleasedAlbumId(_worldId, _albumId) {
        // Validating the probability and the booster pack id for the album.
        require(
            _platinumStickerProbability <= 10000,
            "StickEmAllWorldsManagement: The platinum probability must be between 0 and 10000"
        );
        BoosterPackRule[] storage rules = albumBoosterPackRules[_albumId];
        require(
            _ruleId < rules.length,
            "StickEmAllWorldsManagement: Invalid rule id"
        );
        // Updating the current rule.
        BoosterPackRule storage rule = rules[_ruleId];
        rule.active = _active;
        if (_fiatPrice != 0) rule.fiatPrice = _fiatPrice;
        rule.platinumProbability = _platinumStickerProbability;
    }
}
