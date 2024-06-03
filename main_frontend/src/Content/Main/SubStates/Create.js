import {Box, Button, Grid, MenuItem, Select} from "@mui/material";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import {useContext, useEffect, useMemo, useState} from "react";
import {useNonReactive} from "../../../Utils/nonReactive";
import {ImagePreview} from "../../Controls/ImagePreview";
import {getEventLogs} from "../../../Utils/eventLogs";
import Web3AccountContext from "../../../Wrapping/Web3AccountContext";
import Web3Context from "../../../Wrapping/Web3Context";
import {useNavigate} from "react-router-dom";
import {ReverseChallenge} from "../../Controls/ReverseChallenge";
import Heading from "../../Controls/Heading";
import ThemedPaper from "../../Controls/ThemedPaper";

export default function Create({
    main, worldsManagement, worlds, economy,
    worldsCache, worldsDataCache, setWorldsDataCache,
    albumsCache, albumsDataCache, setAlbumsDataCache,
    selectedWorldId, setSelectedWorldId
}) {
    const {wrappedCall} = useContext(ContractWindowContext);
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const navigate = useNavigate();
    const {web3, account} = context;

    setWorldsDataCache = useNonReactive(setWorldsDataCache);
    setAlbumsDataCache = useNonReactive(setAlbumsDataCache);

    const [selectedAlbumId, setSelectedAlbumId] = useState("");
    useEffect(() => {
        setSelectedAlbumId("");
    }, [selectedWorldId]);

    const currentWorldData = useMemo(() => {
        return worldsDataCache[selectedWorldId] || {};
    }, [selectedWorldId, worldsDataCache]);

    const currentAlbumData = useMemo(() => {
        return albumsDataCache[selectedAlbumId] || {};
    }, [selectedAlbumId, albumsDataCache]);

    useEffect(() => {
        setSelectedWorldId("");
        setSelectedAlbumId("");
    }, []);

    // Refresh the worlds' data.
    useEffect(() => {
        const refreshWorldData = wrappedCall(async function() {
            let newWorldsDataCache = worldsDataCache;

            for(let idx = 0; idx < worldsCache.worldsRelevance.length; idx++) {
                const id = worldsCache.worldsRelevance[idx].worldId.toString();
                if (worldsDataCache[id]) continue;

                const {
                    name, description, logo, background,
                    externalUrl, validatorUrl, earningsReceiver
                } = await worlds.methods.worlds(id).call();
                let retrievedWorldData = {
                    name, description, logo, background,
                    externalUrl, validatorUrl, earningsReceiver
                }
                newWorldsDataCache = {
                    ...newWorldsDataCache,
                    ...(Object.fromEntries([[id, retrievedWorldData]]))
                }
            }

            setWorldsDataCache(newWorldsDataCache);
        });
        refreshWorldData();
    }, [setWorldsDataCache, worldsCache, worldsDataCache, worlds, wrappedCall]);

    // Refresh the albums' data.
    useEffect(() => {
        const refreshAlbumsData = wrappedCall(async function() {
            let newAlbumsDataCache = albumsDataCache;

            for(let idx = 0; idx < albumsCache.albumsRelevance.length; idx++) {
                const id = albumsCache.albumsRelevance[idx].albumId.toString();
                if (albumsDataCache[id]) continue;

                const {
                    worldId, name, edition, frontImage, backImage, rarityIcons,
                    totalStickers, completedPages, released
                } = await worldsManagement.methods.albumDefinitions(id).call();
                let retrievedAlbumData = {
                    worldId, name, edition, frontImage, backImage, rarityIcons,
                    totalStickers, completedPages, released
                }
                newAlbumsDataCache = {
                    ...newAlbumsDataCache,
                    ...(Object.fromEntries([[id, retrievedAlbumData]]))
                }
            }

            setAlbumsDataCache(newAlbumsDataCache);
        });
        refreshAlbumsData();
    }, [setAlbumsDataCache, albumsCache, albumsDataCache, worldsManagement, wrappedCall, selectedWorldId]);

    const worldBackground = currentWorldData.background && `url("${currentWorldData.background}")`;
    const worldLogo = currentWorldData.logo;
    const albumImage = currentAlbumData.frontImage;

    const createAlbum = wrappedCall(async function () {
        if (selectedAlbumId === "" || selectedWorldId === undefined) return;

        const tx = await economy.methods.mintAlbum(
            selectedAlbumId
        ).send({from: account});
        const logs = await getEventLogs(tx, economy);
        const mintLogs = logs.filter(log => log.name === "TransferSingle");

        if (mintLogs.length) {
            const firstTransferLog = mintLogs[0];
            const id = web3.utils.toBigInt(firstTransferLog.event.id);
            navigate(`/albums/${id.toString()}`);
        } else {
            throw new Error(
                "The id of the created album could not be fetched. Go back, then go " +
                "to the 'See my albums' option, and choose it to start using it"
            );
        }
    });

    return <Box sx={{
        aspectRatio: "16 / 9", width: "100%", backgroundSize: "cover", backgroundImage: worldBackground,
        display: "flex", alignItems: "center", justifyContent: "center"
    }}>
        <ThemedPaper color="primary.light">
            <Grid container sx={{width: "800px"}} spacing={2}>
                <Grid item xs={12}>
                    <Heading>Please select a world and an album type to create your album</Heading>
                </Grid>
                <Grid item xs={8}>
                    <Select autoWidth label="World" sx={{ minWidth: "200px", bgcolor: 'background.paper', marginRight: '10px', padding: '5px' }}
                            value={selectedWorldId} onChange={(e) => setSelectedWorldId(e.target.value)}>
                        {worldsCache.worldsRelevance.map((world, index) => {
                            return <MenuItem value={world.worldId} key={index}>
                                {worldsDataCache[world.worldId] ? worldsDataCache[world.worldId].name : "(Unknown)"}
                            </MenuItem>;
                        })}
                    </Select>
                    {(selectedWorldId) ? (
                        <ReverseChallenge worldId={selectedWorldId}
                                          externalUrl={worldsDataCache[selectedWorldId]?.externalUrl}
                                          validatorUrl={worldsDataCache[selectedWorldId]?.validatorUrl} />
                    ) : null}
                </Grid>
                <Grid item xs={4}>
                    <ImagePreview aspectRatio="1 / 1" cover={false} url={worldLogo} />
                </Grid>
                {(selectedWorldId) ? (
                    <>
                        <Grid item xs={8}>
                            <Grid item xs={8}>
                                <Select autoWidth label="Album" sx={{ minWidth: "200px", bgcolor: 'background.paper', marginRight: '10px', padding: '5px' }}
                                        value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                                    {albumsCache.albumsRelevance.map((album, index) => {
                                        return <MenuItem value={album.albumId} key={index}>
                                            {albumsDataCache[album.albumId] ? albumsDataCache[album.albumId].name : "(Unknown)"}
                                        </MenuItem>;
                                    })}
                                </Select>
                                {(selectedAlbumId !== "") ? (
                                    <Button sx={{width: "100%", marginTop: 2}} onClick={createAlbum}
                                            variant="contained" color="primary" size="large">
                                        Create album
                                    </Button>
                                ) : null}
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <ImagePreview aspectRatio="8 / 9" cover={false} url={albumImage} />
                        </Grid>
                    </>
                ) : null}
            </Grid>
        </ThemedPaper>
    </Box>;
}