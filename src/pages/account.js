import { Checkbox } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import CreateLaunchpad from "../components/Button/createLaunchpad";
import CreateLocker from "../components/Button/createLocker";
import LockerList from "../components/Modal/lockerList";
import LongIdoList from "../components/Modal/longIdoList";
import { useApplicationContext } from "../context/applicationContext";
import * as s from "../styles/global";

const Account = () => {
  const { account } = useWeb3React();
  const [showZero, setShowZero] = useState(0);

  const { domainSettings: { isLockerEnabled } } = useApplicationContext();

  if (!account) {
    return (
      <s.Container ai="center">
        <s.TextTitle>Account</s.TextTitle>
        <s.TextDescription>Please login</s.TextDescription>
      </s.Container>
    );
  }

  const handleShowZero = (e) => {
    setShowZero(!showZero);
  };

  return (
    <s.Container ai="center">
      <s.TextTitle>Account</s.TextTitle>
      <s.SpacerMedium />
      <s.Container fd="row" jc="space-between">
        <s.Container flex={1}>
          <s.Container fd="row" ai="center" jc="space-between">
            <s.TextTitle style={{ flex: 1, whiteSpace: "nowrap", margin: 20 }}>
              My IDO
            </s.TextTitle>
            <CreateLaunchpad />
          </s.Container>
          <LongIdoList />
        </s.Container>

        {
          isLockerEnabled &&
          <s.Container flex={1}>
            <s.Container fd="row" ai="center" jc="space-between">
              <s.TextTitle style={{ flex: 1, whiteSpace: "nowrap", margin: 20 }}>
                My Locker
              </s.TextTitle>
              <CreateLocker />
            </s.Container>
            <s.Container fd="row" flex={1}>
              <s.Container flex={4}></s.Container>
              <s.Container flex={2} ai="center" fd="row" jc="center">
                <s.TextDescription>show zero?</s.TextDescription>
                <Checkbox value={showZero} onChange={handleShowZero} />
              </s.Container>
            </s.Container>
            <LockerList showZero={showZero} showUserLockers />
          </s.Container>
        }
      </s.Container>
    </s.Container>
  );
};

export default Account;
