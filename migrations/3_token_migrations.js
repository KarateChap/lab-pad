const TokenContract = artifacts.require("Token");

module.exports = function (deployer){
    deployer.deploy(TokenContract)
}
