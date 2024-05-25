import {useNavigate} from 'react-router-dom';
import {Grid} from "@mui/material";
import WorldsList from "../Components/WorldsList";
import {useContext} from "react";
import ParamsContext from "../../Contexts/ParamsContext";

export default function CreateWorld({ worldsList, worldsData, worldsContract, setNewWorldData }) {
    const paramsContext = useContext(ParamsContext);
    const worldDefinitionHash = paramsContext.params[0].hash;
    const fiatPrice = paramsContext.paramsData.fiatCosts[paramsContext.params[0]];
    const nativePrice = paramsContext.paramsData.nativeCosts[paramsContext.params[0]];

    // TODO implement this later.

    return <Grid container>
        <Grid item xs={5}><WorldsList worldsList={worldsList} worldsData={worldsData} /></Grid>
        <Grid item xs={7}></Grid>
    </Grid>;
}