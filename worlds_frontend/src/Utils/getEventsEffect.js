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


function nextBlock(v) {
    // eslint-disable-next-line no-undef
    if (typeof v === "number") v = BigInt(v);
    // eslint-disable-next-line no-undef
    if (typeof v === "bigint") {
        // eslint-disable-next-line no-undef
        v = v + BigInt(1);
    } else {
        // eslint-disable-next-line no-undef
        v = BigInt(0);
    }
    return v;
}


/**
 * Processes and returns the past events of a contract.
 * @param contract The contract.
 * @param events The names or specs of the events.
 * @param updateState The update state function (it can be mutable).
 * @param finishState A finish function to deliver the new state.
 * @param lastBlock The last block.
 * @param lastState The last state.
 * @returns {Promise<{lastBlock: *, lastState}>} The new {lastBlock, lastState} (async function).
 */
async function processPastEvents(contract, events, updateState, finishState, {lastBlock, lastState}) {
    // First, get initial elements.
    let web3 = new Web3(contract.currentProvider);
    // eslint-disable-next-line no-undef
    let startBlock = lastBlock == null ? web3.utils.toBigInt(0) : lastBlock + 1n;
    let state = lastState;
    updateState = updateState || defaultMutableUpdateState;
    finishState = finishState || defaultFinishState;

    // Then, for each event, we retrieve the logs.
    console.log(`Collecting All the past events...`);
    let pastEvents = [];
    let eventNamesLength = events.length;
    for(let idx = 0; idx < eventNamesLength; idx++) {
        const event = events[idx];
        console.log(">>> Collecting events of type:", event);

        let options = {
            fromBlock: startBlock,
            toBlock: 'latest'
        };
        let eventName;
        if (typeof event === "string") {
            eventName = event;
        } else {
            eventName = event.name;
            options.filter = event.filter;
        }
        pastEvents.push(...(await contract.getPastEvents(eventName, options)));
    }

    // Re-map and sort the past events.
    console.log(`Cleaning and preparing the ${pastEvents.length} collected events...`);
    pastEvents = pastEvents.map(e => {
        return {
            event: e.event,
            returnValues: e.returnValues,
            blockNumber: web3.utils.toBigInt(e.blockNumber),
            transactionIndex: web3.utils.toBigInt(e.transactionIndex),
            logIndex: web3.utils.toBigInt(e.logIndex)
        }
    });
    pastEvents.sort((a, b) => {
        if (a.blockNumber > b.blockNumber) return -1;
        if (a.blockNumber < b.blockNumber) return 1;

        if (a.transactionIndex > b.transactionIndex) return -1;
        if (a.transactionIndex < b.transactionIndex) return 1;

        if (a.logIndex > b.logIndex) return -1;
        if (a.logIndex < b.logIndex) return 1;

        return 0;
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
 * @param events The names or specs of the events.
 * @param updateState The update state function (IT MUST BE IMMUTABLE).
 * @param pushState A function used to push the last state. IT SHOULD BE DE-REACTIVIZED.
 * @param lastBlock The last block.
 * @param lastState The last state.
 * @returns {Array} The event objects.
 */
function processFutureEvents(contract, events, updateState, pushState, {lastBlock, lastState}) {
    // First, get interested in the events.
    let web3 = new Web3(contract.currentProvider);
    let fromBlock = nextBlock(lastBlock);
    let eventsListeners = events.map((event) => {
        let eventName;
        let options = {fromBlock};
        if (typeof event === "string") {
            eventName = event;
        } else {
            eventName = event.name;
            options.filter = event.filter;
        }
        return contract.events[eventName](options);
    });
    updateState = updateState || defaultImmutableUpdateState;

    eventsListeners.forEach((e) => {
        e.on('data', (ei) => {
            lastState = updateState(lastState, {
                event: ei.event,
                returnValues: ei.returnValues,
                blockNumber: web3.utils.toBigInt(ei.blockNumber),
                transactionIndex: web3.utils.toBigInt(ei.transactionIndex),
                logIndex: web3.utils.toBigInt(ei.logIndex)
            });
            pushState({lastBlock: ei.blockNumber + 1n, lastState: lastState});
        })
    })

    return events;
}


/**
 * Creates the event-capturing effect. This effect should only depend on the contract,
 * while all the other references should be non-reactive.
 * @param contract The contract.
 * @param events The names or specs of the events.
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
    contract, events, prepareInitialState, updateNextState, pushState, checkpoint
) {
    const {lastBlock, lastState} = checkpoint || {};
    let {updateInitialState, finishInitialState} = prepareInitialState || {};
    updateNextState = updateNextState || defaultImmutableUpdateState;
    updateInitialState = updateInitialState || defaultMutableUpdateState;
    finishInitialState = finishInitialState || defaultFinishState;

    let wasEffectCanceled = false;
    let eventHandlers = null;

    async function setup() {
        const result = await processPastEvents(
            contract, events, updateInitialState, finishInitialState, {lastBlock, lastState}
        );
        console.log("Setting the initial state...");
        pushState(result);
        if (!wasEffectCanceled) {
            console.log("Preparing the collection of future events...");
            eventHandlers = processFutureEvents(contract, events, updateNextState, pushState, result);
        }
    }

    setup().then(() => console.log("Events listening setup is done"));

    return function() {
        if (eventHandlers !== null) {
            eventHandlers.forEach((eh, idx) => {
                console.log(">>> Stopping the handler for the event type:", events[idx]);
                eh.unsubscribe();
            });
        }
        wasEffectCanceled = true;
    }
}


export default getEventsEffect;