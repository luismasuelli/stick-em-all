import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";


export default function ThemedBox({
    severity = 'info', sx = {}, children, useThemeBorderRadius = false, ...props
}) {
    const theme = useTheme();
    let finalSx = {
        ...sx, padding: theme.spacing(2)
    };
    if (useThemeBorderRadius) {
        finalSx.borderRadius = theme.shape.borderRadius
    }

    if (severity !== 'none') {
        const backgroundColor = theme.palette[severity]?.main; // Get main color based on severity
        const color = theme.palette.getContrastText(backgroundColor);
        const borderColor = theme.palette[severity]?.dark;

        finalSx = {
            ...finalSx, backgroundColor, color,
            border: `1px solid ${borderColor}`,
        }
    }

    return (
        <Box sx={finalSx} {...props}>
            {children}
        </Box>
    );
}