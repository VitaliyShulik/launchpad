import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
// import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { NetworkConnector } from './NetworkConnector';
import { networks } from '../constants/networksInfo';

export const EVM_ADDRESS_REGEXP = /^0x[A-Fa-f0-9]{40}$/;

export const SUPPORTED_NETWORKS = Object.values(networks).reduce((acc, network) => {
  const { multicall, wrappedToken, chainId, rpc, baseCurrency } = network;

  if (
    Boolean(
      multicall?.match(EVM_ADDRESS_REGEXP) &&
        wrappedToken?.address?.match(EVM_ADDRESS_REGEXP) &&
        wrappedToken?.name &&
        wrappedToken?.symbol &&
        baseCurrency?.name &&
        baseCurrency?.symbol &&
        rpc
    )
  ) {
    return { ...acc, [chainId]: network };
  }

  return acc;
}, {});

export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_NETWORKS).map((id) => Number(id));
export const NETWORKS_RPC_BY_ID = Object.values(SUPPORTED_NETWORKS).reduce(
  (acc, { chainId, rpc }) => ({ ...acc, [chainId]: rpc }),
  {}
);

export const network = new NetworkConnector({
  urls: NETWORKS_RPC_BY_ID,
  defaultChainId: 5, // goerli testnet
});

let networkLibrary;
export function getNetworkLibrary() {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider));
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});

export const newWalletConnect = (chainId) => {
  return new WalletConnectConnector({
    rpc: { [networks[chainId].chainId]: networks[networks[chainId].chainId].rpc },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000,
  });
}

// export const newWalletlink = (chainId, appName = '', appLogoUrl = '') =>
//   new WalletLinkConnector({
//     url: networks[chainId].rpc,
//     appName,
//     appLogoUrl,
// });
