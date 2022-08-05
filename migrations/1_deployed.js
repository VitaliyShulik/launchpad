const idoFactory = artifacts.require("IDOFactory");
const tokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.then(async () => {
    let EBTCAddress = "0x4C509e8BDc46e2747D41C67dfA723255C23A135A";
    await deployer.deploy(idoFactory, EBTCAddress, "0", "0");
    await deployer.deploy(tokenLockerFactory);
  });
};
