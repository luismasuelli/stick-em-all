import {Typography} from "@mui/material";

const defaultSx = {p: 2, display: 'inline'};

function Label({ sx, children, ...props }) {
    sx = {...defaultSx, ...sx};
    return <Typography sx={sx}>{children}</Typography>
}

export default Label;