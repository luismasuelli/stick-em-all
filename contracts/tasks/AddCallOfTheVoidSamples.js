const { task } = require("hardhat/config");
const MockV3AggregatorModule = require("../ignition/modules/MockV3Aggregator");
const StickEmAllParams = require("../ignition/modules/StickEmAllParams");
const StickEmAllWorlds = require("../ignition/modules/StickEmAllWorlds");
const StickEmAllWorldsManagement = require("../ignition/modules/StickEmAllWorldsManagement");
const VRFCoordinatorV2PlusMock = require("../ignition/modules/VRFCoordinatorV2PlusMock");
const StickEmAllEconomy = require("../ignition/modules/StickEmAllEconomy");
const StickEmAllMain = require("../ignition/modules/StickEmAllMain");
const fs = require('fs');
const path = require('path');


/**
 * Deploys the price feed contract, if any.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<string>} The address of the deployed contract (async function).
 */
async function deployPriceFeed(hre) {
    switch(hre.network.name) {
        case "hardhat":
        case "localhost":
            const { mock } = await hre.ignition.deploy(MockV3AggregatorModule);
            return await mock.getAddress();
        case "testnet":
            return "0x001382149eBa3441043c1c66972b4772963f5D43";
        case "mainnet":
            return "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0";
        default:
            throw new Error("Unknown network: " + hre.network.name);
    }
}


/**
 * Deploys the params contract, if any.
 * @param hre The hardhat runtime environment.
 * @param priceFeedAddr The address of the price feed.
 * @returns {Promise<*>} The deployed contract (async function).
 */
async function deployParams(hre, priceFeedAddr) {
    const { params } = await hre.ignition.deploy(StickEmAllParams, {
        parameters: {
            "StickEmAllParams": {
                "priceFeed": priceFeedAddr
            }
        }
    });
    return params;
}


/**
 * Deploys the worlds and worldsManagement contracts.
 * @param hre The hardhat runtime environment.
 * @param paramsAddr The address of the params argument.
 * @returns {Promise<{worlds, worldsManagement}>} The worlds and worldsManagement contracts (async function).
 */
async function deployWorld(hre, paramsAddr) {
    // Deploy the worlds contract.
    const { worlds } = await hre.ignition.deploy(StickEmAllWorlds, {
        parameters: {
            "StickEmAllWorlds": {
                "params": paramsAddr
            }
        }
    });
    let worldsAddress = await worlds.getAddress();

    // Deploy the worldsManagement contract.
    const { worldsManagement } = await hre.ignition.deploy(StickEmAllWorldsManagement, {
        parameters: {
            "StickEmAllWorldsManagement": {
                "worlds": worldsAddress
            }
        }
    });
    return { worlds, worldsManagement };
}


/**
 * Computes a keccak256.
 * @param ethers The ethers module.
 * @param key The key
 * @returns {string} The keccak256 of the value.
 */
function keccak256(ethers, key) {
    return ethers.keccak256(ethers.toUtf8Bytes(key));
}


task("add-callofthevoid-samples", "Adds all of the Call of the Void samples")
    .addParam("owner", "The address that will own the Call of the Void sample world")
    .setAction(async ({ owner }, hre, runSuper) => {
        // Deploying the worlds (mint & management) contracts.
        console.log("Recovering world contracts...");
        let priceFeedAddr = await deployPriceFeed(hre);
        let params = await deployParams(hre, priceFeedAddr);
        let paramsAddr = await params.getAddress();
        let { worlds, worldsManagement } = await deployWorld(hre, paramsAddr);

        const defineWorldCostParam = keccak256(hre.ethers, "Costs::DefineWorld");
        const defineAlbumCostParam = keccak256(hre.ethers, "Costs::Albums::DefineAlbum");
        const definePageCostParam = keccak256(hre.ethers, "Costs::Albums::DefinePage");
        const defineAchievementCostParam = keccak256(hre.ethers, "Costs::Albums::DefineAchievement");
        const defineStickerCostParam = keccak256(hre.ethers, "Costs::Albums::DefineSticker");
        console.log(params);
        const defineWorldNativePrice = await params["getNativeCost(bytes32)"](defineWorldCostParam);
        const defineAlbumNativePrice = await params["getNativeCost(bytes32)"](defineAlbumCostParam);
        const definePageNativePrice = await params["getNativeCost(bytes32)"](definePageCostParam);
        const defineAchievementNativePrice = await params["getNativeCost(bytes32)"](defineAchievementCostParam);
        const defineStickerNativePrice = await params["getNativeCost(bytes32)"](defineStickerCostParam);

        const cardAchievementType = keccak256(hre.ethers, "AchievementType::Card");
        const badgeAchievementType = keccak256(hre.ethers, "AchievementType::Badge");

        const baseUrl = "http://callofthevoid.home:8000";
        const baseImageUrl = baseUrl + "/images";

        // 1. Defining the world (id=1).
        console.log("Defining the world: Call of the Void...");
        await worlds.createWorld(
            "Call of the Void", "A lovecraftian adventure collectibles company",
            `${baseImageUrl}/world-logo.webp`,
            {value: defineWorldNativePrice * 110n / 100n}
        );
        await worlds.setBackground(1n, `${baseImageUrl}/world-background.webp`);
        await worlds.setExternalUrl(1n, baseUrl);
        await worlds.setValidatorUrl(1n, `${baseUrl}/validator.json`);

        // 2. Define the album (worldId=1, id=0).
        console.log("Defining the album: Eldritch Armies...");
        await worldsManagement.defineAlbum(
            1n, "Eldritch Armies", "2024", `${baseImageUrl}/album-cover.webp`,
            `${baseImageUrl}/album-back-cover.webp`, `${baseImageUrl}/rarities.png`,
            badgeAchievementType, "Eldritch Master", `${baseImageUrl}/achievement-album.webp`,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );

        // 2. Define the album pages (worldId=1, albumId=0, pageIdx=0..6).
        console.log("Defining the pages of the album...");
        console.log(">>> Page: Sun...");
        await worldsManagement.defineAlbumPage(
            1n, 0n, "Sun", `${baseImageUrl}/page-sun.webp`, 15,
            badgeAchievementType, "Withering Hydra", `${baseImageUrl}/achievement-sun.webp`,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log(">>> Page: Moon...");
        await worldsManagement.defineAlbumPage(
            1n, 0n, "Moon", `${baseImageUrl}/page-moon.webp`, 16,
            badgeAchievementType, "Shadow Man", `${baseImageUrl}/achievement-moon.webp`,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log(">>> Page: Space...");
        await worldsManagement.defineAlbumPage(
            1n, 0n, "Space", `${baseImageUrl}/page-space.webp`, 12,
            badgeAchievementType, "Aeon of The Way", `${baseImageUrl}/achievement-space.webp`,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log(">>> Page: Time...");
        await worldsManagement.defineAlbumPage(
            1n, 0n, "Time", `${baseImageUrl}/page-time.webp`, 13,
            badgeAchievementType, "Entropic Manifestation", `${baseImageUrl}/achievement-time.webp`,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log(">>> Page: Stars...");
        await worldsManagement.defineAlbumPage(
            1n, 0n, "Stars", `${baseImageUrl}/page-stars.webp`, 14,
            badgeAchievementType, "Emissary of the Ancient Ones", `${baseImageUrl}/achievement-stars.webp`,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log(">>> Page: Glitch...");
        await worldsManagement.defineAlbumPage(
            1n, 0n, "Glitch", `${baseImageUrl}/page-glitch.webp`, 0,
            "0x0000000000000000000000000000000000000000000000000000000000000000", "", "",
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        );

        const account = (await hre.ethers.getSigners())[0];
        console.log("Transferring ownership of the world to " + owner + "...");
        await worlds.transferFrom(account, owner, 1n);
    });