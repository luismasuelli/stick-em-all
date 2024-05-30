# Stick 'em All - Contracts

This directory contains the contracts that are related to the Stick 'em All project.

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

## Forward your network to https:// for your wallet

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

Then, configure the local network in MetaMask (or whatever wallet you're using) with the following data:

1. Any name for the network.
2. Symbol: GO (at least, MetaMask will not complain by choosing that symbol).
3. RPC: https://your-awesome-domain.ngrok-free.app.
4. Chain ID: 31337 (If you've already set up your network to Ganache, change the id from 1337 to 31337).
5. No block explorer.

### Copy your MetaMask address

Choose one of your MetaMask accounts you want to work with (you will have at least one account) and copy it.
We'll be using that address in the next step(s).

## Deploy all the contracts

With your local hardhat node and ngrok forwarding running, and your wallet aware of that network, open yet another
new console and run this command:

```shell
npx hardhat deploy-everything --network localhost --owner {0xTheAddressYouCopied}
```

This command will install all the contracts and also set the ownership of the sensitive operations to your address.

You'll notice that the address you specified in the --owner argument now has 100.0 fake MATIC coins.

Your local network can be considered ready by this point.

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

## Alternatives to ngrok

It might happen that you run out of bandwidth when using ngrok to expose your wallet. In this case, and if you
don't want to purchase any license, you can try different services. Some instructions will be given here:

### tunnel.pyjam.as

This service is free, and I'm not sure about the quotas, but it requires an OS having WireGuard installed.

Ubuntu systems can install wireguard with:

```shell
sudo apt install wireguard-tools
```

Additionally, curl must also be present in the system. So, having both curl and wg-quick, run commands like
this one to configure the tunnel:

```shell
curl https://tunnel.pyjam.as/8545 > ~/statunnel.conf
```

Then just see the contents (e.g. using `cat`) and keep it for yourself, save for the URL you'll see. The URL
looks like this: https://qr6yab.tunnel.pyjam.as/. This URL is generated due to the public key therein.

Keep this file forever, and use that URL as the wallet's RPC URL.

Then, the commands to start / stop the tunnel is:

```shell
# Start (will ask for administrative password)
wg-quick up ~/statunnel.conf

# Stop (will ask for administrative password)
wg-quick up ~/statunnel.conf

# Show all the existing tunnels.
sudo wg show
```

There are some things however to consider:

1. The name of the file must be 15 characters or less, end in ".conf", and consist only of letters/numbers.
2. Do NOT rename the file or, at least, do not use the same file twice for different tunnels.
   1. If you start the tunnel and then rename the file, you'll not be able to stop the tunnel later.
   2. Also, you'll not be able to launch the tunnel with a new name in the meantime.
   3. This is because the virtual IP address is already used in the other tunnel. You'll get errors like this:

      ```shell
      [#] ip link add statunnel type wireguard
      [#] wg setconf statunnel /dev/fd/63
      [#] ip -4 address add 10.101.0.35/32 dev statunnel
      [#] ip link set mtu 1420 up dev statunnel
      [#] ip -4 route add 10.101.0.1/32 dev statunnel
      RTNETLINK answers: File exists
      [#] ip link delete dev statunnel
      ```
      
      The "File exists" error means exactly this. So, you use `wg show` and then rename your file to the name
      of the tunnel you want to close, and then use `wg-quick down <the file>`.
3. Always use absolute paths when specifying the file.


### Other alternatives

Check [these](https://github.com/anderspitman/awesome-tunneling?tab=readme-ov-file) on your own. They might
be quite technical, depending.

### Why not locally mounting an HTTPS-enabled server?

Because you'll otherwise have to handle self-signed certificates and for sure even developers try to avoid that
as much as possible - this will be even worse for the non-dev people.

However, if you feel you can deal with the hassle... then try it: See how to create certificates and mount a local
nginx with https support proxying your localhost:8545 and good luck. But it is harder than it sounds.
