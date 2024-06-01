import {useNavigate, useParams} from 'react-router-dom';
import Box from "@mui/material/Box";
import ThemedBox from "../../Controls/ThemedBox";


/**
 * Renders the list of albums, which involves two things:
 * 1. The cached data for each album.
 * 2. The list of albums.
 * @param albumsList The list of albums.
 * @param albumsData The cached data. Some albums do not have cached.
 * @param props More props to be forwarded.
 */
export default function AlbumsList({ albumsList, albumsData, ...props }) {
    const navigate = useNavigate();
    let {worldId} = useParams();

    function handleClick(albumId) {
        navigate("/manage/" + worldId.toString() + "/edit/" + albumId.toString());
    }

    albumsList = albumsList.filter(album => album.worldId.toString() === worldId);

    return <Box sx={{
        height: '100%',   // Use 100% of the parent height
        width: '100%',    // Use 100% of the parent width
        flexGrow: 1,
        position: 'relative'
    }}>
        <Box sx={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflowY: 'auto'}}>
            {albumsList.length ? albumsList.map((album, index) => (
                <ThemedBox key={index} {...props} severity={album.released ? "success" : "info"}
                           onClick={() => handleClick(album.albumId)} style={{userSelect: "none"}}>
                    <h3 style={{textOverflow: "ellipsis", padding: 0, margin: 0}}>ID: {album.albumId.toString()}</h3>
                    {(albumsData[album.albumId]) ? (
                        <p style={{textOverflow: "ellipsis", padding: 0, margin: 0}}>{albumsData[album.albumId].name}</p>
                    ) : null}
                </ThemedBox>
            )) : (
                <ThemedBox {...props} severity="info">
                    <p style={{textOverflow: "ellipsis", padding: 0, margin: 0}}>No defined albums</p>
                </ThemedBox>
            )}
        </Box>
    </Box>;
}