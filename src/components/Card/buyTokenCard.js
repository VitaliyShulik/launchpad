import { TextField } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import { useIDOPoolContract } from "../../hooks/useContract";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import ProgressBar from "../Modal/ProgressBar";
import PoolCountdown from "../Utils/poolCountdown";

const BuyTokenCard = (props) => {
  const { account, library } = useWeb3React();
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);
  const { idoAddress } = props;
  const {
    triggerUpdateAccountData,
    baseCurrencySymbol
  } = useApplicationContext();
  const idoInfo = usePoolContext().allPools[idoAddress];

  const IDOPoolContract = useIDOPoolContract(idoAddress);

  if (!account) {
    return null;
  }
  if (!utils.isValidPool(idoInfo)) {
    return null;
  }
  if (!idoInfo) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }
  if (!idoInfo?.userData) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }

  const buyToken = async (amount) => {
    setLoading(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.pay({
        from: account,
        value: amount,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("buyToken receipt", receipt);
    } catch (err) {
      console.log("buyToken Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    setLoading(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.claim({
        from: account,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("claimToken receipt", receipt);
    } catch (err) {
      console.log("claimToken Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const refund = async () => {
    setLoading(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.refund({
        from: account,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("refund receipt", receipt);
    } catch (err) {
      console.log("refund Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const isStarted = parseInt(idoInfo.start) < (parseInt(Date.now() / 1000));
  const hasEnded = parseInt(idoInfo.end) < (parseInt(Date.now() / 1000));

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>BUY TOKEN</s.TextTitle>
      {hasEnded ? (
        <Badge bg="secondary">Ended</Badge>
      ) : isStarted ? (
        <Badge bg="success">Started</Badge>
      ) : (
        <Badge bg="secondary">Not started</Badge>
      )}
      <s.SpacerSmall />
      <PoolCountdown start={idoInfo.start} end={idoInfo.end} />
      <s.Container fd="row" jc="space-between" style={{ marginTop: 10 }}>
        <s.Card style={{ padding: 0 }}>
          <s.TextID>{"Minimum " + baseCurrencySymbol}</s.TextID>
          <s.TextDescription>
            {BigNumber(library.web3.utils.fromWei(idoInfo.min)).toFormat(2)}
          </s.TextDescription>
        </s.Card>
        <s.Card style={{ padding: 0 }}>
          <s.TextID>Maximum {baseCurrencySymbol}</s.TextID>
          <s.TextDescription>
            {BigNumber(library.web3.utils.fromWei(idoInfo.max)).toFormat(2)}
          </s.TextDescription>
        </s.Card>
      </s.Container>
      <s.Container fd="row" jc="space-between" ai="center">
        <s.Container flex={4}>
          <s.TextID>To claim</s.TextID>
          <s.TextDescription>
            {BigNumber(idoInfo.userData.debt)
              .dividedBy(10 ** idoInfo.tokenDecimals)
              .toFixed(2) +
              " $" +
              idoInfo.tokenSymbol}
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1}>
          <s.button
            disabled={
              Date.now() / 1000 < BigNumber(idoInfo.end) ||
              BigNumber(idoInfo.userData.debt).lte(0)
            }
            onClick={(e) => {
              e.preventDefault();
              claimToken();
            }}
          >
            CLAIM
          </s.button>
        </s.Container>
      </s.Container>
      <s.Container fd="row" jc="space-between" ai="center">
        <s.Container flex={4}>
          <s.TextID>My invested {baseCurrencySymbol}</s.TextID>
          <s.TextDescription>
            {BigNumber(library.web3.utils.fromWei(idoInfo.userData.totalInvestedETH)).toFormat(
              2
            ) + " " + baseCurrencySymbol}
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1}>
          <s.button
            disabled={
              !hasEnded ||
              BigNumber(idoInfo.totalInvestedETH).gte(
                BigNumber(idoInfo.softCap)
              ) ||
              BigNumber(idoInfo.userData.totalInvestedETH).lte(0)
            }
            onClick={(e) => {
              e.preventDefault();
              refund();
            }}
          >
            REFUND
          </s.button>
        </s.Container>
      </s.Container>
      <s.TextID>Progress</s.TextID>
      <s.SpacerSmall />
      <ProgressBar now={parseInt(idoInfo.progress)} />
      <s.SpacerMedium />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={4} style={{ marginRight: 20 }}>
          <TextField
            fullWidth
            label={"Buy with " + baseCurrencySymbol}
            type={"tel"}
            onChange={(e) => {
              e.preventDefault();
              let val = BigNumber(e.target.value).absoluteValue().toFixed();
              if (!isNaN(val)) {
                setPrice(library.web3.utils.toWei(val));
              } else {
                setPrice("0");
              }
            }}
          ></TextField>
        </s.Container>
        <s.Container flex={1} ai="flex-end">
          <s.button
            disabled={
              BigNumber(price).gt(
                BigNumber(idoInfo.max).minus(
                  BigNumber(idoInfo.userData.totalInvestedETH)
                )
              ) ||
              BigNumber(idoInfo.max).lte(
                BigNumber(idoInfo.userData.totalInvestedETH)
              ) ||
              BigNumber(price).lt(BigNumber(idoInfo.min)) ||
              BigNumber(price)
                .dividedBy(BigNumber(idoInfo.price))
                .times(BigNumber(10 ** idoInfo.tokenDecimals))
                .plus(BigNumber(idoInfo.toDistributed))
                .gt(BigNumber(idoInfo.maxDistributed)) ||
              price == "0" ||
              hasEnded ||
              !isStarted
            }
            onClick={(e) => {
              e.preventDefault();
              buyToken(price);
            }}
          >
            BUY
          </s.button>
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      <s.TextID>You will recieve</s.TextID>
      {BigNumber(idoInfo.tokenRate)
        .dividedBy(BigNumber(10).pow(BigNumber(idoInfo.tokenDecimals)))
        .times(BigNumber(library.web3.utils.fromWei(price)))
        .toFormat(2)}
      {" $" + idoInfo.tokenSymbol}
    </s.Card>
  );
};
export default BuyTokenCard;
