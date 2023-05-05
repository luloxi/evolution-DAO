const { ethers } = require("hardhat");
const khaziContractAddress =
  require("../deployments/localhost/Khazi.json").address;

async function main() {
  // Set up the proposal details
  const title = "What's your favorite animal?"; // Title of your proposal

  // Set up the Khazi contract instance
  const contractAddress = khaziContractAddress;
  const Khazi = await ethers.getContractFactory("Khazi");
  const khazi = await Khazi.attach(contractAddress);

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
