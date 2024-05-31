import {Button, Grid} from "@mui/material";
import AlbumsList from "./AlbumsList";
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {WorldManagementBreadcrumbs} from "./WorldManagementBreadcrumbs";


export default function AlbumsListEnabledLayout({
    worldsData, albumsList, albumsData, children, sx={}, minHeight = "600px", ...props
}) {
    const navigate = useNavigate();
    let {worldId} = useParams();

    return <Box>
        <WorldManagementBreadcrumbs worldId={worldId} worldData={worldsData[worldId]} />
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