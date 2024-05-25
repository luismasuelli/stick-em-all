import {useContext, useEffect, useRef, useState} from "react";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import worldsContractClients from "./Main/worldsContractClients";
import Web3 from "web3";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";
import worldsEventsEffect from "./Main/worldsEventsEffect";
import SelectWorld from './Main/SubStates/SelectWorld';
import CreateWorld from './Main/SubStates/CreateWorld';
import WorldCreated from './Main/SubStates/WorldCreated';
import EditWorld from './Main/SubStates/EditWorld';
import TransferWorld from './Main/SubStates/TransferWorld';
import ManageWorld from './Main/SubStates/ManageWorld';


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
        return worldsEventsEffect(worlds, setWorldsCacheRef, account);
    }, [worlds, setWorldsCacheRef, account]);

    // 3. Keeping a track of the data associated to worlds.
    //    For each world, the cached data is name and description.
    //    Other data appears only on retrieval and must be done in
    //    real-time.
    const {worldsDataCache, setWorldsDataCache} = useState({});

    // 4. Keeping a track of the data associated to new worlds,
    //    or editing an existing world.
    const {newWorldData, setNewWorldData} = useState({});

    // 5. Keeping a track of the currently selected-for-edition world.
    //    The first value (and the value when creating a world) is null.
    const {selectedWorld, setSelectedWorld} = useState(null);

    // Rendering everything.
    return <MemoryRouter>
        <Routes>
            <Route path="/" element={<SelectWorld
                worldsList={worldsCache.worldsRelevance} worldsData={worldsDataCache}
            />} />
            <Route path="/create" element={<CreateWorld
                worldsList={worldsCache.worldsRelevance} worldsData={worldsDataCache} worldsContract={worlds}
                setNewWorldData={setNewWorldData}
            />} />
            <Route path="/created/:worldId" element={<WorldCreated
                worldsList={worldsCache.worldsRelevance} worldsData={worldsDataCache} newWorldData={newWorldData}
            />} />
            <Route path="/edit/:worldId" element={<EditWorld
                worldsList={worldsCache.worldsRelevance} worldsData={worldsDataCache} worldsContract={worlds}
            />} />
            <Route path="/edit/:worldId/transfer" element={<TransferWorld
                worldsList={worldsCache.worldsRelevance} worldsData={worldsDataCache} worldsContract={worlds}
            />} />
            <Route path="/manage/:worldId" element={<ManageWorld
                worldsManagementContract={worldsManagement}
            />} />
        </Routes>
    </MemoryRouter>;
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
        worldsContractClients(web3, account).then(setContracts);
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