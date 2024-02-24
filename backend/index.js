const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const itemBought = require("./routes/itemBought");
const issueTokens = require("./routes/issueTokens");
const allocateTokens = require("./routes/allocateTokens");
const onboardAndAllocate = require("./routes/onboardAndAllocate");
const getContract = require("./utils/getContract");
dotenv.config();
const port = 4000;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

app.get("/api/", async (req, res) => {
  try {
    const Supercoin = getContract();
    const balance = await Supercoin.getBalance();
    console.log(balance.toString());
    res.status(200).send("done");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.use("/api/itemBought", itemBought);
app.use("/api/issueTokens", issueTokens);
app.use("/api/allocateTokens", allocateTokens);
app.use("/api/onboardAndAllocate", onboardAndAllocate);

app.get("/api/products", (req, res) => {
  res.sendFile(path.join(__dirname, "/constants/products.json"));
});

app.get("/api/sellerProducts", (req, res) => {
  res.sendFile(path.join(__dirname, "/constants/sellerProducts.json"));
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
