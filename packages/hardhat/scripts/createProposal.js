const { ethers } = require("hardhat");
const khazumContractAddress =
  require("../deployments/localhost/Khazum.json").address;

async function main() {
  // Set up the Khazum contract instance
  const contractAddress = khazumContractAddress;
  const Khazum = await ethers.getContractFactory("Khazum");
  const khazum = await Khazum.attach(contractAddress);

  // Set up the proposal details
  const title = "<PROPOSAL_TITLE>"; // i.e: Best ice-cream flavor
  const description = "<PROPOSAL_DESCRIPTION>"; // Option A is Chocolate, Option B is Strawberry
  const proposalDurationInMinutes = "1"; // 1, the minimum amount of minutes for the proposal
  const minimumVotes = "1"; // 1, unless you wanna require more than one voter

  // Create the proposal
  await khazum.createProposal(
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
