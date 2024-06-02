import {useContext, useEffect, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import ParamsAwareContractWindow from "./Windows/ParamsAwareContractWindow";
import StandaloneMessage from "./Windows/StandaloneMessage";
import mainContractClients from "./Main/mainContractClients";


/**
 * Renders all the content to the end user(s).
 */
function MainContent() {

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
