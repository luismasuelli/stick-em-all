import {useParams, useNavigate} from 'react-router-dom';
import {Grid} from "@mui/material";
import WorldsList from "../Components/WorldsList";
import ThemedBox from "../../Controls/ThemedBox";
import {useEffect} from "react";
import WorldsListEnabledLayout from "../Components/WorldsListEnabledLayout";
import Box from "@mui/material/Box";

export default function WorldCreated({ worldsList, worldsData, newWorldData }) {
    let {worldId} = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        let timeout = setTimeout(() => {
            navigate(`/edit/${worldId.toString()}`);
            timeout = null;
        }, 5000);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [worldId, newWorldData, navigate]);

    return <WorldsListEnabledLayout sx={{minHeight: "600px"}} worldsList={worldsList} worldsData={worldsData}>
        <ThemedBox severity="none" sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', width: '100%', padding: 2
        }}>
            <Box>
                <p>The world was successfully created with this id: {worldId.toString()}</p>
                <p>
                    Name: {newWorldData.name}<br/>
                    Description: {newWorldData.description}<br/>
                    Logo: {newWorldData.logo}
                </p>
                <p>
                    You'll be properly redirected in 5 seconds...
                </p>
            </Box>
        </ThemedBox>
    </WorldsListEnabledLayout>;
}