import BigNumber from "bignumber.js";
import React from "react";
import Countdown from "react-countdown";
import { NavLink } from "react-router-dom";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";

const LongLocker = (props) => {
  const { lockerAddress } = props;
  const lockerInfo = usePoolContext().allLocker[lockerAddress];

  if (!lockerInfo) {
    return (
      <s.Card
        ai="center"
        style={{ maxWidth: 500, margin: 20, minWidth: 400 }}
      ></s.Card>
    );
  }

  return (
    <NavLink
      to={"/locker/" + lockerAddress}
      style={{
        textDecoration: "none",
        color: "white",
        width: "100%",
      }}
    >
      <s.Card
        fd="row"
        p={"20px"}
        style={{ maxWidth: "100%" }}
        jc="space-between"
      >
        <s.Container flex={1}>
          <s.TextDescription>{lockerInfo.name}</s.TextDescription>
          <s.TextID>{lockerInfo.token.tokenSymbol}</s.TextID>
        </s.Container>
        <s.Container flex={1} ai="flex-end">
          <s.TextDescription>
            {BigNumber(lockerInfo.balance)
              .dividedBy(
                BigNumber(10 ** parseInt(lockerInfo.token.tokenDecimals))
              )
              .toFixed(2) +
              " $" +
              lockerInfo.token.tokenSymbol}
          </s.TextDescription>
          {BigNumber(lockerInfo.time).lt(Date.now() / 1000) ? (
            <s.TextID style={{ color: "var(--primary)" }}>UNLOCKED</s.TextID>
          ) : (
            <s.TextID>
              <Countdown date={parseInt(lockerInfo.time) * 1000}></Countdown>
            </s.TextID>
          )}
        </s.Container>
      </s.Card>
    </NavLink>
  );
};
export default LongLocker;
