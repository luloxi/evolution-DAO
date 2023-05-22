const { ethers } = require("hardhat");
const khaziContractAddress =
  require("../deployments/localhost/Khazi.json").address;

async function main() {
  // Set up the proposal details
  const title = "Best animal? (A: Alpaca | B: Buffalo)";
  const optionA = "Alpaca";
  const optionB = "Buffalo";

  // Khazi contract connection
  const Khazi = await ethers.getContractFactory("Khazi");
  const khazi = await Khazi.attach(khaziContractAddress);

  // Checkpoint 3: Add optionA and optionB as arguments to createProposal
  // Create the proposal
  await khazi.createProposal(title);

  console.log("Proposal created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
