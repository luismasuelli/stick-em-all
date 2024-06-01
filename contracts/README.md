# Stick 'em All - Contracts

This directory contains the contracts that are related to the Stick 'em All project.

The local network is: A Hardhat project
The testnet is: Polygon Amoy
The mainnet is: Polygon Mainnet

## Install everything

This is a node project. All the `npm` / `npx` projects must be run in _this_ directory.

Run this command in a shell:

```shell
npm install
```

## Mounting the sample network

Run this command in a shell:

```shell
npx hardhat node
```

Some wallets (e.g. MetaMask) allow you to use http://localhost:8545 (the local RPC node you just mounted).
Ensure you use a proper wallet and configure that one as a new "Local" network.

### Copy your Wallet address

Choose one of your wallet's accounts you want to work with (you will have at least one account) and copy it.
We'll be using that address in the next step(s).

## Deploy all the contracts on local network

With your local hardhat node and ngrok forwarding running, and your wallet aware of that network, open yet another
new console and run this command:

```shell
npx hardhat deploy-everything --network localhost --owner {0xTheAddressYouCopied}
```

This command will install all the contracts and also set the ownership of the sensitive operations to your address.

You'll notice that the address you specified in the --owner argument now has 100.0 fake MATIC coins.

Your local network can be considered ready by this point.

### Install some Call of the Void samples

This is only intended to test in your local network or testnet. It does not make that much sense in mainnet.

Run this command to have some example worlds/albums/pages defined to quickly work with.

```shell
npx hardhat add-callofthevoid-samples --network localhost --owner {0xTheAddressYouCopied}
```

## Restarting the network

Once you restart your local network, everything is lost from the previous run(s), which means that you'll have to
repeat the deployment command from the previous section after the network is mounted.

You'll not need to re-configure your wallet or your ngrok bridge (perhaps only re-launching it, if closed). However,
certain wallets (like MetaMask) _have an internal cache that needs to be reset_. This cache corresponds to a particular
network configured in the wallet, and not all the configured networks.

So, you must step in the configuration that corresponds to the network entry corresponding to your ngrok domain and
there reset the internal cache. Otherwise, you might get weird errors due to tx nonces otherwise (at least, this
happens in MetaMask).

## Deploy on testnet / mainnet

The command to deploy on testnet and mainnet is trickier, but not impossible. The same goes for either network:

1. Have a well-funded account, and give its mnemonic as an environment variable MNEMONIC=... in an .env file.
2. Please consider that the FIRST address/account will be used out from that mnemonic, so ensure it has enough funds
   to deploy all these contracts and do all these operations (which are A LOT, actually).
3. You'll not need the --owner parameter anymore: the ownership will go to that account. But you CAN specify one, if
   it is the case that you want another account to be the owner of these contracts.
4. You'll properly need to create a VRF subscription id. Creating the subscription id per se is free (even in mainnet),
   but you'll need to properly create one and eventually fund it (otherwise, this will not work). You'll need to take
   notes of the ID, because it will be used in this command. Please note: funding can be done in LINK or MATIC. The
   networks are Polygon Amoy and Polygon Mainnet respectively, and there are both LINK and MATIC faucets for Polygon
   Amoy testnet (developed by Chainlink themselves).

Then, you'll need to run this command:

```shell
# theNetwork will be either testnet or mainnet (literally, those options).
npx hardhat deploy-everything --network {theNetwork} --vrfsub {TheIdOfTheSubscription}
```

Or, if you want to use a specific new owner:

```shell
# theNetwork will be either testnet or mainnet (literally, those options).
npx hardhat deploy-everything --network {theNetwork} --vrfsub {TheIdOfTheSubscription} --owner {0xTheAddressYouCopied}
```

## Take notes of the contracts

This is needed always. It doesn't matter whether you ran the deploy-everything command against localhost, testnet or
mainnet: You'll need to take notes of all the contracts.

The deploy-everything provides all the relevant addresses for them to be used in each of the front-ends. So take notes
of them after you run the deployment command.

If by some reason you didn't pay attention and cleared/closed your terminal, you can run some commands:

1. To list the networks where a deployed occurred:

   ```shell
   npx hardhat ignition deployments
   ```

2. To list the deployed contracts in one of the entries listed by the previous command (e.g. chain-31337):

   ```shell
   npx hardhat ignition status chain-31337
   ```
   
And then take the proper notes to be used in front-ends.

### Authorize the consumer

If you're the responsible for deploying the contract on testnet or mainnet, ensure you copy the address of the
main contract and add it as a valid consumer to your VRF subscription. Otherwise, the VRF calls will fail.

This is not needed (and cannot be done) for your local network.
