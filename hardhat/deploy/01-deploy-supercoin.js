const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../helper-hardhat.config");
const fs = require("fs");
// const a = require("../../frontend/constants/networkMappings.json")

const frontEndContractFiles = "../frontend/constants/networkMappings.json";
const frontendABILocation = "../frontend/constants/";
const backendABILocation = "../backend/constants/";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const name = "Supercoin";
  const symbol = "SP";
  const initialTokenValue = 10; // 1 Matic for 10 SP
  const initialTokenAmount = 100;
  const initialJoiningAmount = 100;
  const args = [
    name,
    symbol,
    initialTokenValue,
    initialJoiningAmount,
    initialTokenAmount,
  ];

  log(
    "-------------------------------------------------------------------------------------"
  );
  log("Deploying Supercoin contract...");
  const supercoin = await deploy("Supercoin", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("Successfully Deployed!");

  log("Contract Address: ", supercoin.address);

  log(
    "-----------------------------------------------------------------------------------"
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.POLYGONSCAN_API_KEY
  ) {
    try {
      log("Verifying...");
      await verify(supercoin.address, args);
      log("Verified!");
    } catch (error) {
      log(error);
    }
  }

  try {
    console.log("Updating frontend...");
    await updateABI(supercoin);
    await updateContractAddresses(supercoin);
    console.log("Successful");
  } catch (error) {
    console.log(error);
  }
};

async function updateABI(supercoin) {
  fs.writeFileSync(
    `${frontendABILocation}Supercoin.json`,
    JSON.stringify(supercoin.abi)
  );
  fs.writeFileSync(
    `${backendABILocation}Supercoin.json`,
    JSON.stringify(supercoin.abi)
  );
}

async function updateContractAddresses(supercoin) {
  console.log(hardhatConfig);
  const chainId =
    network.config.chainId.toString() || 31337;
  let contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractFiles, "utf8")
  );

  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]) {
      contractAddresses[chainId] = { Supercoin: [supercoin.address] };
    } else if (!contractAddresses[chainId]["Supercoin"].includes(supercoin.address)) {
      contractAddresses[chainId]["Supercoin"].push(supercoin.address);
    }
  } else {
    contractAddresses[chainId] = { Supercoin: [supercoin.address] };
  }

  fs.writeFileSync(frontEndContractFiles, JSON.stringify(contractAddresses));
}

module.exports.tags = ["supercoin"];
