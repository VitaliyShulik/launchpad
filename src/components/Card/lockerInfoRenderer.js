import BigNumber from "bignumber.js";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import Locker from "../../contracts/TokenLocker.json";
import * as s from "../../styles/global";

const LockerInfoRenderer = (props) => {
  const { lockerAddress } = props;
  const [loading, setLoading] = useState(false);
  const {
    triggerUpdateAccountData,
  } = useApplicationContext();
  const blockchain = useSelector((state) => state.blockchain);

  const poolContext = usePoolContext();
  let lockerInfo = poolContext.allLocker[lockerAddress];

  if (!lockerInfo) {
    return null;
  }

  const time = new Date(parseInt(lockerInfo.time) * 1000);

  const withdraw = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    const LockerContract = await new web3.eth.Contract(
      Locker.abi,
      lockerAddress
    );
    LockerContract.methods
      .withdrawTokenAll()
      .send({
        from: blockchain.account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        triggerUpdateAccountData();
      });
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
        {blockchain.account ? (
          <s.Container flex={1} ai="center">
            <s.button
              disabled={
                BigNumber(lockerInfo.balance).lte(0) ||
                !BigNumber(lockerInfo.time).lt(Date.now() / 1000) ||
                blockchain.account.toLowerCase() !== lockerInfo.withdrawer.toLowerCase()
              }
              onClick={(e) => {
                e.preventDefault();
                withdraw();
              }}
            >
              WITHDRAW
            </s.button>
          </s.Container>
        ) : null}
      </s.Card>
    </s.Container>
  );
};
export default LockerInfoRenderer;
