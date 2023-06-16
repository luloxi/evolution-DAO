// const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const faucet = await deploy("KhaFaucet", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: chainId === localChainId ? 0 : 5,
  });

  try {
    if (chainId !== localChainId) {
      await run("verify:verify", {
        address: faucet.address,
        contract: "contracts/KhaFaucet.sol:KhaFaucet",
        constructorArguments: [],
      });
    }
  } catch (error) {
    console.error("Verification Error =>", error);
  }
};

module.exports.tags = ["KhaFaucet"];
