import {useContext} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import {AppBar, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';

/**
 * This is the main page. All the pages should look like this.
 * @returns {JSX.Element}
 */
export default function Main() {
    // Extract the context's relevant data to make transactions.
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const { web3, account, balanceRefresher } = context;
    // Is the contract deployed? Which address?
    const isDeployed = !!(process.env.REACT_APP_PARAMS_CONTRACT);
    const contractAddress = process.env.REACT_APP_PARAMS_CONTRACT || '0x0';

    return <Paper elevation={3} style={{ margin: '40px', marginTop: '120px', padding: '20px' }}>
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Stick 'em All - Management (Contract: {isDeployed ? contractAddress : "not deployed yet"})
                </Typography>
                {(isDeployed ? (
                    <IconButton color="inherit" onClick={balanceRefresher}>
                        <RefreshIcon />
                    </IconButton>
                ) : null)}
            </Toolbar>
        </AppBar>

        <Typography variant="body1" color="primary" style={{ marginTop: '20px' }}>
            This section allows the contract owner to modify the business parameters.
            This involves management of ownership, earnings, and costs (expressed in USD).
        </Typography>
        {/* Placeholder for further content */}
    </Paper>;
}