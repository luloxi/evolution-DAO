import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { ethers } from "ethers";
// import KhazumABI from "../../../hardhat/artifacts/contracts/Khazum.sol";
// import KhazumDeployment from "../../../hardhat/deployments/localhost/Khazum.json";
import "./Fancy.css";

const { Meta } = Card;

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const contractAddress = KhazumDeployment.address; // the address of the deployed contract
// const contractAbi = KhazumABI; // the ABI of the contract
// const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const ProposalCard = ({ proposal }) => {
  //   const handleVoteOptionA = async () => {
  //     const signer = provider.getSigner();
  //     const updatedProposal = {
  //       ...proposal,
  //       votesForOptionA: proposal.votesForOptionA + 1,
  //     };
  //     console.log(`Voted Option A for proposal ${proposal.title}`);
  //     try {
  //       const tx = await contract.vote(proposal.id, 0).connect(signer);
  //       console.log(tx);
  //       // Call a function to update the proposal in the database or state
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const handleVoteOptionB = async () => {
  //     const signer = provider.getSigner();
  //     const updatedProposal = {
  //       ...proposal,
  //       votesForOptionB: proposal.votesForOptionB + 1,
  //     };
  //     console.log(`Voted Option B for proposal ${proposal.title}`);
  //     try {
  //       const tx = await contract.vote(proposal.id, 1).connect(signer);
  //       console.log(tx);
  //       // Call a function to update the proposal in the database or state
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  const mapProposalStatus = proposal => {
    const now = Date.now() / 1000;
    const proposalDeadline = parseInt(proposal.proposalDeadline, 10);

    if (now < proposalDeadline) {
      return "Pending";
    } else if (proposal.votesForOptionA + proposal.votesForOptionB < proposal.minimumVotes) {
      return "Closed";
    } else if (proposal.votesForOptionA > proposal.votesForOptionB) {
      return "Option A won";
    } else if (proposal.votesForOptionB > proposal.votesForOptionA) {
      return "Option B won";
    } else {
      return "Finished";
    }
  };

  const [timeRemaining, setTimeRemaining] = useState(null);
  const [status, setStatus] = useState(mapProposalStatus(proposal));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now() / 1000;
      const proposalDeadline = parseInt(proposal.proposalDeadline, 10);

      if (now >= proposalDeadline) {
        clearInterval(timer);
        setStatus(mapProposalStatus(proposal));
        setTimeRemaining(null);
      } else {
        setStatus("Pending");
        const timeRemainingSeconds = proposalDeadline - now;
        const hours = Math.floor(timeRemainingSeconds / 3600);
        const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
        const seconds = Math.floor(timeRemainingSeconds % 60);
        setTimeRemaining(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [proposal.proposalDeadline, mapProposalStatus]);

  return (
    <Card
      className="proposal-card"
      actions={
        [
          // <Button key="optionA" onClick={handleVoteOptionA}>
          //   Vote Option A
          // </Button>,
          // <Button key="optionB" onClick={handleVoteOptionB}>
          //   Vote Option B
          // </Button>,
        ]
      }
    >
      {proposal && (
        <>
          <Meta title={proposal.title.toString()} description={proposal.description.toString()} />
          <br />
          <p>
            Proposal Deadline:{" "}
            {timeRemaining ? timeRemaining : new Date(proposal.proposalDeadline * 1000).toLocaleString()}
          </p>
          <p>Minimum Votes: {parseInt(proposal.minimumVotes, 10)}</p>
          <p>Votes for Option A: {parseInt(proposal.votesForOptionA, 10)}</p>
          <p>Votes for Option B: {parseInt(proposal.votesForOptionB, 10)}</p>
          <p>
            Status:{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  status === "Pending"
                    ? "#29bf12"
                    : status === "Closed"
                    ? "#ff9914"
                    : status === "Option A won"
                    ? "#f07167"
                    : "#0081a7",
              }}
            >
              {status}
            </span>
          </p>
        </>
      )}
    </Card>
  );
};

export default ProposalCard;
