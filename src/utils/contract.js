export const getContractInstance = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address)
}

// const deployContract = async (params) => {
//   const { abi, byteCode, library, onDeploy = () => {}, onHash = () => {}, deployArguments } = params

//   let contract
//   let accounts

//   try {
//     const web3 = getWeb3Library(library.provider)

//     contract = new web3.eth.Contract(abi)
//     //@ts-ignore
//     accounts = await window.ethereum.request({ method: 'eth_accounts' })

//     const transaction = contract.deploy({
//       data: byteCode,
//       arguments: deployArguments,
//     })

//     const gasLimit = await transaction.estimateGas({ from: accounts[0] })
//     const gasPrice = await web3.eth.getGasPrice()

//     return await transaction
//       .send({
//         from: accounts[0],
//         gas: gasLimit,
//         gasPrice,
//       })
//       .on('transactionHash', (hash: string) => onHash(hash))
//       .on('receipt', (receipt: any) => onDeploy(receipt))
//       .on('error', (error: any) => console.error(error))
//   } catch (error) {
//     throw error
//   }
// }

// export const deployFactory = async (params: any) => {
//   const { library, onHash, admin, devFeeAdmin } = params
//   const { abi, bytecode } = Factory

//   return deployContract({
//     abi,
//     byteCode: bytecode,
//     deployArguments: [admin, devFeeAdmin],
//     library,
//     onHash,
//   })
// }

// export const deployRouter = async (params: any) => {
//   const { library, factory, onHash, wrappedToken } = params
//   const { abi, bytecode } = RouterV2

//   return deployContract({
//     abi,
//     byteCode: bytecode,
//     deployArguments: [factory, wrappedToken],
//     library,
//     onHash,
//   })
// }

// export const deploySwapContracts = async (params: {
//   admin: string
//   chainId: number
//   library: Web3Provider
//   wrappedToken: string
//   devFeeAdmin: string
//   onFactoryHash?: (hash: string) => void
//   onRouterHash?: (hash: string) => void
//   onSuccessfulDeploy?: (params: { chainId: number; factory: string; router: string }) => void
// }) => {
//   const { admin, chainId, library, wrappedToken, devFeeAdmin, onFactoryHash, onRouterHash, onSuccessfulDeploy } = params

//   try {
//     const factory = await deployFactory({
//       onHash: onFactoryHash,
//       library,
//       admin,
//       devFeeAdmin,
//     })

//     if (factory) {
//       const router = await deployRouter({
//         onHash: onRouterHash,
//         library,
//         factory: factory.options.address,
//         wrappedToken,
//       })

//       if (typeof onSuccessfulDeploy === 'function') {
//         onSuccessfulDeploy({
//           chainId,
//           factory: factory.options.address,
//           router: router.options.address,
//         })
//       }
//     } else {
//       throw new Error('No factory contract')
//     }
//   } catch (error) {
//     throw error
//   }
// }