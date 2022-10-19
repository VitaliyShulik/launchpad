import BigNumber from "bignumber.js";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "react-bootstrap";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getValidImageUrl } from "../../utils/utils";
import * as s from "../../styles/global";
import ProgressBar from "../Modal/ProgressBar";

import imageSolid from "../../assets/images/image-solid.png"
import { networks } from "../../utils/chainInfo";

const PoolRenderer = (props) => {
  const contract = useSelector((state) => state.contract);
  const [image, setImage] = useState("");
  const { pool: idoInfo } = props;

  const card = useRef(null);

  const isStarted = parseInt(idoInfo.start) < (parseInt(Date.now() / 1000));
  const hasEnded = parseInt(idoInfo.end) < (parseInt(Date.now() / 1000));
  const { baseCurrency } = networks[process.env.REACT_APP_networkID || 5]

  useEffect(async () => {
    setImage(getValidImageUrl(idoInfo.metadata.image));
  }, [idoInfo]);

  // if (!utils.isValidPool(idoInfo) || !idoInfo) {
  //   return (
  //     <s.Card
  //       ref={card}
  //       ai="center"
  //       style={{ maxWidth: 500, margin: 20, minWidth: 400 }}
  //     >
  //       Loading
  //     </s.Card>
  //   );
  // }

  return (
    <s.Card ref={card} style={{ maxWidth: 500, margin: 20, minWidth: 400 }}>
      <NavLink
        to={"/launchpad/" + idoInfo.idoAddress}
        style={{
          textDecoration: "none",
          color: "white",
          width: "100%",
        }}
      >
        <s.UpperCard fd="row" jc="space-between" ai="center">
          <s.Container flex={1} ai="center">
            <img
              style={{ width: 100, height: 100, borderRadius: 20 }}
              src={image}
              onError={(e) => {
                setImage(imageSolid);
              }}
            ></img>
          </s.Container>
          <s.SpacerSmall />
          <s.Container flex={3} ai="center" style={{ paddingLeft: 5 }}>
            <s.TextDescriptionEllipsis
              style={{ textAlign: "center" }}
              fs={"26px"}
            >
              {idoInfo.tokenName}
            </s.TextDescriptionEllipsis>
            <s.TextID>${idoInfo.tokenSymbol}</s.TextID>
          </s.Container>
        </s.UpperCard>
        <s.SpacerSmall />
        <s.Container fd="row" jc="flex-start">
          {hasEnded ? (
            <Badge bg="secondary">Ended</Badge>
          ) : isStarted ? (
            <Badge bg="success">Started</Badge>
          ) : (
            <Badge bg="secondary">Not started</Badge>
          )}
        </s.Container>
        <s.SpacerXSmall />
        <s.TextID>Description</s.TextID>
        <s.TextField>
          <s.TextDescription>{idoInfo.metadata.description}</s.TextDescription>
          <s.BlurTextField></s.BlurTextField>
        </s.TextField>
        <s.SpacerSmall />
        <s.Container fd="row">
          <s.Container ai="center" flex={1}>
            <s.TextID fullWidth>Soft cap</s.TextID>
            {BigNumber(contract.web3.utils.fromWei(idoInfo.softCap)).toFormat(
              2
            ) +
              " " +
              baseCurrency.symbol}
          </s.Container>
          <s.Container ai="center" flex={1}>
            <s.TextID fullWidth>Hard cap</s.TextID>
            {BigNumber(contract.web3.utils.fromWei(idoInfo.hardCap)).toFormat(
              2
            ) +
              " " +
              baseCurrency.symbol}
          </s.Container>
        </s.Container>
        <s.SpacerSmall />
        {
          !hasEnded && (
            <>
              <s.TextID>
                {isStarted
                  ? "End in"
                  : "Start in"}
              </s.TextID>
              <Countdown
                date={
                  isStarted
                    ? parseInt(idoInfo.end) * 1000
                    : parseInt(idoInfo.start) * 1000
                }
              />
            </>
          )
        }
        <s.TextID>Progress</s.TextID>
        <ProgressBar now={idoInfo.progress} />
      </NavLink>
    </s.Card>
  );
};
export default PoolRenderer;
