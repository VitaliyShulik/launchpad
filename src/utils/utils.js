import BigNumber from "bignumber.js";
import { getAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import ERC20 from "../contracts/ERC20.json";
import IDOPool from "../contracts/IDOPool.json";
import Locker from "../contracts/TokenLocker.json";
import { networks, chainRouter } from '../constants/networksInfo';
import { ZERO_ADDRESS } from '../constants';

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRouterName(router, factory, weth, chainId) {
  let name = "";
  chainRouter[chainId].map((item, index) => {
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

export const loadPoolData = async (idoAddress, web3, account, infuraDedicatedGateway) => {
  try {
    const idoPool = await new web3.eth.Contract(IDOPool.abi, idoAddress);
    let metadataURL = await idoPool.methods.metadataURL().call();
    let balance = await web3.eth.getBalance(idoAddress);
    let tokenAddress = await idoPool.methods.rewardToken().call();
    const token = new web3.eth.Contract(ERC20.abi, tokenAddress);
    let metadata = await getTokenURI(metadataURL, infuraDedicatedGateway);
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
  if (!isAddress(tokenAddress)) {
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

export function getTokenURI(uri, infuraDedicatedGateway) {
  return fetch(getValidIPFSUrl(uri, infuraDedicatedGateway))
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getValidImageUrl(imageUrl, infuraDedicatedGateway) {
  if (!infuraDedicatedGateway || !imageUrl) {
    console.error('The app has not "Infura Dedicated Gateway" option or imageUrl is not valid')
    return ""
  }

  const isURL = imageUrl.match('https')
  return isURL
    ? ( imageUrl.match('ipfs.infura.io') ? imageUrl.replace('https://ipfs.infura.io', infuraDedicatedGateway) : imageUrl )
    : `${infuraDedicatedGateway}/ipfs/${imageUrl}`;
}

export function getValidIPFSUrl(url, infuraDedicatedGateway) {
  if (!infuraDedicatedGateway || !url) {
    console.error('The app has not "Infura Dedicated Gateway" option or url is not valid')
    return ""
  }

  const isURL = url.match('https')
  return isURL
    ? ( url.match('gateway.pinata.cloud') ? url.replace('https://gateway.pinata.cloud', infuraDedicatedGateway) : url )
    : `${infuraDedicatedGateway}/ipfs/${url}`;
}

export const isMobile = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}();

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export const addInjectedNetwork = async (chainId) => {
  const network = networks[chainId]

  if (!network || !window.ethereum?.request) return false

  const successfulResult = null
  const { name, baseCurrency, rpc, explorer } = network

  const params = {
    chainId: `0x${chainId.toString(16)}`,
    chainName: name,
    nativeCurrency: {
      name: baseCurrency.name,
      symbol: baseCurrency.symbol,
      decimals: baseCurrency.decimals,
    },
    rpcUrls: [rpc],
    blockExplorerUrls: [explorer],
  }

  try {
    const result = await window.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    })

    return result === successfulResult
  } catch (error) {
    console.group('%c new network addition', 'color: red;')
    console.error(error)
    console.groupEnd()
  }

  return false
}

export const switchInjectedNetwork = async (chainId) => {
  if (!window.ethereum?.request) return false

  const ADD_CHAIN_ERROR_CODE = 4902 // from Metamask docs
  const successfulResult = null

  try {
    const result = await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })

    return result === successfulResult
  } catch (error) {
    const messageAboutAddition = JSON.stringify(error).match(/(T|t)ry adding the chain/)

    if (error.code === ADD_CHAIN_ERROR_CODE || messageAboutAddition) {
      return await addInjectedNetwork(chainId)
    } else {
      console.group('%c switch network', 'color: red;')
      console.error(error)
      console.groupEnd()
    }

    return false
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account = '') {
  if (!isAddress(address) || address === ZERO_ADDRESS) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export const getCurrentDomain = () => {
  return window.location.hostname || document.location.host || ''; // 'dev-launchpad'
}

export const validateArray = arr => Array.isArray(arr) && !!arr.length;