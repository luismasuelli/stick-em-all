import {useNavigate} from 'react-router-dom';
import {Grid} from "@mui/material";
import WorldsList from "../Components/WorldsList";

export default function CreateWorld({ worldsList, worldsData }) {
    return <Grid container>
        <Grid item xs={5}><WorldsList worldsList={worldsList} worldsData={worldsData} /></Grid>
        <Grid item xs={7}></Grid>
    </Grid>;
}