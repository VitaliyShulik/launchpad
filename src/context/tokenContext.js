import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils } from "../utils";

export const TokenContext = createContext({});

export const TokenContextProvider = ({ children }) => {
  const [allTokenAddress, setAllTokenAddress] = useState([]);
  const [allTokens, setAllTokens] = useState(new Array());
  const dispatch = useDispatch();
  const contract = useSelector((state) => state.contract);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      allTokenAddress.map(async (address, index) => {
        await utils.loadTokenData(address, contract.web3, "").then((e) => {
          setAllTokens((p) => ({ ...p, ...{ [address]: e } }));
        });
      });
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [allTokenAddress]);

  useEffect(async () => {
    if (!contract.IDOFactory) {
      return null;
    }

    contract.IDOFactory.events.IDOCreated(
      {
        fromBlock: 0,
      },
      async function (error, event) {
        if (event) {
          setAllTokenAddress((p) => [...p, event.returnValues.idoToken]);
        }
      }
    );
  }, [dispatch, contract]);

  const value = {
    allTokens: allTokens,
    allTokenAddress: allTokenAddress,
  };
  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

export const useTokenContext = () => React.useContext(TokenContext);
