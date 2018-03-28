var voting14 = artifacts.require("./voting14.sol");
var ManageAccount14 = artifacts.require("./ManageAccount14.sol");

module.exports = function(deployer) {
  deployer.deploy(ManageAccount14, {gas: 4700000});
  deployer.link(ManageAccount14, voting14);
  deployer.deploy(voting14, {gas: 4700000});
  
};