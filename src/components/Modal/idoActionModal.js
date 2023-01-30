import { useWeb3React } from "@web3-react/core";
import React from "react";
import * as s from "../../styles/global";
import BuyTokenCard from "../Card/buyTokenCard";
import WithdrawETH from "../Card/withdrawCard";

const IDOAction = (props) => {
  const { idoAddress, flex = 1 } = props;
  const { account } = useWeb3React();

  if (!account || !idoAddress) {
    return null;
  }
  return (
    <s.Container flex={flex} ai="center">
      <BuyTokenCard idoAddress={idoAddress} />
      <WithdrawETH idoAddress={idoAddress} />
    </s.Container>
  );
};

export default IDOAction;
