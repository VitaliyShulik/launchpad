const initialState = {
  loading: false,
  ETHamount: -1,
  FeeTokenamount: -1,
  FeeTokenSymbol: '',
  FeeTokenApproveToFactory: -1,
  allPools: -1,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        ETHamount: action.payload.ETHamount,
        FeeTokenamount: action.payload.FeeTokenamount,
        FeeTokenSymbol: action.payload.FeeTokenSymbol,
        FeeTokenApproveToFactory: action.payload.FeeTokenApproveToFactory,
        allPools: action.payload.allPools,
      };
    case "CHECK_DATA_FAILED":
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

export default dataReducer;
