import React from "react";
import * as s from "../../styles/global";
import Decimal from "../Decimal";

const Overall = (props) => {
  return (
    <s.Container className="Fontcard" style={{ padding: 30 }}>
      <s.TextTitle>Dashboard</s.TextTitle>
      <s.SpacerLarge></s.SpacerLarge>
      {props.market.feePool >= 0 ? (
        <s.Container
          ai="center"
          jc="space-evenly"
          fd="row"
          style={{ flexWrap: "wrap" }}
        >
          <s.TextDescription>
            Fee Pool:{" "}
            <Decimal number={props.market.feePool} currency={"FeeToken"} />
          </s.TextDescription>
          <s.TextDescription>
            Mining Pool:{" "}
            <Decimal number={props.market.remainingFeeToken} currency={"FeeToken"} />
          </s.TextDescription>
          <s.TextDescription>
            {process.env.REACT_APP_Native} Pool:{" "}
            <Decimal
              number={props.market.remainingEthers}
              currency={process.env.REACT_APP_Native}
            />
          </s.TextDescription>
        </s.Container>
      ) : (
        "Loading..."
      )}
    </s.Container>
  );
};
export default Overall;
