import React, { useEffect, useState } from 'react';
import Context from './Context.js';
import Initializing from './Initializing.js';
import NoActiveWallet from './NoActiveWallet.js';
import BadNetwork from './BadNetwork.js';
import Unexpected from "./Unexpected";
import Web3 from 'web3';

const STATUS_INITIALIZING = 0;
const STATUS_NO_WALLET = 1;
const STATUS_BAD_NETWORK = 2;
const STATUS_OK = 3;

const Wrapper = ({ expectedChainId, expectedChainName, children }) => {
    // The chain id to compare must be set to hexadecimal.
    const expectedHexChainId = '0x' + expectedChainId.toString(16);

    // First, a state for the component. This tells what is
    // going on with the injected wallet.
    const [uiStatus, setUIStatus] = useState(STATUS_INITIALIZING);

    // Second, create a web3 client for this application.
    const [web3, setWeb3] = useState(null);

    // Third, a state for the list of available accounts.
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        // Get the ethereum variable. Typically, extensions
        // make use of this variable when injecting providers.
        const { ethereum } = window;

        // Detection on whether it is a web3 provider or not
        // is the very first thing to do. We'll halt everything
        // if this fails.
        const isWeb3Provider = ethereum && (
            typeof ethereum.request === 'function' &&
            typeof ethereum.on === 'function' &&
            typeof ethereum.send === 'function'
        );
        if (!isWeb3Provider) {
            setUIStatus(STATUS_NO_WALLET);
            // Empty return - nothing to dispose.
            return;
        }

        // Create the Web3 client. It will contain the connected
        // accounts, which are a subset of the available accounts
        // in the extension.
        let web3_ = web3;
        if (!web3_) {
            web3_ = new Web3(ethereum);
            setWeb3(web3_);
            return;
        }

        // Define a callback for when the chain id changes.
        function onChainIdChanged(chainId) {
            if (chainId !== expectedHexChainId) {
                setUIStatus(STATUS_BAD_NETWORK);
            } else {
                setUIStatus(STATUS_OK);
            }
        }

        // Link the events of data update.
        ethereum.on('accountsChanged', setAccounts);
        ethereum.on('chainChanged', onChainIdChanged);

        // Finally, get the initial data for chainId and accounts.
        async function initConnectionData() {
            try {
                const chainId = await web3.eth.getChainId();
                try {
                    const accounts = await web3.eth.getAccounts();
                    return [chainId, accounts];
                } catch(error) {
                    console.error("Failed to retrieve accounts", error);
                    return [chainId];
                }
            } catch (error) {
                console.error("Failed to retrieve chain ID", error);
                return [];
            }
        }
        initConnectionData().then((result) => {
            const length = result.length;
            if (length > 0) {
                onChainIdChanged(result[0]);
            }
            if (length > 1) {
                setAccounts(result[1]);
            }
        })

        return () => {
            ethereum.removeListener('accountsChanged', setAccounts);
            ethereum.removeListener('chainChanged', onChainIdChanged);
        };
    }, [web3, expectedHexChainId, expectedChainName]);

    switch(uiStatus) {
        case STATUS_INITIALIZING:
            return <Initializing />;
        case STATUS_NO_WALLET:
            return <NoActiveWallet />;
        case STATUS_BAD_NETWORK:
            return <BadNetwork expectedChainName={expectedChainName} />;
        case STATUS_OK:
            return <Context.Provider value={{web3: web3, accounts: accounts}}>
                {children}
            </Context.Provider>;
        default:
            return <Unexpected uiStatus={uiStatus} />;
    }
};

export default Wrapper;
