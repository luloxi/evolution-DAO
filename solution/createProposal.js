const { ethers } = require("hardhat");
const khazumContractAddress =
  require("../deployments/localhost/Khazum.json").address;

async function main() {
  // Checkpoint 3: Create a const called minimumVotes and set it to the amount of votes the proposal should receive to declare a winner
  // Checkpoint 4: Create a const for each option address and name
  /* Setting up the proposal details */
  const title = "Who's the next donation receiver?"; // Title of your proposal
  const proposalDurationInMinutes = "3"; // Duration of the proposal in minutes
  const minimumVotes = "10";
  const optionA = "0xfBD9Ca40386A8C632cf0529bbb16b4BEdB59a0A0";
  const optionB = "0x97843608a00e2bbc75ab0C1911387E002565DEDE";
  const nameForOptionA = "Save the cats";
  const nameForOptionB = "Save the dogs";

  /* Getting the Khazum contract instance */
  const contractAddress = khazumContractAddress;
  const Khazum = await ethers.getContractFactory("Khazum");
  const khazum = await Khazum.attach(contractAddress);

  // Checkpoint 3: Add minimumVotes as an argument to the createProposal call
  // Checkpoint 4: Add option address and names as arguments to the createProposal call
  /* Calling functions on the Khazum contract instance */
  await khazum.createProposal(
    title,
    proposalDurationInMinutes,
    minimumVotes,
    optionA,
    optionB,
    nameForOptionA,
    nameForOptionB
  );

  console.log("Proposal created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });