var voting15 = artifacts.require("./voting15.sol");
var ManageAccount15 = artifacts.require("./ManageAccount15.sol");

module.exports = function(deployer) {
  deployer.deploy(ManageAccount15, {gas: 4700000});
  deployer.link(ManageAccount15, voting15);
  deployer.deploy(voting15, {gas: 4700000});
  
};