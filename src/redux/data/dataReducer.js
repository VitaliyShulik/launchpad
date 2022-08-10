const initialState = {
  loading: false,
  ETHamount: -1,
  EBTCamount: -1,
  EBTCSymbol: '',
  EBTCApproveToFactory: -1,
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
        EBTCamount: action.payload.EBTCamount,
        EBTCSymbol: action.payload.EBTCSymbol,
        EBTCApproveToFactory: action.payload.EBTCApproveToFactory,
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
