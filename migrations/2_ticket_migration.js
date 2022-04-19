const TicketContract = artifacts.require("Ticket");

module.exports = function (deployer){
    deployer.deploy(TicketContract)
}
