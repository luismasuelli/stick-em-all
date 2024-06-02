import {Typography} from "@mui/material";

const defaultSx = {textAlign: 'left', p: 2, paddingLeft: 0};

function StaticText({ sx, children, ...props }) {
    sx = {...defaultSx, ...sx};
    return <Typography sx={sx} {...props}>{children}</Typography>
}

export default StaticText;