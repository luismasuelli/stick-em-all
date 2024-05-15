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

        /**
         * The allocated slots, telling their expected stickers.
         */
        uint32[] slots;
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
         * The definitions in this album.
         */
        AchievementDefinition[] achievements;

        /**
         * The pages in this album.
         */
        AlbumPageDefinition[] pages;

        /**
         * All the stickers definitions.
         */
        StickerDefinition[] stickers;

        /**
         * Whether the album is released or not. Starts in false and
         * after it is released it cannot be edited anymore and also
         * it is ready to be:
         * - Price-defined, and sold.
         * - Have its booster packs defined.
         */
        bool released;

        /**
         * Which stickers are bronze.
         */
        uint32[] bronzeStickers;

        /**
         * Which stickers are silver.
         */
        uint32[] silverStickers;

        /**
         * Which stickers are gold.
         */
        uint32[] goldStickers;

        /**
         * Which stickers are platinum.
         */
        uint32[] platinumStickers;
    }

    /**
     * The worlds contract.
     */
    StickEmAllWorlds public worlds;

    /**
     * All the defined albums. At most 1<<224 albums.
     */
    AlbumDefinition[] public albumDefinitions;

    /**
     * Event that allows enumerating the events of a world.
     */
    event AlbumDefined(uint256 indexed id, uint256 indexed worldId);

    constructor(address _worlds) {
        require(_worlds != address(0), "StickEmAllWorldsManagement: Invalid worlds contract address");
        worlds = StickEmAllWorlds(_worlds);
    }
}
