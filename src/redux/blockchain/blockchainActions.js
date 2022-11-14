// constants
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import FeeToken from "../../contracts/FeeToken.json";
import IDOFactory from "../../contracts/IDOFactory.json";
import LockerFactory from "../../contracts/TokenLockerFactory.json";
import { networks } from "../../utils/chainInfo";
// log
import { fetchData } from "../userData/dataActions";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "fc1094913ebd41a3853b32571ebe6bbb",
    },
  },
};

const web3Modal = new Web3Modal({
  network: process.env.REACT_APP_networkID, // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

const changeChainRequest = () => {
  return {
    type: "CHANGE_CHAIN_REQUEST",
  };
};

const changeChain = (payload) => {
  return {
    type: "CHANGE_CHAIN",
    payload: payload,
  };
}

const getConnectionData = async (provider) => {
  try {
    let web3 = new Web3(provider);
    const networkId = process.env.REACT_APP_networkID;
    const [account] = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();

    const isSupportedNetwork = networkId == chainId;

    // Todo: get data from appSettings store
    const FeeTokenNetworkData = await FeeToken.networks[networkId];
    const IDOFactoryNetworkData = await IDOFactory.networks[networkId];
    const LockerFactoryNetworkData = await LockerFactory.networks[networkId];

    const hasSettingsData = (
      IDOFactoryNetworkData &&
      FeeTokenNetworkData &&
      LockerFactoryNetworkData
    )

    if (hasSettingsData && isSupportedNetwork) {
      const IDOFactoryContract = new web3.eth.Contract(
        IDOFactory.abi,
        IDOFactoryNetworkData.address
      );
      const FeeTokenContract = new web3.eth.Contract(
        FeeToken.abi,
        FeeTokenNetworkData.address
      );
      const LockerFactoryContract = new web3.eth.Contract(
        LockerFactory.abi,
        LockerFactoryNetworkData.address
      );

      return {
        web3,
        account,
        isSupportedNetwork,
        hasSettingsData,
        IDOFactory: IDOFactoryContract,
        FeeToken: FeeTokenContract,
        LockerFactory: LockerFactoryContract,
      }

    }

    return {
      web3,
      account,
      isSupportedNetwork,
      hasSettingsData,
      IDOFactory: null,
      FeeToken: null,
      LockerFactory: null,
    }

  } catch (error) {
    console.log('ConnectionError: ', error)
  }
}

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const provider = await web3Modal.connect();

    const {
      hasSettingsData,
      account,
      isSupportedNetwork,
      IDOFactory: IDOFactoryContract,
      FeeToken: FeeTokenContract,
      LockerFactory: LockerFactoryContract,
      web3,
    } = await getConnectionData(provider);

    if (hasSettingsData && isSupportedNetwork) {
      dispatch(
        connectSuccess({
          account,
          isSupportedNetwork,
          IDOFactory: IDOFactoryContract,
          FeeToken: FeeTokenContract,
          LockerFactory: LockerFactoryContract,
          web3,
        })
      );
      // Add listeners start
      provider.on("accountsChanged", (accounts) => {
        dispatch(updateAccount(accounts[0]));
      });
      provider.on("chainChanged", (chainId) => {
        dispatch(changeChainRequest());
        dispatch(changeChainId(chainId, provider));
        // clearCache();
      });
      // Add listeners end
    } else {
      web3Modal.clearCachedProvider();
      dispatch(
        connectFailed(
          !isSupportedNetwork
          ? "This network is not available, plese connect to " + networks[process.env.REACT_APP_networkID || 5].name
          : !hasSettingsData
            ? "The application is not configured with this network"
            : "Unknown error"
        )
      );
    }
  };
};

export const clearCache = () => {
  web3Modal.clearCachedProvider();
  window.location.reload();
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};

export const changeChainId = (chainId, provider) =>
  async (dispatch) => {

    const {
      hasSettingsData,
      isSupportedNetwork,
      IDOFactory: IDOFactoryContract,
      FeeToken: FeeTokenContract,
      LockerFactory: LockerFactoryContract,
      web3,
    } = await getConnectionData(provider);

    if (hasSettingsData && isSupportedNetwork) {
      dispatch(changeChain({
        isSupportedNetwork,
        IDOFactory: IDOFactoryContract,
        FeeToken: FeeTokenContract,
        LockerFactory: LockerFactoryContract,
        web3,
      }));
    } else {
      dispatch(
        connectFailed(
          !isSupportedNetwork
          ? "This network is not available, plese connect to " + networks[process.env.REACT_APP_networkID || 5].name
          : !hasSettingsData
            ? "The application is not configured with this network"
            : "Unknown error"
        )
      );
    }
  };

export const checkConnection = () =>
  (dispatch) => {
    if (web3Modal.cachedProvider) {
      dispatch(connect())
    }
  };
