const initialState = {
  loading: false,
  IDOFactory: null,
  TokenLockerFactory: null,
  web3: null,
  error: false,
  errorMsg: "",
};

const contractReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_CONTRACT_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_CONTRACT_SUCCESS":
      return {
        ...initialState,
        loading: false,
        onsale: action.payload.onsale,
        IDOFactory: action.payload.IDOFactory,
        TokenLockerFactory: action.payload.TokenLockerFactory,
        web3: action.payload.web3,
      };
    case "CHECK_CONTRACT_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default contractReducer;
