import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import {Button, Typography} from "@mui/material";
import Box from "@mui/material/Box";

export default function EditAlbumPage({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId
}) {
    const {worldId, albumId, pageId} = useParams();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    const {wrappedCall} = useContext(ContractWindowContext);
    const navigate = useNavigate();

    const albumData = albumsDataCache[albumId];
    const worldData = worldsData[worldId];
    const url = `/manage/${worldId.toString()}/edit/${albumId.toString()}`;

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
            <Button variant="contained" color="primary"
                    onClick={() => navigate(url)}>&#9664; Back</Button>
            <Typography sx={{p: 2, textAlign: 'right'}}>
                You're managing the album {albumId.toString()} - {albumData.name} for the world {worldId.toString()} - {worldData.name}
            </Typography>
        </Box>
    </AlbumsListEnabledLayout>;
}
