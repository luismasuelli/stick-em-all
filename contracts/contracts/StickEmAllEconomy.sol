// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StickEmAllWorldsManagement.sol";

/**
 * The economy. It is a standard ERC1155 contract but the
 * economy will have an owner that will mint/burn properly.
 */
contract StickEmAllEconomy is ERC1155 {
    /**
     * Some notes about the IDs of the tokens:
     * - Albums are NFTs:       [1:1bit][albumInstId:255bit].
     * - Booster packs are FTs: [0:1bit][albumTypeId:224bit][1(=BP):1bit][0:14bit][ruleId:16bit].
     * - Stickers are FTs:      [0:1bit][albumTypeId:224bit][0(=ST):1bit][0:14bit][pageIdx:13bit][slotIdx:3bit].
     */

    // The mask for an album type id.
    uint256 private constant AlbumTypeIdMask = (1 << 224) - 1;

    // The mask for an album instance id.
    uint256 private constant AlbumIdMask = (1 << 255) - 1;

    // The mask for a booster rule id.
    uint256 private constant RuleIdMask = 0xffff;

    // The mask for a page id.
    uint256 private constant PageIdxMask = 0x1fff;

    // The mask for a slot id.
    uint256 private constant SlotIdxMask = 0x7;

    // The worlds management contract.
    StickEmAllWorldsManagement public worldsManagement;

    // The main contract (only its address).
    address public main;

    /**
     * The owner will be StickEmAllWorlds.
     */
    constructor(address _worldsManagement) ERC1155("") {
        require(_worldsManagement != address(0), "StickEmAllEconomy: Invalid management contract");
        worldsManagement = StickEmAllWorldsManagement(_worldsManagement);
    }

    /**
     * Sets the main contract (the one that will be allowed to mint).
     */
    function setMainContract(address _main) external {
        require(main == address(0), "StickEmAllEconomy: The main contract is already set");
        require(_main != address(0), "StickEmAllEconomy: The main contract cannot be zero");
        require(
            msg.sender == worldsManagement.worlds().params().owner(),
            "StickEmAllEconomy: Only the owner can invoke this method"
        );
        main = _main;
    }

    /**
     * This modifier restricts actions to the main contract only.
     */
    modifier onlyMain {
        require(msg.sender == main, "StickEmAllEconomy: Only the main StickEmAll contract can invoke this method");
        _;
    }

    /**
     * Mints many stickers. Only the owner can call this method.
     * Here, the sticker ids comes composed with the page id.
     */
    function mintStickers(address _owner, uint256 _albumTypeId, uint256[] memory _stickerIds) external onlyMain {
        uint256 length = _stickerIds.length;
        uint256[] memory ids = new uint256[](length);
        uint256[] memory values = new uint256[](length);
        _albumTypeId = _albumTypeId << 31;
        for(uint256 index = 0; index < length; index++) {
            ids[index] = _stickerIds[index] | _albumTypeId;
            values[index] = 1;
        }
        _mintBatch(_owner, ids, values, "");
    }

    /**
     * Burns a sticker. Only the owner can call this method.
     */
    function burnSticker(address _owner, uint256 _albumTypeId, uint16 _pageId, uint16 _slotId) external onlyMain {
        _burn(_owner, _albumTypeId << 31 | _pageId << 3 | _slotId, 1);
    }

    /**
     * Mints N booster packs. Only the owner can call this method.
     */
    function mintBoosterPacks(address _owner, uint256 _albumTypeId, uint16 _ruleId, uint256 _amount) external onlyMain {
        _mint(_owner, _albumTypeId << 31 | 0x40000000 | _ruleId, _amount, "");
    }

    /**
     * Burns a booster pack.
     */
    function burnBoosterPack(address _owner, uint256 _albumTypeId, uint16 _ruleId) external onlyMain {
        _burn(_owner, _albumTypeId << 31 | _ruleId, 1);
    }
}
