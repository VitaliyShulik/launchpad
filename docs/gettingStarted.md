# Getting Started

## Preparation

- Copy `.env.example`, rename it to `.env.production` and fill all constants
- In `migrations/1_deployed.js` file replace **feeToken** token address to yours
- In `contracts/IDOPool.sol` file replace **dev** address (required for **emergencyWithdraw** extra method)  to yours
- Create `.secret` file with your mnemonic phrase (ussualy it is a 12 word, required for deploy smart contracts)

## Installation

1. Install dependencies

    ```bash
    yarn
    ```

2. Install truffle globaly:

    ```bash
    npm install -g truffle
    ```

3. Compile and deploy necessary contacts

    ```bash
    truffle migrate --network goerli
    # or
    npx truffle migrate --network goerli
    ```

4. Start app

    ```bash
    yarn start:prod
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.