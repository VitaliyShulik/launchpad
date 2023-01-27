import React from "react";
import LockTokenForm from "../components/Form/lockTokenForm";
import * as s from "../styles/global";

const LockToken = () => {
  return (
    <s.Container ai="center">
      <s.TextTitle></s.TextTitle>
      <s.SpacerMedium />
      <LockTokenForm />
    </s.Container>
  );
};

export default LockToken;
