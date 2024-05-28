import {useNavigate} from 'react-router-dom';
import Box from "@mui/material/Box";
import ThemedBox from "../../Controls/ThemedBox";


/**
 * Renders the list of worlds, which involves two things:
 * 1. The cached data for each world.
 * 2. The list of worlds.
 * @param worldsList The list of worlds.
 * @param worldsData The cached data. Some worlds do not have cached.
 * @param props More props to be forwarded.
 * data for them. This is until they're visited.
 */
export default function WorldsList({ worldsList, worldsData, ...props }) {
    const navigate = useNavigate();

    function handleClick(worldId) {
        navigate("/edit/" + worldId.toString());
    }

    worldsList = worldsList.filter(world => (world.owned || world.allowed));

    return <Box sx={{
        height: '100%',   // Use 100% of the parent height
        width: '100%',    // Use 100% of the parent width
        flexGrow: 1,
        position: 'relative'
    }}>
        <Box sx={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, overflowY: 'auto'}}>
            {worldsList.length ? worldsList.map((world, index) => (
                <ThemedBox key={index} {...props} severity={world.owned ? "success" : "info"}
                           onClick={() => handleClick(world.worldId)} style={{userSelect: "none"}}>
                    <h3 style={{textOverflow: "ellipsis", padding: 0, margin: 0}}>ID: {world.worldId.toString()}</h3>
                    {(worldsData[world.worldId]) ? (
                        <p style={{textOverflow: "ellipsis", padding: 0, margin: 0}}>{worldsData[world.worldId].name}</p>
                    ) : null}
                </ThemedBox>
            )) : (
                <ThemedBox {...props} severity="info">
                    <p style={{textOverflow: "ellipsis", padding: 0, margin: 0}}>No defined worlds</p>
                </ThemedBox>
            )}
        </Box>
    </Box>;
}