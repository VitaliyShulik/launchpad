import React from "react";
import * as s from "../../styles/global";
import { networks } from "../../utils/chainInfo";

const PreviewForm = (props) => {
  const { baseCurrency } = networks[process.env.REACT_APP_networkID || 5]
  return (
    <s.Container>
      <s.TextTitle style={{ width: 640 }}>Preview</s.TextTitle>
      <s.TextDescription>Contract address</s.TextDescription>
      <s.Input readOnly></s.Input>
      <s.TextDescription>Price</s.TextDescription>
      <s.Input readOnly></s.Input>
      <s.TextDescription>Start date</s.TextDescription>
      <s.Input readOnly type={"date"} placeholder="start date"></s.Input>
      <s.TextDescription>End date</s.TextDescription>
      <s.Input readOnly type={"date"} placeholder="end date"></s.Input>
      <s.TextDescription>Claim date</s.TextDescription>
      <s.Input readOnly type={"date"} placeholder="end date"></s.Input>
      <s.Container
        fd="row"
        jc="space-between"
        style={{ marginTop: 20, flexWrap: "wrap" }}
      >
        <s.TextDescription>
          Min {baseCurrency.symbol} Purchase
        </s.TextDescription>
        <s.Input readOnly />
        <s.TextDescription>
          Max {baseCurrency.symbol} Purchase
        </s.TextDescription>
        <s.Input readOnly />
      </s.Container>
      <s.TextDescription>Max token distributed</s.TextDescription>
      <s.Input readOnly />
    </s.Container>
  );
};
export default PreviewForm;
