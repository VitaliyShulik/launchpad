import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import React from "react";
import { Badge } from "react-bootstrap";
import { ETHER } from "../../constants";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import { utils } from "../../utils";
// import { getRouterName } from "../../utils/utils";
import TokenInfo from "./tokenInfo";

const PoolInfoRenderer = (props) => {
  const { idoAddress } = props;

  const { library } = useWeb3React();

  const {
    baseCurrencySymbol
  } = useApplicationContext();

  const poolContext = usePoolContext();

  let idoInfo = poolContext.allPools[idoAddress];

  if (!utils.isValidPool(idoInfo)) {
    console.log(idoInfo);
    return null;
  }

  const startDate = new Date(parseInt(idoInfo.start) * 1000);
  const endDate = new Date(parseInt(idoInfo.end) * 1000);
  const claimDate = new Date(parseInt(idoInfo.claim) * 1000);

  const isAddLiquidityEnabled = idoInfo.listingRate > 0 && idoInfo.lpPercentage > 0;

  return (
    <s.Container flex={2} ai="center" style={{ margin: 10, minWidth: 400 }}>
      <s.Card
        style={{
          flex: 3,
        }}
      >
        {/* IDO Information */}
        <s.TextTitle>IDO Information</s.TextTitle>
        {parseInt(idoInfo.end) < parseInt(Date.now() / 1000) ? (
          <Badge bg="secondary">Ended</Badge>
        ) : parseInt(idoInfo.start) < parseInt(Date.now() / 1000) ? (
          <Badge bg="success">Started</Badge>
        ) : (
          <Badge bg="secondary">Not started</Badge>
        )}
        <s.Container style={{ marginTop: 15 }} fd="row" jc="space-between">
          <s.TextID fw="700">IDO pool address</s.TextID>
          <s.TextDescriptionEllipsis>{idoAddress}</s.TextDescriptionEllipsis>
        </s.Container>
        <s.SpacerSmall />
        <s.Container fd="row" jc="space-between">
          <s.TextID fw="700">Token rate</s.TextID>
          {`${ETHER.div(idoInfo.tokenRate)} ${idoInfo.tokenSymbol}/${baseCurrencySymbol}`}
        </s.Container>
        <s.SpacerSmall />
        {
          isAddLiquidityEnabled && <s.Container fd="row" jc="space-between">
            <s.TextID fw="700">Listing rate</s.TextID>
            {`${ETHER.div(idoInfo.listingRate)} ${idoInfo.tokenSymbol}/${baseCurrencySymbol}`}
          </s.Container>
        }
        <s.SpacerSmall />
        <s.Container fd="row" jc="space-between" style={{ marginTop: 10 }}>
          <s.Card ai="center" style={{ padding: 0 }}>
            <s.TextID>Soft Cap</s.TextID>
            <s.TextDescription>
              {BigNumber(library.web3.utils.fromWei(idoInfo.softCap)).toFormat(2) +
                " " + baseCurrencySymbol}
            </s.TextDescription>
          </s.Card>
          <s.Card ai="center" style={{ padding: 0 }}>
            <s.TextID>Hard Cap</s.TextID>
            <s.TextDescription>
              {BigNumber(library.web3.utils.fromWei(idoInfo.hardCap)).toFormat(2) +
                " " + baseCurrencySymbol}
            </s.TextDescription>
          </s.Card>
          <s.Card ai="center" style={{ padding: 0 }}>
            <s.TextID>Minimum Buy</s.TextID>
            <s.TextDescription>
              {BigNumber(library.web3.utils.fromWei(idoInfo.min)).toFormat(2) +
                " " + baseCurrencySymbol}
            </s.TextDescription>
          </s.Card>
          <s.Card ai="center" style={{ padding: 0 }}>
            <s.TextID>Maximum Buy</s.TextID>
            <s.TextDescription>
              {BigNumber(library.web3.utils.fromWei(idoInfo.max)).toFormat(2) +
                " " + baseCurrencySymbol}
            </s.TextDescription>
          </s.Card>
        </s.Container>
        <s.SpacerSmall />
        {
          isAddLiquidityEnabled && <>
            <s.Container fd="row" jc="space-between">
              <s.TextID fw="700">Liquidity %</s.TextID>
              {idoInfo.lpPercentage + " %"}
            </s.Container>
            <s.SpacerSmall />
            {/* <s.Container fd="row" jc="space-between">
              <s.TextID fw="700">Router</s.TextID>
              {getRouterName(chainId)}
            </s.Container> */}
            <s.SpacerSmall />
          </>
        }
        <s.Container fd="row" jc="space-between">
          <s.TextID fw="700">Start time</s.TextID>
          {startDate.toString()}
        </s.Container>
        <s.SpacerSmall />
        <s.Container fd="row" jc="space-between">
          <s.TextID fw="700">End time</s.TextID>
          {endDate.toString()}
        </s.Container>
        <s.SpacerSmall />
        <s.Container fd="row" jc="space-between">
          <s.TextID fw="700">Lock LP until</s.TextID>
          {claimDate.toString()}
        </s.Container>
        <s.SpacerSmall />
      </s.Card>
      <s.SpacerMedium />
      <TokenInfo idoAddress={idoAddress} />
    </s.Container>
  );
};
export default PoolInfoRenderer;
