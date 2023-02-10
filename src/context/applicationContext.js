import React, { createContext, useEffect, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { SUPPORTED_CHAIN_IDS } from "../connectors";
import { useTokenContract, useLockerFactoryContract, useIDOFactoryContract } from "../hooks/useContract";
import { networks } from "../constants/networksInfo";
import useDomainData from "../hooks/useDomainData";

export const Application = createContext({});

export const ApplicationContextProvider = ({ children }) => {
  const { account, chainId, library, error } = useWeb3React();


  const chainName = networks[chainId]?.name;
  const baseCurrencySymbol = networks[chainId]?.baseCurrency?.symbol;
  const networkExplorer = networks[chainId]?.explorer;

  const [isAvailableNetwork, setIsAvailableNetwork] = useState(true);

  const {
    domain,
    isAdmin,
    domainSettings,
    isDomainDataFetching,
    isDomainDataFetched,
    triggerDomainData,
  } = useDomainData();


  const [FeeTokenAddress, setFeeTokenAddress] = useState(domainSettings?.contracts?.[chainId]?.FeeTokenAddress|| '');
  const [IDOFactoryAddress, setIDOFactoryAddress] = useState(domainSettings?.contracts?.[chainId]?.IDOFactoryAddress|| '');
  const [TokenLockerFactoryAddress, setTokenLockerFactoryAddress] = useState(domainSettings?.contracts?.[chainId]?.TokenLockerFactoryAddress || '');

  const [isAppConfigured, setIsAppConfigured] = useState(Boolean(
    domainSettings?.contracts?.[chainId]?.FeeTokenAddress
    && domainSettings?.contracts?.[chainId]?.IDOFactoryAddress
    && domainSettings?.contracts?.[chainId]?.TokenLockerFactoryAddress
    && domainSettings?.networks?.[chainId]?.webSocketRPC
    && domainSettings?.admin
    && domainSettings?.ipfsInfuraDedicatedGateway
    && domainSettings?.ipfsInfuraProjectId
    && domainSettings?.ipfsInfuraProjectSecret
  ));

  useEffect(() => {
    setFeeTokenAddress(domainSettings?.contracts?.[chainId]?.FeeTokenAddress|| '');
    setIDOFactoryAddress(domainSettings?.contracts?.[chainId]?.IDOFactoryAddress|| '');
    setTokenLockerFactoryAddress(domainSettings?.contracts?.[chainId]?.TokenLockerFactoryAddress || '');

    setIsAppConfigured(Boolean(
      domainSettings?.contracts?.[chainId]?.FeeTokenAddress
      && domainSettings?.contracts?.[chainId]?.IDOFactoryAddress
      && domainSettings?.contracts?.[chainId]?.TokenLockerFactoryAddress
      && domainSettings?.networks?.[chainId]?.webSocketRPC
      && domainSettings?.admin
      && domainSettings?.ipfsInfuraDedicatedGateway
      && domainSettings?.ipfsInfuraProjectId
      && domainSettings?.ipfsInfuraProjectSecret
    ))
  }, [domainSettings, chainId])

  useEffect(() => {
    if (error && error instanceof UnsupportedChainIdError) {
      return setIsAvailableNetwork(false);
    }

    if (chainId) {
      // const lowerAcc = account?.toLowerCase()
      // const appAdmin = wordpressData?.wpAdmin
      //   ? wordpressData?.wpAdmin?.toLowerCase() === lowerAcc
      //   : admin && admin !== ZERO_ADDRESS
      //   ? admin.toLowerCase() === lowerAcc
      //   : true

      // const accessToStorageNetwork = appAdmin && chainId === STORAGE_NETWORK_ID

      // const networkIsFine =
      //   !wordpressData?.wpNetworkIds?.length
      //   || accessToStorageNetwork
      //   || wordpressData.wpNetworkIds.includes(chainId);

      setIsAvailableNetwork(
        Boolean(SUPPORTED_CHAIN_IDS.includes(Number(chainId))
        // && networkIsFine
      ))
    }
  }, [
    chainId,
    // domainDataTrigger,
    // wordpressData,
    // admin,
    account,
    error,
  ]);

  const [shouldUpdateAccountData, setShouldUpdateAccountData] = useState(false);
  const triggerUpdateAccountData = () => setShouldUpdateAccountData(!shouldUpdateAccountData);

  const [feeTokenSymbol, setFeeTokenSymbol] = useState('');
  const [feeTokenBalance, setFeeTokenBalance] = useState(0);
  const [feeTokenApproveToFactory, setFeeTokenApproveToFactory] = useState(0);
  const [isFeeTokenDataFetching, setIsFeeTokenDataFetching] = useState(false);

  const [nativeCoinBalance, setNativeCoinBalance] = useState(0);
  const [isNativeCoinBalanceFetching, setIsNativeCoinBalanceFetching] = useState(false);

  useEffect(() => {
    const fetchNativeCoinBalance = async () => {
      setIsNativeCoinBalanceFetching(true);

      try {
        const accountBalance = await library.getBalance(account);
        setNativeCoinBalance(Number(accountBalance));
      } catch (error) {
        console.log('fetchNativeCoinBalance Error: ', error);
      } finally {
        setIsNativeCoinBalanceFetching(false);
      }
    }

    if (account && library && chainId) {
      fetchNativeCoinBalance()
    } else {
      setNativeCoinBalance(0);
    }
  }, [account, library, chainId, shouldUpdateAccountData])

  const FeeTokenContract = useTokenContract(FeeTokenAddress, true);

  useEffect(() => {
    const fetchFeeTokenData = async () => {
      setIsFeeTokenDataFetching(true);

      try {
        const symbol = await FeeTokenContract.symbol();
        const balance = await FeeTokenContract.balanceOf(account);
        const approveToFactory = await FeeTokenContract.allowance(account, IDOFactoryAddress);
        setFeeTokenSymbol(symbol);
        setFeeTokenBalance(Number(balance));
        setFeeTokenApproveToFactory(Number(approveToFactory));
      } catch (error) {
        console.log('fetchTokenFeeData error: ', error);
      } finally {
        setIsFeeTokenDataFetching(false);
      }
    }

    if (account && FeeTokenContract && IDOFactoryAddress) {
      fetchFeeTokenData();
    } else {
      setFeeTokenSymbol('');
      setFeeTokenBalance(0);
      setFeeTokenApproveToFactory(0);
    }
  }, [account, FeeTokenContract, IDOFactoryAddress, shouldUpdateAccountData]);

  const TokenLockerFactoryContract = useLockerFactoryContract(TokenLockerFactoryAddress, true);
  const IDOFactoryContract = useIDOFactoryContract(IDOFactoryAddress, true);

  const value = {
    isAppConfigured,

    domain,
    isAdmin,
    domainSettings,
    isDomainDataFetching,
    isDomainDataFetched,

    triggerDomainData,

    isAvailableNetwork,
    chainName,
    networkExplorer,
    baseCurrencySymbol,

    triggerUpdateAccountData,
    ETHamount: nativeCoinBalance,
    isNativeCoinBalanceFetching,

    FeeTokenamount: feeTokenBalance,
    FeeTokenSymbol: feeTokenSymbol,
    FeeTokenApproveToFactory: feeTokenApproveToFactory,
    isFeeTokenDataFetching,

    FeeTokenContract,
    FeeTokenAddress,

    IDOFactoryContract,
    IDOFactoryAddress,

    TokenLockerFactoryAddress,
    TokenLockerFactoryContract,
  };

  return (
    <Application.Provider value={value}>{children}</Application.Provider>
  );
};

export const useApplicationContext = () => React.useContext(Application);
