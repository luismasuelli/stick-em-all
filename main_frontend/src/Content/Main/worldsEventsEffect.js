import {produce} from "immer";
import getEventsEffect from "../../Utils/getEventsEffect";


/**
 * Updates a state by a given event.
 * @param state The state.
 * @param event The event to update by.
 * @param account The account to update by.
 * @returns {*} The new event.
 * @private
 */
function _updateState(state, event, account) {
    /**
     * Gets or adds a world entry.
     * @param worldId The world id.
     * @returns {{worldId}|*} The object.
     */
    function getOrAdd(worldId) {
        const index = state.worldsIndices[worldId];
        if (index === undefined) {
            state.worldsIndices[worldId] = state.worldsRelevance.length;
            let obj = {worldId};
            state.worldsRelevance.push(obj);
            return obj;
        } else {
            return state.worldsRelevance[index];
        }
    }

    if (event.event === "Transfer") {
        const {tokenId} = event.returnValues;
        getOrAdd(tokenId);
    }
    return state;
}


/**
 * Related to an account, processes an event in an immutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @param account The account.
 * @returns {unknown} The NEW updated state.
 */
function updateAccountDependentNextState(state, event, account) {
    return produce(state, draft => {
        _updateState(draft, event, account);
    });
}


/**
 * Related to an account, processes an event in a mutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @param account The account.
 * @returns {*} The updated state.
 */
function updateAccountDependentInitialState(state, event, account) {
    return _updateState(state || {worldsIndices: {}, worldsRelevance: []}, event, account);
}


/**
 * Clones the state.
 * @param state The original state.
 * @returns {*} The resulting state.
 */
function finishInitialState(state) {
    return {...state};
}


/**
 * Creates an events effect for the worlds events.
 * @param worlds The current worlds contract.
 * @param worldsCache The initial cache.
 * @param setWorldsCache A setter for the worlds cache.
 * @returns {function(): void} The close function for the effect.
 */
export default function worldsEventsEffect(worlds, worldsCache, setWorldsCache) {
    let prepareInitialState = {
        updateInitialState: updateAccountDependentInitialState, finishInitialState
    };

    return getEventsEffect(
        worlds, [
            {name: "Transfer", filter: {from: "0x0000000000000000000000000000000000000000"}},
        ], prepareInitialState, updateAccountDependentNextState, setWorldsCache, worldsCache
    );
}