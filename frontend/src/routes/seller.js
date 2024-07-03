import "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import Image from "next/image";
import { userAddresses } from "../constants/userAddresses";
import GiftModal from "../components/Modals/GiftModal";
import truncateStr from "../utils/truncateStr";
import BuyTokensModal from "../components/Modals/BuyTokensModal";
import { sellerImageURI } from "../constants/imageURI";
import networkMappings from "../constants/networkMappings.json";
import Supercoin from "../constants/Supercoin.json";
import { ethers } from "ethers";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export default function Seller() {
  const { isWeb3Enabled, account, chainId } = useMoralis();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [products, setProducts] = useState([]);
  const [balance, setBalance] = useState(0);

  const chainString = parseInt(chainId).toString() || CHAIN_ID;
  let SupercoinAddress = "";
  if (networkMappings[chainString]) {
    SupercoinAddress = networkMappings[chainString].Supercoin[0];
  }
  const { runContractFunction: balanceOf } = useWeb3Contract({
    abi: Supercoin,
    contractAddress: SupercoinAddress,
    functionName: "balanceOf",
    params: { account: account },
  });

  async function updateUI() {
    try {
      const tempBal = await balanceOf();
      setBalance(ethers.utils.formatEther(tempBal));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${BACKEND_API}/api/sellerProducts`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    updateUI();
    fetchProducts();
  }, [isWeb3Enabled]);

  return (
    <div className="container mx-auto my-4">
      <GiftModal
        seller={account}
        user={userAddress}
        isVisible={showGiftModal}
        setIsVisible={setShowGiftModal}
      />
      <BuyTokensModal isVisible={showBuyModal} setIsVisible={setShowBuyModal} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col lg:flex-row m-4 sm:col-span-2">
          <div className="flex flex-col justify-center border-2 rounded-lg ring max-w-fit mr-5 h-fit">
            <Image
              loader={() => sellerImageURI}
              src={sellerImageURI}
              height="300"
              width="300"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1"
              onClick={() => {
                setShowBuyModal(true);
              }}
            >
              Buy Supercoins
            </button>
          </div>
          <div>
            <p className="font-bold text-2xl">Seller</p>
            <p className="my-2">Address: {account}</p>
            <p className="my-2">Supercoins: {balance}</p>
          </div>
        </div>
        <div className="sm:row-span-3 mt-2">
          <p className="font-bold text-2xl">Your top 5 most loyal customers</p>
          <p className="">
            Would you like to gift Supercoins to your customers?
          </p>
          <div className="my-4">
            {userAddresses.length > 0
              ? userAddresses.map((address, index) => (
                  <div key={index} className="my-4 flex justify-between">
                    <p className="pt-2">{truncateStr(address, 35)}</p>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded m-1"
                      onClick={() => {
                        setUserAddress(address);
                        setShowGiftModal(true);
                      }}
                    >
                      Gift
                    </button>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div className="lg:col-span-3 container mx-auto">
          <p className="font-bold text-2xl text-center">Your Listed Products</p>
          <div className="flex flex-wrap">
            {products.length > 0 ? (
              products.map((item, index) => (
                <div key={index}>
                  <NFTBox item={item} disable={true} />
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
