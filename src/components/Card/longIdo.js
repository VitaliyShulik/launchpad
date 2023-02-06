import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { usePoolContext } from "../../context/poolContext";
import { useApplicationContext } from "../../context/applicationContext";
import { getValidImageUrl } from "../../utils/utils";
import * as s from "../../styles/global";
import ProgressBar from "../Modal/ProgressBar";
import PoolCountdown from "../Utils/poolCountdown";

import imageSolid from "../../assets/images/image-solid.png"

const LongIdo = (props) => {
  const {
    domainSettings: {
      ipfsInfuraDedicatedGateway
    }
  } = useApplicationContext();
  const [image, setImage] = useState("");
  const { idoAddress } = props;

  const idoInfo = usePoolContext().allPools[idoAddress];

  useEffect(() => {
    if (idoInfo?.metadata?.image || idoInfo?.metadata?.imageHash) {
      setImage(getValidImageUrl(idoInfo?.metadata?.image || idoInfo?.metadata?.imageHash, ipfsInfuraDedicatedGateway));
    }
  }, [idoInfo, idoInfo.metadata.image, idoInfo.metadata.imageHash, ipfsInfuraDedicatedGateway]);

  if (!idoInfo) {
    return (
      <s.Card
        ai="center"
        style={{ maxWidth: 500, margin: 20, minWidth: 400 }}
      ></s.Card>
    );
  }

  return (
    <NavLink
      to={"/launchpad/" + idoAddress}
      style={{
        textDecoration: "none",
        color: "white",
        width: "100%",
      }}
    >
      <s.Container>
        <s.Card
          fd="row"
          p={"20px"}
          ai="center"
          style={{ width: "100%" }}
          jc="space-between"
        >
          <s.Container
            flex={3}
            fd={"row"}
            ai="center"
            style={{ flexWrap: "nowrap" }}
          >
            <img
              style={{ width: 60, height: 60, borderRadius: 10 }}
              src={image}
              onError={(e) => {
                setImage(imageSolid);
              }}
            ></img>
            <s.Container flex={1} ai="flex-start" style={{ paddingLeft: 20 }}>
              <s.TextDescription>{idoInfo.tokenName}</s.TextDescription>
              <s.TextID>${idoInfo.tokenSymbol}</s.TextID>
            </s.Container>
          </s.Container>

          <s.Container flex={1} ai="flex-end">
            <PoolCountdown start={idoInfo.start} end={idoInfo.end} />
          </s.Container>
          <ProgressBar
            now={idoInfo.progress}
          />
        </s.Card>
      </s.Container>
    </NavLink>
  );
};
export default LongIdo;
