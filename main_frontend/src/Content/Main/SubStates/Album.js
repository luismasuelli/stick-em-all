import ThemedPaper from "../../Controls/ThemedPaper";
import {Box, Button} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Label from "../../Controls/Label";

export default function Album({
    worldsManagement, worlds, economy,
    albumsDataCache, assetsDataCache, albumTypesDataCache
}) {
    const navigate = useNavigate();
    const {albumId} = useParams();
    const albumDataCache = albumsDataCache[albumTypesDataCache[albumId]];

    console.log("cached data:", albumDataCache);
    return <ThemedPaper sx={{minHeight: "600px", marginTop: 2}}>
        <Box sx={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 1, marginTop: 1
        }}>
            <Button variant="contained" color="primary"
                    onClick={() => navigate("/")}>&#9664; Back</Button>
            <Label sx={{paddingRight: 0}}>
                You're in an album: {albumDataCache?.name || "(Unknown)"}&nbsp;
                (Edition: {albumDataCache?.edition || "(Unknown)"})
            </Label>
        </Box>
    </ThemedPaper>;
}