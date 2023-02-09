import { useMemo } from 'react';
import Web3 from 'web3';
import TokenLockerFactory from '../contracts/TokenLockerFactory.json';
import Locker from "../contracts/TokenLocker.json";
import IDOFactory from '../contracts/IDOFactory.json';
import IDOPool from "../contracts/IDOPool.json";
import STORAGE from '../contracts/Storage.json';
import ERC20 from '../contracts/ERC20.json';
import { STORAGE_NETWORK_ID } from '../constants';
import { networks } from '../constants/networksInfo';
import { getContract } from '../utils/utils';
import { useActiveWeb3React } from './index';

export function useStorageContract() {
  const { storage, rpc } = networks[STORAGE_NETWORK_ID];

  return useMemo(() => {
    if (!storage) return null;

    try {
      const web3 = new Web3(rpc);
      return new web3.eth.Contract(STORAGE.abi, storage);
    } catch (error) {
      console.error('Failed to get Storage contract', error);
    }

    return null;
  }, [storage, rpc]);
}

// returns null on errors
function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useLockerFactoryContract(address, withSignerIfPossible) {
  return useContract(address, TokenLockerFactory.abi, withSignerIfPossible)
}

export function useLockerContract(address, withSignerIfPossible) {
  return useContract(address, Locker.abi, withSignerIfPossible)
}

export function useIDOFactoryContract(address, withSignerIfPossible) {
  return useContract(address, IDOFactory.abi, withSignerIfPossible)
}

export function useTokenContract(tokenAddress, withSignerIfPossible) {
  return useContract(tokenAddress, ERC20.abi, withSignerIfPossible)
}

export function useIDOPoolContract(IDOAddress, withSignerIfPossible) {
  return useContract(IDOAddress, IDOPool.abi, withSignerIfPossible)
}
