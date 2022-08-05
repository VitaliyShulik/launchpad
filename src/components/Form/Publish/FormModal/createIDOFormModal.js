export default {
  formId: "checkoutForm",
  formField: {
    tokenAddress: {
      name: "tokenAddress",
      label: "Token address*",
      requiredErrorMsg: "Token address is required",
      invalidErrorMsg: "Contract is not valid",
    },
    isTokenValid: {
      name: "isValidToken",
      invalidErrorMsg: "Contract is not valid",
    },
    decimals: {
      name: "decimals",
      invalidErrorMsg: "Contract is not valid",
    },
    presaleRate: {
      name: "presaleRate",
      label: "Presale rate*",
      requiredErrorMsg: "Presale rate is required",
      invalidErrorMsg: "Rate cannot be 0",
    },
    whitelist: {
      name: "whitelist",
      label: "Whitelist",
      requiredErrorMsg: "Whitelist is required",
    },
    softCap: {
      name: "softCap",
      label: "Soft cap*",
      requiredErrorMsg: "Soft cap is required",
      invalidErrorMsg: "Soft cap cannot be 0",
    },
    hardCap: {
      name: "hardCap",
      label: "Hard cap*",
      requiredErrorMsg: "Hard cap is required",
      invalidErrorMsg: "Hard cap cannot be 0",
    },
    minETH: {
      name: "minETH",
      label: "Minimum Buy",
      requiredErrorMsg: "Minimum Buy is required",
      invalidErrorMsg: "Minimum Buy cannot be 0",
    },
    maxETH: {
      name: "maxETH",
      label: "Maximum Buy*",
      requiredErrorMsg: "Maximum Buy is required",
      invalidErrorMsg: "Minimum Buy cannot be 0)",
    },
    refundType: {
      name: "refundType",
      label: "Refund type*",
      requiredErrorMsg: "Country is required",
    },
    router: {
      name: "router",
      label: "Routers",
      requiredErrorMsg: "Country is required",
    },
    liquidityPercentage: {
      name: "liquidityPercentage",
      label: "Liquidity %*",
      requiredErrorMsg: "Name on card is required",
    },
    listingRate: {
      name: "listingRate",
      label: "Listing rate*",
      requiredErrorMsg: "Card number is required",
      invalidErrorMsg: "Card number is not valid (e.g. 4111111111111)",
    },
    start: {
      name: "start",
      label: "Start time*",
      requiredErrorMsg: "Expiry date is required",
      invalidErrorMsg: "Expiry date is not valid",
    },
    end: {
      name: "end",
      label: "End time*",
      requiredErrorMsg: "CVV is required",
      invalidErrorMsg: "CVV is invalid (e.g. 357)",
    },
    unlock: {
      name: "unlock",
      label: "Unlock time*",
      requiredErrorMsg: "CVV is required",
      invalidErrorMsg: "CVV is invalid (e.g. 357)",
    },
  },
};
