import {produce} from "immer";
import getEventsEffect from "../../Utils/getEventsEffect";


const albumIdMask = 1n << 255n;
const boosterPackSubMask = 1n << 30n;
const boosterPackRuleIdSubMask = (1n << 16n) - 1n;
const stickerPageIdSubMask = (1n << 13n) - 1;
const stickerCombinedIdSubMask = (1n << 16n) - 1;


/**
 * Categorizes an id.
 * @param id The raw id (already a big int).
 * @returns The categorized id.
 */
function categorizeId(id) {
    // id is already a BigInt here.

    // Test for album id.
    if ((id & albumIdMask) !== 0n) {
        return {id, type: "album"};
    }

    // Test for booster pack id.
    if ((id & boosterPackSubMask) !== 0n) {
        return {id, type: "booster-pack", albumTypeId: id >> 31n, ruleId: id & boosterPackRuleIdSubMask};
    }

    // Assume for sticker id.
    return {
        id, type: "sticker", albumTypeId: id >> 31n,
        pageId: (id >> 3n) & stickerPageIdSubMask, slotId: (id & 7n),
        combinedId: (id & stickerCombinedIdSubMask)
    }
}


/**
 * Updates a state by a given event.
 * @param state The state.
 * @param event The event to update by.
 * @returns {*} The new event.
 * @private
 */
function _updateState(state, event, account) {
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

    /**
     * Processes a single entry, which might go up or down.
     * @param id The id of the entry.
     * @param value The value of the entry.
     */
    function processIDAndAmount(id, value) {
        // eslint-disable-next-line no-undef
        id = BigInt(id);
        // eslint-disable-next-line no-undef
        value = BigInt(value);
        // TODO CONTINUE THIS IMPLEMENTATION (must use: categorizeId).
    }

    if (event.event === "TransferSingle") {
        const {from, to, id, value} = event.returnValues;
        if (from === account) {
            processIDAndAmount(id, -value);
        }
        if (to === account) {
            processIDAndAmount(id, value);
        }
    } else if (event.event === "TransferBatch") {
        const {from, to, ids, values} = event.returnValues;
        if (from === account) {
            for(let index = 0; index < ids.length; index++) {
                processIDAndAmount(ids[index], -values[index]);
            }
        }
        if (to === account) {
            for(let index = 0; index < ids.length; index++) {
                processIDAndAmount(ids[index], values[index]);
            }
        }
    }
    return state;
}


/**
 * Related to an account, processes an event in an immutable way.
 * @param state The current state.
 * @param event The event being processed.
 * @param account The related account.
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
 * @param account The related account.
 * @returns {*} The updated state.
 */
function updateAccountDependentInitialState(state, event, account) {
    return _updateState(state || {
        assetsIndices: {},
        assetsRelevance: [], // Amounts actually go here (for ALL the tokens).
        // TODO properly define/implement these.
        albums: {}, // [albumId] = amount (1 or 0)
        boosterPacks: {}, // [albumTypeId][ruleId] = amount
        stickers: {}, // [albumTypeId][pageId][slotId] = amount
        // Also: [albumTypeId]["__all__"][combinedId] = amount
    }, event, account);
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
 * Creates an events effect for the assets' events.
 * @param economy The economy contract.
 * @param account The account to watch.
 * @returns {function(): void} The close function for the effect.
 */
export default function assetsEventsEffect(economy, account, setAssetsCache, assetsCache) {
    const prepareInitialState = {
        updateInitialState: (state, event) => updateAccountDependentInitialState(state, event, account),
        finishInitialState
    };
    const updateNextState = (state, event) => updateAccountDependentNextState(state, event, account);

    return getEventsEffect(
        economy, [
            {name: "TransferSingle", filter: {from: account}},
            {name: "TransferBatch", filter: {from: account}},
            {name: "TransferSingle", filter: {to: account}},
            {name: "TransferBatch", filter: {to: account}},
        ], prepareInitialState, updateNextState, setAssetsCache, assetsCache
    );
}