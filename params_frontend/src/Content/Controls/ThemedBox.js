import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";


function ThemedBox({ severity = 'info', sx = {}, children, ...props }) {
    const theme = useTheme();
    const backgroundColor = theme.palette[severity]?.main; // Get main color based on severity
    const color = theme.palette.getContrastText(backgroundColor);

    return (
        <Box
            sx={{
                backgroundColor,
                color,
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette[severity]?.dark}`,
                ...sx
            }}
            {...props}
        >
            {children}
        </Box>
    );
}