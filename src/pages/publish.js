import React from "react";
import PublishForm from "../components/Form/Publish/publishForm";
import * as s from "../styles/global";

const Publish = () => {
  return (
    <s.Container ai="center">
      <s.TextTitle></s.TextTitle>
      <s.SpacerMedium />
      <PublishForm></PublishForm>
    </s.Container>
  );
};

export default Publish;
