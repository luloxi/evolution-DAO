// deploy/01_deploy_khazum.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const khaTokenDeployment = await deployments.get("KhaToken");
  const khaTokenAddress = khaTokenDeployment.address;

  await deploy("Khazum", {
    from: deployer,
    args: [khaTokenAddress],
    log: true,
    waitConfirmations: chainId === localChainId ? 0 : 5,
  });

  const khazum = await ethers.getContract("Khazum", deployer);

  // First proposal parameters
  const title = "Who is your favorite?"; // i.e: Best ice-cream flavor
  const description = "Alice or Bob?"; // Option A is Chocolate, Option B is Strawberry
  const proposalDurationInMinutes = "3"; // Duration of the proposal in minutes
  const minimumVotes = "5"; // Minimum amount of votes the proposal should receive to declare a winner

  // Create a sample proposal if on localhost
  if (chainId == "31337") {
    await khazum.createProposal(
      title,
      description,
      proposalDurationInMinutes,
      minimumVotes
    );
  }

  console.log("Proposal created successfully!");

  try {
    // Verify contract if not on local chain

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
