import {useParams} from 'react-router-dom';
import {Alert, Button, Grid} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import ContractWindowContext from "../../Contexts/ContractWindowContext";
import Label from "../../Controls/Label";
import TextField from "@mui/material/TextField";
import {useDerivedState} from "../../../Utils/derived";
import AddressInput from "../../Controls/AddressInput";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";
import Web3Context from "../../../Wrapping/Web3Context";
import Web3AccountContext from "../../../Wrapping/Web3AccountContext";

export default function EditWorld({ worldsList, worldsData, worldsContract, setWorldsData }) {
    let {worldId} = useParams();
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account} = context;
    let [currentWorldData, setCurrentWorldData] = useState({});
    let [name, setName] = useDerivedState(currentWorldData, setCurrentWorldData, "name");
    let [description, setDescription] = useDerivedState(currentWorldData, setCurrentWorldData, "description");
    let [logo, setLogo] = useDerivedState(currentWorldData, setCurrentWorldData, "logo");
    let [background, setBackground] = useDerivedState(currentWorldData, setCurrentWorldData, "background");
    let [externalUrl, setExternalUrl] = useDerivedState(currentWorldData, setCurrentWorldData, "externalUrl");
    let [validatorUrl, setValidatorUrl] = useDerivedState(currentWorldData, setCurrentWorldData, "validatorUrl");
    let [earningsReceiver, setEarningsReceiver] = useDerivedState(
        currentWorldData, setCurrentWorldData, "earningsReceiver"
    );
    let {wrappedCall} = useContext(ContractWindowContext);

    useEffect(() => {
        const getWorldData = wrappedCall(async function getWorldData() {
            // 1. Download the world data for the given id.
            const [
                name, description, logo, background,
                externalUrl, validatorUrl, earningsReceiver
            ] = await worldsContract.methods.worlds(worldId).call();
            let retrievedWorldData = {
                name, description, logo, background,
                externalUrl, validatorUrl, earningsReceiver
            }
            // 2. Set the downloaded world's data into the worldsData for the worldId.
            setWorldsData({
                ...worldsData,
                ...(Object.fromEntries([[worldId, retrievedWorldData]]))
            });
            // 3. Also set the downloaded world's data into the current world data.
            setCurrentWorldData(retrievedWorldData);
        });
        getWorldData();
    }, [/* Intentionally empty */]);

    const updateName = wrappedCall(async function() {
        await worldsContract.methods.setName(worldId, name).send({from: account});
    });

    const updateDescription = wrappedCall(async function() {
        await worldsContract.methods.setDescription(worldId, description).send({from: account});
    });

    const updateLogo = wrappedCall(async function() {
        await worldsContract.methods.setLogo(worldId, logo).send({from: account});
    });

    const updateBackground = wrappedCall(async function() {
        await worldsContract.methods.setBackground(worldId, background).send({from: account});
    });

    const updateExternalUrl = wrappedCall(async function() {
        await worldsContract.methods.setExternalUrl(worldId, externalUrl).send({from: account});
    });

    const updateValidatorUrl = wrappedCall(async function() {
        await worldsContract.methods.setValidatorUrl(worldId, validatorUrl).send({from: account});
    });

    const updateEarningsReceiver = wrappedCall(async function() {
        await worldsContract.methods.setEarningsReceiver(worldId, earningsReceiver).send({from: account});
    });

    return <WorldsListEnabledLayout sx={{height: "600px"}} worldsList={worldsList} worldsData={worldsData}>
        <Alert severity="info">
            You're currently editing the world: {worldId.toString()}. Each field is edited
            individually.
        </Alert>
        <Grid container>
            {/* Name */}
            <Grid item xs={5}><Label>Name:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateName}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
            {/* Description */}
            <Grid item xs={5}><Label>Description:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateDescription}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
            {/* Logo */}
            <Grid item xs={5}><Label>Logo (URL):</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={logo} onChange={(e) => setLogo(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateLogo}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
            {/* Background */}
            <Grid item xs={5}><Label>Background (URL):</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={background} onChange={(e) => setBackground(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateBackground}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
            {/* External URL */}
            <Grid item xs={5}><Label>External URL:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateExternalUrl}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
            {/* Validator URL */}
            <Grid item xs={5}><Label>Validator URL:</Label></Grid>
            <Grid item xs={7}>
                <TextField variant="outlined" value={validatorUrl} onChange={setValidatorUrl} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateValidatorUrl}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
            {/* Earnings Receiver */}
            <Grid item xs={5}><Label>Earnings Receiver:</Label></Grid>
            <Grid item xs={7}>
                <AddressInput value={earningsReceiver} onChange={setEarningsReceiver} />
            </Grid>
            <Grid item xs={12}>
                <Button disabled={!worldsContract} onClick={updateEarningsReceiver}
                        variant="contained" color="primary" size="large">Update</Button>
            </Grid>
        </Grid>
    </WorldsListEnabledLayout>;
}