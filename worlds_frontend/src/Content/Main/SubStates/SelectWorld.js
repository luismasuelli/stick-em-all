import {Grid} from "@mui/material";
import WorldsList from "../Components/WorldsList";
import ThemedBox from "../../Controls/ThemedBox";

export default function SelectWorld({ worldsList, worldsData }) {
    return <Grid container>
        <Grid item xs={5}><WorldsList worldsList={worldsList} worldsData={worldsData} /></Grid>
        <Grid item xs={7}>
            <ThemedBox severity="none" sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', width: '100%', padding: 2
            }}>
                <p>Select or create a world to continue</p>
            </ThemedBox>
        </Grid>
    </Grid>;
}