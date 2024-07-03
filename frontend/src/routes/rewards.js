import { Card } from "@web3uikit/core";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SubscriptionModal from "../components/Modals/SubscriptionModal";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Supercoin from "../constants/Supercoin.json";
import networkMappings from "../constants/networkMappings.json";
import { ethers } from "ethers";
import { netflixImageURI, twitterImageURI } from "../constants/imageURI";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export default function Rewards() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { chainId, isWeb3Enabled, account } = useMoralis();
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
    if (chainId) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="container mx-auto">
      <SubscriptionModal
        user={account}
        title={title}
        price={price}
        isVisible={showSubscriptionModal}
        setIsVisible={setShowSubscriptionModal}
      />
      <div className="mx-4 p-4 flex gap-4">
        <div>
          <Card
            title="Tweeter Premium"
            onClick={() => {
              setTitle("Twitter Premium");
              setPrice("199rs");
              setShowSubscriptionModal(true);
            }}
            isDisabled={balance >= 10 ? false : true}
          >
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <Image
                  loader={() => twitterImageURI}
                  src={twitterImageURI}
                  height="200"
                  width="200"
                />
                <div>10 SP + 199rs</div>
                <div className="text-red-500">
                  {balance < 10 ? "Not enough tokens" : ""}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div>
          <Card
            title="Netflix Premium"
            onClick={() => {
              setTitle("Netflix Premium");
              setPrice("149rs");
              setShowSubscriptionModal(true);
            }}
            isDisabled={balance >= 10 ? false : true}
          >
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <Image
                  loader={() => netflixImageURI}
                  src={netflixImageURI}
                  height="200"
                  width="200"
                />
                <div>10 SP + 149rs</div>
                <div className="text-red-500">
                  {balance < 10 ? "Not enough tokens" : ""}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <h1 className="py-4 px-4 font-bold text-2xl text-center">
        More coming soon...
      </h1>
    </div>
  );
}
