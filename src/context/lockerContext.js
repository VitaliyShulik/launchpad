import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils } from "../utils";

export const PoolContext = createContext({});

export const PoolContextProvider = ({ children }) => {
  const [allPoolAddress, setAllPoolAddress] = useState([]);
  const [allPools, setAllPools] = useState(new Array());
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
        setAllPoolAddress((p) => [...p, event.returnValues.idoPool]);
      }
    );
  }, [dispatch, contract]);

  const value = {
    allPools: allPools,
    allPoolAddress: allPoolAddress,
  };
  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

export const usePoolContext = () => React.useContext(PoolContext);
