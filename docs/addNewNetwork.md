# How to add a new EVM-like network

1. Add a new object in this file: [networksInfo.js](../src/constants/networksInfo.js) to the networks object:

    ```js
    export const networks = {
    ...,
    // key as a chain id
    56: {
      name: "BSC",
      rpc: "https://bscrpc.com/",
      chainId: 56,
      explorer: "https://bscscan.com",
      // used in the connection modal for the network item border color
      color: "#CC9B00",
      // address of the Storage contract. We use BSC contract globally, so for new networks
      // we do not need to pass this parameter.
      storage: "0xa7472f384339D37EfE505a1A71619212495A973A",
      // optional, does not use at the moment, but maybe in the future we will use it to fetch the balance of tokens
      // aggregates results from multiple contract constant function calls
      // https://github.com/makerdao/multicall
      multicall: "0x41263cBA59EB80dC200F3E2544eda4ed6A90E76C",
      // optionally, subscribe to the launchpad contract events from a designated block, such as the contract creation block
      // this allows for the exclusion of extraneous blocks, and only obtaining the latest information in order to promptly display Pools.
      fromBlock: 0,
      // native currency config
      baseCurrency: {
        decimals: 18,
        name: "BNB",
        symbol: "BNB"
      },
      // ERC20 token acts as an equivalent for the native currency.
      wrappedToken: {
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        name: "Wrapped BNB",
        symbol: "WBNB"
      }
    },
    ...
    ```

    > In the end do not forget to verify `wrappedToken` contract in the network explorer.

2. Add the required DEX contracts to the chainRouter object in the same file like 1 step:

    ```js
    export const chainRouter = {
    ...,
    // key as a chain id
    56: [
      {
        name: "PancakeSwap",
        // UniSwap-v2-like or Pancake-like Factory smart contract
        FACTORY: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        // The same WETH token contract like in the ROUTER contract
        WETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        // UniSwap-v2-like or Pancake-like Router smart contract
        ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      },
    ],
    ...
    ```

3. Add a network logo in the `../src/assets/images/<chain symbol>.png` (**.png** or **.svg** format). Import it in `index.ts` in the same directory.
