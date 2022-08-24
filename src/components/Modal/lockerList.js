import { ListItemAvatar } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { usePoolContext } from "../../context/poolContext";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import LongLocker from "../Card/longLocker";

const LockerList = (props) => {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [lockersAddresses, setLockersAddresses] = useState([])

  const { tokenAddress, owner, showZero, showUserLockers } = props;

  const { allLocker, allLockerAddress, userLockersAddresses } = usePoolContext();


  useEffect(() => {
    setLockersAddresses(showUserLockers ? userLockersAddresses : allLockerAddress);
  }, [showUserLockers, userLockersAddresses, allLockerAddress]);

  if (!lockersAddresses.length) {
    return null;
  }

  // sort lockers by unlock time
  lockersAddresses.sort((a, b) => allLocker[b]?.time - allLocker[a]?.time);

  const loadmore = (amount) => {
    setLimit((p) => (p < lockersAddresses.length ? p + amount : p));
  };

  return (
    <s.Container ai="center">
      <s.Container ai="center">
        <s.Container
          jc="space-around"
          style={{ flexWrap: "wrap", marginTop: 20 }}
        >
          {lockersAddresses.map((lockerAddress, index) => {
            if (index >= limit || !ListItemAvatar) {
              return null;
            }
            if (!showZero) {
              if (BigNumber(allLocker[lockerAddress]?.balance).lte(0)) {
                return null;
              }
            }
            if (owner && owner !== "") {
              if (allLocker[lockerAddress]?.owner.toLowerCase() !== owner.toLowerCase()) {
                return null;
              }
            }
            if (tokenAddress && tokenAddress !== "") {
              if (
                allLocker[lockerAddress]?.token.tokenAddress.toLowerCase() !==
                tokenAddress.toLowerCase()
              ) {
                return null;
              }
            }
            return (
              <s.Container key={index} style={{ padding: 10 }}>
                <LongLocker lockerAddress={lockerAddress} />
              </s.Container>
            );
          })}
        </s.Container>
      </s.Container>
      <s.SpacerSmall />
      {limit >= lockersAddresses.length ? null : (
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
