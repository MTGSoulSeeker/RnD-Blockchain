var voting12 = artifacts.require("./voting12.sol");
var ManageAccount12 = artifacts.require("./ManageAccount12.sol");

module.exports = function(deployer) {
  deployer.deploy(ManageAccount12, {gas: 4700000});
  deployer.link(ManageAccount12, voting12);
  deployer.deploy(voting12, {gas: 4700000});
  
};