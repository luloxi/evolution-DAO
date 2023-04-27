import React, { useState, useEffect } from "react";
import { Button, Switch, Card } from "antd";
import { Fancy } from "./";

const { Meta } = Card;

const ProposalCard = ({ proposal, proposalId, tx, writeContracts, readContracts, address }) => {
  const [option, setOption] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const optionAVotes = Number(proposal.votesForOptionA) / 10 ** 18;
  const optionBVotes = Number(proposal.votesForOptionB) / 10 ** 18;
  const hasVotes = optionAVotes > 0 || optionBVotes > 0;

  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000);
    const proposalDeadline = parseInt(proposal.proposalDeadline, 10);
    if (now >= proposalDeadline) {
      setTimeRemaining(null);
    } else {
      const timer = setInterval(() => {
        const timeRemainingSeconds = proposalDeadline - now;
        const hours = Math.floor(timeRemainingSeconds / 3600);
        const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
        const seconds = Math.floor(timeRemainingSeconds % 60);
        setTimeRemaining(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [proposal.proposalDeadline]);

  return (
    <Card
      className="proposal-card"
      actions={[
        <div className={`proposal-switch ${option === 1 ? "switch-container-b" : "switch-container-a"}`}>
          {" "}
          <span className={`option-label ${option === 0 ? "selected-a" : ""}`}>A</span>{" "}
          <Switch className="proposal-switch" checked={option === 1} onChange={checked => setOption(checked ? 1 : 0)} />{" "}
          <span className={`option-label ${option === 1 ? "selected-b" : ""}`}>B</span>{" "}
        </div>,
        <Button
          className="wide-button"
          style={{
            backgroundColor: option === 0 ? "#29BF12" : option === 1 ? "#0081A7" : "initial",
            fontWeight: "bold",
          }}
          onClick={async () => {
            console.log("Proposal ID: ", proposalId);
            const estimatedGas = await writeContracts.Khazum.estimateGas.vote(proposalId, option);
            const result = tx(writeContracts.Khazum.vote(proposalId, option), { gasLimit: estimatedGas }, update => {
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
          <div className="proposal-content">
            <p className="proposal-status">
              {proposal.status === 0 && timeRemaining !== null && (
                <span style={{ fontWeight: "bold", color: "#29bf12" }}>Open to vote</span>
              )}
              {proposal.status === 1 || timeRemaining === null ? (
                <>
                  {!hasVotes && <span style={{ fontWeight: "bold", color: "#ff9914" }}>Ignored</span>}
                  {hasVotes && (
                    <>
                      {optionAVotes > optionBVotes && (
                        <span style={{ fontWeight: "bold", color: "#29bf12" }}>Option A won</span>
                      )}
                      {optionAVotes < optionBVotes && (
                        <span style={{ fontWeight: "bold", color: "#0081a7" }}>Option B won</span>
                      )}
                      {optionAVotes === optionBVotes && (
                        <span style={{ fontWeight: "bold", color: "#ff9914" }}>Tie</span>
                      )}
                    </>
                  )}
                </>
              ) : null}
            </p>
          </div>
          <div className="proposal-content">
            <div className="proposal-column">
              <div className="card-content">
                <div>
                  <p>
                    <span className="vote-label">Proposal Deadline:</span>{" "}
                    {timeRemaining ? timeRemaining : new Date(proposal.proposalDeadline * 1000).toLocaleString()}
                  </p>
                  <p>
                    <span className="vote-label">Minimum Votes:</span> {parseInt(proposal.minimumVotes, 10)}
                  </p>
                </div>
                <div></div>
              </div>
            </div>
            <div className="proposal-column">
              <div className="proposal-content">
                <div className="proposal-column">
                  <div className="proposal-content">
                    <p className="vote-label">Votes for Option A:</p>
                    <p className="vote-count">{optionAVotes}</p>
                  </div>
                </div>
                <div className="proposal-column">
                  <div className="proposal-content">
                    <p className="vote-label">Votes for Option B:</p>
                    <p className="vote-count">{optionBVotes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default ProposalCard;
