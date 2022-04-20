const TokenContract = artifacts.require("Token");

module.exports = function (deployer){
    const totalSupply = '2000000000000000000000';
    deployer.deploy(TokenContract, totalSupply)
}
