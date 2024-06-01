import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import Section from "../../../Controls/Section";
import {Grid} from "@mui/material";
import {Label} from "@mui/icons-material";
import {ImagePreview} from "../../../Controls/ImagePreview";

function useGlobalContextData() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {worldId, albumId} = useParams();
    const {wrappedCall} = useContext(ContractWindowContext);

    return {account, worldId, albumId, wrappedCall};
}

function AlbumData({ worldsManagement, setAlbumData }) {
    // Global contexts.
    const {wrappedCall, albumId} = useGlobalContextData();

    // Local data.
    const [localAlbumData, setLocalAlbumData] = useState({
        worldId: '', name: '', edition: '', frontImage: '', backImage: '',
        rarityIcons: '', totalStickers: 0, completedPages: 0, released: false
    });

    useEffect(() => {
        const getAlbumData = wrappedCall(async function getWorldData() {
            // 1. Download the album data for the given id.
            const {
                worldId, name, edition, frontImage, backImage, rarityIcons,
                totalStickers, completedPages, released
            } = await worldsManagement.methods.albumDefinitions(albumId).call();
            let retrievedAlbumData = {
                worldId, name, edition, frontImage, backImage, rarityIcons,
                totalStickers, completedPages, released
            }
            // 2. Set the downloaded world's data into the worldsData for the worldId.
            setAlbumData(albumId, retrievedAlbumData);
            setLocalAlbumData(retrievedAlbumData);
        });
        getAlbumData();
    }, [albumId, wrappedCall, worldsManagement, setAlbumData]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>
        <Grid container>
            <Grid item xs={3}>
                <Label>Base data:</Label>
            </Grid>
            <Grid item xs={9}>
                Name: {localAlbumData.name}<br />
                Edition: {localAlbumData.edition}<br />
                Pages: {localAlbumData.completedPages} (completely defined ones)<br />
                Released: {localAlbumData.released ? "Yes" : "No"}<br />
            </Grid>
            <Grid item xs={3}>
                <Label>Front image:</Label>
            </Grid>
            <Grid item xs={9}>
                {localAlbumData.frontImage
                    ? <ImagePreview url={localAlbumData.frontImage}
                                    aspectRatio="8 / 9" cover={true} style={{maxWidth: "400px"}} />
                    : "none"}
            </Grid>
            <Grid item xs={3}>
                <Label>Back image:</Label>
            </Grid>
            <Grid item xs={9}>
                {localAlbumData.backImage
                    ? <ImagePreview url={localAlbumData.backImage}
                                    aspectRatio="8 / 9" cover={true} style={{maxWidth: "400px"}} />
                    : "none"}
            </Grid>
            <Grid item xs={3}>
                <Label>Rarity icons:</Label>
            </Grid>
            <Grid item xs={9}>
                {localAlbumData.rarityIcons
                    ? <ImagePreview url={localAlbumData.rarityIcons}
                                    aspectRatio="4 / 1" cover={true} style={{maxWidth: "100px"}} />
                    : "none"}
            </Grid>
        </Grid>
    </Section>;
}

function AlbumPages({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumPages, setAlbumPages] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

function AlbumAchievements({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumAchievements, setAlbumAchievements] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

function AlbumBoosterPackRules({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

function AlbumReleasePreview({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);

    return <Section title="Album data" color="primary.light" sx={{marginTop: 4}}>

    </Section>;
}

export default function EditAlbum({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId, setAlbumData
}) {
    const {worldId, albumId} = useParams();
    const albumData = albumsDataCache[albumId];

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <AlbumData worldsManagement={worldsManagement} worldId={worldId} albumId={albumId}
                   setAlbumData={setAlbumData} />
        <AlbumPages worldsManagement={worldsManagement} worldId={worldId} albumId={albumId} />
        <AlbumAchievements worldsManagement={worldsManagement} worldId={worldId} albumId={albumId} />
        {albumData ? (
            albumData.released
                ? <AlbumBoosterPackRules worldsManagement={worldsManagement} />
                : <AlbumReleasePreview worldsManagement={worldsManagement} />
        ) : null}
    </AlbumsListEnabledLayout>;
}
