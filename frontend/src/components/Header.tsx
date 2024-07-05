import { ConnectWallet, useChainId } from "@thirdweb-dev/react";
// import RegisterSellerModal from "./Modals/RegisterSellerModal";
import { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const Header = () => {
  const [showRegisterSellerModal, setShowRegisterSellerModal] = useState(false);
  const chainId = useChainId();
  const [isSeller, setIsSeller] = useState(false);

  async function updateUI() {
    // try {
    //   const checkSeller = await checkPlatformOrBrand();
    //   setIsSeller(checkSeller);
    // } catch (error) {
    //   console.log(error);
    // }
  }
  useEffect(() => {
    if (chainId) {
      updateUI();
    }
  }, []);
  return (
    <nav className="p-2 flex flex-col md:flex-row items-center md:justify-between">
      {/* <RegisterSellerModal
        isVisible={showRegisterSellerModal}
        setIsVisible={setShowRegisterSellerModal}
      /> */}
      <div className="flex items-center mb-4 md:mb-0">
        <Link to="/">
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
              return redirect("/seller");
            } else {
              setShowRegisterSellerModal(true);
            }
          }}
        >
          Become Seller
        </a>
        <Link to="/earn">
          <a className="mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold">
            Earn
          </a>
        </Link>
        <Link to="/rewards">
          <a className="mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold">
            Rewards
          </a>
        </Link>
        <a
          className="cursor-pointer mb-2 md:mb-0 mr-4 p-2 md:p-3 text-md md:text-xl text-white font-bold"
          onClick={() => {
            if (isSeller) {
              return redirect("/seller");
            } else {
              return redirect("/account");
            }
          }}
        >
          My Account
        </a>
        <div className="ml-auto py-2">
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};
