import React from "react";
import { useParams } from "react-router-dom";
import LockerInfoRenderer from "../components/Card/lockerInfoRenderer";
import * as s from "../styles/global";

const LockerInfo = () => {
  const { lockerAddress } = useParams();

  return (
    <s.Container ai="center">
      <s.TextTitle>Locker Information</s.TextTitle>
      <s.SpacerMedium />
      <s.Container jc="space-around" fd="row">
        {/* TODO: add loader depends on fetching all lockers */}
        <LockerInfoRenderer lockerAddress={lockerAddress} />
      </s.Container>
    </s.Container>
  );
};

export default LockerInfo;
