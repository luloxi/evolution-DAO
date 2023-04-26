const { ethers } = require("hardhat");
const khaziContractAddress =
  require("../deployments/localhost/Khazi.json").address;

async function main() {
  // Set up the Khazi contract instance
  const contractAddress = khaziContractAddress;
  const Khazi = await ethers.getContractFactory("Khazi");
  const khazi = await Khazi.attach(contractAddress);

  // Set up the proposal details
  const title = "<PROPOSAL_TITLE>"; // i.e: Best ice-cream flavor
  const description = "<PROPOSAL_DESCRIPTION>"; // Option A is Chocolate, Option B is Strawberry
  const proposalDurationInMinutes = "1"; // 1, the minimum amount of minutes for the proposal
  const minimumVotes = "1"; // 1, unless you wanna require more than one voter

  // Create the proposal
  await khazi.createProposal(
    title,
    description,
    proposalDurationInMinutes,
    minimumVotes
  );

  console.log("Proposal created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
