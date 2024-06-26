import {useContext, useEffect, useState} from "react";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import worldsContractClients from "./Main/worldsContractClients";
import Web3 from "web3";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";
import worldsEventsEffect from "./Main/worldsEventsEffect";
import albumsEventsEffect from "./Main/albumsEventsEffect";
import SelectWorld from './Main/SubStates/SelectWorld';
import CreateWorld from './Main/SubStates/CreateWorld';
import WorldCreated from './Main/SubStates/WorldCreated';
import EditWorld from './Main/SubStates/EditWorld';
import TransferWorld from './Main/SubStates/TransferWorld';
import SelectAlbum from './Main/SubStates/Management/SelectAlbum';
import CreateAlbum from './Main/SubStates/Management/CreateAlbum';
import EditAlbum from './Main/SubStates/Management/EditAlbum';
import EditAlbumPage from './Main/SubStates/Management/EditAlbumPage';
import Section from "./Controls/Section";
import {useNonReactive} from "../Utils/nonReactive";


// Which are the defined & relevant params of the app?
const params = [
    // Define many costs like this:
    {
        caption: "Defining a World",
        hash: Web3.utils.soliditySha3("Costs::DefineWorld")
    },
    {
        caption: "Defining an Album",
        hash: Web3.utils.soliditySha3("Costs::Albums::DefineAlbum")
    },
    {
        caption: "Defining an Album's Page",
        hash: Web3.utils.soliditySha3("Costs::Albums::DefinePage")
    },
    {
        caption: "Defining an Achievement",
        hash: Web3.utils.soliditySha3("Costs::Albums::DefineAchievement")
    },
    {
        caption: "Defining a Sticker",
        hash: Web3.utils.soliditySha3("Costs::Albums::DefineSticker")
    }
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
    let [worldsCache, setWorldsCache] = useState(
        {lastBlock: null, lastState: {worldsIndices: {}, worldsRelevance: []}}
    );
    setWorldsCache = useNonReactive(setWorldsCache);
    useEffect(() => {
        return worldsEventsEffect(
            worlds, {lastBlock: null, lastState: {worldsIndices: {}, worldsRelevance: []}},
            setWorldsCache, account
        );
    }, [worlds, setWorldsCache, account]);

    // 3. Keeping a track of the data associated to worlds.
    //    For each world, the cached data is name and description.
    //    Other data appears only on retrieval and must be done in
    //    real-time.
    const [worldsDataCache, setWorldsDataCache] = useState({});
    const setWorldData = useNonReactive((worldId, worldData) => {
        setWorldsDataCache({
            ...worldsDataCache,
            ...(Object.fromEntries([[worldId, worldData]]))
        });
    });

    // 4. Keeping a track of the data associated to new worlds,
    //    or editing an existing world.
    const [newWorldData, setNewWorldData] = useState({});

    // 5. Add the ability to select worlds and get albums data.
    let [selectedWorldId, setSelectedWorldId] = useState();
    setSelectedWorldId = useNonReactive(setSelectedWorldId);
    let [albumsCache, setAlbumsCache] = useState(
        {lastBlock: null, lastState: {albumsIndices: {}, albumsRelevance: []}}
    );
    setAlbumsCache = useNonReactive(setAlbumsCache);
    useEffect(() => {
        setAlbumsCache({lastBlock: null, lastState: {albumsIndices: {}, albumsRelevance: []}});
        if (typeof selectedWorldId === "bigint" && selectedWorldId >= 0n) {
            // start fetching albums data.
            return albumsEventsEffect(
                worldsManagement, {lastBlock: null, lastState: {albumsIndices: {}, albumsRelevance: []}},
                // eslint-disable-next-line no-undef
                setAlbumsCache, BigInt(selectedWorldId)
            );
        }
    }, [selectedWorldId, setAlbumsCache, worldsManagement]);

    // 6. Finally, tracking the albums data cache.
    const [albumsDataCache, setAlbumsDataCache] = useState({});
    const setAlbumData = useNonReactive((albumId, albumData) => {
        setAlbumsDataCache({
            ...albumsDataCache,
            ...(Object.fromEntries([[albumId, albumData]]))
        });
    });

    // Rendering everything.
    return <Section title="Earnings management" color="primary.light" sx={{marginTop: 4}}>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<SelectWorld
                    worldsList={worldsCache.lastState.worldsRelevance} worldsData={worldsDataCache}
                />} />
                <Route path="/create" element={<CreateWorld
                    worldsList={worldsCache.lastState.worldsRelevance} worldsData={worldsDataCache}
                    worldsContract={worlds} setNewWorldData={setNewWorldData}
                />} />
                <Route path="/created/:worldId" element={<WorldCreated
                    worldsList={worldsCache.lastState.worldsRelevance} worldsData={worldsDataCache}
                    newWorldData={newWorldData}
                />} />
                <Route path="/edit/:worldId" element={<EditWorld
                    worldsList={worldsCache.lastState.worldsRelevance} worldsData={worldsDataCache}
                    worldsContract={worlds} setWorldData={setWorldData}
                />} />
                <Route path="/edit/:worldId/transfer" element={<TransferWorld
                    worldsList={worldsCache.lastState.worldsRelevance} worldsData={worldsDataCache}
                    worldsContract={worlds}
                />} />
                <Route path="/manage/:worldId" element={<SelectAlbum
                    worldsManagement={worldsManagement} worldsData={worldsDataCache}
                    albumsCache={albumsCache}
                    albumsDataCache={albumsDataCache}
                    setSelectedWorldId={setSelectedWorldId} selectedWorldId={selectedWorldId}
                />} />
                <Route path="/manage/:worldId/create" element={<CreateAlbum
                    worldsManagement={worldsManagement} worldsData={worldsDataCache}
                    albumsCache={albumsCache}
                    albumsDataCache={albumsDataCache}
                    setSelectedWorldId={setSelectedWorldId} selectedWorldId={selectedWorldId}
                />} />
                <Route path="/manage/:worldId/edit/:albumId" element={<EditAlbum
                    worldsManagement={worldsManagement} worldsData={worldsDataCache}
                    albumsCache={albumsCache}
                    albumsDataCache={albumsDataCache} setAlbumData={setAlbumData}
                    setSelectedWorldId={setSelectedWorldId} selectedWorldId={selectedWorldId}
                />} />
                <Route path="/manage/:worldId/edit/:albumId/:pageId" element={<EditAlbumPage
                    worldsManagement={worldsManagement} worldsData={worldsDataCache}
                    albumsCache={albumsCache}
                    albumsDataCache={albumsDataCache}
                    setSelectedWorldId={setSelectedWorldId} selectedWorldId={selectedWorldId}
                />} />
            </Routes>
        </MemoryRouter>
    </Section>;
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
            <MainContent account={account} contracts={contracts} />
        </ParamsAwareContractWindow>;
    } else {
        return <StandaloneMessage title="Loading..." content="Loading the contracts..." />;
    }
}