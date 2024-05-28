import {Button, Grid} from "@mui/material";
import WorldsList from "./WorldsList";
import {useNavigate} from "react-router-dom";


export default function WorldsListEnabledLayout({ worldsList, worldsData, children, sx={}, minHeight = "600px", ...props}) {
    const navigate = useNavigate();

    return <Grid container {...props} sx={{...(sx||{}), alignItems: "stretch", minHeight}}>
        <Grid item xs={4} sx={{display: 'flex', flexDirection: 'column', padding: 2}}>
            <WorldsList worldsList={worldsList} worldsData={worldsData} />
            <Button onClick={() => navigate("/create")} variant="contained" color="primary" size="large">
                Create
            </Button>
        </Grid>
        <Grid item xs={8} sx={{display: 'flex', flexDirection: 'column', padding: 2}}>
            {children}
        </Grid>
    </Grid>;
}