import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { usePoolContext } from "../../context/poolContext";
import { getValidImageUrl } from "../../utils/utils";
import * as s from "../../styles/global";
import ReadMore from "../Form/readMore";
import SocialMediaModal from "../Modal/socialmediaModal";

import imageSolid from "../../assets/images/image-solid.png"
import { useApplicationContext } from "../../context/applicationContext";

const TokenInfo = (props) => {
  const [image, setImage] = useState(null);
  const { idoAddress } = props;

  const {
    domainSettings: {
      ipfsInfuraDedicatedGateway
    }
  } = useApplicationContext();

  const idoInfo = usePoolContext().allPools[idoAddress];

  useEffect(() => {
    if (idoInfo?.metadata?.image || idoInfo?.metadata?.imageHash) {
      setImage(getValidImageUrl(idoInfo?.metadata?.image || idoInfo?.metadata?.imageHash, ipfsInfuraDedicatedGateway));
    }
  }, [idoInfo, idoInfo.metadata.image, idoInfo.metadata.imageHash, ipfsInfuraDedicatedGateway]);

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
            onError={() => {
              setImage(imageSolid);
            }}
          ></img>
        </div>
        <s.Container
          ai="flex-start"
          jc="center"
          style={{ paddingLeft: 20, marginBottom: 20 }}
        >
          <s.TextDescription
            style={{ textAlign: "center", fontSize: 26, whiteSpace: "nowrap" }}
            fs={"30px"}
            fw={"bold"}
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
