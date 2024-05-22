function defaultUpdateState(s, e) {
    s = s || [];
    s.push(e);
    return s;
}

function defaultFinishState(s) {
    return [...s];
}


/**
 * Processes and returns the past events of a contract.
 * @param contract The contract.
 * @param eventNames The names of the events.
 * @param updateState The update state function.
 * @param finishState A finish function to deliver the new state.
 * @param lastBlock The last block.
 * @param lastState The last state.
 * @returns {Promise<{lastBlock: *, lastState}>} The new {lastBlock, lastState} (async function).
 */
async function processPastEvents(contract, eventNames, updateState, finishState, {lastBlock, lastState}) {
    // First, get initial elements.
    let web3 = contract.getContextObject();
    let startBlock = lastBlock == null ? web3.utils.toBN(0) : lastBlock.add(1);
    let state = lastState;
    updateState = updateState || defaultUpdateState;
    finishState = finishState || defaultFinishState;

    // Then, for each event, we retrieve the logs.
    let pastEvents = [];
    let eventNamesLength = eventNames.length;
    for(let idx = 0; idx < eventNamesLength; idx++) {
        pastEvents.push(...(await contract.getPastEvents(eventNames[idx], {
            fromBlock: startBlock,
            toBlock: 'latest'
        })));
    }

    // Re-map and sort the past events.
    pastEvents = pastEvents.map(e => {
        return {
            name: e.name,
            returnValue: e.returnValue,
            blockNumber: web3.utils.toBN(e.blockNumber),
            transactionIndex: web3.utils.toBN(e.transactionIndex),
            logIndex: web3.utils.toBN(e.logIndex)
        }
    });
    pastEvents.sort((a, b) => {
        let cmpBN = a.blockNumber.cmp(b.blockNumber);
        if (cmpBN !== 0) return cmpBN;

        let cmpTI = a.transactionIndex.cmp(b.transactionIndex);
        if (cmpTI !== 0) return cmpTI;

        return a.logIndex.cmp(b.logIndex);
    });

    // For each event, process the current state based on it.
    pastEvents.forEach((e) => {
        state = updateState(state, e);
    })
    state = defaultFinishState(state);

    // Then, return the new state.
    const newBlock = pastEvents.length ? pastEvents[pastEvents.length - 1].blockNumber : null;
    return {lastBlock: newBlock, lastState: state};
}
