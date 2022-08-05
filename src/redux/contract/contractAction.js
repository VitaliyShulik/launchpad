// log
import Web3 from "web3";
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

export const fetchContract = () => {
  return async (dispatch) => {
    dispatch(fetchContractRequest());

    let web3 = new Web3(process.env.REACT_APP_WS);
    const networkId = process.env.REACT_APP_networkID;
    try {
      const IDOFactoryNetworkData = await IDOFactory.networks[networkId];
      const IDOFactoryContract = new web3.eth.Contract(
        IDOFactory.abi,
        IDOFactoryNetworkData.address
      );
      const LockerFactoryNetworkData = await LockerFactory.networks[networkId];
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
