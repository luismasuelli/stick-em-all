import {useContext, useEffect, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";
import mainContractClients from "./Main/mainContractClients";
import {MemoryRouter, Route, Routes, useNavigate} from "react-router-dom";
import {Box, Button, Grid} from "@mui/material";
import worldsEventsEffect from "./Main/worldsEventsEffect";
import {useNonReactive} from "../Utils/nonReactive";
import albumsEventsEffect from "./Main/albumsEventsEffect";
import Create from "./Main/SubStates/Create";
import MyAlbums from "./Main/SubStates/MyAlbums";
import Album from "./Main/SubStates/Album";
import assetsEventsEffect from "./Main/assetsEventsEffect";


function EntryPoint() {
    const navigate = useNavigate();

    return <Box sx={{
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        display: "flex", alignItems: "center", justifyContent: "center"
    }}>
        <Box sx={{display: "inline-block", width: "300px"}}>
            <Grid container>
                <Grid item xs={12} sx={{p: 2}}>
                    <Button sx={{width: "100%"}} onClick={() => navigate("/create")}
                            variant="contained" color="primary" size="large">
                        Create album
                    </Button>
                </Grid>
                <Grid item xs={12} sx={{p: 2}}>
                    <Button sx={{width: "100%"}} onClick={() => navigate("/albums")}
                            variant="contained" color="primary" size="large">
                        See my albums
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </Box>;
}

/**
 * Renders all the content to the end user(s).
 */
function MainContent({
    contracts
}) {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {
        main, economy, worldsManagement, worlds, params
    } = contracts;

    // 1. Listing the worlds.
    let [worldsCache, setWorldsCache] = useState(
        {lastBlock: null, lastState: {worldsIndices: {}, worldsRelevance: []}}
    );
    useEffect(() => {
        return worldsEventsEffect(
            worlds, {lastBlock: null, lastState: {worldsIndices: {}, worldsRelevance: []}},
            setWorldsCache
        );
    }, [worlds]);

    // 2. Tracking the cached data for the worlds.
    const [worldsDataCache, setWorldsDataCache] = useState({});
    const setWorldData = useNonReactive((worldId, worldData) => {
        setWorldsDataCache({
            ...worldsDataCache,
            ...(Object.fromEntries([[worldId, worldData]]))
        });
    });

    // 3. Picking a world.
    let [selectedWorldId, setSelectedWorldId] = useState("");

    // 4. Listing the albums' types (for a world).
    let [albumsCache, setAlbumsCache] = useState(
        {lastBlock: null, lastState: {albumsIndices: {}, albumsRelevance: []}}
    );
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
    }, [selectedWorldId, worldsManagement]);

    // 5. Tracking the cached data for the albums.
    const [albumsDataCache, setAlbumsDataCache] = useState({});
    const setAlbumData = useNonReactive((albumId, albumData) => {
        setAlbumsDataCache({
            ...albumsDataCache,
            ...(Object.fromEntries([[albumId, albumData]]))
        });
    });

    // 6. Listing all the assets (for an account).
    let [assetsCache, setAssetsCache] = useState({
        lastBlock: null, lastState: {
            assetsIndices: {}, assetsRelevance: [], boosterPacks: {}, stickers: {}, albums: []
        }}
    );
    useEffect(() => {
        setAssetsCache({lastBlock: null, lastState: {
            assetsIndices: {}, assetsRelevance: [], boosterPacks: {}, stickers: {}, albums: []
        }});
        // start fetching albums data.
        return assetsEventsEffect(
            economy, account, setAssetsCache, {lastBlock: null, lastState: {
                assetsIndices: {}, assetsRelevance: [], boosterPacks: {}, stickers: {}, albums: []
            }}
        );
    }, [account, economy]);

    // 7. Tracking the cached data for the assets.
    let [assetsDataCache, setAssetsDataCache] = useState({});

    // 8. Also tracking the types of the albums.
    let [albumTypesDataCache, setAlbumTypesDataCache] = useState({});

    return <Box sx={{width: "100%", height: "100%", minHeight: "600px", position: "relative"}}>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<EntryPoint />} />
                <Route path="/create" element={<Create
                    main={main} economy={economy} worldsManagement={worldsManagement} worlds={worlds}
                    worldsCache={worldsCache.lastState} worldsDataCache={worldsDataCache} setWorldsDataCache={setWorldsDataCache}
                    albumsCache={albumsCache.lastState} albumsDataCache={albumsDataCache} setAlbumsDataCache={setAlbumsDataCache}
                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                />} />
                <Route path="/albums" element={<MyAlbums
                    economy={economy} worldsManagement={worldsManagement} worlds={worlds}
                    albums={assetsCache.lastState.albums}
                    albumsDataCache={albumsDataCache} setAlbumsDataCache={setAlbumsDataCache}
                    albumTypesDataCache={albumTypesDataCache} setAlbumTypesDataCache={setAlbumTypesDataCache}
                />} />
                <Route path="/albums/:albumId" element={<Album
                    economy={economy} worldsManagement={worldsManagement} worlds={worlds}
                    albumsDataCache={albumsDataCache} assetsDataCache={assetsDataCache}
                    albumTypesDataCache={albumTypesDataCache}
                />} />
            </Routes>
        </MemoryRouter>
    </Box>;
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
        "You can buy new or make use of your existing albums :D. Enjoy the experience!"

    useEffect(() => {
        mainContractClients(web3, account).then(setContracts);
    }, [web3, account]);

    if (contracts) {
        return <ParamsAwareContractWindow caption={"Stick 'Em All"} description={description}
                                          paramsContract={contracts.params} params={[]}
                                          mainContract={contracts.main}>
            <MainContent account={account} contracts={contracts} />
        </ParamsAwareContractWindow>;
    } else {
        return <StandaloneMessage title="Loading..." content="Loading the contracts..." />;
    }
}
