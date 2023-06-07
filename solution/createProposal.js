const { ethers } = require("hardhat");
const khaziContractAddress =
  require("../deployments/localhost/Khazi.json").address;

async function main() {
  // Khazi contract connection
  const Khazi = await ethers.getContractFactory("Khazi");
  const khazi = await Khazi.attach(khaziContractAddress);

  // Set up the proposal details
  const title = "Best animal?"; // You can make title shorter
  const optionA = "Alpaca";
  const optionB = "Buffalo";
  const deadline = "2"; // Number of minutes

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
