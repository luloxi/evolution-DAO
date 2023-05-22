const { ethers } = require("hardhat");
const khaziContractAddress =
  require("../deployments/localhost/Khazi.json").address;

async function main() {
  // Khazi contract connection
  const Khazi = await ethers.getContractFactory("Khazi");
  const khazi = await Khazi.attach(khaziContractAddress);

  // Checkpoint 3: Add const variables for optionA and optionB.
  // Checkpoint 4: Add a const variable for deadline. Remember it holds the number of minutes the proposal will remain open
  // Set up the proposal details
  const title = "Best animal? (A: Alpaca | B: Buffalo)"; // You can make title shorter

  // Checkpoint 3: Add optionA and optionB as arguments to createProposal
  // Checkpoint 4: Add deadline as argument to createProposal
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
