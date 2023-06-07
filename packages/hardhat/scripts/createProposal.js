const { ethers } = require("hardhat");
const khazumContractAddress =
  require("../deployments/localhost/Khazum.json").address;

async function main() {
  /* Set up the proposal details */
  const title = "What's your favorite animal? (A: Alpaca | B: Bison)"; // Title of your proposal
  const proposalDurationInMinutes = "3"; // Duration of the proposal in minutes
  const minimumVotes = "15"; // Minimum amount of votes the proposal should receive to declare a winner

  /* Set up the Khazum contract instance */
  const contractAddress = khazumContractAddress;
  const Khazum = await ethers.getContractFactory("Khazum");
  const khazum = await Khazum.attach(contractAddress);

  /* Create the proposal */
  await khazum.createProposal(title, proposalDurationInMinutes, minimumVotes);

  console.log("Proposal created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
