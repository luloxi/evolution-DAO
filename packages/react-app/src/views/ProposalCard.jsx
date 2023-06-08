import React, { useState, useEffect } from "react";
import { Button, Card, notification } from "antd";
import { useContractReader } from "eth-hooks";

console.log("ProposalCard component loaded");

const ProposalCard = ({ proposal, proposalId, tx, writeContracts, readContracts, address }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  // HasVoted reading
  const hasVoted = useContractReader(readContracts, "Khazum", "viewHasVoted", [proposalId, address]);

  const optionAVotes = Number(proposal.votesForOptionA) / 10 ** 18;
  const optionBVotes = Number(proposal.votesForOptionB) / 10 ** 18;
  const hasVotes = optionAVotes > 0 || optionBVotes > 0;

  // Date and time, and countdown setter.

  useEffect(() => {
    const proposalDeadline = parseInt(proposal.proposalDeadline, 10);

    const timer = setInterval(() => {
      const now = Math.floor(new Date().getTime() / 1000);

      if (now >= proposalDeadline) {
        setTimeRemaining(null);
        clearInterval(timer);
      } else {
        const timeRemainingSeconds = proposalDeadline - now;
        const hours = Math.floor(timeRemainingSeconds / 3600);
        const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
        const seconds = Math.floor(timeRemainingSeconds % 60);
        setTimeRemaining(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [proposal.proposalDeadline, readContracts.Khazum]);

  // Makig deadline text dynamic

  const deadlineMessage = () => {
    const now = Math.floor(new Date().getTime() / 1000);
    const proposalDeadline = parseInt(proposal.proposalDeadline, 10);
    if (now >= proposalDeadline) {
      return {
        message: "Ended on:",
        color: "#db3a34",
      };
    } else {
      return {
        message: "Time left:",
        color: "#29bf12",
      };
    }
  };

  // Vote handling

  const handleVote = async (proposalId, option) => {
    try {
      const result = await tx(writeContracts.Khazum.vote(proposalId, option));
      console.log("awaiting metamask/web3 confirm result...", result);
      console.log(await result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Error handling

  const openNotification = (type, message, error) => {
    const chunkString = (str, length) => {
      return str.match(new RegExp(`.{1,${length}}`, "g"));
    };
    const errorMessage = chunkString(error.message, 36).join("\n");
    notification[type]({
      message: message,
      description: (
        <pre
          style={{
            maxHeight: "10em",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            width: "100%",
          }}
        >
          {errorMessage}
        </pre>
      ),
    });
  };

  return (
    <Card
      className="proposal-card"
      actions={[
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Voting buttons */}
          <div>
            <Button
              style={{
                backgroundColor: "#f35b04",
                fontWeight: "bold",
              }}
              onClick={() => handleVote(proposalId, 0)}
            >
              Vote for {proposal.nameForOptionA ? proposal.nameForOptionA : "Option A"}
            </Button>
          </div>
          <div>
            <Button
              style={{
                backgroundColor: "#0081a7",
                fontWeight: "bold",
              }}
              onClick={() => handleVote(proposalId, 1)}
            >
              Vote for {proposal.nameForOptionB ? proposal.nameForOptionB : "Option B"}
            </Button>
          </div>
        </div>,
        /* Execute Proposal button */
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={proposal.status === 0 || proposal.status === 2 || timeRemaining !== null}
            onClick={async () => {
              try {
                const result = tx(writeContracts.Khazum.executeProposal(proposalId));
                console.log("awaiting metamask/web3 confirm result...", result);
                console.log(await result);
              } catch (error) {
                console.error("Error:", error);
                openNotification("error", "Error", error);
              }
            }}
          >
            Execute Proposal
          </Button>
        </div>,
      ]}
    >
      {proposal && (
        <>
          <h2>{"Proposal #" + proposalId + ": " + proposal.title.toString()}</h2>
          <div className="proposal-content">
            <p className="proposal-status">
              {proposal.status === 0 &&
                timeRemaining !== null &&
                optionAVotes + optionBVotes < proposal.minimumVotes && (
                  <span style={{ fontWeight: "bold", color: "#29bf12" }}>Open to vote</span>
                )}

              {((proposal.status === 1 && hasVotes) || timeRemaining === null) && (
                <>
                  {optionAVotes > optionBVotes && optionAVotes + optionBVotes >= proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#f35b04" }}>
                      {proposal.nameForOptionA ? proposal.nameForOptionA : "Option A"} won
                    </span>
                  )}
                  {optionAVotes < optionBVotes && optionAVotes + optionBVotes >= proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#0081a7" }}>
                      {proposal.nameForOptionB ? proposal.nameForOptionB : "Option B"} won
                    </span>
                  )}
                  {optionAVotes === optionBVotes && optionAVotes + optionBVotes >= proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#ff9914" }}>Tie</span>
                  )}
                  {hasVotes && optionAVotes + optionBVotes < proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#db3a34" }}>Minimum votes not met</span>
                  )}
                  {!hasVotes && timeRemaining === null && (
                    <span style={{ fontWeight: "bold", color: "#ff9914" }}>Ignored</span>
                  )}
                </>
              )}
            </p>
          </div>
          <div className="proposal-content">
            <div className="proposal-column">
              <div className="card-content">
                <div>
                  <p>
                    <span className="vote-label" style={{ color: deadlineMessage().color }}>
                      {deadlineMessage().message}
                    </span>
                    <br />
                    {timeRemaining ? timeRemaining : new Date(proposal.proposalDeadline * 1000).toLocaleString()}
                  </p>
                  {proposal.minimumVotes && (
                    <p>
                      <span className="vote-label">Minimum Votes:</span> {parseInt(proposal.minimumVotes, 10)}
                    </p>
                  )}
                </div>
                <div></div>
              </div>
            </div>
            <div className="proposal-column">
              <div className="proposal-content">
                <div className="proposal-column">
                  <div className="proposal-content">
                    <p className="vote-label vote-label-a">
                      {" "}
                      Votes for {proposal.nameForOptionA ? proposal.nameForOptionA : "Option A"}:{" "}
                    </p>
                    <p className="vote-count">{optionAVotes}</p>
                  </div>
                </div>
                <div className="proposal-column">
                  <div className="proposal-content">
                    <p className="vote-label vote-label-b">
                      Votes for {proposal.nameForOptionB ? proposal.nameForOptionB : "Option B"}:
                    </p>
                    <p className="vote-count">{optionBVotes}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="proposal-content" style={{ textAlign: "center" }}>
              <p>
                Have YOU voted in this proposal?{" "}
                <span
                  style={{
                    backgroundColor: hasVoted ? "green" : "red",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {hasVoted ? "YES" : "NO"}
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
