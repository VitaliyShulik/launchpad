const IdoFactory = artifacts.require("IDOFactory");
const TokenLockerFactory = artifacts.require("TokenLockerFactory");
const FeeToken = artifacts.require("FeeToken");


module.exports = function (deployer) {
  deployer.then(async () => {
    const feeToken = await deployer.deploy(FeeToken);
    await deployer.deploy(IdoFactory, feeToken.address, "0", "0");
    await deployer.deploy(TokenLockerFactory);
  });
};
