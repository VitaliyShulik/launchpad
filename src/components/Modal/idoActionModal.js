import React from "react";
import { useSelector } from "react-redux";
import * as s from "../../styles/global";
import BuyTokenCard from "../Card/buyTokenCard";
import WithdrawETH from "../Card/withdrawCard";

const IDOAction = (props) => {
  const { idoAddress, flex = 1 } = props;
  const blockchain = useSelector((state) => state.blockchain);

  if (!blockchain.account || !idoAddress) {
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
