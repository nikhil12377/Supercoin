const express = require("express");
const getContract = require("../utils/getContract");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user, amount } = req.body;
    console.log(user);
    console.log(Math.round(amount));

    const Supercoin = getContract();
    const tx = await Supercoin.issueTokens(user, Math.round(amount), {
      gasLimit: 210000,
    });

    await tx.wait();

    res.status(200).json({
      message: `${Math.round(amount)} tokens issued successfully`,
      transactionHash: "tx.hash",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
