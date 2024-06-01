import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";

function useGlobalContextData() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {worldId, albumId} = useParams();
    const {wrappedCall} = useContext(ContractWindowContext);

    return {account, worldId, albumId, wrappedCall};
}

function AlbumData({ worldsManagement, setAlbumData }) {
    const {wrappedCall, albumId} = useGlobalContextData();

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
        });
        getAlbumData();
    }, [albumId, wrappedCall, worldsManagement, setAlbumData]);
}

function AlbumPages({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumPages, setAlbumPages] = useState([]);
}

function AlbumAchievements({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumAchievements, setAlbumAchievements] = useState([]);
}

function AlbumBoosterPackRules({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);
}

function AlbumReleasePreview({ worldsManagement }) {
    // Global contexts.
    const {wrappedCall, albumId, worldId, account} = useGlobalContextData();

    // Local data.
    const [albumBoosterPackRules, setAlbumBoosterPackRules] = useState([]);
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
            albumData.released ?
                <AlbumBoosterPackRules worldsManagement={worldsManagement} /> :
                <AlbumReleasePreview worldsManagement={worldsManagement} />
        ) : null}
    </AlbumsListEnabledLayout>;
}
