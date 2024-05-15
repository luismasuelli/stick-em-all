// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./StickEmAllParams.sol";
import "./StickEmAllParamsConsumer.sol";
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
        uint32 achievementId;
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
        uint32 achievementId;

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
         * and (4h)x(h) in size. First, the bronze icon. Then, the silver.
         * Then, the gold and finally the platinum one.
         */
        string rarityIcons;

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
    function albumAchievementDefinitionsCount(uint256 albumId) public view returns (uint256) {
        return albumAchievementDefinitions[albumId].length;
    }

    /**
     * The per-album pages.
     */
    mapping(uint256 => AlbumPageDefinition[]) public albumPageDefinitions;

    /**
     * The length of per-album pages.
     */
    function albumPageDefinitionsCount(uint256 albumId) public view returns (uint256) {
        return albumPageDefinitions[albumId].length;
    }

    /**
     * The per-album / per-page slots.
     */
    mapping(uint256 => mapping(uint32 => StickerDefinition[])) public albumPageStickersDefinitions;

    /**
     * The length of per-album / per-page slots.
     */
    function albumPageStickersDefinitionsCount(uint256 albumId, uint32 pageId) public view returns (uint256) {
        return albumPageStickersDefinitions[albumId][pageId].length;
    }

    /**
     * The per-album bronze stickers' indices.
     */
    mapping(uint256 => uint32[]) public albumBronzeStickerIndices;

    /**
     * The per-album count of bronze stickers.
     */
    function albumBronzeStickerIndicesCount(uint256 albumId) public view returns (uint256) {
        return albumBronzeStickerIndices[albumId].length;
    }

    /**
     * The per-album silver stickers' indices.
     */
    mapping(uint256 => uint32[]) public albumSilverStickerIndices;

    /**
     * The per-album count of silver stickers.
     */
    function albumSilverStickerIndicesCount(uint256 albumId) public view returns (uint256) {
        return albumSilverStickerIndices[albumId].length;
    }

    /**
     * The per-album gold stickers' indices.
     */
    mapping(uint256 => uint32[]) public albumGoldStickerIndices;

    /**
     * The per-album count of gold stickers.
     */
    function albumGoldStickerIndicesCount(uint256 albumId) public view returns (uint256) {
        return albumGoldStickerIndices[albumId].length;
    }

    /**
     * The per-album platinum stickers' indices.
     */
    mapping(uint256 => uint32[]) public albumPlatinumStickerIndices;

    /**
     * The per-album count of platinum stickers.
     */
    function albumPlatinumStickerIndicesCount(uint256 albumId) public view returns (uint256) {
        return albumPlatinumStickerIndices[albumId].length;
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
     * Checks for an album id to be valid and for the given world.
     */
    modifier validAlbumId(uint256 _worldId, uint256 _albumId) {
        AlbumDefinition storage album = albumDefinitions[_albumId];
        require(
            album.worldId == _worldId && !album.released,
            "StickEmAllWorldsManagement: Invalid (or already-released) album for world"
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
            backImage: _backImage, rarityIcons: _rarityIcons, released: false
        }));
        albumAchievementDefinitions[_index].push(AchievementDefinition({
            type_: _achievementType, displayName: _achievementName,
            image: _achievementImage, data: _achievementData
        }));
        emit AlbumDefined(_index, _worldId);
    }

    /**
     * Defines an album page (and its optional achievement).
     */
    function defineAlbumPage(
        uint256 _worldId, uint256 _albumId, string memory _name, string memory _backgroundImage,
        StickerPageLayout _layout, bytes32 _achievementType, string memory _achievementName,
        string memory _achievementImage, bytes memory _achievementData
    ) external validWorldId(_worldId) validAlbumId(_worldId, _albumId) {
        uint32 achievementId = 0;
        if (_achievementType != bytes32(0)) {
            AchievementDefinition[] storage achievements = albumAchievementDefinitions[_albumId];
            achievementId = uint32(achievements.length);
            achievements.push(AchievementDefinition({
                type_: _achievementType, displayName: _achievementName, image: _achievementImage,
                data: _achievementData
            }));
        }
        albumPageDefinitions[_albumId].push(AlbumPageDefinition({
            name: _name, backgroundImage: _backgroundImage, layout: _layout, maxStickers: slotsPerLayout[_layout],
            currentlyDefinedStickers: 0, achievementId: achievementId, complete: false
        }));
    }
}
