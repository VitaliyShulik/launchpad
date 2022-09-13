const IdoFactory = artifacts.require("IDOFactory");
const TokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.then(async () => {
    let feeToken = "0xc5007E592e9ACE06Cfec11CB7e1C1A18906A43Ec";
    await deployer.deploy(IdoFactory, feeToken, "0", "0");
    await deployer.deploy(TokenLockerFactory);
  });
};
