import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useParams} from "react-router-dom";
import {useContext} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";

export default function EditAlbumPage({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId
}) {
    const {worldId, albumId, pageId} = useParams();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {wrappedCall} = useContext(ContractWindowContext);

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        {/*Content here*/}
    </AlbumsListEnabledLayout>;
}
