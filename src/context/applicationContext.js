import React, { createContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import IDOFactory from '../contracts/IDOFactory.json';
import FeeToken from "../contracts/FeeToken.json";
import TokenLockerFactory from "../contracts/TokenLockerFactory.json";
import { useTokenContract, useLockerFactoryContract, useIDOFactoryContract } from "../hooks/useContract";
import { networks } from "../constants/networksInfo";

export const Application = createContext({});

export const ApplicationContextProvider = ({ children }) => {
  const { account, chainId, library } = useWeb3React();

  // use blockchain storage state for all contracts' addresses
  const TokenLockerFactoryAddress = TokenLockerFactory?.networks?.[chainId]?.address;
  const IDOFactoryAddress = IDOFactory?.networks?.[chainId]?.address;
  const FeeTokenAddress = FeeToken?.networks?.[chainId]?.address;

  const [shouldUpdateAccountData, setShouldUpdateAccountData] = useState(false);
  const triggerUpdateAccountData = () => setShouldUpdateAccountData(!shouldUpdateAccountData);

  const [feeTokenSymbol, setFeeTokenSymbol] = useState('');
  const [feeTokenBalance, setFeeTokenBalance] = useState(0);
  const [feeTokenApproveToFactory, setFeeTokenApproveToFactory] = useState(0);
  const [isFeeTokenDataFetching, setIsFeeTokenDataFetching] = useState(false);

  const [nativeCoinBalance, setNativeCoinBalance] = useState(0);
  const [isNativeCoinBalanceFetching, setIsNativeCoinBalanceFetching] = useState(false);

  const baseCurrencySymbol = networks[chainId]?.baseCurrency?.symbol || networks[1].baseCurrency.symbol;
  const chainName = networks[chainId]?.name || networks[1].name;
  const networkExplorer = networks[chainId]?.explorer || networks[1].explorer;

  const TokenLockerFactoryContract = useLockerFactoryContract(TokenLockerFactoryAddress, true);
  const IDOFactoryContract = useIDOFactoryContract(IDOFactoryAddress, true);
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

    if (account && chainId && FeeTokenContract) {
      fetchFeeTokenData();
    } else {
      setFeeTokenSymbol('');
      setFeeTokenBalance(0);
      setFeeTokenApproveToFactory(0);
    }
  }, [account, chainId, FeeTokenContract, IDOFactoryAddress, shouldUpdateAccountData]);

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

  const value = {
    triggerUpdateAccountData,
    chainName,
    networkExplorer,
    baseCurrencySymbol,
    ETHamount: nativeCoinBalance,
    isNativeCoinBalanceFetching,

    FeeTokenContract,
    FeeTokenAddress,
    FeeTokenamount: feeTokenBalance,
    FeeTokenSymbol: feeTokenSymbol,
    FeeTokenApproveToFactory: feeTokenApproveToFactory,
    isFeeTokenDataFetching,

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
