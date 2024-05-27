import Web3 from "web3";

function defaultMutableUpdateState(s, e) {
    s = s || [];
    s.push(e);
    return s;
}


function defaultFinishState(s) {
    return [...(s || [])];
}


function defaultImmutableUpdateState(s, e) {
    return [...s, e];
}


/**
 * Processes and returns the past events of a contract.
 * @param contract The contract.
 * @param eventNames The names of the events.
 * @param updateState The update state function (it can be mutable).
 * @param finishState A finish function to deliver the new state.
 * @param lastBlock The last block.
 * @param lastState The last state.
 * @returns {Promise<{lastBlock: *, lastState}>} The new {lastBlock, lastState} (async function).
 */
async function processPastEvents(contract, eventNames, updateState, finishState, {lastBlock, lastState}) {
    // First, get initial elements.
    let web3 = new Web3(contract.currentProvider);
    console.log(web3);
    let startBlock = lastBlock == null ? web3.utils.toBN(0) : lastBlock.add(1);
    let state = lastState;
    updateState = updateState || defaultMutableUpdateState;
    finishState = finishState || defaultFinishState;

    // Then, for each event, we retrieve the logs.
    console.log(`Collecting All the past events...`);
    let pastEvents = [];
    let eventNamesLength = eventNames.length;
    for(let idx = 0; idx < eventNamesLength; idx++) {
        console.log(`>>> Collecting events of type ${eventNames[idx]}...`);
        pastEvents.push(...(await contract.getPastEvents(eventNames[idx], {
            fromBlock: startBlock,
            toBlock: 'latest'
        })));
    }

    // Re-map and sort the past events.
    console.log(`Cleaning and preparing the ${pastEvents.length} collected events...`);
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
    console.log(`Preparing the state based on the ${pastEvents.length} collected events...`);
    pastEvents.forEach((e) => {
        state = updateState(state, e);
    })
    state = finishState(state);

    // Then, return the new state.
    const newBlock = pastEvents.length ? pastEvents[pastEvents.length - 1].blockNumber : null;
    return {lastBlock: newBlock, lastState: state};
}


/**
 * Processes and returns the future/incoming events of a contract.
 * @param contract The contract.
 * @param eventNames The names of the events.
 * @param updateState The update state function (IT MUST BE IMMUTABLE).
 * @param pushState A function used to push the last state. IT SHOULD BE DE-REACTIVIZED.
 * @param lastBlock The last block.
 * @param lastState The last state.
 * @returns {Array} The event objects.
 */
function processFutureEvents(contract, eventNames, updateState, pushState, {lastBlock, lastState}) {
    // First, get interested in the events.
    let web3 = new Web3(contract.currentProvider);
    let events = eventNames.map((en) => contract.events[en]({fromBlock: lastBlock.add(1)}));
    updateState = updateState || defaultImmutableUpdateState;

    events.forEach((e) => {
        console.log(`>>> Starting the handler for the ${e} event type...`);
        e.on('data', (ei) => {
            lastState = updateState(lastState, {
                name: ei.name,
                returnValue: ei.returnValue,
                blockNumber: web3.utils.toBN(ei.blockNumber),
                transactionIndex: web3.utils.toBN(ei.transactionIndex),
                logIndex: web3.utils.toBN(ei.logIndex)
            });
            pushState(lastState);
        })
    })

    return events;
}


/**
 * Creates the event-capturing effect. This effect should only depend on the contract,
 * while all the other references should be non-reactive.
 * @param contract The contract.
 * @param eventNames The names of the events.
 * @param prepareInitialState An object {updateInitialState, finishInitialState} where updateInitialState is a function
 * that takes (state, element) and returns a new state (or the same state, after mutating it) and finishInitialState is
 * another function taking (state) usually returning a clone of the state.
 * @param updateNextState The update state function (IT MUST BE IMMUTABLE). It must take (state, element) and return
 * a new state object (NOT relying on mutations).
 * @param pushState A function to push the {lastBlock, lastState} to be managed or rendered later.
 * @param checkpoint A {lastBlock, lastState} object where the lastBlock stands for the last synchronized block and
 * the lastState stands for the corresponding state of digested data in a way that it can be further synchronized from.
 * @returns {function(): function(): void} The effect function (async function).
 */
function getEventsEffect(
    contract, eventNames, prepareInitialState, updateNextState, pushState, checkpoint
) {
    const {lastBlock, lastState} = checkpoint || {};
    const {updateInitialState, finishInitialState} = prepareInitialState;
    updateNextState = updateNextState || defaultImmutableUpdateState;

    let wasEffectCanceled = false;
    let eventHandlers = null;

    async function setup() {
        const result = await processPastEvents(
            contract, eventNames, updateInitialState, finishInitialState, {lastBlock, lastState}
        );
        console.log("Setting the initial state...");
        pushState(result);
        if (!wasEffectCanceled) {
            console.log("Preparing the collection of future events...");
            eventHandlers = processFutureEvents(contract, eventNames, updateNextState, pushState, result);
        }
    }

    setup().then(() => console.log("Events listening setup is done"));

    return function() {
        if (eventHandlers !== null) {
            eventHandlers.forEach((eh, idx) => {
                console.log(`>>> Stopping the handler for the ${eventNames[idx]} event type...`);
                eh.unsubscribe();
            });
        }
        wasEffectCanceled = true;
    }
}


export default getEventsEffect;