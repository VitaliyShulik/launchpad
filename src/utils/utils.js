import BigNumber from "bignumber.js";
import ERC20 from "../contracts/ERC20.json";
import IDOPool from "../contracts/IDOPool.json";
import Locker from "../contracts/TokenLocker.json";
import { chainRouter } from "./chainInfo";

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRouterName(router, factory, weth) {
  let name = "";
  chainRouter[process.env.REACT_APP_networkID].map((item, index) => {
    if (item.factory == factory && item.router == router && weth == weth) {
      name = item.name;
    }
  });
  return name;
}

export function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

export var typewatch = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const isValidPool = (_idoInfo) => {
  if (!_idoInfo) {
    return false;
  }
  if (!_idoInfo.metadata) {
    return false;
  } else if (!_idoInfo.metadata.links) {
    return false;
  } else {
    return true;
  }
};

export const isValidMetadata = (_metadata) => {
  if (!_metadata) {
    return false;
  } else if (!_metadata.links) {
    return false;
  } else {
    return true;
  }
};

export const isValidToken = (_tokenInfo) => {
  if (!_tokenInfo) {
    return false;
  }
  if (!_tokenInfo.tokenName) {
    return false;
  } else if (!_tokenInfo.tokenDecimals) {
    return false;
  } else if (!_tokenInfo.tokenSymbol) {
    return false;
  } else if (!_tokenInfo.totalSupply) {
    return false;
  } else if (!_tokenInfo.tokenAddress) {
    return false;
  } else {
    return true;
  }
};

export const loadPoolData = async (idoAddress, web3, account) => {
  try {
    const idoPool = await new web3.eth.Contract(IDOPool.abi, idoAddress);
    let metadataURL = await idoPool.methods.metadataURL().call();
    let balance = await web3.eth.getBalance(idoAddress);
    let tokenAddress = await idoPool.methods.rewardToken().call();
    const token = new web3.eth.Contract(ERC20.abi, tokenAddress);
    let metadata = await getTokenURI(metadataURL);
    let owner = await idoPool.methods.owner().call();

    const userData = await loadUserData(idoAddress, web3, account)

    let tokenName = await token.methods.name().call();
    let tokenSymbol = await token.methods.symbol().call();
    let tokenDecimals = await token.methods.decimals().call();
    let totalSupply = await token.methods.totalSupply().call();
    let finInfo = await idoPool.methods.finInfo().call();

    // TODO: make a check for withdraw tokens from the contract if the Soft Cap is not collected
    let unsold = 0;
    try { unsold = await idoPool.methods.getNotSoldToken().call(); }
    catch (e) { console.log(e); }

    const timestamps = await idoPool.methods.timestamps().call();
    const dexInfo = await idoPool.methods.dexInfo().call();
    const totalInvestedETH = await idoPool.methods.totalInvestedETH().call();

    const {
      startTimestamp,
      endTimestamp,
      unlockTimestamp,
    } = timestamps;

    const {
      tokenPrice,
      hardCap,
      softCap,
      minEthPayment,
      maxEthPayment,
      listingPrice,
      lpInterestRate,
    } = finInfo;

    const progress = parseFloat(
      BigNumber(totalInvestedETH)
        .times(100)
        .dividedBy(BigNumber(finInfo.hardCap))
    );

    let result = {
      tokenAddress: tokenAddress,
      metadata: metadata,
      tokenName: tokenName,
      tokenDecimals: tokenDecimals,
      tokenSymbol: tokenSymbol,
      totalSupply: totalSupply,
      idoAddress: idoAddress,
      owner: owner,
      balance: balance,
      unsold: unsold,
      tokenRate: tokenPrice,
      listingRate: listingPrice,
      dexInfo,
      lpPercentage: lpInterestRate,
      start: startTimestamp,
      end: endTimestamp,
      claim: unlockTimestamp,
      min: minEthPayment,
      max: maxEthPayment,
      softCap: softCap,
      hardCap: hardCap,
      totalInvestedETH: totalInvestedETH,
      progress: progress,
      metadataURL,
      userData: userData,
    };
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getTokenData = async (tokenAddress, web3) => {
  if (!web3.utils.isAddress(tokenAddress)) {
    return null;
  }
  const token = new web3.eth.Contract(ERC20.abi, tokenAddress);
  let tokenName = await token.methods.name().call();
  let tokenSymbol = await token.methods.symbol().call();
  let tokenDecimals = await token.methods.decimals().call();
  let totalSupply = await token.methods.totalSupply().call();
  return {
    tokenAddress: tokenAddress,
    tokenName: tokenName,
    tokenDecimals: tokenDecimals,
    tokenSymbol: tokenSymbol,
    totalSupply: totalSupply,
  };
};

export const loadUserData = async (idoAddress, web3, account) => {
  try {
    const idoPool = await new web3.eth.Contract(IDOPool.abi, idoAddress);

    const userData = account && account !== ""
      ? await idoPool.methods.userInfo(account).call()
      : null;

    return userData;
  } catch (e) {
    console.log(e);
  }
};

export const getBalanceOfERC20 = async (tokenAddress, address, web3) => {
  const token = new web3.eth.Contract(ERC20.abi, tokenAddress);

  let balance = await token.methods.balanceOf(address).call();
  return balance;
};

export const getLockerData = async (lockerAddress, web3) => {
  const locker = new web3.eth.Contract(Locker.abi, lockerAddress);
  let token = await locker.methods.token().call();
  let tokenData = await getTokenData(token, web3);
  let name = await locker.methods.name().call();
  let withdrawer = await locker.methods.withdrawer().call();
  let balance = await getBalanceOfERC20(token, lockerAddress, web3);
  let time = await locker.methods.withdrawTime().call();
  let owner = await locker.methods.owner().call();
  return {
    lockerAddress: lockerAddress,
    token: tokenData,
    name: name,
    withdrawer: withdrawer,
    time: time,
    owner: owner,
    balance: balance,
  };
};

export function getTokenURI(uri) {
  return fetch(uri)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getValidImageUrl(imageUrl) {
  const infuraDedicatedGateway = process.env.REACT_APP_INFURA_DEDICATED_GATEWAY;
  return infuraDedicatedGateway ? imageUrl.replace('https://ipfs.infura.io', infuraDedicatedGateway) : imageUrl;
}
