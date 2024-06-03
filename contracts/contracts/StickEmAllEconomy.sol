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

    /**
     * Tracking ownership of each NFT.
     */
    struct AlbumInstance {
        /**
         * The owner of this album (!= 0 means it exists).
         */
        address owner;

        /**
         * The type of the album.
         */
        uint256 albumTypeId;
    }

    /**
     * The id of the last spawned album (starts with 1<<255 because it
     * is not a valid album id).
     */
    uint256 private lastAlbumId = 1 << 255;

    /**
     * Albums are NFTs. They're properly tracked.
     */
    mapping(uint256 => AlbumInstance) public albums;

    /**
     * The worlds management contract.
     */
    StickEmAllWorldsManagement public worldsManagement;

    /**
     * The main contract.
     */
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
     * Mints an album for the sender. The albums are free.
     */
    function mintAlbum(uint256 _albumTypeId) external {
        (,,,,,,,,bool released) = worldsManagement.albumDefinitions(_albumTypeId);
        require(released, "StickEmAllEconomy: Invalid album id");
        require(lastAlbumId != ~uint256(0), "StickEmAllEconomy: No more albums");
        lastAlbumId += 1;
        albums[lastAlbumId] = AlbumInstance({owner: msg.sender, albumTypeId: _albumTypeId});
        _mint(msg.sender, lastAlbumId, 1, "");
    }

    /**
     * Updates the ownership of NFTs.
     */
    function _update(
        address from, address to, uint256[] memory ids, uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);
        uint256 length = ids.length;
        for(uint256 idx = 0; idx < length; idx++) {
            uint256 id = ids[idx];
            if (id & (1 << 255) != 0) albums[id].owner = to;
        }
    }

    /**
     * Mints many stickers. Only the owner can call this method.
     * Here, the sticker ids comes composed with the album type id and page id as well.
     */
    function mintStickers(address _owner, uint256[] memory ids) external onlyMain {
        uint256 length = ids.length;
        uint256[] memory values = new uint256[](length);
        for(uint256 index = 0; index < length; index++) {
            values[index] = 1;
        }
        _mintBatch(_owner, ids, values, "");
    }

    /**
     * Burns a sticker. Only the owner can call this method.
     * Here, the sticker id comes composed with the album type id and page id as well.
     */
    function burnSticker(address _owner, uint256 _stickerId) external onlyMain {
        _burn(_owner, _stickerId, 1);
    }

    /**
     * Mints N booster packs. Only the owner can call this method.
     * Here, the booster pack id comes composed with the album type id as well.
     */
    function mintBoosterPacks(address _owner, uint256 _boosterPackId, uint256 _amount) external onlyMain {
        _mint(_owner, _boosterPackId, _amount, "");
    }

    /**
     * Burns a booster pack.
     * Here, the booster pack id comes composed with the album type id as well.
     */
    function burnBoosterPack(address _owner, uint256 _boosterPackId) external onlyMain {
        _burn(_owner, _boosterPackId, 1);
    }

    /**
     * The URI for the token (depends on it being album, sticker, or booster pack).
     */
    function uri(uint256 _tokenId) public view virtual override returns (string memory) {
        string memory name;
        string memory description;
        string memory image;
        string memory type_;

        if (_tokenId & (1<<255) != 0) {
            if (_tokenId > lastAlbumId) return "";

            uint256 typeId = albums[_tokenId].albumTypeId;
            string memory edition;
            (,name,edition,image,,,,,) = worldsManagement.albumDefinitions(typeId);
            description = string(abi.encodePacked("Edition: ", edition));
            type_ = "album";
        } else if (_tokenId & (1<<30) != 0) {
            bool created;
            uint256 albumTypeId = _tokenId >> 31;
            uint256 ruleId = _tokenId & ((1 << 16) - 1);
            string memory albumName;
            string memory albumEdition;
            (,albumName,albumEdition,,,,,,) = worldsManagement.albumDefinitions(albumTypeId);
            (created,,,,name,image,,,,) = worldsManagement.albumBoosterPackRules(albumTypeId, ruleId);
            if (!created) return "";
            description = string(abi.encodePacked("Booster Pack for Album: ", albumName, ", Edition: ", albumEdition));
            type_ = "booster-pack";
        } else {
            uint256 slot = _tokenId & 7;
            _tokenId = _tokenId >> 3;
            uint16 page = uint16(_tokenId & ((1 << 13) - 1));
            uint256 albumTypeId = _tokenId >> 28;
            string memory albumName;
            string memory albumEdition;
            (,albumName,albumEdition,,,,,,) = worldsManagement.albumDefinitions(albumTypeId);
            uint256 maxStickers = worldsManagement.albumPageStickersDefinitionsCount(albumTypeId, page);
            if (slot >= maxStickers) return "";
            (name,image,,) = worldsManagement.albumPageStickersDefinitions(albumTypeId, page, slot);
            description = string(abi.encodePacked("Sticker for Album: ", albumName, ", Edition: ", albumEdition));
            type_ = "sticker";
        }

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(abi.encodePacked(
            '{"name":"', name, '","description":"', description, '","image":"', image,
            '","properties":{"type":"', type_, '"}}'
        ))));
    }
}
