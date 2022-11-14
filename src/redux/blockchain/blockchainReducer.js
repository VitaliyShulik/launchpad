const initialState = {
  loading: false,
  account: null,
  FeeToken: null,
  IDOFactory: null,
  LockerFactory: null,
  web3: null,
  chainId: null,
  errorMsg: "",
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        FeeToken: action.payload.FeeToken,
        IDOFactory: action.payload.IDOFactory,
        LockerFactory: action.payload.LockerFactory,
        web3: action.payload.web3,
        chainId: action.payload.chainId,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
      };
    case "CHANGE_CHAIN_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "CHANGE_CHAIN":
      return {
        ...state,
        loading: false,
        isSupportedNetwork: action.payload.isSupportedNetwork,
        FeeToken: action.payload.FeeToken,
        IDOFactory: action.payload.IDOFactory,
        LockerFactory: action.payload.LockerFactory,
        web3: action.payload.web3,
        chainId: action.payload.chainId,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
