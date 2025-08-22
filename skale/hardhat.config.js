require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { SKALE_ENDPOINT, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    skale: {
      url: SKALE_ENDPOINT || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
      // chainId resolved from RPC
    }
  }
};
