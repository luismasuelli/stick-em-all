import {useParams, useNavigate} from 'react-router-dom';
import {Grid} from "@mui/material";

export default function EditWorld() {
    let {worldId} = useParams();
    return <Grid container>
        <Grid item xs={5}></Grid>
        <Grid item xs={7}></Grid>
    </Grid>;
}