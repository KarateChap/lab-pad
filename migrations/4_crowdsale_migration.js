const CrowdSaleContract = artifacts.require("CrowdSale");

module.exports = function (deployer){
    const tokenInstance = '0xe5F479C80CfD2C8F5c83F6F8Ea29F710a2aD677d';
    deployer.deploy(CrowdSaleContract, tokenInstance)
}
