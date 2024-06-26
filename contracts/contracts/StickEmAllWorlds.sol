// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./StickEmAllParams.sol";
import "./StickEmAllParamsConsumer.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * This contract is a token contract that mints and manages a full
 * world (which is meant to define albums and their stickers).
 */
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
        string externalUrl;

        /**
         * The validation file. If empty, no validation
         * will occur (which is as bad as failing it).
         * It MUST be prefixed with the externalUri
         * setting (however, these changes are only done
         * in front-end, never back-end).
         */
        string validatorUrl;

        /**
         * The earnings receiver (worlds will earn money
         * when booster packs are sold).
         */
        address earningsReceiver;
    }

    /**
     * A mapping for the world data from the id.
     */
    mapping(uint256 => World) public worlds;

    /**
     * Tells that a world edition allowance has changed.
     */
    event WorldEditionAllowanceChanged(uint256 indexed worldId, address indexed who, bool allowed);

    constructor(address _params) ERC721("World", "STWD") StickEmAllParamsConsumer(_params) {}

    /**
     * The transfer from is enhanced to set the earningsReceiver
     * to the new destination.
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.transferFrom(from, to, tokenId);
        worlds[tokenId].earningsReceiver = to;
    }

    /**
     * Sets the world edition allowance for a user.
     */
    function setWorldEditionAllowed(uint256 _worldId, address _who, bool _allowed) external {
        require(_who != address(0), "StickEmAllWorlds: You're not the owner of this world");
        if (_allowed) {
            require(_ownerOf(_worldId) == msg.sender, "StickEmAllWorlds: You're not the owner of this world");
        }
        _isWorldEditionAllowed[msg.sender][_worldId][_who] = _allowed;
        emit WorldEditionAllowanceChanged(_worldId, _who, _allowed);
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
            background: "", externalUrl: "", validatorUrl: "",
            earningsReceiver: msg.sender
        });
        _mint(msg.sender, tokenId);
    }

    /**
     * Validates a world being editable by the user.
     */
    function _validateWorld(uint256 _tokenId) private view returns (World storage) {
        World storage world = worlds[_tokenId];
        address owner = _ownerOf(_tokenId);
        address sender = msg.sender;
        require(
            sender == owner || _isWorldEditionAllowed[owner][_tokenId][sender],
            "StickEmAllWorlds: You're not allowed to do this operation"
        );
        return world;
    }

    /**
     * Sets the name of a world.
     */
    function setName(uint256 _tokenId, string memory _value) external {
        _validateWorld(_tokenId).name = _value;
    }

    /**
     * Sets the description of a world.
     */
    function setDescription(uint256 _tokenId, string memory _value) external {
        _validateWorld(_tokenId).description = _value;
    }

    /**
     * Sets the logo of a world.
     */
    function setLogo(uint256 _tokenId, string memory _value) external {
        _validateWorld(_tokenId).logo = _value;
    }

    /**
     * Sets the background of a world.
     */
    function setBackground(uint256 _tokenId, string memory _value) external {
        _validateWorld(_tokenId).background = _value;
    }

    /**
     * Sets the external url of a world.
     */
    function setExternalUrl(uint256 _tokenId, string memory _value) external {
        _validateWorld(_tokenId).externalUrl = _value;
    }

    /**
     * Sets the validator url of a world.
     */
    function setValidatorUrl(uint256 _tokenId, string memory _value) external {
        _validateWorld(_tokenId).validatorUrl = _value;
    }

    /**
     * Sets the earnings receiver of a world.
     */
    function setEarningsReceiver(uint256 _tokenId, address _earningsReceiver) external {
        require(_earningsReceiver != address(0), "StickEmAllWorlds: Invalid earnings receiver");
        World storage world = worlds[_tokenId];
        address owner = _ownerOf(_tokenId);
        address sender = msg.sender;
        require(sender == owner, "StickEmAllWorlds: You're not allowed to do this operation");
        world.earningsReceiver = _earningsReceiver;
    }

    /**
     * Returns the full data of a world for the NFT markets.
     */
    function tokenURI(uint256 tokenId) public override view returns (string memory) {
        _requireOwned(tokenId);
        World storage world = worlds[tokenId];
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(abi.encodePacked(
            '{"name:","', world.name, '", "description": "', world.description, '", "image": "', world.logo,
            '", "external_url": "',world.externalUrl,'", "attributes": {"validator": "',world.validatorUrl,'"}}'
        ))));
    }
}
