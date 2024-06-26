import {Typography} from "@mui/material";

const defaultSx = {p: 2, display: 'block', textAlign: 'right'};

function Label({ sx, children, ...props }) {
    sx = {...defaultSx, ...sx};
    return <Typography sx={sx} {...props}>{children}</Typography>
}

export default Label;