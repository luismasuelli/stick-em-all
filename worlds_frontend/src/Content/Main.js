import {useCallback, useContext, useEffect, useRef, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import MakeWorldsContractClients from "./Main/MakeWorldsContractClients";
import getEventsEffect from "../Utils/getEventsEffect";
import Web3 from "web3";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";
import {produce} from "immer";


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


// Which are the defined & relevant params of the app?
const params = [
    // Define many costs like this:
    {
        caption: "Defining a World",
        hash: Web3.utils.soliditySha3("Costs::DefineWorld")
    },
]


/**
 * Renders the main content of the window.
 * @constructor
 */
function MainContent({ contracts, account }) {
    // 1. We'll make use of the main contracts and track the
    //    cache of events.
    const {worlds, worldsManagement} = contracts;

    // 2. Keeping a track of the worlds cache.
    const {worldsCache, setWorldsCache} = useState({worldsIndices: {}, worldsRelevance: []});
    const setWorldsCacheRef = useRef(setWorldsCache);
    setWorldsCacheRef.current = setWorldsCache;
    useEffect(() => {
        let updateInitialState = (state, event) => updateAccountDependentInitialState(state, event, account);
        let updateNextState = (state, event) => updateAccountDependentNextState(state, event, account);

        return getEventsEffect(
            worlds, ["Transfer", "WorldEditionAllowanceChanged"],
            {updateInitialState, finishInitialState}, updateNextState, setWorldsCacheRef.current, null
        )();
    }, [worlds, setWorldsCacheRef, account]);

    // 3. Keeping a track of the data associated to worlds.
    const {worldsDataCache, setWorldsDataCache} = useState({});
    const setWorldsDataCacheRef = useRef(setWorldsDataCache);
    setWorldsDataCacheRef.current = setWorldsDataCache;

    // 4. Keeping a track of the data associated to new worlds.
    const {newWorldData, setNewWorldData} = useState({});
    const setNewWorldDataRef = useRef(setNewWorldData);
    setNewWorldDataRef.current = setNewWorldData;

    // 4. Keeping a track of the currently selected-for-edition world.
    //    The first value (and the value when creating a world) is null.
    const {selectedWorld, setSelectedWorld} = useState(null);
    const setSelectedWorldData = useCallback((data) => {
        if (selectedWorld === undefined) {
            setWorldsDataCacheRef.current(produce(worldsDataCache, worldsDataCache => {
                worldsDataCache[selectedWorld] = data;
            }));
        } else {
            setNewWorldDataRef.current(data);
        }
    }, [selectedWorld, setWorldsDataCacheRef, worldsDataCache, setNewWorldDataRef]);
}


/**
 * This is the main page. All the pages should look like this.
 * @returns {JSX.Element}
 */
export default function Main() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {web3, account} = context;
    const [contracts, setContracts] = useState(null);
    const description =
        "This section allows defining new worlds, transferring ownership of the worlds, and " +
        "(for the respective world owners) managing the contents / properties of the worlds."

    useEffect(() => {
        MakeWorldsContractClients(web3, account).then(setContracts);
    }, [web3, account]);

    if (contracts) {
        return <ParamsAwareContractWindow caption={"Stick 'Em All - Worlds"} description={description}
                                          paramsContract={contracts.params} params={params}
                                          mainContract={contracts.worldsManagement} showOwner={true}>
            <MainContent />
        </ParamsAwareContractWindow>;
    } else {
        return <StandaloneMessage title="Loading..." content="Loading the contracts..." />;
    }
}