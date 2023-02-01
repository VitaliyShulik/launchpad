export const networks = {
  1: {
    name: "Ethereum",
    wsrpc: process.env.REACT_APP_ETH_WS_RPC,
    rpc: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
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
  56: {
    name: "BSC",
    wsrpc: process.env.REACT_APP_BSC_WS_RPC,
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
  5: {
    name: "Görli",
    wsrpc: process.env.REACT_APP_GoerliETH_WS_RPC,
    rpc: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
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
}

export const chainRouter = {
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
      name: "Pancakeswap",
      FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
  ],
  96: [
    {
      name: "UniswapX DEX",
      FACTORY: "0x4b81A5610968B79EFC5dC12CA98264DeFcd3f778",
      WETH: "0x2E27E20Da584bE8349Db668d2C85c16fab560B20",
      ROUTER: "0x429368f41d8a2B256EA2Dc4F3D2Ae42935010F78",
    },
  ],
  3: [
    {
      name: "Uniswap",
      FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    },
  ],
};


export default {
  chainRouter,
  networks,
}
