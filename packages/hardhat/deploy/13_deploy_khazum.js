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

  const khazum = await ethers.getContract("Khazum", deployer);

  // First proposal parameters
  const title = "Alice or Bob?"; // i.e: Best ice-cream flavor
  const description = "Who is your favorite?"; // Option A is Chocolate, Option B is Strawberry
  const proposalDurationInMinutes = "3"; // minimum amount of minutes for the proposal
  const minimumVotes = "1"; // 1, unless you wanna require more than one voter for declaring a winner

  // Create the proposal
  await khazum.createProposal(
    title,
    description,
    proposalDurationInMinutes,
    minimumVotes
  );

  console.log("Proposal created successfully!");

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
