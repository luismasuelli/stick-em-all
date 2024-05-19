const { task } = require("hardhat/config");
const MockV3AggregatorModule = require("../ignition/modules/MockV3Aggregator");
const StickEmAllParams = require("../ignition/modules/StickEmAllParams");
const StickEmAllWorlds = require("../ignition/modules/StickEmAllWorlds");
const StickEmAllWorldsManagement = require("../ignition/modules/StickEmAllWorldsManagement");
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
 * @returns {Promise<string>} The address of the deployed contract.
 */
async function deployParams(hre, priceFeedAddr) {
    const { params } = await hre.ignition.deploy(StickEmAllParams, {
        parameters: {
            "StickEmAllParams": {
                "priceFeed": priceFeedAddr
            }
        }
    });
    return await params.getAddress();
}


/**
 * Deploys the worlds and worldsManagement contracts.
 * @param hre The hardhat runtime environment.
 * @param paramsAddr The address of the params argument.
 * @returns {Promise<{worldsAddress, worldsManagementAddress}>} The address of worlds and worldsManagement contracts.
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
    return {worldsAddress, worldsManagementAddress: await worldsManagement.getAddress()};
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
        let paramsAddr = await deployParams(hre, priceFeedAddr);
        console.log("Params address: " + paramsAddr);

        // Deploying the worlds (mint & management) contracts.
        let {worldsAddress, worldsManagementAddress} = await deployWorld(hre, paramsAddr);
        console.log("Worlds address: " + worldsAddress);
        console.log("Worlds Management address: " + worldsManagementAddress);
    });