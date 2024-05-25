import {useParams, useNavigate} from 'react-router-dom';
import {Grid} from "@mui/material";

export default function WorldCreated() {
    let {worldId} = useParams();
    return <Grid container>

    </Grid>;
}