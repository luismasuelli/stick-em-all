import {Grid} from "@mui/material";
import WorldsList from "./WorldsList";


export default function WorldsListEnabledLayout({ worldsList, worldsData, children, ...props}) {
    return <Grid container {...props}>
        <Grid item xs={5} sx={{height: "100%"}}>
            <WorldsList worldsList={worldsList} worldsData={worldsData} />
        </Grid>
        <Grid item xs={7} sx={{height: "100%"}}>
            {children}
        </Grid>
    </Grid>;
}