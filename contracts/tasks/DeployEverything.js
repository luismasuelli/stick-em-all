const { task } = require("hardhat/config");
const MockV3AggregatorModule = require("../ignition/modules/MockV3Aggregator");
const StickEmAllParams = require("../ignition/modules/StickEmAllParams");
const StickEmAllWorlds = require("../ignition/modules/StickEmAllWorlds");
const StickEmAllWorldsManagement = require("../ignition/modules/StickEmAllWorldsManagement");
const VRFCoordinatorV2PlusMock = require("../ignition/modules/VRFCoordinatorV2PlusMock");
const fs = require('fs');
const path = require('path');


/**
 * Resets the deployment directory.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<void>} Nothing (async function).
 */
async function resetDeployments(hre) {
    const chainId = await hre.getChainId();
    const deploymentDir = path.join(__dirname, 'deployments', `chain-${chainId}`);

    if (fs.existsSync(deploymentDir)) {
        fs.rmdirSync(deploymentDir, { recursive: true });
    }
}


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
                "params": worlds
            }
        }
    });
    let worldsAddress = await worlds.getAddress();

    // Deploy the worldsManagement contract.
    const { worldsManagement } = await hre.ignition.deploy(StickEmAllWorldsManagement, {
        parameters: {
            "StickEmAllWorldsManagement": {
                "worlds": worlds
            }
        }
    });
    return {worlds, worldsManagement};
}


/**
 * Deploys the VRF mock contract.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<{}>} The contract (async function).
 */
async function deployVRF(hre) {
    const { mock } = await hre.ignition.deploy(VRFCoordinatorV2PlusMock);
    return mock;
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


task("deploy-everything", "Deploys all our ecosystem")
    .addParam("owner", "The address that will own the ecosystem in the end")
    .setAction(async ({ owner }, hre, runSuper) => {
        if (!hre.ethers.isAddress(owner)) {
            console.error("The owner is not a valid checksum address");
            return;
        }

        // Resetting everything.
        await resetDeployments(hre);

        // Deploying or identifying the price feed contract.
        let priceFeedAddr = await deployPriceFeed(hre);
        console.log("Price feed address: " + priceFeedAddr);

        // Deploying or identifying the params addr.
        let params = await deployParams(hre, priceFeedAddr);
        let paramsAddr = await params.getAddress();
        console.log("Params address: " + paramsAddr);

        // Deploying the worlds (mint & management) contracts.
        let {worlds, worldsManagement} = await deployWorld(hre, paramsAddr);
        let worldsAddress = await worlds.getAddress();
        let worldsManagementAddress = await worldsManagement.getAddress();
        console.log("Worlds address: " + worldsAddress);
        console.log("Worlds Management address: " + worldsManagementAddress);

        // Deploying the VRF.
        let mock = await deployVRF(hre);
        let mockAddress = await mock.getAddress();
        console.log("VRF Mock address: " + mockAddress);

        // Define world parameters.
        await worldsAddress.setFiatCost(keccak256("Costs::DefineWorld", 10));
        await worldsAddress.setFiatCost(keccak256("Costs::Albums::DefineAlbum", 5));
        await worldsAddress.setFiatCost(keccak256("Costs::Albums::DefinePage", 3));
        await worldsAddress.setFiatCost(keccak256("Costs::Albums::DefineAchievement", 2));
        await worldsAddress.setFiatCost(keccak256("Costs::Albums::DefineSticker", 1));
    });