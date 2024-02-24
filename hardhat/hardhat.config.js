require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainID: 31337,
      blockConfirmations: 1,
    },
    mumbai: {
      chainID: 80001,
      blockConfirmations: 6,
      url: process.env.MUMBAI_RPC_PROVIDER,
      accounts: [process.env.PRIVATE_KEY],
    },
  },

  gasReporter: {
    enabled: false,
    currency: "USD",
    token: "ETH",
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
    platform: {
      default: 2,
    },
  },
};
