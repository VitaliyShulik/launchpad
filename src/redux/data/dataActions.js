// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let idoFactoryAddress = await store.getState().blockchain.IDOFactory
        ._address;
      let EBTCamount = await store
        .getState()
        .blockchain.EBTC.methods.balanceOf(account)
        .call();
      let EBTCApproveToFactory = await store
        .getState()
        .blockchain.EBTC.methods.allowance(account, idoFactoryAddress)
        .call();
      let ethAmount = await store
        .getState()
        .blockchain.web3.eth.getBalance(account);
      dispatch(
        fetchDataSuccess({
          ETHamount: ethAmount,
          EBTCamount: EBTCamount,
          EBTCApproveToFactory: EBTCApproveToFactory,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
