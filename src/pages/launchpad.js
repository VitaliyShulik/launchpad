import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import IDOList from "../components/Modal/idoList";
import { usePoolContext } from "../context/poolContext";
import * as s from "../styles/global";
import { utils } from "../utils";

const Launchpad = (props) => {
  const [address, setAddress] = useState("");
  const contract = useSelector((state) => state.contract);
  const poolContext = usePoolContext();

  if (!contract.web3) {
    return null;
  }

  return (
    <s.Container ai="center">
      <s.TextTitle>Launchpad</s.TextTitle>
      <s.SpacerMedium />
      <TextField
        fullWidth
        label={"Search by token address "}
        onChange={async (e) => {
          e.preventDefault();
          await utils.typewatch(2000);
          setAddress(e.target.value);
        }}
      />
      <IDOList tokenAddress={address} />
    </s.Container>
  );
};

export default Launchpad;
