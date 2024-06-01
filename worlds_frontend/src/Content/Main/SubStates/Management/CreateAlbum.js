import AlbumsListEnabledLayout from "../../Components/AlbumsListEnabledLayout";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useState} from "react";
import Web3Context from "../../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../../Wrapping/Web3AccountContext";
import ContractWindowContext from "../../../Contexts/ContractWindowContext";
import Box from "@mui/material/Box";
import {Alert, Button} from "@mui/material";
import ParamsContext from "../../../Contexts/ParamsContext";
import {getEventLogs} from "../../../../Utils/eventLogs";
import {useDerivedState} from "../../../../Utils/derived";


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
    const params = paramsContext.params;
    const fiatPrices = paramsContext.paramsData.fiatCosts;
    const nativePrices = paramsContext.paramsData.nativeCosts;

    const [albumData, setAlbumData] = useState({
        name: "", edition: "", frontImage: "", backImage: "", rarityIcons: "",
        achievementType: "", achievementName: "", achievementImage: "", achievementData: ""
    });
    const [name, setName] = useDerivedState(albumData, setAlbumData, "name");
    const [edition, setEdition] = useDerivedState(albumData, setAlbumData, "edition");
    const [frontImage, setFrontImage] = useDerivedState(albumData, setAlbumData, "frontImage");
    const [backImage, setBackImage] = useDerivedState(albumData, setAlbumData, "backImage");
    const [rarityIcons, setRarityIcons] = useDerivedState(albumData, setAlbumData, "rarityIcons");
    const [achievementType, setAchievementType] = useDerivedState(albumData, setAlbumData, "achievementType");
    const [achievementName, setAchievementName] = useDerivedState(albumData, setAlbumData, "achievementName");
    const [achievementImage, setAchievementImage] = useDerivedState(albumData, setAlbumData, "achievementImage");
    const [achievementData, setAchievementData] = useDerivedState(albumData, setAlbumData, "achievementData");

    const defineAlbum = wrappedCall(async function() {
        const tx = await worldsManagement.methods.defineAlbum(
            worldId, name, edition, frontImage, backImage, rarityIcons,
            achievementType, achievementName, achievementImage, achievementData
        ).send({from: account});

        const logs = await getEventLogs(tx, worldsManagement);
        const definitionLogs = logs.filter(log => log.name === "AlbumDefined");

        if (definitionLogs.length) {
            const firstTransferLog = definitionLogs[0];
            const id = web3.utils.toBigInt(firstTransferLog.event.id);
            navigate(`/manage/${worldId.toString()}/edit/${id.toString()}`);
        } else {
            throw new Error(
                "The id of the created album could not be fetched. See the changes " +
                "in the events list to get a hint of your just-created album"
            );
        }
    });

    return <AlbumsListEnabledLayout worldsData={worldsData} albumsData={albumsDataCache}
                                    selectedWorldId={selectedWorldId} setSelectedWorldId={setSelectedWorldId}
                                    albumsList={albumsCache.lastState.albumsRelevance}>
        <Box sx={{display: 'flex', justifyContent: 'start', marginBottom: 4}}>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>&#9664; Back</Button>
        </Box>
        <Alert severity="info">
            You're about to define a new album. The associated definition costs are: <br />
            <ul>
                <li>Album: USD {usdFromCents(fiatPrices[params[1].hash])} / MATIC: {web3.utils.fromWei(nativePrices[params[1].hash], "ether")}</li>
                <li>Per page: USD {usdFromCents(fiatPrices[params[2].hash])} / MATIC: {web3.utils.fromWei(nativePrices[params[2].hash], "ether")}</li>
                <li>Per achievement: USD {usdFromCents(fiatPrices[params[3].hash])} / MATIC: {web3.utils.fromWei(nativePrices[params[3].hash], "ether")}</li>
                <li>Per sticker: USD {usdFromCents(fiatPrices[params[4].hash])} / MATIC: {web3.utils.fromWei(nativePrices[params[4].hash], "ether")}</li>
            </ul>
        </Alert>
        <Alert severity="warning">
            Please take special care while creating the bare album here. Changes cannot be done later.
            Pages (and achievements) and stickers (and achievements) will be added later.
        </Alert>

        <Box sx={{marginTop: 4}}>
            {/*
                TODO implement form:
                uint256 _worldId, string memory _name, string memory _edition,
                string memory _frontImage, string memory _backImage, string memory _rarityIcons,
                bytes32 _achievementType, string memory _achievementName, string memory _achievementImage,
                bytes memory _achievementData
            */}
        </Box>
    </AlbumsListEnabledLayout>;
}
