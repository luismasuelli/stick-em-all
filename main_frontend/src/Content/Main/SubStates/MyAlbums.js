import {Box, Button, Grid, MenuItem, Select} from "@mui/material";
import Heading from "../../Controls/Heading";
import {ImagePreview} from "../../Controls/ImagePreview";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import {useNonReactive} from "../../../Utils/nonReactive";

export default function MyAlbums({
    worldsManagement, albums, albumsDataCache, setAlbumsDataCache
}) {
    const [selectedAlbumId, setSelectedAlbumId] = useState("");
    const {wrappedCall} = useContext(ContractWindowContext);
    const worldBackground = "";
    const navigate = useNavigate();
    const [localAlbumsData, setLocalAlbumsData] = useState({});

    setAlbumsDataCache = useNonReactive(setAlbumsDataCache);

    useEffect(() => {
        const fetchAlbumsData = wrappedCall(async function(){
            let newAlbumsDataCache = albumsDataCache;
            let newLocalAlbumsData = {};

            for(let idx = 0; idx < albums.length; idx++) {
                const id = albums[idx].toString();

                if (!albumsDataCache[id]) {
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

                newLocalAlbumsData[id.toString()] = newAlbumsDataCache[id];
            }

            setAlbumsDataCache(newAlbumsDataCache);
            setLocalAlbumsData(newLocalAlbumsData);
        })
        fetchAlbumsData();
    }, [worldsManagement, albums, albumsDataCache, setAlbumsDataCache, wrappedCall]);

    return <Box sx={{
        aspectRatio: "16 / 9", width: "100%", backgroundSize: "cover", backgroundImage: worldBackground,
        display: "flex", flexDirection: "column"
    }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 1, marginTop: 1}}>
            <Button variant="contained" color="primary"
                    onClick={() => navigate("/")}>&#9664; Back</Button>
        </Box>
        <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            flexGrow: 1, backgroundImage: worldBackground
        }}>
            <Grid container sx={{width: "800px"}} spacing={2}>
                <Grid item xs={12}>
                    <Heading>Please select one of your albums</Heading>
                </Grid>
                <Grid item xs={8}>
                    <Select autoWidth label="World" sx={{ minWidth: "200px", bgcolor: 'background.paper', marginRight: '10px', padding: '5px' }}
                            value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)}>
                        {albums.map((albumId, index) => {

                            return <MenuItem value={albumId} key={index}>
                                {localAlbumsData[albumId] ? localAlbumsData[albumId].name : "(Unknown)"}
                            </MenuItem>;
                        })}
                    </Select>
                    {(selectedAlbumId !== "") ? (
                        <Button sx={{width: "100%", marginTop: 2}}
                                onClick={() => navigate(`/albums/${selectedAlbumId.toString()}`)}
                                variant="contained" color="primary" size="large">
                            Select album
                        </Button>
                    ) : null}
                </Grid>
                <Grid item xs={4}>
                    <ImagePreview aspectRatio="8 / 9" cover={false} url={localAlbumsData[selectedAlbumId.toString()]?.frontImage} />
                </Grid>
            </Grid>
        </Box>
    </Box>;
}