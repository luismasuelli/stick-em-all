import {useNavigate} from 'react-router-dom';
import {Alert, Button, Grid} from "@mui/material";
import React, {useContext, useState} from "react";
import ParamsContext from "../../Contexts/ParamsContext";
import Label from "../../Controls/Label";
import TextField from "@mui/material/TextField";
import {useDerivedState} from "../../../Utils/derived";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import Web3Context from "../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../Wrapping/Web3AccountContext";
import {getEventLogs} from "../../../Utils/eventLogs";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";


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


export default function CreateWorld({ worldsList, worldsData, worldsContract, setNewWorldData }) {
    const paramsContext = useContext(ParamsContext);
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const navigate = useNavigate();
    const {web3, account} = context;
    const worldDefinitionHash = paramsContext.params[0].hash;
    const fiatPrice = paramsContext.paramsData.fiatCosts[worldDefinitionHash];
    const nativePrice = paramsContext.paramsData.nativeCosts[worldDefinitionHash];
    let [currentWorldData, setCurrentWorldData] = useState({});
    let {name, setName} = useDerivedState(currentWorldData, setCurrentWorldData, "name");
    let {description, setDescription} = useDerivedState(currentWorldData, setCurrentWorldData, "description");
    let {logo, setLogo} = useDerivedState(currentWorldData, setCurrentWorldData, "logo");
    let {wrappedCall} = useContext(ContractWindowContext);

    const createWorld = wrappedCall(async function() {
        const tx = await worldsContract.methods.createWorld(
            name, description, logo
        ).send({value: nativePrice.mul(110).div(100)});
        const logs = await getEventLogs(tx);
        const transferLogs = logs.filter(log => log.name === "Transfer" && log.event.to === account);
        if (transferLogs.length) {
            const firstTransferLog = transferLogs[0];
            const tokenId = web3.utils.toBigInt(firstTransferLog.event.tokenId);
            navigate("/created/" + tokenId.toString());
        } else {
            throw new Error(
                "The id of the created world could not be fetched. See the changes " +
                "in the events list to get a hint of your just-created world"
            );
        }
    });

    return <WorldsListEnabledLayout sx={{height: "600px"}} worldsList={worldsList} worldsData={worldsData}>
        <Alert severity="info">
            You're about to create a new world. The cost of creating a new world
            is {usdFromCents(fiatPrice)} (MATIC: {web3.utils.fromWei(nativePrice, "ether")}).
        </Alert>
        <Grid container>
            {/* Name */}
            <Grid item xs={5}><Label>Name:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={name} onChange={setName} />
            </Grid>
            {/* Description */}
            <Grid item xs={5}><Label>Description:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={description} onChange={setDescription} />
            </Grid>
            {/* Logo */}
            <Grid item xs={5}><Label>Logo (URL):</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={logo} onChange={setLogo} />
            </Grid>
            {/* Button */}
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={createWorld}
                        variant="contained" color="primary" size="large">Create World</Button>
            </Grid>
        </Grid>
    </WorldsListEnabledLayout>;
}