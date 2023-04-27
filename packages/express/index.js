const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// read the latest contract address and ABI from the deployment JSON file
const deploymentData = JSON.parse(
  fs.readFileSync("../hardhat/deployments/localhost/Khazum.json")
);
const khazumContractAddress = deploymentData.address;
const KhazumABI = deploymentData.abi;

const provider = ethers.getDefaultProvider("http://localhost:8545");
const khazumContract = new ethers.Contract(
  khazumContractAddress,
  KhazumABI,
  provider
);

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

  // app.post("/vote", async (req, res) => {
  //   const { proposalId, option, signerAddress } = req.body;

  //   try {
  //     const signer = provider.getSigner(signerAddress);
  //     const connectedContract = khazumContract.connect(signer);

  //     const tx = await connectedContract.vote(proposalId, option);
  //     await tx.wait();

  //     res.json({ success: true, message: "Vote processed successfully" });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ success: false, message: "Failed to process vote" });
  //   }
  // });

  res.json(proposals);
});

app.listen(3001, () => console.log("API listening on port 3001..."));
