import React, { useState } from "react";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import LongIdo from "../Card/longIdo";
import PoolRenderer from "../Card/poolRenderer";

const LongIdoList = () => {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const { userPoolAddresses, allPools } = usePoolContext();
  const { domainSettings: { isLockerEnabled } } = useApplicationContext();

  // sort IDOs by start time
  userPoolAddresses.sort((a, b) => allPools[b]?.start - allPools[a]?.start);

  const loadmore = (amount) => {
    setLimit((p) => (p < userPoolAddresses.length ? p + amount : p));
  };

  return (
    <s.Container ai="center">
      <s.Container ai="center">

      {
        isLockerEnabled ?
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
        </s.Container> :
        <s.Container
          fd="row"
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {userPoolAddresses.map((poolAddress, index) => {
              if (index >= limit) {
                return null;
              }
              return <PoolRenderer key={index} pool={allPools[poolAddress]}/>;
            })}
        </s.Container>
      }
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
