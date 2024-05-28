import {useParams, useNavigate} from 'react-router-dom';
import {Alert, Button, Grid} from "@mui/material";
import React, {useContext, useState} from "react";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import Label from "../../Controls/Label";
import Web3Context from "../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../Wrapping/Web3AccountContext";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";
import AddressInput from "../../Controls/AddressInput";
import Box from "@mui/material/Box";
import Heading from "../../Controls/Heading";
import RadioGroupToggle from "../../Controls/RadioGroupToggle";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function TransferWorld({ worldsList, worldsData, worldsContract }) {
    let {worldId} = useParams();
    let [targetTransferAccount, setTargetTransferAccount] = useState("0x0");
    let [targetAllowAccount, setTargetAllowAccount] = useState("0x0");
    let [allowed, setAllowed] = useState(false);
    let {wrappedCall} = useContext(ContractWindowContext);
    const navigate = useNavigate();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {web3, account} = context;

    const transfer = wrappedCall(async function() {
        let isAddress = (
            web3.utils.toChecksumAddress(targetTransferAccount) !==
            web3.utils.toChecksumAddress(ZERO_ADDRESS)
        );
        if (!isAddress) {
            throw new Error("Cannot transfer the world to the zero address");
        }
        await worldsContract.methods.transferFrom(account, targetTransferAccount, worldId).send({from: account});
        navigate("/");
    });

    const allow = wrappedCall(async function() {
        let isAddress = (
            web3.utils.toChecksumAddress(targetAllowAccount) !==
            web3.utils.toChecksumAddress(ZERO_ADDRESS)
        );
        if (!isAddress) {
            throw new Error("Cannot [dis]allow the world edition to the zero address");
        }
        await worldsContract.methods.setWorldEditionAllowed(
            worldId, targetAllowAccount, allowed
        ).send({from: account});
    });

    return <WorldsListEnabledLayout worldsList={worldsList} worldsData={worldsData}>
        <Box sx={{display: 'flex', justifyContent: 'flex-start' , marginBottom: 4}}>
            <Button variant="contained" color="primary" onClick={() => navigate(`/edit/${worldId.toString()}`)}>&#9664; Back</Button>
        </Box>
        <Grid container>
            <Grid item xs={12}><Heading>Transfer</Heading></Grid>
            <Grid item xs={12}>
                <Alert severity="warning" sx={{margin: 1}}>
                    This section is meant to transfer the world: {worldId.toString()}. Do this carefully
                    since you're about to lose control over this world.
                </Alert>
            </Grid>
            <Grid item xs={3}><Label>Target account:</Label></Grid>
            <Grid item xs={9}>
                <AddressInput variant="outlined" value={targetTransferAccount} onChange={setTargetTransferAccount} />
                <Button disabled={!worldsContract} onClick={transfer}
                        variant="contained" color="primary" size="large">Transfer</Button>
            </Grid>
            <Grid item xs={12}><Heading>Allow edition</Heading></Grid>
            <Grid item xs={12}>
                <Alert severity="warning" sx={{margin: 1}}>
                    This section is meant to allow someone as editor for the world: {worldId.toString()}.
                    Do this carefully since this will give/share control for many administrative features.
                </Alert>
            </Grid>
            <Grid item xs={3}><Label>Target account:</Label></Grid>
            <Grid item xs={9}>
                <AddressInput variant="outlined" value={targetAllowAccount} onChange={setTargetAllowAccount} />
            </Grid>
            <Grid item xs={12}>
                <RadioGroupToggle trueLabel="Allow" falseLabel="Disallow" value={allowed} onChange={setAllowed} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={allow}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
        </Grid>
    </WorldsListEnabledLayout>;
}