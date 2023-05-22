import { Button, Card } from "antd";
import { useContractReader } from "eth-hooks";

const { Meta } = Card;
console.log("ProposalCard component loaded");

const ProposalCard = ({ proposal, proposalId, tx, readContracts, writeContracts, address }) => {
  // Deadline calculation
  const deadlineDate = proposal.deadline ? new Date(proposal.deadline * 1000) : null;

  // HasVoted reading
  const hasVoted = useContractReader(readContracts, "Khazi", "hasVoted", [proposalId, address]);

  // Winner or tie message
  let winnerMessage = "Open for voting";
  if (proposal.deadline && Date.now() > proposal.deadline * 1000) {
    if (proposal.votesForOptionA > proposal.votesForOptionB) {
      winnerMessage = "Winner: " + proposal.optionA;
    } else if (proposal.votesForOptionA < proposal.votesForOptionB) {
      winnerMessage = "Winner: " + proposal.optionB;
    } else if (proposal.votesForOptionA == proposal.votesForOptionB) {
      winnerMessage = "Tie";
    }
  }

  return (
    <Card
      className="proposal-card"
      actions={[
        <Button
          style={{
            backgroundColor: "#f35b04",
            fontWeight: "bold",
          }}
          onClick={async () => {
            try {
              const result = tx(writeContracts.Khazi.vote(proposalId, false), update => {
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
          Vote for Option A
        </Button>,
        <Button
          style={{
            backgroundColor: "#0081a7",
            fontWeight: "bold",
          }}
          onClick={async () => {
            try {
              const result = tx(writeContracts.Khazi.vote(proposalId, true), update => {
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
          Vote for Option B
        </Button>,
      ]}
    >
      {proposal && (
        <>
          <Meta title={"#" + proposalId + ": " + proposal.title.toString()} />

          {deadlineDate && (
            <div className="proposal-content">
              <p className="deadline" style={{ textAlign: "center" }}>
                Deadline: {deadlineDate.toLocaleString()}
              </p>
            </div>
          )}

          {winnerMessage && (
            <div className="proposal-content">
              <p style={{ fontWeight: "bold", marginTop: "8px" }}>{winnerMessage}</p>
            </div>
          )}
          <div className="proposal-content">
            <div className="proposal-column">
              <div className="proposal-content">
                <p className="vote-label vote-label-a">
                  {proposal.optionA ? `Votes for ${proposal.optionA}:` : "Votes for Option A:"}
                </p>
              </div>
              <div className="proposal-content">
                <p className="vote-count">{proposal.votesForOptionA}</p>
              </div>
            </div>
            <div className="proposal-column">
              <div className="proposal-content">
                <p className="vote-label vote-label-b">
                  {proposal.optionB ? `Votes for ${proposal.optionB}:` : "Votes for Option B:"}
                </p>
              </div>
              <div className="proposal-content">
                <p className="vote-count">{proposal.votesForOptionB}</p>
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
