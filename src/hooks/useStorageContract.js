import { useMemo } from 'react'
import Web3 from 'web3'
import STORAGE from '../contracts/Storage.json'
import { networks } from "../utils/chainInfo";

const STORAGE_NETWORK_ID = 5;

export function useStorageContract() {
  const { storage, rpc } = networks[STORAGE_NETWORK_ID]

  return useMemo(() => {
    if (!storage) return null

    try {
    const web3 = new Web3(rpc)
    return new web3.eth.Contract(STORAGE.abi, storage)
    } catch (error) {
    console.error('Failed to get Storage contract', error)
    }

    return null
  }, [storage, rpc])
}