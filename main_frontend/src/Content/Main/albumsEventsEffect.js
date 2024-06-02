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
     * Gets or adds an album entry.
     * @param albumId The album id.
     * @param worldId The world id.
     * @returns {{albumId}|*} The object.
     */
    function getOrAdd(albumId, worldId) {
        const index = state.albumsIndices[albumId];
        if (index === undefined) {
            state.albumsIndices[albumId] = state.albumsRelevance.length;
            let obj = {albumId, worldId};
            state.albumsRelevance.push(obj);
            return obj;
        } else {
            return state.albumsRelevance[index];
        }
    }

    if (event.event === "AlbumReleased") {
        const {albumId, worldId} = event.returnValues;

        let obj = getOrAdd(albumId, worldId);
        obj.released = true;
    }
    return state;
}


/**
 * Related to an account, processes an event in an immutable way.
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
 * Related to an account, processes an event in a mutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @returns {*} The updated state.
 */
function updateInitialState(state, event) {
    return _updateState(state || {albumsIndices: {}, albumsRelevance: []}, event);
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
 * Creates an events effect for the albums events.
 * @param worldsManagement The current worldsManagement contract.
 * @param albumsCache The initial cache.
 * @param setAlbumsCache A setter for the albums cache.
 * @param worldId The id of the world to get the albums from.
 * @returns {function(): void} The close function for the effect.
 */
export default function albumsEventsEffect(worldsManagement, albumsCache, setAlbumsCache, worldId) {
    let prepareInitialState = {
        updateInitialState, finishInitialState
    };

    return getEventsEffect(
        worldsManagement, [
            {name: "AlbumDefined", filter: {worldId}},
            {name: "AlbumReleased", filter: {worldId}},
        ], prepareInitialState, updateNextState, setAlbumsCache, albumsCache
    );
}