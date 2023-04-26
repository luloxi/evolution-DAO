// deploy/01_deploy_khazum.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const khaTokenDeployment = await deployments.get("KhaToken");
  const khaTokenAddress = khaTokenDeployment.address;

  await deploy("Khazum", {
    from: deployer,
    args: [khaTokenAddress],
    log: true,
  });

  try {
    // Verify contract if not on local chain
    const localChainId = "31337";
    const chainId = await getChainId();
    if (chainId !== localChainId) {
      const khazumDeployment = await deployments.get("Khazum");
      const khazumAddress = khazumDeployment.address;
      await run("verify:verify", {
        address: khazumAddress,
        contract: "contracts/Khazum.sol:Khazum",
        constructorArguments: [khaTokenAddress],
      });
    }
  } catch (error) {
    console.error("Verification Error =>", error);
  }
};

module.exports.tags = ["Khazum"];
