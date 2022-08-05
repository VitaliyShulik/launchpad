import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import ReadMore from "../Form/readMore";
import SocialMediaModal from "../Modal/socialmediaModal";

const TokenInfo = (props) => {
  const contract = useSelector((state) => state.contract);
  const [image, setImage] = useState(null);
  let imageSolid = require("../../assets/images/image-solid.png");
  const { idoAddress } = props;

  const idoInfo = usePoolContext().allPools[idoAddress];

  useEffect(() => {
    setImage(idoInfo.metadata.image);
  }, [idoInfo]);

  if (!idoInfo) {
    return null;
  }

  return (
    <s.Card
      style={{
        flex: 1,
        margin: 0,
      }}
    >
      <s.Container
        fd="row"
        ai="center"
        jc="center"
        style={{ flexWrap: "wrap" }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "var(--upper-card)",
            width: 140,
            height: 140,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <img
            style={{ width: 100, height: 100, borderRadius: 20 }}
            src={image}
            onError={(e) => {
              setImage(imageSolid.default);
            }}
          ></img>
        </div>
        <s.Container
          ai="flex-start"
          jc="center"
          style={{ paddingLeft: 20, marginBottom: 20 }}
        >
          <s.TextDescription
            style={{ textAlign: "center", fontSize: 26 }}
            fs={"30px"}
            fw={"bold"}
            style={{ whiteSpace: "nowrap" }}
          >
            {idoInfo.tokenName}
          </s.TextDescription>
          <s.TextID>${idoInfo.tokenSymbol}</s.TextID>
        </s.Container>
        <SocialMediaModal
          website={idoInfo.metadata.links.website}
          discord={idoInfo.metadata.links.discord}
          telegram={idoInfo.metadata.links.telegram}
          twitter={idoInfo.metadata.links.twitter}
        />
      </s.Container>
      <s.SpacerSmall />
      <s.Container fd="row" jc="space-between">
        <s.TextID fw="700">Token address</s.TextID>
        <s.TextDescriptionEllipsis>
          {idoInfo.tokenAddress}
        </s.TextDescriptionEllipsis>
      </s.Container>
      <s.SpacerSmall />
      <s.Container fd="row" jc="space-between">
        <s.TextID fw="700">Decimals</s.TextID>
        {idoInfo.tokenDecimals}
      </s.Container>
      <s.SpacerSmall />
      <s.Container fd="row" jc="space-between">
        <s.TextID fw="700">Total Supply</s.TextID>
        {BigNumber(idoInfo.totalSupply)
          .dividedBy(10 ** parseInt(idoInfo.tokenDecimals))
          .toFormat()}{" "}
        ${idoInfo.tokenSymbol}
      </s.Container>
      <s.SpacerSmall />
      <s.TextID fw="700">Description</s.TextID>
      <ReadMore>{idoInfo.metadata.description}</ReadMore>
    </s.Card>
  );
};
export default TokenInfo;
