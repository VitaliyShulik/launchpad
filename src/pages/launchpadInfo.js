import React from "react";
import { useParams } from "react-router-dom";
import PoolInfoRenderer from "../components/Card/poolInfoRenderer";
import IDOAction from "../components/Modal/idoActionModal";
import * as s from "../styles/global";

const LaunchpadInFo = () => {
  const { idoAddress } = useParams();

  return (
    <s.Container ai="center">
      <s.TextTitle>Launchpad</s.TextTitle>
      <s.SpacerMedium />
      <s.Container jc="space-around" fd="row">
        <PoolInfoRenderer idoAddress={idoAddress} />
        <IDOAction idoAddress={idoAddress} />
      </s.Container>
    </s.Container>
  );
};

export default LaunchpadInFo;
