import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Item } from "../types";
import { calculateDiscount } from "../utils";
import BuyItemModal from "./Modals/BuyItemModal";
import PostToTwitterModal from "./Modals/PostToTwitterModal";
import { Button, Card } from "react-bootstrap";

const truncateStr = (fullstr: string, strLen: number) => {
  if (fullstr.length <= strLen) return fullstr;

  const seperator = "...";
  return fullstr.substring(0, strLen) + seperator;
};

export default function NFTBox({ balance, item, disable = false }: { balance: number, item: Item, disable: boolean }) {
  const [showBuyItemModal, setShowBuyItemModal] = useState(false);
  const [showPostToTwitterModal, setShowPostToTwitterModal] = useState(false);
  const handleBuyClose = () => setShowBuyItemModal(false);
  const handleBuyShow = () => setShowBuyItemModal(true);
  const handlePostClose = () => setShowPostToTwitterModal(false);
  const handlePostShow = () => setShowPostToTwitterModal(true);


  return (
    <div>
      {item.image ? (
        <div className="container mx-2 sm:mx-4 p-2 sm:p-4">
          <PostToTwitterModal
            item={item}
            isVisible={showPostToTwitterModal}
            handleClose={handlePostClose}
          />
          <BuyItemModal
            item={item}
            isVisible={showBuyItemModal}
            handleClose={handleBuyClose}
            handlePostShow={handlePostShow}
          />

          <div className="card" style={{ width: "18rem" }}>
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>

          <Card style={{ width: '18rem' }} onClick={() => {
            if (!disable) {
              handleBuyShow();
            }
          }}
          >
            <Card.Img variant="top" src={item.image} />
            <Card.Body>
              <Card.Title>{truncateStr(item.title, 20)}</Card.Title>
              <Card.Text>
                <div className="p-2">
                  <div className="flex flex-col items-center gap-2">
                    <div>#{item.id}</div>
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
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
