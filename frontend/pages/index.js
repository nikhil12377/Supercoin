import "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Supercoin from "../constants/Supercoin.json";
import networkMappings from "../constants/networkMappings.json";
import { ethers } from "ethers";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { chainId, account } = useMoralis();
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
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${BACKEND_API}/api/products`);
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(true);
      }
    }

    async function updateUI() {
      try {
        const tempBal = await balanceOf();
        console.log(ethers.utils.formatEther(tempBal));
        setBalance(ethers.utils.formatEther(tempBal));
      } catch (error) {
        console.log(error);
      }
    }

    if (chainId) {
      updateUI();
    }

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products.map((item, index) => {
            return (
              <div key={index} className="mb-4">
                <NFTBox balance={balance} item={item} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
