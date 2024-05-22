import {useContext, useEffect, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import MakeWorldsContractClients from "./Main/MakeWorldsContractClients";

/**
 * This is the main page. All the pages should look like this.
 * @returns {JSX.Element}
 */
export default function Main() {
    // 1. Get the context and everything needed to have the references to the contracts.
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const { account, web3 } = context;
    const { contracts, setContracts } = useState(null);

    useEffect(() => {
        MakeWorldsContractClients(web3, account).then(setContracts);
    }, [account, web3]);

    // 2. Once the contracts are set, we can use them to set up the effects properly.
    useEffect(() => {
        if (contracts) {

        }
    }, [contracts]);


    return <></>;
}