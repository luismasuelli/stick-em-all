import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import Box from "@mui/material/Box";
import {Alert, Button} from "@mui/material";
import ParamsContext from "../../../Contexts/ParamsContext";


function usdFromCents(v) {
    v = v.toString();
    switch(v.length) {
        case 0:
            return "$0.00";
        case 1:
            return "$0.0" + v;
        case 2:
            return "$0." + v;
        default:
            return `$${v.substring(0, v.length - 2)}.${v.substring(v.length - 2)}`;
    }
}


export default function CreateAlbum({
    worldsManagement, worldsData, albumsCache, albumsDataCache,
    selectedWorldId, setSelectedWorldId
}) {
    const {worldId} = useParams();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {web3, account} = context;
    const {wrappedCall} = useContext(ContractWindowContext);
    const navigate = useNavigate();
    const paramsContext = useContext(ParamsContext);
    const fiatPrices = paramsContext.paramsData.fiatCosts;
    const nativePrices = paramsContext.paramsData.nativeCosts;

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <Box sx={{display: 'flex', justifyContent: 'start', marginBottom: 4}}>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>&#9664; Back</Button>
        </Box>
        <Alert severity="info">
            You're about to define a new album. The associated definition costs are: <br />
            <ul>
                <li>Album: USD {usdFromCents(fiatPrices[1])} / MATIC: {web3.utils.fromWei(nativePrices[1], "ether")}</li>
                <li>Per page: USD {usdFromCents(fiatPrices[2])} / MATIC: {web3.utils.fromWei(nativePrices[2], "ether")}</li>
                <li>Per achievement: USD {usdFromCents(fiatPrices[3])} / MATIC: {web3.utils.fromWei(nativePrices[3], "ether")}</li>
                <li>Per sticker: USD {usdFromCents(fiatPrices[4])} / MATIC: {web3.utils.fromWei(nativePrices[4], "ether")}</li>
            </ul>
        </Alert>
        <Alert severity="warning">
            Please take special care while creating the bare album here. Changes cannot be done later.
            Pages (and achievements) and stickers (and achievements) will be added later.
        </Alert>

        <Box sx={{marginTop: 4}}>
            {/*
                uint256 _worldId, string memory _name, string memory _edition,
                string memory _frontImage, string memory _backImage, string memory _rarityIcons,
                bytes32 _achievementType, string memory _achievementName, string memory _achievementImage,
                bytes memory _achievementData
            */}
        </Box>
    </AlbumsListEnabledLayout>;
}
