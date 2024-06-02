import {produce} from "immer";
import getEventsEffect from "../../Utils/getEventsEffect";


/**
 * Updates a state by a given event.
 * @param state The state.
 * @param event The event to update by.
 * @returns {*} The new event.
 * @private
 */
function _updateState(state, event) {
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
 * Processes an event in an immutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @returns {unknown} The NEW updated state.
 */
function updateNextState(state, event) {
    return produce(state, draft => {
        _updateState(draft, event);
    });
}


/**
 * Processes an event in a mutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @returns {*} The updated state.
 */
function updateInitialState(state, event) {
    return _updateState(state || {worldsIndices: {}, worldsRelevance: []}, event);
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
        updateInitialState, finishInitialState
    };

    return getEventsEffect(
        worlds, [
            {name: "Transfer", filter: {from: "0x0000000000000000000000000000000000000000"}},
        ], prepareInitialState, updateNextState, setWorldsCache, worldsCache
    );
}