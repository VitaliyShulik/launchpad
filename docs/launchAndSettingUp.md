# Launch and Setting Up Application

## Preparation

- Add your EVM-like network if you need. [Read more](./addNewNetwork.md)
- If you use developer enviroment. Rewrite **getCurrentDomain** function and return there only your domain as string (for eg. - `"your-domain.com"`) in the `./src/utils/utils.js` file
- If you use production. Make application build and host the application on your domain. [Read more](./makeBuildAndHostApp.md)

## Initial Setup

0. Open your domain with the app

1. Connect your wallet and use the BSC network (Binance Smart Chain network is the Storage network of the application)

2. Click the "Set Owner" to set admin of the domain as your connected account, and confirm the transaction in your wallet

3. Go to the Infura IPFS Settings sections in the Main settings, fill in all options, and save settings via a generated transaction. [How to set up the Infura IPFS?](https://support.onout.org/hc/1331700057/36/how-to-setting-up-the-infura-ipfs)

4. Go to the Networks section in the Main settings, select a network you want to configure, fill in a Web Socket RPC option of this network, and save settings via a generated transaction. [Why do I need a Web Socket RPC and where I can find it?](https://support.onout.org/hc/1331700057/37/why-i-need-a-web-socket-rpc-and-where-i-can-find-it)

5. Go to the Contracts section in the Main settings, you need to set up [Main Launchpad Contracts](https://support.onout.org/hc/1331700057/38/main-launchpad-contracts), and select a network you want to configure:

    - if you have deployed contracts: fill in all options, and save settings via a generated transaction
    - if you have not deployed contracts: Deploy contracts following the instruction in this settings section and save settings via a generated transaction

6. Congratulation!!! You have set up your own Launchpad! Now you can connect to a configured network and surf application features.
