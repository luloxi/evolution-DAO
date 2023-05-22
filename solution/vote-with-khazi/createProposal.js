const { ethers } = require("hardhat");
const khaziContractAddress =
  require("../deployments/localhost/Khazi.json").address;

async function main() {
  // Khazi contract connection
  const Khazi = await ethers.getContractFactory("Khazi");
  const khazi = await Khazi.attach(khaziContractAddress);

  // Set up the proposal details
  const title = "Best Solidity development suite?"; // You can make title shorter
  const optionA = "Hardhat";
  const optionB = "Foundry";
  const deadline = "3600"; // Number of minutes

  // Checkpoint 3: Add optionA and optionB as arguments to createProposal
  // Checkpoint 4: Add deadline as argument to createProposal
  // Create the proposal
  await khazi.createProposal(title, optionA, optionB, deadline);

  console.log("Proposal created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
