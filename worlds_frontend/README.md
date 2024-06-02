# Stick 'em All - Worlds Application

This directory contains an application to:

1. Mint a world and maintain its data.
2. Create albums, maintain their data (adding pages, achievements, and stickers) and release them.
3. Define and update booster pack rules.

## Install everything

This is a node project. All the `npm` / `npx` projects must be run in _this_ directory.

Run this command in a shell:

```shell
npm install
```

## Launch the application

### Launching against your Local network

First, you need to read the local deployment instructions [for the contracts](../contracts/README.md).

Once the contracts are deployed, take the "Params address" and "Worlds Management address" from the output of the deploy-everything task.

Then, in the `worlds_frontend/` directory create a `.env.development.custom.local` with:

```
REACT_APP_PARAMS_CONTRACT=0xTheAddressYouCopiedFromParams
REACT_APP_WORLDS_MANAGEMENT_CONTRACT=0xTheAddressYouCopiedFromWorldsManagement
```

And then, run this command in shell:

```shell
npm run start
```

Then, visit the local site (e.g. localhost:3000) ensuring the current network in your wallet is the local one.

### Launching against Polygon Amoy

First, you need to read the testnet deployment instructions [for the contracts](../contracts/README.md).

The later instructions are similar but with `.env.test.custom.local`, but after deploying the contracts
to the "testnet" network.

And then, run this command in shell:

```shell
npm run start:testnet
```

Then, visit the local site (e.g. localhost:3000) ensuring the current network in your wallet is the testnet pme.

### Launching against Polygon Mainnet

First, you need to read the testnet deployment instructions [for the contracts](../contracts/README.md).

The later instructions are similar but with `.env.production.custom.local`, but after deploying the contracts
to the "mainnet" network.

And then, run this command in shell:

```shell
npm run start:mainnet
```

Then, visit the local site (e.g. localhost:3000) ensuring the current network in your wallet is the mainnet one.
