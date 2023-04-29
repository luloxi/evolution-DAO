import React, { useState, useEffect } from "react";
import { Button, Switch, Card, notification } from "antd";

const { Meta } = Card;
console.log("ProposalCard component loaded");

const ProposalCard = ({ proposal, proposalId, tx, writeContracts, readContracts, address }) => {
  const [option, setOption] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const optionAVotes = Number(proposal.votesForOptionA) / 10 ** 18;
  const optionBVotes = Number(proposal.votesForOptionB) / 10 ** 18;
  const hasVotes = optionAVotes > 0 || optionBVotes > 0;

  // Proposal date and time setter, replace with useInterval for a live countdown in a future version

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
  }, [proposal.proposalDeadline, readContracts.Khazum]);

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
        <div className={`switch-container ${option === 1 ? "switch-container-b" : "switch-container-a"}`}>
          {" "}
          <span className={`option-label ${option === 0 ? "selected-a" : "not-selected-a"}`}>A</span>{" "}
          <Switch
            className="switch-container"
            checked={option === 1}
            onChange={checked => setOption(checked ? 1 : 0)}
          />{" "}
          <span className={`option-label ${option === 1 ? "selected-b" : "not-selected-"}`}>B</span>{" "}
        </div>,
        <Button
          style={{
            backgroundColor:
              proposal.status === 1 ? "#cccccc" : option === 0 ? "#f35b04" : option === 1 ? "#0081a7" : "initial",
            fontWeight: "bold",
          }}
          onClick={async () => {
            try {
              const result = tx(writeContracts.Khazum.vote(proposalId, option), update => {
                console.log("Transaction result:", result);
                console.log("📡 Transaction Update:", update);
                console.log("Transaction status:", update.status);
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
            } catch (error) {
              console.error("Error:", error);
              openNotification("error", "Error", error);
            }
          }}
        >
          {option === 0 ? "Vote Option A" : option === 1 ? "Vote Option B" : "Vote!"}
        </Button>,
      ]}
    >
      {proposal && (
        <>
          <Meta
            title={"Proposal #" + proposalId + ": " + proposal.title.toString()}
            description={proposal.description.toString()}
          />
          <div className="proposal-content">
            <p className="proposal-status">
              {proposal.status === 0 &&
                timeRemaining !== null &&
                optionAVotes + optionBVotes >= proposal.minimumVotes && (
                  <span style={{ fontWeight: "bold", color: "#29bf12" }}>Open to vote</span>
                )}
              {proposal.status === 0 &&
                timeRemaining !== null &&
                optionAVotes + optionBVotes < proposal.minimumVotes && (
                  <span style={{ fontWeight: "bold", color: "#29bf12" }}>Open to vote</span>
                )}

              {((proposal.status === 1 && hasVotes) || timeRemaining === null) && (
                <>
                  {optionAVotes > optionBVotes && optionAVotes + optionBVotes >= proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#f35b04" }}>Option A won</span>
                  )}
                  {optionAVotes < optionBVotes && optionAVotes + optionBVotes >= proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#0081a7" }}>Option B won</span>
                  )}
                  {optionAVotes === optionBVotes && optionAVotes + optionBVotes >= proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#ff9914" }}>Tie</span>
                  )}
                  {optionAVotes + optionBVotes < proposal.minimumVotes && (
                    <span style={{ fontWeight: "bold", color: "#db3a34" }}>Minimum votes not met</span>
                  )}
                </>
              )}

              {proposal.status === 1 && !hasVotes && timeRemaining === null && (
                <span style={{ fontWeight: "bold", color: "#ff9914" }}>Ignored</span>
              )}
            </p>
          </div>
          <div className="proposal-content">
            <div className="proposal-column">
              <div className="card-content">
                <div>
                  <p>
                    <span className="vote-label">Proposal Deadline:</span>
                    <br /> {timeRemaining ? timeRemaining : new Date(proposal.proposalDeadline * 1000).toLocaleString()}
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
                    <p className="vote-label vote-label-a"> Votes for Option A: </p>
                    <p className="vote-count">{optionAVotes}</p>
                  </div>
                </div>
                <div className="proposal-column">
                  <div className="proposal-content">
                    <p className="vote-label vote-label-b">Votes for Option B:</p>
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
