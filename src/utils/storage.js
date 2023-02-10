import { STORAGE, STORAGE_APP_KEY } from "../constants";
import { getContractInstance } from "./contract";
import Storage from '../contracts/Storage.json';

const makeBaseStructure = (data) => {
  if (!data[STORAGE_APP_KEY]) {
    data[STORAGE_APP_KEY] = {};
  }

  if (!data[STORAGE_APP_KEY].networks) {
    data[STORAGE_APP_KEY].networks = {}
  }

  if (!data[STORAGE_APP_KEY].contracts) {
    data[STORAGE_APP_KEY].contracts = {}
  }

  return data;
}

const updateData = (oldData, newData) => {
  oldData = makeBaseStructure(oldData);

  let result;

  result = {
    ...oldData,
    [STORAGE_APP_KEY]: {
      ...oldData[STORAGE_APP_KEY],
      ...newData,
      networks: {
        ...oldData[STORAGE_APP_KEY].networks,
        ...newData.networks,
      },
      contracts: {
        ...oldData[STORAGE_APP_KEY].contracts,
        ...newData.contracts,
      },
    },
  };

  return result;
}

export const saveAppData = async ({ library, domain, owner, data, onHash, onReceipt }) => {

  try {
    const storageContract = getContractInstance(library.web3, STORAGE, Storage.abi)
    const { info } = await storageContract.methods.getData(domain).call();

    const newData = updateData(JSON.parse(info || '{}'), data);

    return new Promise(async (resolve, reject) => {
      storageContract.methods
        .setKeyData(domain, {
          owner,
          info: JSON.stringify(newData),
        })
        .send({ from: owner })
        .on('transactionHash', (hash) => {
          if (typeof onHash === 'function') onHash(hash)
        })
        .on('receipt', (receipt) => {
          if (typeof onReceipt === 'function') onReceipt(receipt, receipt?.status)
        })
        .then(resolve)
        .catch(reject)
    });
  } catch (error) {
    throw error;
  }
}