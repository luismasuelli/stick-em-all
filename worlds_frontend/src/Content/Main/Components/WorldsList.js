import {useNavigate} from 'react-router-dom';
import Box from "@mui/material/Box";
import ThemedBox from "../../Controls/ThemedBox";


/**
 * Renders the list of worlds, which involves two things:
 * 1. The cached data for each world.
 * 2. The list of worlds.
 * @param worldsList The list of worlds.
 * @param worldsData The cached data. Some worlds do not have cached
 * data for them. This is until they're visited.
 */
export default function WorldsList({ worldsList, worldsData }) {
    const navigate = useNavigate();

    return <Box
        sx={{
            height: '100%',   // Use 100% of the parent height
            width: '100%',    // Use 100% of the parent width
            overflowY: 'auto' // Show vertical scrollbar when needed
        }}
    >
        {worldsList.length ? worldsList.filter(world => (world.owner || world.allowed)).map((world, index) => (
            <ThemedBox key={index} style={{padding: 1}} severity={world.owner ? "success" : "info"}>
                <h3 style={{textOverflow: "ellipsis"}}>ID: {world.worldId}</h3>
                {(worldsData[world.worldId]) ? (
                    <p style={{textOverflow: "ellipsis"}}>worldsData[world.worldId].name</p>
                ) : null}
            </ThemedBox>
        )) : (
            <ThemedBox style={{padding: 1}} severity="info">
                <p style={{textOverflow: "ellipsis"}}>No defined worlds</p>
            </ThemedBox>
        )}
    </Box>;
}