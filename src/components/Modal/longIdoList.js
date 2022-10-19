import React, { useState } from "react";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import LongIdo from "../Card/longIdo";

const LongIdoList = (props) => {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const { userPoolAddresses, allPools } = usePoolContext();

  // sort IDOs by start time
  userPoolAddresses.sort((a, b) => allPools[b]?.start - allPools[a]?.start);

  const loadmore = (amount) => {
    setLimit((p) => (p < userPoolAddresses.length ? p + amount : p));
  };

  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.Container
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {userPoolAddresses.map((poolAddress, index) => {
              if (index >= limit) {
                return null;
              }
              return (
                <s.Container key={index} style={{ padding: 10 }}>
                  <LongIdo idoAddress={poolAddress} />
                </s.Container>
              );
            })}
        </s.Container>

      </s.Container>
      <s.SpacerSmall />
      {limit >= userPoolAddresses.length ? null : (
        <s.button
          onClick={async (e) => {
            e.preventDefault();
            setLoading(true);
            await utils.timeout(1000);
            loadmore(6);
            setLoading(false);
          }}
        >
          {loading ? "LOADING . . ." : "LOADMORE"}
        </s.button>
      )}
    </s.Container>
  );
};

export default LongIdoList;
