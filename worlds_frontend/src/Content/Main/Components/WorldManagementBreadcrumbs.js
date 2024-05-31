import Box from "@mui/material/Box";
import {Button, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

export function WorldManagementBreadcrumbs({ worldId, worldData }) {
    const navigate = useNavigate();
    worldData ||= {};

    return <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
        <Button variant="contained" color="primary"
                onClick={() => navigate(`/edit/${worldId.toString()}`)}>&#9664; Back</Button>
        <Typography sx={{p: 2, textAlign: 'right'}}>
            You're managing the albums for the world {worldId.toString()} - {worldData.name}
        </Typography>
    </Box>
}