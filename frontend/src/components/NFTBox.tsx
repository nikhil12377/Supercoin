import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Item } from "../types";
import { calculateDiscount } from "../utils";
// import BuyItemModal from "./Modals/BuyItemModal";
// import PostToTwitterModal from "./Modals/PostToTwitterModal";
// import calculateDiscount from "../utils/calculateDiscount";

const truncateStr = (fullstr: string, strLen: number) => {
  if (fullstr.length <= strLen) return fullstr;

  const seperator = "...";
  return fullstr.substring(0, strLen) + seperator;
};

export default function NFTBox({ balance, item, disable = false }: { balance: number, item: Item, disable: boolean }) {
  const [showBuyItemModal, setShowBuyItemModal] = useState(false);
  const [showPostToTwitterModal, setShowPostToTwitterModal] = useState(false);
  function handleCardClick() {
    setShowBuyItemModal(true);
  }

  return (
    <div>
      {item.image ? (
        <div className="container mx-2 sm:mx-4 p-2 sm:p-4">
          {/* <PostToTwitterModal
            item={item}
            isVisible={showPostToTwitterModal}
            setIsVisible={setShowPostToTwitterModal}
          />
          <BuyItemModal
            item={item}
            isVisible={showBuyItemModal}
            setIsVisible={setShowBuyItemModal}
            setShowPost={setShowPostToTwitterModal}
          /> */}

          <div className="card" style={{ width: "18rem" }}>
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>


          {/* <Card
            title={truncateStr(item.title, 20)}
            description={truncateStr(item.description, 20)}
            onClick={() => {
              if (!disable) {
                handleCardClick();
              }
            }}
            isDisabled={item.discount > balance}
          >
            <div className="p-2">
              <div className="flex flex-col items-center gap-2">
                <div>#{item.id}</div>
                <img
                  src={item.image}
                  height="150"
                  width="150"
                  className="rounded-md"
                />
                <div className="w-full flex justify-center sm:justify-end">
                  {item.discount > 0 ? (
                    <div className="text-center sm:text-right">
                      <span className="line-through px-2">{item.price}rs</span>
                      {item.price - calculateDiscount(item.discount)}
                      {"rs "}+ {item.discount}SP
                    </div>
                  ) : (
                    <div className="text-center sm:text-right">{`${item.price}rs`}</div>
                  )}
                </div>
              </div>
            </div>
          </Card> */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
