import { TextField } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { usePoolContext } from "../../context/poolContext";
import IDOPool from "../../contracts/IDOPool.json";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import ProgressBar from "../Modal/ProgressBar";
import PoolCountdown from "../Utils/poolCountdown";

const BuyTokenCard = (props) => {
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);
  const { idoAddress } = props;
  const dispatch = useDispatch();
  const currency = " " + process.env.REACT_APP_CURRENCY;
  const idoInfo = usePoolContext().allPools[idoAddress];
  const [userData, setUserData] = useState(null);

  useEffect(async () => {
    if (blockchain.account && blockchain.web3 && idoAddress !== "") {
      try {
        await utils
          .loadUserData(idoAddress, blockchain.web3, blockchain.account)
          .then((e) => {
            setUserData(e);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }, [idoAddress, blockchain.account, data.ETHamount]);

  if (!blockchain.account) {
    return null;
  }
  if (!utils.isValidPool(idoInfo)) {
    return null;
  }
  if (!idoInfo) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }
  if (!userData) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }
  const web3 = blockchain.web3;

  const buyToken = async (amount) => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .pay()
        .send({
          from: blockchain.account,
          value: amount,
        })
        .once("error", (err) => {
          setLoading(false);
          console.log(err);
        })
        .then((receipt) => {
          setLoading(false);
          console.log(receipt);
          dispatch(fetchData(blockchain.account));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const claimToken = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .claim()
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
          dispatch(fetchData(blockchain.account));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const refund = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .claimETH()
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
          dispatch(fetchData(blockchain.account));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const isStarted = parseInt(idoInfo.start) < (parseInt(Date.now() / 1000));
  const isEnded = parseInt(idoInfo.end) < (parseInt(Date.now() / 1000));

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>BUY TOKEN</s.TextTitle>
      {isEnded ? (
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
          <s.TextID>{"Minimum" + currency}</s.TextID>
          <s.TextDescription>
            {BigNumber(web3.utils.fromWei(idoInfo.min)).toFormat(2)}
          </s.TextDescription>
        </s.Card>
        <s.Card style={{ padding: 0 }}>
          <s.TextID>Maximum{currency}</s.TextID>
          <s.TextDescription>
            {BigNumber(web3.utils.fromWei(idoInfo.max)).toFormat(2)}
          </s.TextDescription>
        </s.Card>
      </s.Container>
      <s.Container fd="row" jc="space-between" ai="center">
        <s.Container flex={4}>
          <s.TextID>To claim</s.TextID>
          <s.TextDescription>
            {BigNumber(userData.debt)
              .dividedBy(10 ** idoInfo.tokenDecimals)
              .toFixed(2) +
              " $" +
              idoInfo.tokenSymbol}
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1}>
          <s.button
            disabled={
              Date.now() / 1000 < BigNumber(idoInfo.claim) ||
              BigNumber(userData.debt).lte(0)
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
          <s.TextID>My invested {process.env.REACT_APP_CURRENCY}</s.TextID>
          <s.TextDescription>
            {BigNumber(web3.utils.fromWei(userData.totalInvestedETH)).toFormat(
              2
            ) + currency}
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1}>
          <s.button
            disabled={
              !isEnded ||
              BigNumber(idoInfo.totalInvestedETH).gt(
                BigNumber(idoInfo.softCap)
              ) ||
              BigNumber(userData.totalInvestedETH).lte(0)
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
            label={"Buy with" + currency}
            type={"tel"}
            onChange={(e) => {
              e.preventDefault();
              let val = BigNumber(e.target.value).absoluteValue().toFixed();
              if (!isNaN(val)) {
                setPrice(web3.utils.toWei(val));
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
                  BigNumber(userData.totalInvestedETH)
                )
              ) ||
              BigNumber(idoInfo.max).lte(
                BigNumber(userData.totalInvestedETH)
              ) ||
              BigNumber(price).lt(BigNumber(idoInfo.min)) ||
              BigNumber(price)
                .dividedBy(BigNumber(idoInfo.price))
                .times(BigNumber(10 ** idoInfo.tokenDecimals))
                .plus(BigNumber(idoInfo.toDistributed))
                .gt(BigNumber(idoInfo.maxDistributed)) ||
              price == "0" ||
              isEnded ||
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
        .times(BigNumber(web3.utils.fromWei(price)))
        .toFormat(2)}
      {" $" + idoInfo.tokenSymbol}
    </s.Card>
  );
};
export default BuyTokenCard;
