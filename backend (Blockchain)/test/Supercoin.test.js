const { ethers } = require("hardhat");
const { expect } = require("chai");

// !developmentChains.includes(network.name)
//   ? describe.skip
//   :
describe("Supercoin tests", () => {
  let Supercoin,
    deployer,
    user,
    platformOrBrand,
    userSupercoin,
    platformSupercoin;
  let name = "Supercoin";
  let symbol = "SP";
  let initialTokenValue = 10; // 1 Matic for 10 SP
  let initialTokenAmount = ethers.parseUnits("100", 18);
  let initialJoiningAmount = ethers.parseUnits("100", 18); // 100 tokens for platform or brand signup

  beforeEach(async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    Supercoin = await ethers.deployContract("Supercoin", [
      name,
      symbol,
      initialTokenValue,
      100,
      100,
    ]);
    deployer = owner;
    user = addr1;
    platformOrBrand = addr2;

    userSupercoin = Supercoin.connect(user);
    platformSupercoin = Supercoin.connect(platformOrBrand);
  });

  it("Constructor should initialize contract with correct values", async () => {
    const _name = await Supercoin.name();
    const _symbol = await Supercoin.symbol();
    const _initialTokenValue = await Supercoin.getTokenValue();
    const _initialTokenAmount = await Supercoin.intialSupply();
    const _initialJoiningAmount = await Supercoin.joiningAmount();
    expect(_name).to.equal(name);
    expect(_symbol).to.equal(symbol);
    expect(_initialTokenValue.toString()).to.equal(
      initialTokenValue.toString()
    );
    expect(_initialTokenAmount.toString()).to.equal(
      initialTokenAmount.toString()
    );
    expect(_initialJoiningAmount.toString()).to.equal(
      initialJoiningAmount.toString()
    );
  });

  it("Should issue tokens to user", async () => {
    let tokens = "10";
    let tokensInEth = ethers.parseEther(tokens);
    let balanceBefore = await userSupercoin.getBalance();
    await Supercoin.issueTokens(user, tokens);
    let balanceAfter = await userSupercoin.getBalance();
    expect(balanceBefore.toString()).to.equal("0");
    expect(balanceAfter).to.equal(tokensInEth);
  });

  it("Should burn tokens from user after item bought or delivered", async () => {
    let tokens = "10";
    let balanceBeforeBuy = await userSupercoin.getBalance();
    await Supercoin.issueTokens(user, tokens);
    await Supercoin.itemBought(user, tokens);
    let balanceAfterBuy = await userSupercoin.getBalance();
    let balanceBeforeDelivered = await userSupercoin.getBalance();
    await Supercoin.issueTokens(user, tokens);
    await Supercoin.itemDelivered(user, tokens);
    let balanceAfterDelivered = await userSupercoin.getBalance();
    expect(balanceBeforeBuy).to.equal(balanceAfterBuy);
    expect(balanceBeforeDelivered).to.equal(balanceAfterDelivered);
  });

  it("Should refund tokens to user after item canceled", async () => {
    let tokens = "10";
    await Supercoin.issueTokens(user, tokens);
    let balanceBefore = await userSupercoin.getBalance();
    await Supercoin.itemBought(user, tokens);
    await Supercoin.itemCanceled(user, tokens);
    let balanceAfter = await userSupercoin.getBalance();
    expect(balanceBefore).to.equal(balanceAfter);
  });

  it("Should add joining amount tokens and token buy limit to platform or brand", async () => {
    let tokenLimit = "100";
    let limitInEth = ethers.parseEther(tokenLimit);
    const limitBefore = await platformSupercoin.getTokenLimit();
    let balanceBefore = await platformSupercoin.getBalance();
    await Supercoin.onboardAndAllocate(platformOrBrand, tokenLimit);
    const limitAfter = await platformSupercoin.getTokenLimit();
    let balanceAfter = await platformSupercoin.getBalance();
    expect(limitBefore.toString()).to.equal("0");
    expect(limitAfter.toString()).to.equal(limitInEth.toString());
    expect(balanceBefore.toString()).to.equal("0");
    expect(balanceAfter.toString()).to.string(initialJoiningAmount.toString());
  });

  it("Should buy tokens for platform or brand", async () => {
    let tokenLimit = "100";
    let ethValue = ethers.parseEther("1");
    await Supercoin.onboardAndAllocate(platformOrBrand, tokenLimit);
    let balanceBefore = await platformSupercoin.getBalance();
    await platformSupercoin.buyTokens({ value: ethValue });
    let balanceAfter = await platformSupercoin.getBalance();
    expect(balanceAfter).to.equal(
      balanceBefore + ethValue * BigInt(initialTokenValue)
    );
  });

  it("Should allocate tokens from platform, brand to user", async () => {
    let tokenLimit = "100";
    let transferAmount = "10";
    let ethTransferAmount = ethers.parseEther(transferAmount);
    await Supercoin.onboardAndAllocate(platformOrBrand, tokenLimit);
    let userBbalanceBefore = await userSupercoin.getBalance();
    let platformBbalanceBefore = await platformSupercoin.getBalance();
    await Supercoin.allocateTokens(platformOrBrand, user, transferAmount);
    let userBbalanceAfter = await userSupercoin.getBalance();
    let platformBbalanceAfter = await platformSupercoin.getBalance();
    expect(userBbalanceBefore.toString()).to.equal("0");
    expect(platformBbalanceBefore).to.equal(initialJoiningAmount);
    expect(userBbalanceAfter).to.equal(ethTransferAmount);
    expect(platformBbalanceAfter).to.equal(
      initialJoiningAmount - ethTransferAmount
    );
  });

  it("Should increase the token buy limit for platform or brand", async () => {
    let tokenLimit = "100";
    let newTokenLimit = "200";
    let buyTokenAmount = "50";
    let ethValue = ethers.parseEther("5");
    let buyTokenAmountEth = ethers.parseEther(buyTokenAmount);
    let oldAmount = ethers.parseEther(tokenLimit);
    let newAmount = ethers.parseEther(newTokenLimit);
    await Supercoin.onboardAndAllocate(platformOrBrand, tokenLimit);
    await platformSupercoin.buyTokens({ value: ethValue });
    let limitBefore = await platformSupercoin.getTokenLimit();
    await Supercoin.increaseTokenLimit(platformOrBrand, newTokenLimit);
    let limitAfter = await platformSupercoin.getTokenLimit();
    expect(limitBefore).to.equal(oldAmount - buyTokenAmountEth);
    expect(limitAfter).to.equal(limitBefore + newAmount);
  });

  it("Should set new token value", async () => {
    let tokenValue = "20";
    await Supercoin.setTokenValue(tokenValue);
    const newTokenValue = await Supercoin.getTokenValue();
    expect(tokenValue).to.equal(newTokenValue.toString());
  });

  it("Should set new joining amount", async () => {
    let joiningAmount = "200";
    let joiningAmountEth = ethers.parseEther(joiningAmount);
    await Supercoin.setJoiningAmount(joiningAmount);
    const newJoiningAmount = await Supercoin.getJoiningAmount();
    expect(joiningAmountEth).to.equal(newJoiningAmount);
  });

  it("Should revert with token limit exceeded", async () => {
    let tokenLimit = "100";
    let ethValue = ethers.parseEther("11");
    await Supercoin.onboardAndAllocate(platformOrBrand, tokenLimit);
    await expect(
      platformSupercoin.buyTokens({ value: ethValue })
    ).to.be.revertedWithCustomError(
      platformSupercoin,
      "Token_Limit_Exceeded()"
    );
  });

  it("Should revert with invalid address", async () => {
    let tokenLimit = "100";
    let address = ethers.ZeroAddress;
    await expect(
      Supercoin.onboardAndAllocate(address, tokenLimit)
    ).to.be.revertedWithCustomError(Supercoin, "Invalid_Address()");
  });

  it("Should revert with amount should be greater than zero", async () => {
    await expect(Supercoin.issueTokens(user, 0)).to.be.revertedWithCustomError(
      Supercoin,
      "Amount_Should_Be_Greater_Than_Zero()"
    );
  });

  it("Should revert with insufficient balance", async () => {
    await expect(Supercoin.itemBought(user, 10)).to.be.revertedWithCustomError(
      Supercoin,
      "Insufficient_Balance()"
    );
  });

  it("Should revert with invalid platform or brand", async () => {
    let ethValue = ethers.parseEther("1");
    await expect(
      userSupercoin.buyTokens({ value: ethValue })
    ).to.be.revertedWithCustomError(
      userSupercoin,
      "Invalid_Platform_Or_Brand()"
    );
  });

  it("Should revert with not enough ETH", async () => {
    let tokenLimit = "100";
    await Supercoin.onboardAndAllocate(platformOrBrand, tokenLimit);
    await expect(platformSupercoin.buyTokens()).to.be.revertedWithCustomError(
      platformSupercoin,
      "Not_Enough_ETH()"
    );
  });

  it("Should emit new tokens issued event", async () => {
    let tokens = "10";
    await expect(Supercoin.issueTokens(user, tokens)).emit(
      Supercoin,
      "newTokensIssued"
    );
  });

  it("Should emit item bought event", async () => {
    let tokens = "10";
    await Supercoin.issueTokens(user, tokens);
    await expect(Supercoin.itemBought(user, tokens)).emit(
      Supercoin,
      "newItemBought"
    );
  });

  it("Should emit item got delivered event", async () => {
    let tokens = "10";
    await Supercoin.issueTokens(user, tokens);
    await expect(Supercoin.itemDelivered(user, tokens)).emit(
      Supercoin,
      "itemGotDelivered"
    );
  });

  it("Should emit item got canceled event", async () => {
    let tokens = "10";
    await expect(Supercoin.itemCanceled(user, tokens)).emit(
      Supercoin,
      "itemGotCanceled"
    );
  });

  it("Should emit tokens allocated event", async () => {
    let amount = "10";
    let limit = "100";
    await Supercoin.onboardAndAllocate(platformOrBrand, limit);
    await expect(Supercoin.allocateTokens(platformOrBrand, user, amount)).emit(
      Supercoin,
      "tokensAllocated"
    );
  });
});
