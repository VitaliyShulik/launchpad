import { Checkbox, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LockerList from "../components/Modal/lockerList";
import * as s from "../styles/global";
import { utils } from "../utils";

const Locker = (props) => {
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
      <s.TextTitle>Locker</s.TextTitle>
      <s.SpacerMedium />
      <s.Container fd="row">
        <s.Container flex={7}></s.Container>
        <s.Container flex={2} ai="center" fd="row" jc="center">
          show zero?
          <Checkbox value={showZero} onChange={handleShowZero} />
        </s.Container>
      </s.Container>
      <TextField
        fullWidth
        label={"Search by token address "}
        onChange={async (e) => {
          e.preventDefault();
          utils.typewatch(setAddress(e.target.value), 2000);
        }}
      />
      <LockerList showZero={showZero} tokenAddress={address} />
    </s.Container>
  );
};

export default Locker;
