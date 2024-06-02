import {useContext, useEffect, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";
import mainContractClients from "./Main/mainContractClients";
import {MemoryRouter, Route, Routes, useNavigate} from "react-router-dom";
import {Box, Button, Grid} from "@mui/material";


function EntryPoint() {
    const navigate = useNavigate();

    return <Box sx={{
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
        display: "flex", alignItems: "center", justifyContent: "center"
    }}>
        <Box sx={{display: "inline-block", width: "300px"}}>
            <Grid container>
                <Grid xs={12} sx={{p: 2}}>
                    <Button sx={{width: "100%"}} onClick={() => navigate("/create")}
                            variant="contained" color="primary" size="large">
                        Create album
                    </Button>
                </Grid>
                <Grid xs={12} sx={{p: 2}}>
                    <Button sx={{width: "100%"}} onClick={() => navigate("/albums")}
                            variant="contained" color="primary" size="large">
                        See my albums
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </Box>;
}

/**
 * Renders all the content to the end user(s).
 */
function MainContent() {
    return <Box sx={{width: "100%", height: "100%", minHeight: "600px", position: "relative"}}>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<EntryPoint />} />
                <Route path="/create" element={<></>} />
                <Route path="/albums" element={<></>} />
                <Route path="/albums/:albumId" element={<></>} />
            </Routes>
        </MemoryRouter>
    </Box>;
}


/**
 * This is the main page. All the pages should look like this.
 * @returns {JSX.Element}
 */
export default function Main() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {web3, account} = context;
    const [contracts, setContracts] = useState(null);
    const description =
        "You can buy new or make use of your existing albums :D. Enjoy the experience!"

    useEffect(() => {
        mainContractClients(web3, account).then(setContracts);
    }, [web3, account]);

    if (contracts) {
        return <ParamsAwareContractWindow caption={"Stick 'Em All"} description={description}
                                          paramsContract={contracts.params} params={[]}
                                          mainContract={contracts.worldsManagement}>
            <MainContent account={account} contracts={contracts} />
        </ParamsAwareContractWindow>;
    } else {
        return <StandaloneMessage title="Loading..." content="Loading the contracts..." />;
    }
}
