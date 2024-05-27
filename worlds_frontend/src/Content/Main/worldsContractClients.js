const worldsContractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_params",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "worldId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "who",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "allowed",
                "type": "bool"
            }
        ],
        "name": "WorldEditionAllowanceChanged",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "_isWorldEditionAllowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_logo",
                "type": "string"
            }
        ],
        "name": "createWorld",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_param",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "getNativeCost",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_who",
                "type": "address"
            }
        ],
        "name": "isWorldEditionAllowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "params",
        "outputs": [
            {
                "internalType": "contract StickEmAllParams",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "setBackground",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "setDescription",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_earningsReceiver",
                "type": "address"
            }
        ],
        "name": "setEarningsReceiver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "setExternalUrl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "setLogo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "setName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_value",
                "type": "string"
            }
        ],
        "name": "setValidatorUrl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_who",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_allowed",
                "type": "bool"
            }
        ],
        "name": "setWorldEditionAllowed",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "worlds",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "logo",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "background",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "externalUrl",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "validatorUrl",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "earningsReceiver",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


const worldsManagementContractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_worlds",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "worldId",
                "type": "uint256"
            }
        ],
        "name": "AlbumDefined",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "worldId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "albumId",
                "type": "uint256"
            }
        ],
        "name": "AlbumReleased",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumAchievementDefinitions",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "type_",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "displayName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "image",
                "type": "string"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumAchievementDefinitionsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumBoosterPackRules",
        "outputs": [
            {
                "internalType": "bool",
                "name": "created",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "uint32",
                "name": "fiatPrice",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "fiatFee",
                "type": "uint32"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "image",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "bronzeStickersCount",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "silverStickersCount",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "hasGoldOrPlatinumSticker",
                "type": "bool"
            },
            {
                "internalType": "uint16",
                "name": "platinumProbability",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumBoosterPackRulesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumBronzeStickerIndices",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumBronzeStickerIndicesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumDefinitions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "worldId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "edition",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "frontImage",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "backImage",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "rarityIcons",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "totalStickers",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "completedPages",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "released",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "albumDefinitionsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumGoldStickerIndices",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumGoldStickerIndicesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumPageDefinitions",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "backgroundImage",
                "type": "string"
            },
            {
                "internalType": "enum StickEmAllWorldsManagement.StickerPageLayout",
                "name": "layout",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "maxStickers",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "currentlyDefinedStickers",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "achievementId",
                "type": "uint16"
            },
            {
                "internalType": "bool",
                "name": "complete",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumPageDefinitionsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumPageStickersDefinitions",
        "outputs": [
            {
                "internalType": "string",
                "name": "displayName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "image",
                "type": "string"
            },
            {
                "internalType": "enum StickEmAllWorldsManagement.StickerRarity",
                "name": "rarity",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "achievementId",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "_pageId",
                "type": "uint16"
            }
        ],
        "name": "albumPageStickersDefinitionsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumPlatinumStickerIndices",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumPlatinumStickerIndicesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumSilverStickerIndices",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "albumSilverStickerIndicesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "canBeReleased",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_edition",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_frontImage",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_backImage",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_rarityIcons",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "_achievementType",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "_achievementName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_achievementImage",
                "type": "string"
            },
            {
                "internalType": "bytes",
                "name": "_achievementData",
                "type": "bytes"
            }
        ],
        "name": "defineAlbum",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_backgroundImage",
                "type": "string"
            },
            {
                "internalType": "enum StickEmAllWorldsManagement.StickerPageLayout",
                "name": "_layout",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "_achievementType",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "_achievementName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_achievementImage",
                "type": "string"
            },
            {
                "internalType": "bytes",
                "name": "_achievementData",
                "type": "bytes"
            }
        ],
        "name": "defineAlbumPage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "_pageIdx",
                "type": "uint16"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_image",
                "type": "string"
            },
            {
                "internalType": "enum StickEmAllWorldsManagement.StickerRarity",
                "name": "_rarity",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "_achievementType",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "_achievementData",
                "type": "bytes"
            }
        ],
        "name": "defineAlbumPageSticker",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_image",
                "type": "string"
            },
            {
                "internalType": "uint32",
                "name": "_fiatPrice",
                "type": "uint32"
            },
            {
                "internalType": "uint8",
                "name": "_bronzeStickersCount",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_silverStickersCount",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "_hasGoldOrPlatinumSticker",
                "type": "bool"
            },
            {
                "internalType": "uint16",
                "name": "_platinumStickerProbability",
                "type": "uint16"
            }
        ],
        "name": "defineBoosterPackRule",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "getAlbumReleaseFiatCost",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "getAlbumReleaseNativeCost",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            }
        ],
        "name": "releaseAlbum",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum StickEmAllWorldsManagement.StickerPageLayout",
                "name": "",
                "type": "uint8"
            }
        ],
        "name": "slotsPerLayout",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_worldId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_albumId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ruleId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_active",
                "type": "bool"
            },
            {
                "internalType": "uint32",
                "name": "_fiatPrice",
                "type": "uint32"
            },
            {
                "internalType": "uint16",
                "name": "_platinumStickerProbability",
                "type": "uint16"
            }
        ],
        "name": "updateBoosterPackRule",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "worlds",
        "outputs": [
            {
                "internalType": "contract StickEmAllWorlds",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


const paramsContractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_priceFeed",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "earningsBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "earningsReceiver",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "fiatCosts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_key",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "setFiatCost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_earningsReceiver",
                "type": "address"
            }
        ],
        "name": "setEarningsReceiver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "earningsWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_key",
                "type": "bytes32"
            }
        ],
        "name": "getNativeCost",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];


const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';


/**
 * Returns references to the Worlds and WorldsManagement contracts.
 * @param web3 The web3 client to use.
 * @param account The account to use.
 * @returns {Promise<{worldsManagement: web3.eth.Contract, worlds: web3.eth.Contract, params: web3.eth.Contract}|null>} Instances of the three contracts (async function).
 */
export default async function worldsContractClients(web3, account) {
    const worldsManagementContractAddress = process.env.REACT_APP_WORLDS_MANAGEMENT_CONTRACT;
    if (worldsManagementContractAddress && web3.utils.isAddress(worldsManagementContractAddress) && (
        web3.utils.toChecksumAddress(worldsManagementContractAddress) !== web3.utils.toChecksumAddress(ZERO_ADDRESS)
    )) {
        let worldsManagement = new web3.eth.Contract(
            worldsManagementContractABI, worldsManagementContractAddress, {from: account}
        );
        let worldsContractAddress = await worldsManagement.methods.worlds().call();
        let worlds = new web3.eth.Contract(worldsContractABI, worldsContractAddress);
        console.log("Worlds' methods:", worlds.methods);
        let paramsContractAddress = await worlds.methods.params().call();
        let params = new web3.eth.Contract(paramsContractABI, paramsContractAddress);
        return {
            worldsManagement, worlds, params
        }
    }

    return null;
}