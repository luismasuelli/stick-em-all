# Stick 'em All - Parameters Application

This directory contains an application to:

1. Transfer the ownership of this application and, by extension, the whole ecosystem.
2. Define which account will be the one that receives the earnings in a _withdraw_ operation.
3. Withdraw part of the earnings (done against the earnings-receiving address).
4. Change the prices (expressed in USD) of each parameter.

## Install everything

This is a node project. All the `npm` / `npx` projects must be run in _this_ directory.

Run this command in a shell:

```shell
npm install
```

## Launch the application

### Launching against your Local network

First, you need to read the local deployment instructions [for the contracts](../contracts/README.md).

Once the contracts are deployed, take the "Params address" from the output of the deploy-everything task.

Then, in the `params_frontend/` directory create a `.env.development.custom.local` with:

```
REACT_APP_PARAMS_CONTRACT=0xTheAddressYouCopied
```

And finally, run this command in shell:

```shell
npm run start
```

### Launching against Polygon Amoy

First, you need to read the testnet deployment instructions [for the contracts](../contracts/README.md).

The later instructions are similar but with `.env.test.custom.local`, but after deploying the contracts
to the "testnet" network.

And finally, run this command in shell:

```shell
npm run start:testnet
```

### Launching against Polygon Mainnet

First, you need to read the testnet deployment instructions [for the contracts](../contracts/README.md).

The later instructions are similar but with `.env.production.custom.local`, but after deploying the contracts
to the "mainnet" network.

And finally, run this command in shell:

```shell
npm run start:mainnet
```
