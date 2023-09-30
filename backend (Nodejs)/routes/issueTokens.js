const express = require("express");
const getContract = require("../utils/getContract");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user, amount } = req.body;
    console.log(user);
    console.log(amount);

    const Supercoin = getContract();
    const tx = await Supercoin.issueTokens(user, amount, {
      gasLimit: 100000,
    });

    await tx.wait();

    res.status(200).json({
      message: `${amount} tokens issued successfully`,
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
