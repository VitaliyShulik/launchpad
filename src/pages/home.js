import React from "react";
import * as s from "../styles/global";

const Home = (props) => {
  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.TextDescription fs={"89px"}>NEXTCUBATOR</s.TextDescription>
        <s.TextDescription style={{ textAlign: "center" }}>
          Decentralize IDO launchpad platform
        </s.TextDescription>
        <s.SpacerLarge />
        <s.TextDescription>{/* - Isaak Solovev - */}</s.TextDescription>
      </s.Container>
    </s.Container>
  );
};

export default Home;
