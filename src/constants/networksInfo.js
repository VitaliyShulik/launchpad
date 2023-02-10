export const networks = {
  1: {
    name: "Ethereum",
    rpc: 'https://rpc.ankr.com/eth',
    chainId: 1,
    explorer: "https://etherscan.io",
    color: "#627EEA",
    multicall: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    ENSRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    baseCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH"
    },
    wrappedToken: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Etherer",
      symbol: "WETH"
    }
  },
  5: {
    name: "Görli",
    rpc: "https://rpc.ankr.com/eth_goerli",
    chainId: 5,
    explorer: "https://goerli.etherscan.io",
    color: "#f6c343",
    storage: "0x171a664f12672a61E4e948BC7Fd38eB34b64a15b",
    multicall: "0xFD4e092227e876dD8F2d036FA8fEB23F8A7F94ca",
    ENSRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    baseCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH"
    },
    wrappedToken: {
      address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      name: "Wrapped Ether",
      symbol: "WETH"
    }
  },
  56: {
    name: "BSC",
    rpc: "https://bscrpc.com/",
    chainId: 56,
    explorer: "https://bscscan.com",
    color: "#CC9B00",
    storage: "0xa7472f384339D37EfE505a1A71619212495A973A",
    multicall: "0x41263cBA59EB80dC200F3E2544eda4ed6A90E76C",
    baseCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB"
    },
    wrappedToken: {
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      name: "Wrapped BNB",
      symbol: "WBNB"
    }
  },
  97: {
    name: "BSC Testnet",
    rpc: "https://data-seed-prebsc-2-s3.binance.org:8545",
    chainId: 97,
    explorer: "https://testnet.bscscan.com/",
    color: "#CC9B00",
    multicall: "0x6e5BB1a5Ad6F68A8D7D6A5e47750eC15773d6042",
    baseCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB"
    },
    wrappedToken: {
      address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      name: "Wrapped BNB",
      symbol: "WBNB"
    }
  },
}

export const chainRouter = {
  1: [
    {
      name: "Uniswap",
      FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
  ],
  5: [
    {
      name: "Uniswap",
      FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      WETH: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
  ],
  56: [
    {
      name: "PancakeSwap",
      FACTORY: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      WETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    },
  ],
  97: [
    {
      name: "PancakeSwap",
      FACTORY: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
      WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      ROUTER: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    },
  ],
};


export default {
  chainRouter,
  networks,
}
