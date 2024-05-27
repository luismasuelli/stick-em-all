import Web3 from "web3";

function decodeLogFromABI(contract, log) {
    const web3 = new Web3(contract.currentProvider);
    const event = contract.options.jsonInterface.find(item => {
        return item.type === 'event' && web3.utils.keccak256(item.signature) === log.topics[0];
    });

    if (!event) return null; // Event not found in the ABI

    return {
        name: event.name,
        event: web3.eth.abi.decodeLog(event.inputs, log.data, log.topics.slice(1)),
        raw: log
    };
}


/**
 * Gets the list of event logs from a tx receipt.
 * @param contract The contract that triggered the transaction.
 * @param tx The recept.
 * @returns The logs (async function).
 */
export async function getEventLogs(tx, contract) {
    const web3 = new Web3(contract.currentProvider);
    const receipt = await web3.eth.getTransactionReceipt(
        tx.transactionHash
    );
    const logs = receipt ? receipt.logs : [];
    return logs.map(log => decodeLogFromABI(contract, log));
}