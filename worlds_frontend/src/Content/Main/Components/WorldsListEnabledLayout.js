import {Button, Grid} from "@mui/material";
import WorldsList from "./WorldsList";
import {useNavigate} from "react-router-dom";


export default function WorldsListEnabledLayout({ worldsList, worldsData, children, ...props}) {
    const navigate = useNavigate();

    return <Grid container {...props}>
        <Grid item xs={4} sx={{display: 'flex', flexDirection: 'column', height: "100%"}}>
            <WorldsList worldsList={worldsList} worldsData={worldsData} sx={{ flexGrow: 1, overflow: 'auto' }} />
            <Button onClick={() => navigate("/create")} variant="contained" color="primary" size="large">
                Create
            </Button>
        </Grid>
        <Grid item xs={8} sx={{height: "100%"}}>
            {children}
        </Grid>
    </Grid>;
}