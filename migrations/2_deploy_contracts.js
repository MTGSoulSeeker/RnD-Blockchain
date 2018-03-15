var votingVer1_3_2 = artifacts.require("./votingVer1_3_2.sol");
var ManageAccount = artifacts.require("./ManageAccount.sol");

module.exports = function(deployer) {
  deployer.deploy(votingVer1_3_2, {gas: 4700000});
  // deployer.deploy(ManageAccount, {gas: 4700000});
};