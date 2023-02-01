// log
import Web3 from "web3";
import { networks } from "../../constants/networksInfo";
import IDOFactory from "../../contracts/IDOFactory.json";
import LockerFactory from "../../contracts/TokenLockerFactory.json";

const fetchContractRequest = () => {
  return {
    type: "CHECK_CONTRACT_REQUEST",
  };
};

const fetchContractSuccess = (payload) => {
  return {
    type: "CHECK_CONTRACT_SUCCESS",
    payload: payload,
  };
};

const fetchContractFailed = (payload) => {
  return {
    type: "CHECK_CONTRACT_FAILED",
    payload: payload,
  };
};

export const fetchContract = (chainId) => {
  return (dispatch) => {
    dispatch(fetchContractRequest());

    const networkWS = networks[chainId].wsrpc;
    const IDOFactoryNetworkData = IDOFactory.networks[chainId];
    const LockerFactoryNetworkData = LockerFactory.networks[chainId];

    let web3 = new Web3(networkWS);
    try {
      if (!networkWS || !IDOFactoryNetworkData?.address || !LockerFactoryNetworkData.address) throw Error("Network is not configured");
      const IDOFactoryContract = new web3.eth.Contract(
        IDOFactory.abi,
        IDOFactoryNetworkData.address
      );
      const LockerFactoryContract = new web3.eth.Contract(
        LockerFactory.abi,
        LockerFactoryNetworkData.address
      );
      dispatch(
        fetchContractSuccess({
          IDOFactory: IDOFactoryContract,
          LockerFactory: LockerFactoryContract,
          web3,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchContractFailed("Could not load data from contract."));
    }
  };
};
