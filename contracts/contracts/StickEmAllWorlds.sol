// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./StickEmAllParams.sol";
import "./StickEmAllParamsConsumer.sol";

contract StickEmAllWorlds is ERC721, StickEmAllParamsConsumer {
    /**
     * The parameter to define a world.
     */
    bytes32 private constant DefineWorld = keccak256("Costs::DefineWorld");

    /**
     * The current token index (starts with 1).
     */
    uint256 private _nextTokenId = 1;

    /**
     * Tells whether, according to the [owner] and for a world [id],
     * a given [address] is allowed to edit it.
     */
    mapping(address => mapping(uint256 => mapping(address => bool))) public _isWorldEditionAllowed;

    struct World {
        /**
         * The name of the world.
         */
        string name;

        /**
         * The description of the world.
         */
        string description;

        /**
         * The logo (a square image). If absent or
         * invalid, front-end would render a default
         * icon. This is not recommended, however.
         */
        string logo;

        /**
         * The background (a 16:9 image). If absent
         * or invalid, front-end would render a default
         * background or a solid color.
         */
        string background;

        /**
         * An external URL for the validation. If empty,
         * no validation will occur (which is as bad as
         * failing a validation), since there is no URL
         * to compare against.
         */
        string externalUri;

        /**
         * The validation file. If empty, no validation
         * will occur (which is as bad as failing it).
         * It MUST be prefixed with the externalUri
         * setting (however, these changes are only done
         * in front-end, never back-end).
         */
        string validatorUri;
    }

    /**
     * A mapping for the world data from the id.
     */
    mapping(uint256 => World) public worlds;

    constructor(address _params) ERC721("World", "STWD") StickEmAllParamsConsumer(_params) {}

    /**
     * Sets the world edition allowance for a user.
     */
    function setWorldEditionAllowed(uint256 _worldId, address _who, bool _allowed) external {
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
    function isWorldEditionAllowed(uint256 _tokenId, address _who) external view returns (bool) {
        return _isWorldEditionAllowed[_ownerOf(_tokenId)][_tokenId][_who];
    }

    /**
     * Mints a world token.
     */
    function createWorld(
        string memory _name, string memory _description, string memory _logo
    ) external payable chargesAmount(DefineWorld, 1) {
        uint256 tokenId = _nextTokenId++;
        worlds[tokenId] = World({
            name: _name, description: _description, logo: _logo,
            background: "", externalUri: "", validatorUri: ""
        });
        _mint(msg.sender, tokenId);
    }

    /**
     * Sets a field in the world.
     */
    function setField(uint256 _tokenId, string memory _field, string memory _value) external {
        World storage world = worlds[_tokenId];
        require(
            msg.sender == ownerOf(_tokenId) || isWorldEditionAllowed(_tokenId, msg.sender),
            "StickEmAllWorlds: You're not allowed to do this operation"
        );

        if (_field == "name") {
            world.name = _value;
        } else if (_field == "description") {
            world.description = _value;
        } else if (_field == "logo") {
            world.logo = _value;
        } else if (_field == "background") {
            world.background = _value;
        } else if (_field == "externalUri") {
            world.externalUri = _value;
        } else if (_field == "validatorUri") {
            world.validatorUri = _value;
        } else {
            revert(abi.encodePacked("StickEmAllWorlds: Unknown field ", _field));
        }
    }
}
