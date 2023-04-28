const { ethers } = require("hardhat");

async function transferTokens(deployer, totalSupply) {
  const khaFaucet = await ethers.getContract("KhaFaucet", deployer);
  const khaToken = await ethers.getContract("KhaToken", deployer);

  console.log("khaFaucet address:", khaFaucet.address);
  console.log("khaToken address:", khaToken.address);

  // Mint the entire token supply to the faucet contract
  await khaToken.transfer(khaFaucet.address, totalSupply);
  console.log("Faucet's loaded!");

  await khaFaucet.setTokenAddress(khaToken.address);
  console.log("Free KhaTokens come and grab!!");
}

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const totalSupply = ethers.utils.parseEther("1000000");

  const token = await deploy("KhaToken", {
    from: deployer,
    args: [totalSupply],
    log: true,
    waitConfirmations: chainId === localChainId ? 0 : 5,
  });

  await transferTokens(deployer, totalSupply);

  try {
    // Verify the contract only in production
    const chainId = await getChainId();
    if (chainId !== localChainId) {
      await run("verify:verify", {
        address: token.address,
        contract: "contracts/KhaToken.sol:KhaToken",
        constructorArguments: [totalSupply],
      });
    }
  } catch (error) {
    console.error("Error in contract verification:", error);
  }
};

module.exports.tags = ["KhaToken"];
