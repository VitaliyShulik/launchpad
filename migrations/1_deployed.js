const idoFactory = artifacts.require("IDOFactory");
const tokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.then(async () => {
    let burnableTokenAddressForFee = "0xaFF4481D10270F50f203E0763e2597776068CBc5";
    await deployer.deploy(idoFactory, burnableTokenAddressForFee, "0", "0");
    await deployer.deploy(tokenLockerFactory);
  });
};
