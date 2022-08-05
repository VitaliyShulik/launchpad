import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as s from "../styles/global";
import { utils } from "../utils";

const Token = (props) => {
  const [address, setAddress] = useState("");
  const contract = useSelector((state) => state.contract);
  const [showZero, setShowZero] = useState(0);

  if (!contract.web3) {
    return null;
  }

  const handleShowZero = (e) => {
    setShowZero(!showZero);
  };

  return (
    <s.Container ai="center">
      <s.TextTitle>Token</s.TextTitle>
      <s.SpacerMedium />
      <TextField
        fullWidth
        label={"Search by token address "}
        onChange={async (e) => {
          e.preventDefault();
          utils.typewatch(setAddress(e.target.value), 2000);
        }}
      />
      
    </s.Container>
  );
};

export default Token;
