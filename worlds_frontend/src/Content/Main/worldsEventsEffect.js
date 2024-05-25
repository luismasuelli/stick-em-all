import {produce} from "immer";
import getEventsEffect from "../../Utils/getEventsEffect";


/*
 * The information about worlds will be stored like this:
 *
 * 1. List of worlds, either owned or allowed. If a world is owned by the user,
 *    then it will be marked owned:true. If a world is allowed for the user,
 *    then it will be marked allowed:true.
 *
 *    Owned worlds are marked green. Allowed, but not owned, worlds are marked
 *    blue instead. Worlds that stop being both owned and allowed are removed
 *    from this list.
 *
 * 2. List of worlds data. This is a local cache that tracks the data of a world.
 *    This data covers name, description, icon, external URL and validator URL.
 *    The ownership is refreshed automagically. This data is NOT deleted when
 *    the world is disowned and disallowed.
 */


/**
 * Updates a state by a given event.
 * @param state The state.
 * @param event The event to update by.
 * @param account The account to update by.
 * @returns {*} The new event.
 * @private
 */
function _updateState(state, event, account) {
    if (event.name === "Transfer") {
        const {from, to, tokenId} = event.returnValue;
        if (from === account) {
            const index = state.worldsIndices[tokenId];
            if (index === undefined) {
                state.worldsIndices[tokenId] = state.worldsRelevance.length;
                state.worldsRelevance.push({owned: true});
            }
        }
        if (to === account) {
            const index = state.worldsIndices[tokenId];
            if (index !== undefined) {
                state.worldsRelevance[index].owned = false;
            }
        }
    } else if (event.name === "WorldEditionAllowanceChanged") {
        const {worldId, who, allowed} = event.returnValue;
        if (who === account) {
            const index = state.worldsIndices[worldId];
            if (index !== undefined) {
                state.worldsRelevance[index].allowed = allowed;
            }
        }
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
        _updateState(state, event, account);
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
    return _updateState(state || {worldsIndices: {}, worldsRelevance: []});
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
 * Creates an events effect for the worlds event.
 * @param worlds The current worlds contract.
 * @param setWorldsCacheRef A setter for the worlds cache.
 * @param account The current account.
 * @returns {function(): void} The close function for the effect.
 */
export default function worldsEventsEffect(worlds, setWorldsCacheRef, account) {
    let updateInitialState = (state, event) => updateAccountDependentInitialState(state, event, account);
    let updateNextState = (state, event) => updateAccountDependentNextState(state, event, account);
    let prepareInitialState = {updateInitialState, finishInitialState};

    return getEventsEffect(
        worlds, ["Transfer", "WorldEditionAllowanceChanged"], prepareInitialState,
        updateNextState, setWorldsCacheRef.current, null
    );
}