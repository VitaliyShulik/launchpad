import BigNumber from "bignumber.js";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { usePoolContext } from "../../context/poolContext";
import IDOPool from "../../contracts/IDOPool.json";
import { fetchData } from "../../redux/userData/dataActions";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import { networks } from "../../utils/chainInfo";

const WithdrawETH = (props) => {
  const blockchain = useSelector((state) => state.blockchain);
  const [loading, setLoading] = useState(false);
  const { idoAddress } = props;
  const dispatch = useDispatch();

  const idoInfo = usePoolContext().allPools[idoAddress];

  if (!blockchain.account || !idoInfo || !blockchain.web3) {
    return null;
  }

  if (!utils.isValidPool(idoInfo)) {
    return null;
  }

  if (idoInfo.owner.toLowerCase() !== blockchain.account.toLowerCase()) {
    return null;
  }

  const web3 = blockchain.web3;

  const withdrawETH = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      const isNeedLocker = parseInt(idoInfo.claim) > parseInt(Date.now() / 1000);
      const lockerFactory = blockchain.LockerFactory;
      IDOPoolContract.methods
        .withdrawETH()
        .send({
          from: blockchain.account,
          value: isNeedLocker ? await lockerFactory?.methods?.fee().call() : 0,
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

  const withdrawToken = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .refundTokens()
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

  const withdrawUnsoldToken = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .withdrawNotSoldTokens()
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

  const hasEnded = parseInt(idoInfo.end) < parseInt(Date.now() / 1000);

  const { baseCurrency } = networks[process.env.REACT_APP_networkID || 5]

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>WITHDRAW</s.TextTitle>
      <s.TextID>(Pool owner only)</s.TextID>
      <s.SpacerSmall />
      {
        !hasEnded && (
          <s.Container fd="row" ai="center" jc="space-between">
            <s.Container flex={3}>
              <s.TextID>Can withdraw in</s.TextID>
            </s.Container>

            <Countdown date={idoInfo.end * 1000} />
          </s.Container>
        )
      }
      <s.SpacerMedium />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Total invested</s.TextID>
          <s.TextDescription>
            {BigNumber(web3.utils.fromWei(idoInfo.balance)).toFixed(2) +
              " " +
              baseCurrency.symbol}
          </s.TextDescription>
        </s.Container>
        <s.button
          disabled={
            !hasEnded ||
            BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ||
            idoInfo.balance == 0
          }
          onClick={(e) => {
            e.preventDefault();
            withdrawETH();
          }}
        >
          WITHDRAW
        </s.button>
      </s.Container>
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Unsold token</s.TextID>
          <s.TextDescription>
            {BigNumber(idoInfo.unsold)
              .dividedBy(10 ** idoInfo.tokenDecimals)
              .toFixed(2) +
              " " +
              idoInfo.tokenSymbol}
          </s.TextDescription>
        </s.Container>
        {BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ? (
          <s.button
            disabled={
              !hasEnded ||
              !BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ||
              (!idoInfo.unsold || idoInfo.unsold == "0")
            }
            onClick={(e) => {
              e.preventDefault();
              withdrawToken();
            }}
          >
            WITHDRAW ALL TOKEN
          </s.button>
        ) : (
          <s.button
            disabled={
              !hasEnded ||
              idoInfo.balance > 0 ||
              (!idoInfo.unsold || idoInfo.unsold == "0")
            }
            onClick={(e) => {
              e.preventDefault();
              withdrawUnsoldToken();
            }}
          >
            WITHDRAW UNSOLD TOKEN
          </s.button>
        )}
      </s.Container>
    </s.Card>
  );
};
export default WithdrawETH;
