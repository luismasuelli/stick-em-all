const { task } = require("hardhat/config");
const VRFCoordinatorV2PlusMock = require("../ignition/modules/VRFCoordinatorV2PlusMock");
const fs = require('fs');
const path = require('path');


/**
 * Gets or deploys a VRF contract instance.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<*>} The deployed VRF contract (async function).
 */
async function getVRFContract(hre) {
    switch(hre.network.name) {
        case "hardhat":
        case "localhost":
            break;
        case "testnet":
        case "mainnet":
            throw new Error("This operation is only supported in hardhat/localhost networks");
        default:
            throw new Error("Unknown network: " + hre.network.name);
    }

    const { mock } = await hre.ignition.deploy(VRFCoordinatorV2PlusMock);
    return mock;
}


/**
 * Lists all the pending requests in the mock.
 * @param hre The hardhat runtime environment.
 * @returns {Promise<Array>} Pairs of request/amount (async function).
 */
async function getPendingVRFRequests(hre) {
    const mock = await getVRFContract(hre);
    const [indices, amounts] = await mock.listPendingRequests();
    return indices.map((e, idx) => [e, amounts[idx]]);
}


/**
 * Fulfills a request
 * @param hre The hardhat runtime environment.
 * @param id The id of the request
 * @returns {Promise<void>} (async function).
 */
async function fulfillVRFRequest(hre, id) {
    const mock = await getVRFContract(hre);
    const result = await mock.requests(id);
    if (result[4]) {
        console.error("This request is already fulfilled");
    }
    const amount = result[1];
    let elements = [];
    for(let index = 0; index < amount; index++) {

    }
    await mock.fulfillRandomWordsRequest(id, []);
    console.log(`Request #${id} was fulfilled`);
}

task("vrf-list-requests", "Lists the pending VRF requests")
    .setAction(async (args, hre, runSuper) => {
        try {
            const elements = await getPendingVRFRequests(hre);
            elements.forEach((e) => {
                console.log(`Request #${e[0]} -> ${e[1]} elements`);
            })
        } catch(e) {
            console.error(e);
        }
    });


task("vrf-fulfill", "Fulfills one request")
    .setAction(async({ id }, hre, runSuper) => {
        try {
            await fulfillVRFRequest(id);
        } catch(e) {
            console.log(e);
        }
    });