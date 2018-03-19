var votingVer1_3_2 = artifacts.require("./votingVer1_3_2.sol");
var ManageAccount_1_0_1 = artifacts.require("./ManageAccount_1_0_1.sol");

module.exports = function(deployer) {
  deployer.deploy(votingVer1_3_2, {gas: 4700000});
  deployer.deploy(ManageAccount_1_0_1, {gas: 4700000});
};