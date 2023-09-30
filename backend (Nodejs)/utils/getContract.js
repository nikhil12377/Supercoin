const ethers = require("ethers");
const { ContractAddress, abi } = require("../constants/getAddressAndABI");

const getContract = () => {
  const PROVIDER_URL = process.env.PROVIDER;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(`${PROVIDER_URL}`);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(ContractAddress, abi, provider);
  const Supercoin = contract.connect(wallet);
  return Supercoin;
};

module.exports = getContract;
