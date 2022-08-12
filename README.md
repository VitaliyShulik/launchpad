# IDO FACTORY

## Getting Started

### Preparation

- Copy `.env.example`, rename it to `.env.production` and fill all constants
- In `migrations/1_deployed.js` file replace **EBTCAddress** token address to yours
- In `contracts/IDOPool.sol` file replace **dev** address (required for **emergencyWithdraw** extra method)  to yours
- Create `.secret` file with your mnemonic phrase (ussualy it is a 12 word, required for deploy smart contracts)

### Installation

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
    truffle migrate --network nsc
    # or
    npx truffle migrate --network nsc
    ```

4. Start app

    ```bash
    yarn start:production
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Images

<img width="1440" alt="Screen Shot 2565-05-22 at 14 31 27" src="https://user-images.githubusercontent.com/55227490/169684174-53125cd1-be57-4d7d-a58c-a0328a95e7f8.png">
<img width="1440" alt="Screen Shot 2565-05-22 at 14 31 36" src="https://user-images.githubusercontent.com/55227490/169684176-99c0c5b9-ec8d-4b2e-a651-037125069cd5.png">
<img width="1440" alt="Screen Shot 2565-05-22 at 14 31 41" src="https://user-images.githubusercontent.com/55227490/169684178-e0edcfef-8326-42ee-b479-b8180b722958.png">
