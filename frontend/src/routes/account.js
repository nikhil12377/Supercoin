import "../styles/Home.module.css";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import Image from "next/image";
import { organizations } from "../constants/organizations";
import { Card } from "web3uikit"
import OrganizationModal from "../components/Modals/OrganizationModal";
import Supercoin from "../constants/Supercoin.json";
import networkMappings from "../constants/networkMappings.json";
import { ethers } from "ethers";
import { userImage } from "../constants/imageURI";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const truncate = (fullstr, strLen) => {
  if (fullstr.length <= strLen) return fullstr;

  const seperator = "...";
  return fullstr.substring(0, strLen) + seperator;
};

export default function Account() {
  const { isWeb3Enabled, chainId, account } = useMoralis();


  const [org, setOrg] = useState([]);
  const [balance, setBalance] = useState(0);

  const [showOrganizationModal, setShowOrganizationModal] = useState(false);

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
    if (data) {
      setNewTokens(data.newTokensIssueds);
      console.log(data);
    }
  }, [isWeb3Enabled]);

  return (
    <div className="container mx-auto my-4">
      <OrganizationModal
        user={account}
        org={org}
        isVisible={showOrganizationModal}
        setIsVisible={setShowOrganizationModal}
      />
      <div className="grid grid-col-3 gap-4">
        <div className="grid grid-rows-3 grid-flow-col gap-4">
          <div className="flex col-span-2 m-4 row-span-3">
            <div className="flex flex-col justify-center border-2 rounded-lg ring max-w-fit mr-5 h-fit">
              <Image
                loader={() => userImage}
                src={userImage}
                height="300"
                width="300"
              />
            </div>
            <div>
              <div className="font-bold text-2xl">User</div>
              <div className="my-2">Address: {account}</div>
              <div className="my-2">Supercoins: {balance}</div>
              <div className="text text-red-500">
                {chainId
                  ? parseInt(chainId).toString() !== "80001"
                    ? "Connect to polygon mumbai network"
                    : ""
                  : "Connect your wallet"}
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-3 mt-2 col-span-2">
          <div className="font-bold text-2xl">Donate</div>
          <div className="">
            Would you like to donate Supercoins to these organizations
          </div>
          <div className="my-4 grid grid-cols-2 w-fit">
            {organizations.length > 0
              ? organizations.map((org, index) => {
                return (
                  <div key={index} className="m-2 ">
                    <Card
                      title={truncate(org.title, 10)}
                      onClick={() => {
                        setOrg(org);
                        setShowOrganizationModal(true);
                      }}
                    >
                      <div>
                        <div>
                          <Image
                            loader={() => org.image}
                            src={org.image}
                            height="100"
                            width="150"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
