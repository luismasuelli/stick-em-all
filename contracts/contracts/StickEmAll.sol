// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./StickEmAllWorldsManagement.sol";

/**
 * StickEmAll is the main point where users purchase and
 * manage their albums and stickers, stick them, and get
 * their achievements.
 */
contract StickEmAll is ERC1155 {
    /**
     * Some notes about the IDs of the tokens:
     * - Albums are NFTs:       [1:1bit][albumInstId:225bit].
     * - Booster packs are FTs: [0:1bit][albumTypeId:224bit][1(=BP):1bit][0:14bit][ruleId:16bit].
     * - Stickers are FTs:      [0:1bit][albumTypeId:224bit][0(=ST):1bit][0:14bit][pageIdx:13bit][slotIdx:3bit].
     */

    /**
     * The Worlds Management contract.
     */
    StickEmAllWorldsManagement public worldsManagement;

    constructor(address _worldsManagement) ERC1155("") {
        require(_worldsManagement != address(0), "StickEmAll: Invalid management contract");
        worldsManagement = StickEmAllWorldsManagement(worldsManagement);
    }
}
