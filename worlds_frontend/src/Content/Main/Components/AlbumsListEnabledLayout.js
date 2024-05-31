import {Button, Grid} from "@mui/material";
import AlbumsList from "./AlbumsList";
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {WorldManagementBreadcrumbs} from "./WorldManagementBreadcrumbs";


export default function AlbumsListEnabledLayout({
    worldsData, albumsList, albumsData, children, sx={}, minHeight = "600px",
    selectedWorldId, setSelectedWorldId, ...props
}) {
    worldsData ||= {};
    const navigate = useNavigate();
    let {worldId} = useParams();
    if (selectedWorldId === undefined || selectedWorldId.toString() !== worldId.toString()) {
        setSelectedWorldId(selectedWorldId);
    }

    return <Box>
        {/* eslint-disable-next-line no-undef */}
        <WorldManagementBreadcrumbs worldId={worldId} worldData={worldsData[BigInt(worldId)]} />
        <Grid container {...props} sx={{...(sx||{}), alignItems: "stretch", minHeight}}>
            <Grid item xs={4} sx={{display: 'flex', flexDirection: 'column', padding: 2}}>
                <AlbumsList albumsList={albumsList} albumsData={albumsData} />
                <Button onClick={() => navigate("/manage/" + worldId.toString() + "/create")}
                        variant="contained" color="primary" size="large">
                    Create Album
                </Button>
            </Grid>
            <Grid item xs={8} sx={{display: 'flex', flexDirection: 'column', padding: 2}}>
                {children}
            </Grid>
        </Grid>
    </Box>;
}