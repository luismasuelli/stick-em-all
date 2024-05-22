import {useContext, useEffect, useRef, useState} from "react";
import Web3Context from "../Wrapping/Web3Context";
import Web3AccountContext from "../Wrapping/Web3AccountContext";
import MakeWorldsContractClients from "./Main/MakeWorldsContractClients";
import getEventsEffect from "../Utils/getEventsEffect";


function updateNextState(state, event) {
    // TODO we'll change this later.
    return [...state, event];
}


/**
 * This is the main page. All the pages should look like this.
 * @returns {JSX.Element}
 */
export default function Main() {
    // 1. Get the context and everything needed to have the references to the contracts.
    const context = {...useContext(Web3Context), ...useContext(Web3AccountContext)};
    const {account, web3} = context;
    const [contracts, setContracts] = useState(null);
    const [events, setEvents] = useState([]);
    const ref = useRef(null);
    ref.setEvents = function(events) {
        setEvents(events);
    }
    ref.setContracts = function(contracts) {
        setContracts(contracts);
    }

    useEffect(() => {
        MakeWorldsContractClients(web3, account).then(ref.setContracts);
    }, [account, web3, ref]);

    // 2. Once the contracts are set, we can use them to set up the effects properly.
    useEffect(() => {
        if (contracts) {
            return getEventsEffect(
                contracts.worldsContract,
                ["Transfer", "WorldEditionAllowanceChanged"],
                {}, updateNextState, ref.setEvents,
                {lastState: []}
            );
        }
    }, [contracts, ref]);

    return <></>;
}