import BigNumber from "bignumber.js";
import { injected, newWalletConnect, newWalletlink } from '../connectors';
import { networks } from '../constants/networksInfo';

const BSC_ID = 56;
const GOERLI_ID = 5;

export const STORAGE_NETWORK_ID = process.env.NODE_ENV === 'production' ? BSC_ID : GOERLI_ID;
export const STORAGE_NETWORK_NAME = networks[STORAGE_NETWORK_ID.toString()].name;
export const STORAGE = networks[STORAGE_NETWORK_ID.toString()].storage;

export const STORAGE_APP_KEY = 'launchpad';

export const WALLET_NAMES = {
  INJECTED: 'Injected',
  METAMASK: 'MetaMask',
  WALLET_CONNECT: 'WalletConnect',
//   WALLET_LINK: 'Coinbase Wallet',
};

export const SUPPORTED_WALLETS = {
  INJECTED: {
    connector: injected,
    name: WALLET_NAMES.INJECTED,
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: WALLET_NAMES.METAMASK,
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: newWalletConnect(STORAGE_NETWORK_ID),
    name: WALLET_NAMES.WALLET_CONNECT,
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
//   WALLET_LINK: {
//     connector: newWalletlink(STORAGE_NETWORK_ID),
//     name: WALLET_NAMES.WALLET_LINK,
//     iconName: 'coinbaseWalletIcon.svg',
//     description: 'Use Coinbase Wallet app on mobile device',
//     href: null,
//     color: '#315CF5',
//   },
};

export const NetworkContextName = 'NETWORK';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETHER = BigNumber(10).pow(18);