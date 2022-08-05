import * as Yup from "yup";
import createIDOFormModal from "./createIDOFormModal";
const {
  formField: {
    tokenAddress,
    isTokenValid,
    presaleRate,
    whitelist,
    softCap,
    hardCap,
    minETH,
    maxETH,
    refundType,
    router,
    liquidityPercentage,
    listingRate,
    start,
    end,
    unlock,
  },
} = createIDOFormModal;

const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;

export default [
  Yup.object().shape({
    [tokenAddress.name]: Yup.string().required(
      `${tokenAddress.requiredErrorMsg}`
    ),
  }),
  Yup.object().shape({}),
  Yup.object().shape({}),
];
