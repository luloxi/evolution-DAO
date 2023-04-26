const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const KhaziABI = require("../hardhat/artifacts/contracts/Khazi.sol/Khazi.json");
const Khazi = require("../hardhat/deployments/localhost/Khazi.json");
const app = express();

const khaziContractAddress = Khazi.address;
const provider = ethers.getDefaultProvider("http://localhost:8545");
const khaziContract = new ethers.Contract(
  khaziContractAddress,
  KhaziABI.abi,
  provider
);

// enable CORS for all routes
app.use(cors());

app.get("/proposals", async (req, res) => {
  const proposalCount = await khaziContract.getProposalCount();
  const proposals = [];
  console.log("Got a proposal request, yay!");

  for (let i = 0; i < proposalCount; i++) {
    const proposal = await khaziContract.getProposal(i);
    proposals.push({
      title: proposal.title,
      description: proposal.description,
      proposalDeadline: proposal.proposalDeadline.toString(),
      minimumVotes: proposal.minimumVotes.toString(),
      votesForOptionA: proposal.votesForOptionA.toString(),
      votesForOptionB: proposal.votesForOptionB.toString(),
      status: proposal.status.toString(),
    });
  }

  res.json(proposals);
});

app.listen(3001, () => console.log("API listening on port 3001..."));
