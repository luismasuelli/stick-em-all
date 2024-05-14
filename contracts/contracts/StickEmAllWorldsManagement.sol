// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./StickEmAllParams.sol";
import "./StickEmAllParamsConsumer.sol";

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
     * The cost parameter to define an album sheet (2 pages).
     */
    bytes32 private constant DefineSheet = keccak256("Costs::Albums::DefineSheet");

    /**
     * The cost parameter to define a sticker.
     */
    bytes32 private constant DefineSticker = keccak256("Costs::Albums::DefineSticker");

    /**
     * Achievement definitions stand for albums' achievements.
     * They will be known by their index in the album definition.
     *
     * Defining an achievement has costs.
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
     * A sticker definition is NOT the same of an achievement.
     * Stickers can be exchanged before they're glued, and they
     * even become fungible tokens to be exchanged. However, a
     * sticker can also imply an achievement (and, like they,
     * it has a name and image).
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
         */
        string image;
    }
}
