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
      const idoFactoryAddress = await store.getState().blockchain.IDOFactory
        ._address;
      const FeeTokenamount = await store
        .getState()
        .blockchain.FeeToken.methods.balanceOf(account)
        .call();
      const FeeTokenSymbol = await store
        .getState()
        .blockchain.FeeToken.methods.symbol()
        .call();
      const FeeTokenApproveToFactory = await store
        .getState()
        .blockchain.FeeToken.methods.allowance(account, idoFactoryAddress)
        .call();
      const ethAmount = await store
        .getState()
        .blockchain.web3.eth.getBalance(account);
      dispatch(
        fetchDataSuccess({
          ETHamount: ethAmount,
          FeeTokenamount,
          FeeTokenSymbol,
          FeeTokenApproveToFactory,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
