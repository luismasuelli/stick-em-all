// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./StickEmAllParams.sol";
import "./StickEmAllParamsConsumer.sol";

contract StickEmAllWorlds is ERC721, StickEmAllParamsConsumer {
    /**
     * The parameter to define a world.
     */
    bytes32 constant DefineWorld = keccak256("Costs::DefineWorld");

    /**
     * Tells whether, according to the [owner] and for a world [id],
     * a given [address] is allowed to edit it.
     */
    mapping(address => mapping(uint256 => mapping(address => bool))) public _isWorldEditionAllowed;

    constructor(address _params) ERC721("World", "STWD") StickEmAllParamsConsumer(_params) {}

    /**
     * Sets the world edition allowance for a user.
     */
    function setWorldEditionAllowed(uint256 _worldId, address _who, bool _allowed) public {
        require(_who != address(0), "StickEmAllWorlds: You're not the owner of this world");
        if (_allowed) {
            require(_ownerOf(_worldId) == msg.sender, "StickEmAllWorlds: You're not the owner of this world");
        }
        _isWorldEditionAllowed[msg.sender][_worldId][_who] = _allowed;
    }

    /**
     * Tells whether, according to the owner of the a word [id]
     * (and previously: its [owner]), a given [address] is allowed
     * to edit it.
     */
    function isWorldEditionAllowed(uint256 _tokenId, address _who) public view returns (bool) {
        return _isWorldEditionAllowed[_ownerOf(_tokenId)][_tokenId][_who];
    }
}
