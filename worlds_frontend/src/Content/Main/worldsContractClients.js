const worldsContractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_economy",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_coordinator",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_keyHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "_subscriptionId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "have",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "want",
                "type": "address"
            }
        ],
        "name": "OnlyCoordinatorCanFulfill",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "have",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "coordinator",
                "type": "address"
            }
        ],
        "name": "OnlyOwnerOrCoordinator",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroAddress",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "albumId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint16",
                "name": "achievementId",
                "type": "uint16"
            }
        ],
        "name": "Achievement",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "vrfCoordinator",
                "type": "address"
            }
        ],
        "name": "CoordinatorSet",
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
            }
        ],
        "name": "OwnershipTransferRequested",
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
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "acceptOwnership",
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
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "achieved",
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
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "albumInstances",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "pastedStickers",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "completedPages",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "economy",
        "outputs": [
            {
                "internalType": "contract StickEmAllEconomy",
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
                "internalType": "uint256",
                "name": "_albumTypeId",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "_ruleId",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "getBoosterPackFiatPrice",
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
                "name": "_albumTypeId",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "_ruleId",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "getBoosterPackNativePrice",
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
                "internalType": "uint256",
                "name": "_boosterPackAssetId",
                "type": "uint256"
            }
        ],
        "name": "openBoosterPack",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
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
            }
        ],
        "name": "pastedStickers",
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
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "name": "pastedStickersCount",
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
                "name": "_albumTypeId",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "_ruleId",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "purchaseBoosterPacks",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "requestId",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "randomWords",
                "type": "uint256[]"
            }
        ],
        "name": "rawFulfillRandomWords",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "s_vrfCoordinator",
        "outputs": [
            {
                "internalType": "contract IVRFCoordinatorV2Plus",
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
                "name": "_vrfCoordinator",
                "type": "address"
            }
        ],
        "name": "setCoordinator",
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
            },
            {
                "internalType": "uint256",
                "name": "_stickerId",
                "type": "uint256"
            }
        ],
        "name": "stick",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "worldsManagement",
        "outputs": [
            {
                "internalType": "contract StickEmAllWorldsManagement",
                "name": "",
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
        let paramsContractAddress = await worlds.methods.params().call();
        let params = new web3.eth.Contract(paramsContractABI, paramsContractAddress);
        return {
            worldsManagement, worlds, params
        }
    }

    return null;
}