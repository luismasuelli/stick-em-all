# Stick 'em All - Full Project

A new experience for sticker album enthusiasts, with evolving experiences for collecting and gaming.

## Starting the services

### Static Server

A static server must be mounted to serve, mainly, image files.

* You need a modern version of Python3 (I suggest 3.11, but others not-that-old will also work).

See [the instructions](static_server/README.md) to mount a static server that serves static files.

### Contracts

This is a Hardhat project that contains all the contracts that are used in this application.

* You need a modern version of Node (I'm using Node 21.6, but a version like 20 will work).
* You also need an EVM wallet that allows you to configure custom networks (e.g. MetaMask).
* You also need (you'll be properly instructed to) a ngrok client or something that allows
  you to forward a local service to an external HTTPS service.

See [the instructions](contracts/README.md) to mount a local network or deploy the contracts to the
mainnet (Polygon Mainnet) or testnet (Polygon Amoy).

### Params

This is a React project holding an application that allows you to set up the cost params of
this ecosystem.

See [the instructions](params_frontend/README.md) to mount or build the application.

When building the application for distribution, the ideal scenario involves serving it as a whole
directory through a static HTTP server or using an IPFS pinning service.
