import React, { useState } from "react";
import { Button, Switch, Card } from "antd";

const { Meta } = Card;
console.log("ProposalCard component loaded");

const ProposalCard = ({ proposal, proposalId, tx, writeContracts, readContracts, address }) => {
  const [option, setOption] = useState(0);

  const optionAVotes = Number(proposal.votesForOptionA) / 10 ** 18;
  const optionBVotes = Number(proposal.votesForOptionB) / 10 ** 18;

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
              const result = tx(writeContracts.Khazi.vote(proposalId, option), update => {
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
            }
          }}
        >
          {option === 0 ? "Vote Option A" : option === 1 ? "Vote Option B" : "Vote!"}
        </Button>,
      ]}
    >
      {proposal && (
        <>
          <Meta title={"Proposal #" + proposalId + ": " + proposal.title.toString()} />
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
        </>
      )}
    </Card>
  );
};

export default ProposalCard;
