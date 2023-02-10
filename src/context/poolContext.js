import { useWeb3React } from "@web3-react/core";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { utils } from "../utils";
import { useApplicationContext } from "./applicationContext";

export const PoolContext = createContext({});

export const PoolContextProvider = ({ children }) => {
  const [allPoolAddress, setAllPoolAddress] = useState([]);
  const [userPoolAddresses, setUserPoolAddresses] = useState([]);
  const [allPools, setAllPools] = useState({});
  const [IDOCreatedEvent, setIDOCreatedEvent] = useState(null);

  const [allLockerAddress, setAllLockerAddress] = useState([]);
  const [userLockersAddresses, setUserLockersAddresses] = useState([]);
  const [allLocker, setAllLocker] = useState({});
  const [lockerCreatedEvent, setLockerCreatedEvent] = useState(null);

  const dispatch = useDispatch();
  const contract = useSelector((state) => state.contract);
  const { account } = useWeb3React();

  const {
    domainSettings: {
      ipfsInfuraDedicatedGateway
    }
  } = useApplicationContext();

  useEffect(() => {
    if (ipfsInfuraDedicatedGateway) {
      const delayDebounceFn = setTimeout(() => {
        allPoolAddress.map(async (address, index) => {
          await utils.loadPoolData(address, contract.web3, account, ipfsInfuraDedicatedGateway).then((IDOPoolData) => {
            setAllPools((p) => ({ ...p, ...{ [address]: IDOPoolData } }));
            const { owner, userData, idoAddress } = IDOPoolData;
            if (
              owner?.toLowerCase() === account?.toLowerCase()
              || (userData?.totalInvestedETH && userData?.totalInvestedETH !== "0")
            ) setUserPoolAddresses((prevUserPoolAddresses) => [ ...prevUserPoolAddresses, idoAddress ])
          });
        });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [allPoolAddress, ipfsInfuraDedicatedGateway]);

  useEffect(() => {
    setUserPoolAddresses([])
    const delayDebounceFn = setTimeout(() => {
      Object.values(allPools).map(async (IDOPoolData, index) => {
        const { idoAddress, owner } = IDOPoolData;
        await utils.loadUserData(idoAddress, contract.web3, account).then((userData) => {
          IDOPoolData.userData = userData
          setAllPools((prevAllPools) => ({ ...prevAllPools, ...{ [idoAddress]: IDOPoolData } }));

          if (
            owner?.toLowerCase() === account?.toLowerCase()
            || (userData?.totalInvestedETH && userData?.totalInvestedETH !== "0")
          ) setUserPoolAddresses((prevUserPoolAddresses) => [ ...prevUserPoolAddresses, idoAddress ])

        });
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [account])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      allLockerAddress.map(async (address, index) => {
        await utils.getLockerData(address, contract.web3).then((e) => {
          setAllLocker((p) => ({ ...p, ...{ [address]: e } }));
        });
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [allLockerAddress]);

  useEffect(() => {
    if (!contract?.IDOFactory) {
      return null;
    }

    if (IDOCreatedEvent) {
      IDOCreatedEvent.unsubscribe();
      setAllPools([]);
      setUserPoolAddresses([]);
    }

    setIDOCreatedEvent(
      contract.IDOFactory.events.IDOCreated(
        {
          fromBlock: 0,
        },
        function (error, event) {
          if (event) {
            setAllPoolAddress((p) => [...p, event.returnValues.idoPool]);
          }
        }
      )
    );
  }, [dispatch, contract]);

  useEffect(() => {
    if (!contract.TokenLockerFactory) {
      return null;
    }

    if (lockerCreatedEvent) {
      lockerCreatedEvent.unsubscribe();
      setAllLockerAddress([]);
      setUserLockersAddresses([]);
    }

    setLockerCreatedEvent(
      contract.TokenLockerFactory.events.LockerCreated(
        {
          fromBlock: 0,
        },
        function (error, event) {
          if (event) {
            setAllLockerAddress((p) => [...p, event.returnValues.lockerAddress]);
          }
        }
      )
    );
  }, [dispatch, contract]);

  useEffect(() => {
    setUserLockersAddresses([])
    const delayDebounceFn = setTimeout(() => {
      Object.values(allLocker).map(async (lockerData, index) => {
        const { withdrawer, owner, lockerAddress } = lockerData;
        if (
          owner?.toLowerCase() === account?.toLowerCase()
          || withdrawer?.toLowerCase() === account?.toLowerCase()
        ) setUserLockersAddresses((prevUserLockersAddresses) => [ ...prevUserLockersAddresses, lockerAddress ])

      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [account, allLocker])

  const value = {
    allPools,
    allPoolAddress,
    userPoolAddresses,
    allLocker,
    allLockerAddress,
    userLockersAddresses,
  };
  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

export const usePoolContext = () => React.useContext(PoolContext);
