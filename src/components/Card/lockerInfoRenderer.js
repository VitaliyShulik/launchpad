import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import { useLockerContract } from "../../hooks/useContract";
import * as s from "../../styles/global";
import Loader from "../Loader";

const LockerInfoRenderer = (props) => {
  const { lockerAddress } = props;
  const [loading, setLoading] = useState(false);
  const {
    triggerUpdateAccountData,
  } = useApplicationContext();

  const { account } = useWeb3React();

  const LockerContract = useLockerContract(lockerAddress, true)

  const poolContext = usePoolContext();
  let lockerInfo = poolContext.allLocker[lockerAddress];

  if (!lockerInfo) {
    return null;
  }

  const time = new Date(parseInt(lockerInfo.time) * 1000);

  const withdraw = async () => {
    setLoading(true);

    try {
      const tx = await LockerContract.withdrawTokenAll({
        from: account,
      });

      await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update lockerInfo after withdraw
    } catch (error) {
      console.log('locker withdraw Error', )
    } finally {
      setLoading(false);
    }
  };

  return (
    <s.Container flex={2} ai="center" style={{ margin: 10, minWidth: 400 }}>
      <s.Card
        style={{
          flex: 3,
        }}
      >
        {/* IDO Information */}
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Locker name</s.TextID>
          <s.TextDescriptionEllipsis>
            {lockerInfo.name}
          </s.TextDescriptionEllipsis>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Locker address</s.TextID>
          <s.TextDescription>{lockerAddress}</s.TextDescription>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Token name</s.TextID>
          <s.TextDescription>{lockerInfo.token.tokenName}</s.TextDescription>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Token address</s.TextID>
          <s.TextDescriptionEllipsis>
            {lockerInfo.token.tokenAddress}
          </s.TextDescriptionEllipsis>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Locker balance</s.TextID>
          <s.TextDescription>
            {BigNumber(lockerInfo.balance)
              .dividedBy(
                BigNumber(10 ** parseInt(lockerInfo.token.tokenDecimals))
              )
              .toFixed(2) +
              " $" +
              lockerInfo.token.tokenSymbol}
          </s.TextDescription>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Withdrawer</s.TextID>
          <s.TextDescription>{lockerInfo.withdrawer}</s.TextDescription>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Unlock time</s.TextID>
          <s.TextDescription>{time.toString()}</s.TextDescription>
        </s.Container>
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID>Status</s.TextID>
          {BigNumber(lockerInfo.time).lt(Date.now() / 1000) ? (
            <s.TextID style={{ color: "var(--primary)" }}>UNLOCKED</s.TextID>
          ) : (
            <s.TextID>
              Unlock in{" "}
              <Countdown date={parseInt(lockerInfo.time) * 1000}></Countdown>
            </s.TextID>
          )}
        </s.Container>
        <s.SpacerSmall />
        {account ? (
          <s.Container flex={1} ai="center">
            <s.button
              disabled={
                loading ||
                BigNumber(lockerInfo.balance).lte(0) ||
                !BigNumber(lockerInfo.time).lt(Date.now() / 1000) ||
                account.toLowerCase() !== lockerInfo.withdrawer.toLowerCase()
              }
              onClick={(e) => {
                e.preventDefault();
                withdraw();
              }}
            >
              {loading ? <Loader /> : "WITHDRAW" }
            </s.button>
          </s.Container>
        ) : null}
      </s.Card>
    </s.Container>
  );
};
export default LockerInfoRenderer;
