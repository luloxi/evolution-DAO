import React, { useState, useEffect } from "react";
import { Card, Button, Switch } from "antd";
import "./Fancy.css";

const { Meta } = Card;

const ProposalCard = ({ proposal, proposalId, tx, writeContracts }) => {
  // console.log("Khazum:", writeContracts.Khazum);
  //   console.log("ProposalCard tx:", tx);
  //   console.log(proposalId);
  const [option, setOption] = useState(0); // initialize the option state with 0

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
      actions={[
        <Switch
          className={`proposal-switch ${option === 1 ? "switch-container-b" : "switch-container-a"}`}
          checked={option === 1}
          onChange={checked => setOption(checked ? 1 : 0)}
        />,
        <Button
          className="vote-button"
          style={{
            // marginTop: 8,
            backgroundColor: option === 0 ? "#29BF12" : option === 1 ? "#0081A7" : "initial",
            width: "75%", // change the width to 75%
            fontWeight: "bold", // add a bold font weight
            height: "40px", // increase the height
          }}
          onClick={async () => {
            const result = tx(writeContracts.Khazum.vote(proposalId, option), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
          }}
        >
          {option === 0 ? "Vote Option A" : option === 1 ? "Vote Option B" : "Vote!"}
        </Button>,
      ]}
    >
      {proposal && (
        <>
          <Meta title={proposal.title.toString()} description={proposal.description.toString()} />
          <br />
          <div className="card-content">
            <div>
              <p>
                Proposal Deadline:{" "}
                {timeRemaining ? timeRemaining : new Date(proposal.proposalDeadline * 1000).toLocaleString()}
              </p>
              <p>Minimum Votes: {parseInt(proposal.minimumVotes, 10)}</p>
            </div>
            <div>
              <p>Votes for Option A: {parseInt(proposal.votesForOptionA, 10) / (10 ** 18).toFixed(2)}</p>
              <p>Votes for Option B: {parseInt(proposal.votesForOptionB, 10) / (10 ** 18).toFixed(2)}</p>

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
                        ? "#29bf12"
                        : "#0081a7",
                  }}
                >
                  {status}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default ProposalCard;
