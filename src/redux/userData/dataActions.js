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

const fetchUserData = async (account) => {
  const {
    IDOFactory,
    FeeToken,
    web3,
  } = store.getState().blockchain

  const idoFactoryAddress = IDOFactory._address;

  const FeeTokenamount = await FeeToken.methods.balanceOf(account).call();
  const FeeTokenSymbol = await FeeToken.methods.symbol().call();
  const FeeTokenApproveToFactory = await FeeToken.methods.allowance(account, idoFactoryAddress).call();

  const ETHamount = await web3.eth.getBalance(account);

  return {
    FeeTokenamount,
    FeeTokenSymbol,
    FeeTokenApproveToFactory,
    ETHamount,
  }
}

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      dispatch(
        fetchDataSuccess(await fetchUserData(account))
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
