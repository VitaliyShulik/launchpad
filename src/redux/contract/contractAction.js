// log
import Web3 from "web3";
import IDOFactory from "../../contracts/IDOFactory.json";
import TokenLockerFactory from "../../contracts/TokenLockerFactory.json";

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

export const fetchContract = (chainId, networks, contracts) => {
  return (dispatch) => {
    dispatch(fetchContractRequest());

    const webSocketRPC = networks?.[chainId]?.webSocketRPC;
    const IDOFactoryAddress = contracts?.[chainId]?.IDOFactoryAddress;
    const TokenLockerFactoryAddress = contracts?.[chainId]?.TokenLockerFactoryAddress;

    try {
      if (!webSocketRPC || !IDOFactoryAddress || !TokenLockerFactoryAddress) throw Error("Network is not configured");

      const web3 = new Web3(webSocketRPC);

      const IDOFactoryContract = new web3.eth.Contract(
        IDOFactory.abi,
        IDOFactoryAddress
      );
      const LockerFactoryContract = new web3.eth.Contract(
        TokenLockerFactory.abi,
        TokenLockerFactoryAddress
      );
      dispatch(
        fetchContractSuccess({
          IDOFactory: IDOFactoryContract,
          TokenLockerFactory: LockerFactoryContract,
          web3,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchContractFailed("Could not load data from contract."));
    }
  };
};
