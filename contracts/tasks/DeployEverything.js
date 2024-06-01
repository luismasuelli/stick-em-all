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
 * Resets the deployment directory.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<void>} Nothing (async function).
 */
async function resetDeployments(hre) {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId;
    const deploymentDir = path.join(__dirname, '..', 'ignition', 'deployments', `chain-${chainId}`);

    console.log("Checking/cleaning deployment directory " + deploymentDir + "...");
    if (fs.existsSync(deploymentDir)) {
        switch(hre.network.name) {
            case "hardhat":
            case "localhost":
                console.log("Removing directory " + deploymentDir + "...");
                fs.rmdirSync(deploymentDir, { recursive: true });
                break;
            case "mainnet":
            case "testnet":
                console.warn(
                    "A deployment is already set for network: " + hre.network.name + ", " +
                    "which is located at directory: " + deploymentDir + ". If you want to re-deploy " +
                    "these contracts, delete those directories manually. I'll not do that for you " +
                    "for those networks (I'll only do that locally)."
                );
                break;
        }
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
 * Deploys the VRF mock contract.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<{vrfAddress, keyHash}>} The contract's address and keyhash (async function).
 */
async function deployVRF(hre) {
    switch(hre.network.name) {
        case "hardhat":
        case "localhost":
            const { mock } = await hre.ignition.deploy(VRFCoordinatorV2PlusMock);
            return {
                vrfAddress: await mock.getAddress(),
                keyHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
            };
        case "testnet":
            return {
                vrfAddress: "0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2",
                keyHash: "0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899"
            };
        case "mainnet":
            return {
                vrfAddress: "0xec0Ed46f36576541C75739E915ADbCb3DE24bD77",
                keyHash: "0x719ed7d7664abc3001c18aac8130a2265e1e70b7e036ae20f3ca8b92b3154d86"
            };
        default:
            throw new Error("Unknown network: " + hre.network.name);
    }
}


/**
 * Deploys the economy and main contracts.
 * @param hre The hardhat runtime environment.
 * @param vrfAddress The VRF contract address.
 * @param worldsManagementAddress The Worlds Management contract address.
 * @param keyHash The keyHash to use.
 * @param subscription The subscription to use.
 * @returns {Promise<{economy, main}>} The economy and main contracts (async function).
 */
async function deployMainContracts(hre, vrfAddress, worldsManagementAddress, keyHash, subscription) {
    const { economy } = await hre.ignition.deploy(StickEmAllEconomy, {
        parameters: {
            "StickEmAllEconomy": {
                "worldsManagement": worldsManagementAddress
            }
        }
    });
    const economyAddress = await economy.getAddress();

    switch(hre.network.name) {
        case "hardhat":
        case "localhost":
            // Accept subscription as-is.
            break;
        case "testnet":
        case "mainnet":
            // If subscription is 0 or undefined, error.
            if (!subscription) {
                throw new Error("For network " + hre.network.name + ", the subscription argument must be set");
            }
            break;
        default:
            throw new Error("Unknown network: " + hre.network.name);
    }

    const { main } = await hre.ignition.deploy(StickEmAllMain, {
        parameters: {
            "StickEmAllMain": {
                "economy": economyAddress,
                "vrf": vrfAddress,
                "keyHash": keyHash,
                "subscription": subscription || 0
            }
        }
    });

    await economy.setMainContract(await main.getAddress());

    return { economy, main };
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
    .addOptionalParam("owner", "The address that will own the ecosystem in the end (specially useful in local)")
    .addOptionalParam("vrfsub", "The VRF subscription id (mandatory in testnet/mainnet)")
    .setAction(async ({ owner, vrfsub }, hre, runSuper) => {
        if (owner && !hre.ethers.isAddress(owner)) {
            console.error("The owner is not a valid checksum address");
            return;
        }

        // Resetting everything.
        await resetDeployments(hre);

        // Deploying or identifying the price feed contract.
        console.log("Deploying price feed contract...");
        let priceFeedAddr = await deployPriceFeed(hre);
        console.log("Price feed address: " + priceFeedAddr);

        // Deploying or identifying the params addr.
        console.log("Deploying params contract...");
        let params = await deployParams(hre, priceFeedAddr);
        let paramsAddr = await params.getAddress();
        console.log("Params address: " + paramsAddr);

        // Deploying the worlds (mint & management) contracts.
        console.log("Deploying world contracts...");
        let { worlds, worldsManagement } = await deployWorld(hre, paramsAddr);
        let worldsAddress = await worlds.getAddress();
        let worldsManagementAddress = await worldsManagement.getAddress();
        console.log("Worlds address: " + worldsAddress);
        console.log("Worlds Management address: " + worldsManagementAddress);

        // Deploying the VRF.
        console.log("Deploying VRF contract...");
        let { vrfAddress, keyHash } = await deployVRF(hre);
        console.log("VRF Mock address: " + vrfAddress);
        console.log("VRF Key hash: " + keyHash);

        console.log("Deploying main/economy contracts...");
        let { economy, main } = await deployMainContracts(
            hre, vrfAddress, worldsManagementAddress, keyHash, vrfsub
        );
        let economyAddress = await economy.getAddress();
        let mainAddress = await main.getAddress();
        console.log("Economy address: " + economyAddress);
        console.log("Main address: " + mainAddress);

        // Define world pAdarameters.
        await params.setFiatCost(keccak256(hre.ethers, "Costs::DefineWorld"), 10);
        await params.setFiatCost(keccak256(hre.ethers, "Costs::Albums::DefineAlbum"), 5);
        await params.setFiatCost(keccak256(hre.ethers, "Costs::Albums::DefinePage"), 3);
        await params.setFiatCost(keccak256(hre.ethers, "Costs::Albums::DefineAchievement"), 2);
        await params.setFiatCost(keccak256(hre.ethers, "Costs::Albums::DefineSticker"), 1);

        // Adding two achievement types.
        await params.addAchievementType(keccak256(hre.ethers, "AchievementType::Card"), "Card");
        await params.addAchievementType(keccak256(hre.ethers, "AchievementType::Badge"), "Badge");

        if (owner) {
            console.log("Transferring ownership to " + owner + "...");
            await params.transferOwnership(owner);
            console.log("Transferring 100.0 ETH to " + owner + "...");
            const last = (await hre.ethers.getSigners())[99];
            await last.sendTransaction({to: owner, value: hre.ethers.parseEther('100.0')});
        } else {
            switch(hre.network.name) {
                case "hardhat":
                case "localhost":
                    console.warn(
                        "This is a local network and no owner was set. Unless you set the same " +
                        "mnemonic in your wallet software (which, btw, is NOT recommended at all), you'll " +
                        "not be able to make some significant changes while operating with the contracts. " +
                        "Don't worry: you can re-run this hardhat task with the --owner 0xYourWalletAddress " +
                        "(in the worst case: even restarting the hardhat node before running this task again) " +
                        "and have this totally operational while testing everything locally from your browser's " +
                        "wallet (or whichever one you use)."
                    );
                    break;
                case "testnet":
                case "mainnet":
                    console.log(
                        "You did not specify an explicit owner. The current owner corresponds to the " +
                        "first account related to the specified MNEMONIC: " + (await params.owner())
                    );
                    break;
                default:
                    throw new Error("Unknown network: " + hre.network.name);
            }
        }
    });