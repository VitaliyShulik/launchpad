import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils } from "../utils";

export const PoolContext = createContext({});

export const PoolContextProvider = ({ children }) => {
  const [allPoolAddress, setAllPoolAddress] = useState([]);
  const [allLockerAddress, setAllLockerAddress] = useState([]);
  const [allPools, setAllPools] = useState(new Object());
  const [allLocker, setAllLocker] = useState(new Object());
  const dispatch = useDispatch();
  const contract = useSelector((state) => state.contract);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      allPoolAddress.map(async (address, index) => {
        await utils.loadPoolData(address, contract.web3, "").then((e) => {
          setAllPools((p) => ({ ...p, ...{ [address]: e } }));
        });
      });
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [allPoolAddress]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      allLockerAddress.map(async (address, index) => {
        await utils.getLockerData(address, contract.web3).then((e) => {
          setAllLocker((p) => ({ ...p, ...{ [address]: e } }));
        });
      });
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [allLockerAddress]);

  useEffect(async () => {
    let poolKeys = new Array();

    if (!contract.IDOFactory) {
      return null;
    }

    contract.IDOFactory.events.IDOCreated(
      {
        fromBlock: 0,
      },
      async function (error, event) {
        if (event) {
          setAllPoolAddress((p) => [...p, event.returnValues.idoPool]);
        }
      }
    );
  }, [dispatch, contract]);

  useEffect(async () => {
    let lockerKeys = new Array();

    if (!contract.LockerFactory) {
      return null;
    }

    contract.LockerFactory.events.LockerCreated(
      {
        fromBlock: 0,
      },
      async function (error, event) {
        if (event) {
          setAllLockerAddress((p) => [...p, event.returnValues.lockerAddress]);
        }
      }
    );
  }, [dispatch, contract]);

  const value = {
    allPools: allPools,
    allPoolAddress: allPoolAddress,
    allLocker: allLocker,
    allLockerAddress: allLockerAddress,
  };
  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

export const usePoolContext = () => React.useContext(PoolContext);
