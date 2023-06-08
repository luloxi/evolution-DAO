const { ethers } = require("hardhat");
const khazumContractAddress =
  require("../deployments/localhost/Khazum.json").address;

async function main() {
  // Checkpoint 3: Create a const called minimumVotes and set it to the amount of votes the proposal should receive to declare a winner
  // Checkpoint 4: Create a const for each option address and name
  /* Setting up the proposal details */
  const title =
    "Who's the next donation receiver? (A: Save the cats | B: Save the dogs)"; // Title of your proposal
  const proposalDurationInMinutes = "3"; // Duration of the proposal in minutes

  /* Getting the Khazum contract instance */
  const contractAddress = khazumContractAddress;
  const Khazum = await ethers.getContractFactory("Khazum");
  const khazum = await Khazum.attach(contractAddress);

  // Checkpoint 3: Add minimumVotes as an argument to the createProposal call
  // Checkpoint 4: Add option address and names as arguments to the createProposal call
  /* Calling functions on the Khazum contract instance */
  await khazum.createProposal(title, proposalDurationInMinutes);

  console.log("Proposal created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
