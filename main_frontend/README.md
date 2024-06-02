# Stick 'em All - Main Application

This directory contains an application to:

1. Mint a new album, from a given released album type defined by certain world.
2. Transfer an entire album to another party.
3. Purchase booster pack rules from active rule sets.
4. Use/open any booster pack and get their stickers.
5. Use (glue) the stickers in certain album.
6. Transfer stickers to another party.

## Install everything

This is a node project. All the `npm` / `npx` projects must be run in _this_ directory.

Run this command in a shell:

```shell
npm install
```

## Launch the application

### Launching against your Local network

First, you need to read the local deployment instructions [for the contracts](../contracts/README.md).

Once the contracts are deployed, take the "Main address" from the output of the deploy-everything task.

Then, in the `worlds_frontend/` directory create a `.env.development.custom.local` with:

```
REACT_APP_MAIN_CONTRACT=0xTheAddressYouCopiedFromParams
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
