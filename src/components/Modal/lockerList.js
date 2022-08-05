import { ListItemAvatar } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import LongLocker from "../Card/longLocker";

const LockerList = (props) => {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const { tokenAddress, owner, showZero } = props;

  const allPools = usePoolContext().allLocker;
  const lockerKeys = Object.keys(allPools);

  if (!lockerKeys.length) {
    return null;
  }

  const loadmore = (amount) => {
    setLimit((p) => (p < allPools.length ? p + amount : p));
  };

  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.Container
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {lockerKeys.map((item, index) => {
            if (index >= limit || !ListItemAvatar) {
              return null;
            }
            if (!showZero) {
              if (BigNumber(allPools[item].balance).lte(0)) {
                return null;
              }
            }
            if (owner && owner !== "") {
              if (allPools[item].owner.toLowerCase() !== owner.toLowerCase()) {
                return null;
              }
            }
            if (tokenAddress && tokenAddress !== "") {
              if (
                allPools[item].token.tokenAddress.toLowerCase() !==
                tokenAddress.toLowerCase()
              ) {
                return null;
              }
            }
            return (
              <s.Container key={index} style={{ padding: 10 }}>
                <LongLocker lockerAddress={item} />
              </s.Container>
            );
          })}
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      {limit >= lockerKeys.length ? null : (
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

export default LockerList;
