import {useParams, useNavigate} from 'react-router-dom';
import {Alert, Button, Grid} from "@mui/material";
import React, {useContext, useState} from "react";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import Label from "../../Controls/Label";
import TextField from "@mui/material/TextField";
import Web3Context from "../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../Wrapping/Web3AccountContext";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function TransferWorld({ worldsList, worldsData, worldsContract }) {
    let {worldId} = useParams();
    let {targetAccount, setTargetAccount} = useState("0x0");
    let {wrappedCall} = useContext(ContractWindowContext);
    const navigate = useNavigate();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {web3, account} = context;

    const transfer = wrappedCall(async function() {
        let isAddress = (
            web3.utils.toChecksumAddress(targetAccount) !==
            web3.utils.toChecksumAddress(ZERO_ADDRESS)
        );
        if (!isAddress) {
            throw new Error("Cannot transfer the world to the zero address");
        }
        await worldsContract.methods.transferFrom(account, targetAccount, worldId).send();
        navigate("/");
    });

    return <WorldsListEnabledLayout sx={{height: "600px"}} worldsList={worldsList} worldsData={worldsData}>
        <Alert severity="warning">
            You're about to transfer the world: {worldId.toString()}. Do this carefully
            since you're about to lose control over this world.
        </Alert>
        <Grid container>
            {/* Name */}
            <Grid item xs={5}><Label>Target account:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={targetAccount} onChange={setTargetAccount} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={transfer}
                        variant="contained" color="primary" size="large">Transfer</Button>
            </Grid>
        </Grid>
    </WorldsListEnabledLayout>;
}