const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const KhazumABI = require("../hardhat/artifacts/contracts/Khazum.sol/Khazum.json");
const Khazum = require("../hardhat/deployments/localhost/Khazum.json");
const app = express();

const khazumContractAddress = Khazum.address;
const provider = ethers.getDefaultProvider("http://localhost:8545");
const khazumContract = new ethers.Contract(
  khazumContractAddress,
  KhazumABI.abi,
  provider
);

// enable CORS for all routes
app.use(cors());

app.get("/proposals", async (req, res) => {
  const proposalCount = await khazumContract.getProposalCount();
  const proposals = [];
  console.log("Got a proposal request, yay!");

  for (let i = 0; i < proposalCount; i++) {
    const proposal = await khazumContract.getProposal(i);
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
