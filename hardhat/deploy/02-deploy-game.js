module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const tokenURI = process.env.TOKEN_URI;
  const name = "Supercoin";
  const symbol = "SP";
  const joiningAmount = 100;
  const tokenValue = 10;
  const args = [name, symbol, tokenURI, joiningAmount, tokenValue];

  log(
    "-------------------------------------------------------------------------------------"
  );
  log("Deploying Game contract...");
  const Game = await deploy("Game", {
    from: deployer,
    args: args,
    log: true,
  });

  log("Successfully Deployed!");

  log("Contract Address: ", Game.address);

  log(
    "-----------------------------------------------------------------------------------"
  );
};
