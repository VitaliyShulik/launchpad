import React, { useEffect, useState } from "react";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import PoolRenderer from "../Card/poolRenderer";

const IDOList = (props) => {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const { allPools } = usePoolContext();
  // sort IDOs by start time
  const poolKeys = Object.keys(allPools).sort((a, b) => allPools[b]?.start - allPools[a]?.start);

  const { owner, tokenAddress } = props;

  useEffect(() => {
    console.log("allPools", allPools);
  }, [allPools]);

  const loadmore = (amount) => {
    setLimit((p) => (p < allPools.length ? p + amount : p));
  };

  if (!poolKeys.length || !allPools) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }

  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.Container
          fd="row"
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {poolKeys.map((item, index) => {
            if (index >= limit) {
              return null;
            }
            if (owner && owner !== "") {
              if (allPools[item].owner.toLowerCase() !== owner.toLowerCase()) {
                return null;
              }
            }
            if (tokenAddress && tokenAddress !== "") {
              if (
                allPools[item].tokenAddress.toLowerCase() !==
                tokenAddress.toLowerCase()
              ) {
                return null;
              }
            }
            return (
              <PoolRenderer key={index} pool={allPools[item]}></PoolRenderer>
            );
          })}
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      {limit >= poolKeys.length ? null : (
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

export default IDOList;
