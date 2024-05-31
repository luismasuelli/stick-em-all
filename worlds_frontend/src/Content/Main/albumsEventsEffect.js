import {produce} from "immer";
import getEventsEffect from "../../Utils/getEventsEffect";


/*
 * The information about albums will be stored like this:
 *
 * 1. List of albums, their worldId/albumId and whether being released or not.
 *    Like this: {worldId, albumId[, released:true]}.
 *
 *    Released albums are marked green. Non-released ones are marked blue instead.
 *    Albums are never removed or un-released.
 *
 * 2. List of albums' data. This is a local cache that tracks the data of an album.
 *    This data covers name, edition, and front image.
 */


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
     * @returns {{albumId}|*} The object.
     */
    function getOrAdd(albumId) {
        const index = state.albumsIndices[albumId];
        if (index === undefined) {
            state.albumsIndices[albumId] = state.albumsRelevance.length;
            let obj = {albumId};
            state.albumsRelevance.push(obj);
            return obj;
        } else {
            return state.albumsRelevance[index];
        }
    }

    if (event.event === "AlbumDefined") {
        const {id, worldId} = event.returnValues;

        let obj = getOrAdd(id);
        obj.worldId = worldId;
    } else if (event.event === "AlbumReleased") {
        const {albumId, worldId} = event.returnValues;

        let obj = getOrAdd(albumId);
        obj.worldId = worldId;
    }
    return state;
}


/**
 * Related to an account, processes an event in an immutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @returns {unknown} The NEW updated state.
 */
function updateAccountDependentNextState(state, event) {
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
function updateAccountDependentInitialState(state, event) {
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
 * @param setAlbumsCacheRef A setter for the albums cache.
 * @param worldId The id of the world to get the albums from.
 * @returns {function(): void} The close function for the effect.
 */
export default function worldsEventsEffect(worldsManagement, albumsCache, setAlbumsCacheRef, worldId) {
    let updateInitialState = (state, event) => updateAccountDependentInitialState(state, event);
    let updateNextState = (state, event) => updateAccountDependentNextState(state, event);
    let prepareInitialState = {updateInitialState, finishInitialState};

    return getEventsEffect(
        worldsManagement, [
            {name: "AlbumDefined", filter: {worldId}},
            {name: "AlbumReleased", filter: {worldId}},
        ], prepareInitialState,
        updateNextState, setAlbumsCacheRef.current, albumsCache
    );
}