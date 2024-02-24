const express = require("express");
const getContract = require("../utils/getContract");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user, amount } = req.body;
    const Supercoin = getContract();
    const tx = await Supercoin.itemBought(user, amount, {
      gasLimit: 210000,
    });

    await tx.wait();

    res
      .status(200)
      .json({ message: "Item bought successfully", transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
