const { ethers } = require("hardhat");
const khazumContractAddress =
  require("../deployments/localhost/Khazum.json").address;

async function main() {
  // Set up the proposal details
  const title = "What's your favorite animal?"; // Title of your proposal
  const description = "Alpaca or Bison?"; // Option A is Chocolate, Option B is Strawberry
  const proposalDurationInMinutes = "3"; // Duration of the proposal in minutes
  const minimumVotes = "15"; // Minimum amount of votes the proposal should receive to declare a winner

  // Set up the Khazum contract instance
  const contractAddress = khazumContractAddress;
  const Khazum = await ethers.getContractFactory("Khazum");
  const khazum = await Khazum.attach(contractAddress);

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
