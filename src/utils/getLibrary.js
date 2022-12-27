import { Web3Provider } from '@ethersproject/providers';
import Web3 from 'web3';

export const getWeb3Library = provider => {
  return new Web3(provider);
}

export default function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any');
  console.log('library', library);
  library.pollingInterval = 15000;
  return library;
}