import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";

export default function EditAlbum({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId, setAlbumData
}) {
    const {worldId, albumId} = useParams();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {wrappedCall} = useContext(ContractWindowContext);
    const albumData = albumsDataCache[albumId];

    useEffect(() => {
        const getWorldData = wrappedCall(async function getWorldData() {
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
        getWorldData();
    }, [albumId, wrappedCall, worldsManagement, setAlbumData]);

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        {/*Content here*/}
    </AlbumsListEnabledLayout>;
}
