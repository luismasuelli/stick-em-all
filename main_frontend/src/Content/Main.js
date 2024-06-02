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
import {Album, Create} from "@mui/icons-material";
import {MyAlbums} from "./Main/SubStates/MyAlbums";


function EntryPoint() {
    const navigate = useNavigate();

    return <Box sx={{
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        display: "flex", alignItems: "center", justifyContent: "center"
    }}>
        <Box sx={{display: "inline-block", width: "300px"}}>
            <Grid container>
                <Grid xs={12} sx={{p: 2}}>
                    <Button sx={{width: "100%"}} onClick={() => navigate("/create")}
                            variant="contained" color="primary" size="large">
                        Create album
                    </Button>
                </Grid>
                <Grid xs={12} sx={{p: 2}}>
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
    let [selectedWorldId, setSelectedWorldId] = useState();

    // 3. Listing the albums' types (for a world).
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

    // 6. Tracking the cached data for the albums.
    const [albumsDataCache, setAlbumsDataCache] = useState({});
    const setAlbumData = useNonReactive((albumId, albumData) => {
        setAlbumsDataCache({
            ...albumsDataCache,
            ...(Object.fromEntries([[albumId, albumData]]))
        });
    });

    return <Box sx={{width: "100%", height: "100%", minHeight: "600px", position: "relative"}}>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<EntryPoint />} />
                <Route path="/create" element={<Create />} />
                <Route path="/albums" element={<MyAlbums />} />
                <Route path="/albums/:albumId" element={<Album />} />
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
                                          mainContract={contracts.worldsManagement}>
            <MainContent account={account} contracts={contracts} />
        </ParamsAwareContractWindow>;
    } else {
        return <StandaloneMessage title="Loading..." content="Loading the contracts..." />;
    }
}
