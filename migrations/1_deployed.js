const idoFactory = artifacts.require("IDOFactory");
const tokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.then(async () => {
    let EBTCAddress = "0x01038Cb2440507d36c7A9568fB01dc2Eac122200";
    await deployer.deploy(idoFactory, EBTCAddress, "0", "0");
    await deployer.deploy(tokenLockerFactory);
  });
};
