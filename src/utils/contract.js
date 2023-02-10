import TokenLockerFactory from '../contracts/TokenLockerFactory.json';
import IDOFactory from '../contracts/IDOFactory.json';

export const getContractInstance = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address)
}

const deployContract = async (params) => {
  const { abi, byteCode, library, onDeploy = () => {}, onHash = () => {}, deployArguments } = params;

  let contract;
  let accounts;

  try {
    const { web3 } = library;

    contract = new web3.eth.Contract(abi);

    accounts = await window.ethereum.request({ method: 'eth_accounts' });

    const transaction = contract.deploy({
      data: byteCode,
      arguments: deployArguments,
    });

    const gasLimit = await transaction.estimateGas({ from: accounts[0] });
    const gasPrice = await web3.eth.getGasPrice();

    return await transaction
      .send({
        from: accounts[0],
        gas: gasLimit,
        gasPrice,
      })
      .on('transactionHash', (hash) => onHash(hash))
      .on('receipt', (receipt) => onDeploy(receipt))
      .on('error', (error) => console.error(error));
  } catch (error) {
    throw error;
  }
}

export const deployIDOFactory = async ({ library, onHash, FeeTokenAddress }) => {
  const { abi, bytecode } = IDOFactory;

  return deployContract({
    abi,
    byteCode: bytecode,
    deployArguments: [FeeTokenAddress, "0", "0"],
    library,
    onHash,
  });
}

export const deployLockerFactory = async ({ library, onHash }) => {
  const { abi, bytecode } = TokenLockerFactory;

  return deployContract({
    abi,
    byteCode: bytecode,
    deployArguments: [],
    library,
    onHash,
  });
}

export const deployLaunchpadContracts = async ({
  chainId,
  library,
  FeeTokenAddress,
  onIDOFactoryHash,
  onLockerFactoryHash,
  onSuccessfulDeploy
}) => {

  try {
    const IDOFactory = await deployIDOFactory({
      onHash: onIDOFactoryHash,
      library,
      FeeTokenAddress,
    });

    const LockerFactory = await deployLockerFactory({
      onHash: onLockerFactoryHash,
      library,
    });

    if (typeof onSuccessfulDeploy === 'function') {
      onSuccessfulDeploy({
        chainId,
        FeeTokenAddress,
        IDOFactoryAddress: IDOFactory.options.address,
        TokenLockerFactoryAddress: LockerFactory.options.address,
      });
    }

  } catch (error) {
    throw error;
  }
}

export const getDeployedLaunchpadContracts = () => JSON.parse(localStorage.getItem("deployedLaunchpadContracts")) || null;

export const setDeployedLaunchpadContracts = ({ chainId, FeeTokenAddress, IDOFactoryAddress, TokenLockerFactoryAddress }) => {

  const deployedLaunchpadContracts = getDeployedLaunchpadContracts();

  localStorage.setItem("deployedLaunchpadContracts", JSON.stringify({
    ...deployedLaunchpadContracts,
    [chainId]: {
      FeeTokenAddress,
      IDOFactoryAddress,
      TokenLockerFactoryAddress
    }
  }));
}

export const removeDeployedLaunchpadContracts = (chainId) => {
  const deployedLaunchpadContracts = getDeployedLaunchpadContracts();

  localStorage.setItem("deployedLaunchpadContracts", JSON.stringify({
    ...deployedLaunchpadContracts,
    [chainId]: null
  }));
}
