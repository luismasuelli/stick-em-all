import {useContext, useEffect, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import MakeWorldsContractClients from "./Main/MakeWorldsContractClients";
import getEventsEffect from "../Utils/getEventsEffect";
import Web3 from "web3";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";


function updateNextState(state, event) {
    // TODO we'll change this later.
    return [...state, event];
}

// Which are the defined params of the app?
const params = [
    // Define many costs like this:
    {
        caption: "Defining a World",
        hash: Web3.utils.soliditySha3("Costs::DefineWorld")
    },
]


/**
 * Renders the main content of the window.
 * @constructor
 */
function MainContent() {}


/**
 * This is the main page. All the pages should look like this.
 * @returns {JSX.Element}
 */
export default function Main() {
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {web3, account} = context;
    const [contracts, setContracts] = useState(null);
    const description =
        "This section allows defining new worlds, transferring ownership of the worlds, and " +
        "(for the respective world owners) managing the contents / properties of the worlds."

    useEffect(() => {
        MakeWorldsContractClients(web3, account).then(setContracts);
    }, [web3, account]);

    if (contracts) {
        return <ParamsAwareContractWindow caption={"Stick 'Em All - Worlds"} description={description}
                                          paramsContract={contracts.params} params={params}
                                          mainContract={contracts.worlds} showOwner={true}>
            <MainContent />
        </ParamsAwareContractWindow>;
    } else {
        return <StandaloneMessage title="Loading..." content="Loading the contracts..." />;
    }
}