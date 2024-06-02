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
        return {type: "album"};
    }

    // Test for booster pack id.
    if ((id & boosterPackSubMask) !== 0n) {
        return {type: "booster-pack", albumTypeId: id >> 31n, ruleId: id & boosterPackRuleIdSubMask};
    }

    // Assume for sticker id.
    return {
        type: "sticker", albumTypeId: id >> 31n,
        pageId: (id >> 3n) & stickerPageIdSubMask, slotId: (id & 7n),
        combinedId: (id & stickerCombinedIdSubMask)
    }
}


/**
 * Updates a state by a given event.
 * @param state The state.
 * @param event The event to update by.
 * @param account The related account.
 * @returns {*} The new event.
 * @private
 */
function _updateState(state, event, account) {
    /**
     * Gets or adds an album entry.
     * @param id The asset id.
     * @returns * The object.
     */
    function getOrAdd(id) {
        const index = state.assetsIndices[id];
        if (index === undefined) {
            // 1. Store the global index reference, and the
            //    proper object.
            state.assetsIndices[id] = state.assetsRelevance.length;
            let obj = {amount: 0};
            state.assetsRelevance.push(obj);

            // 2. Also store the other indices.
            const {
                type, albumTypeId, ruleId, pageId, slotId
            } = categorizeId(id);
            // eslint-disable-next-line default-case
            switch(type)
            {
                case "album":
                    state.albums[id] = true;
                    break;
                case "booster-pack":
                    state.boosterPacks[albumTypeId] ||= [];
                    state.boosterPacks[albumTypeId].push({id, ruleId});
                    break;
                case "sticker":
                    state.boosterPacks[albumTypeId] ||= {};
                    state.boosterPacks[albumTypeId][pageId] ||= [];
                    state.boosterPacks[albumTypeId][pageId].push({id, pageId, slotId});
                    state.boosterPacks[albumTypeId]["__all__"] ||= [];
                    state.boosterPacks[albumTypeId]["__all__"].push({id, pageId, slotId});
                    break;
            }

            // Return the object.
            return obj;
        } else {
            return state.assetsRelevance[index];
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
        getOrAdd(id).amount += value;
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
        albums: {}, // [id] = true;
        boosterPacks: {}, // [albumTypeId] = [{id, ruleId}, ...]
        stickers: {}, // [albumTypeId][pageId] = [{id, pageId, slotId}, ...]
        // Also: [albumTypeId]["__all__"] = [{id, pageId, slotId}, ...]
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
 * @param setAssetsCache The setter of the cache.
 * @param assetsCache The cache.
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