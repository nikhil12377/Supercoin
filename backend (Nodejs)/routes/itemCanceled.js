const express = require("express");
const getContract = require("../utils/getContract");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user, amount } = req.body;

    const Supercoin = getContract();
    const tx = await Supercoin.itemCanceled(user, amount);

    await tx.wait();

    res.status(200).json({
      message: "Item canceled successfully",
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
