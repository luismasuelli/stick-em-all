# Stick 'em All contracts

This contains the contracts that are related to the Stick 'em All project.

## Install everything

Run this command in a shell (the current directory must be the root of the project):

```shell
npm install
```

## Mounting the sample network

Run this command in a shell (the current directory must be the root of the project):

```shell
npx hardhat node
```

In another shell, run these commands:

```shell
# For the params and price feed:
npx hardhat run scripts/ParamsDeploy.js --network localhost
```

Your network will run in localhost:8545 (chain ID: 31337), but you'll need to expose it through https.

My advice is like this:

  1. Create an account at [ngrok.com](https://ngrok.com).
  2. Go to the [domain](https://dashboard.ngrok.com/cloud-edge/domains) dashboard and create a FREE domain.
     - Let's say your free domain becomes your-awesome-domain.ngrok-free.app 
  3. Go to the [auth](https://dashboard.ngrok.com/get-started/your-authtoken) dashboard and copy your auth token.
     - Let's say your API key is: `7K79cBvZVo4jaDOHRpE86RmoHaD_2NDGNSn5GPEF1uivUeRQR`.
  4. [Install](https://ngrok.com/download) a ngrok client suitable for your OS.
  5. Run this command in a shell (with the appropriate key):

     ```shell
     ngrok config add-authtoken 7K79cBvZVo4jaDOHRpE86RmoHaD_2NDGNSn5GPEF1uivUeRQR
     ```

With everything setup, you can run this command in a shell (with the appropriate domain):

```shell
ngrok http --domain=your-awesome-domain.ngrok-free.app 8545
```

Then, configure the local network in MetaMask with the following data:

1. Any name for the network.
2. Symbol: ETH.
3. RPC: https://your-awesome-domain.ngrok-free.app.
4. Chain ID: 31337.
5. No block explorer.