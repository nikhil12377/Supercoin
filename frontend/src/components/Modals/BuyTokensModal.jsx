import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export default function BuyTokensModal({ isVisible, setIsVisible }) {
  const { chainId } = useMoralis();

  const [Token, setToken] = useState("1");

  const dispatch = useNotification();

  const chainString = parseInt(chainId).toString() || CHAIN_ID;
  let SupercoinAddress = "";
  if (networkMappings[chainString]) {
    SupercoinAddress = networkMappings[chainString].Supercoin[0];
  }

  const { runContractFunction: buyTokens } = useWeb3Contract({
    abi: Supercoin,
    contractAddress: SupercoinAddress,
    functionName: "buyTokens",
    msgValue: Token,
  });

  const handleGiftSuccess = async () => {
    try {
      console.log(Token);
      buyTokens({
        onSuccess: () => {
          setTimeout(() => {
            dispatch({
              type: "success",
              message: `${Token} SP received.`,
              title: "Successfully Bought!",
              position: "topR",
            });
          }, 1000);
        },
        onError: (error) => console.log(error),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      title="Would you like to buy Supercoins?"
      okText="Buy"
      isVisible={isVisible}
      onCloseButtonPressed={() => {
        setIsVisible(false);
      }}
      onOk={() => {
        handleGiftSuccess();
        setIsVisible(false);
        setToken("");
      }}
      onCancel={() => {
        setIsVisible(false);
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginRight: "1em",
          textAlign: "center",
        }}
      >
        <div>Enter the amount of Supercoins you would like to buy</div>
        <div>Get 10SP for 1 Token</div>
        <div className="mt-4 mb-4">
          <Input
            value="0"
            label="Supercoins"
            name="Supercoins Input"
            onChange={(e) => {
              if (e.target.value != "")
                setToken(ethers.utils.parseEther(e.target.value).toString());
            }}
            type="number"
            validation={{ numberMin: 1 }}
          />
        </div>
      </div>
    </Modal>
  );
}
