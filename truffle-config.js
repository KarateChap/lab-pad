
module.exports = {


  networks: {

    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
  },


  compilers: {
    solc: {
      version: "0.8.13",
      docker: false,
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "byzantium"
      }
    }
  },
};
