import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";
import Router from "next/router";
import RegisterSellerModal from "./Modals/RegisterSellerModal";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMappings from "../constants/networkMappings.json";
import Supercoin from "../constants/Supercoin.json";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const Header = () => {
  const [showRegisterSellerModal, setShowRegisterSellerModal] = useState(false);
  const { chainId, isWeb3Enabled } = useMoralis();
  const [isSeller, setIsSeller] = useState(false);

  const chainString = parseInt(chainId).toString() || CHAIN_ID;
  let SupercoinAddress = "";
  if (networkMappings[chainString]) {
    SupercoinAddress = networkMappings[chainString].Supercoin[0];
  }
  const { runContractFunction: checkPlatformOrBrand } = useWeb3Contract({
    abi: Supercoin,
    contractAddress: SupercoinAddress,
    functionName: "checkPlatformOrBrand",
  });

  async function updateUI() {
    try {
      const checkSeller = await checkPlatformOrBrand();
      setIsSeller(checkSeller);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (chainId) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <nav className="p-2 flex flex-col md:flex-row items-center md:justify-between">
      <RegisterSellerModal
        isVisible={showRegisterSellerModal}
        setIsVisible={setShowRegisterSellerModal}
      />
      <div className="flex items-center mb-4 md:mb-0">
        <Link href="/">
          <a className="py-2 text-white px-4 font-bold text-2xl md:text-3xl">
            Supercoin
          </a>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row content-center">
        <a
          className="cursor-pointer mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold"
          onClick={() => {
            if (isSeller) {
              Router.push({
                pathname: "/seller",
              });
            } else {
              setShowRegisterSellerModal(true);
            }
          }}
        >
          Become Seller
        </a>
        <Link href="/earn">
          <a className="mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold">
            Earn
          </a>
        </Link>
        <Link href="/rewards">
          <a className="mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold">
            Rewards
          </a>
        </Link>
        <a
          className="cursor-pointer mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold"
          onClick={() => {
            if (isSeller) {
              Router.push({
                pathname: "/seller",
              });
            } else {
              Router.push({
                pathname: "/account",
              });
            }
          }}
        >
          My Account
        </a>
        <div className="ml-auto py-2">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
