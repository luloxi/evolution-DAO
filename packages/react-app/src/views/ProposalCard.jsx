import { Button, Card } from "antd";

const { Meta } = Card;
console.log("ProposalCard component loaded");

const ProposalCard = ({ proposal, proposalId, tx, writeContracts }) => {
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
          <div className="proposal-content">
            <div className="proposal-column">
              <div className="proposal-content">
                <p className="vote-label vote-label-a">Votes for Option A:</p>
              </div>
              <div className="proposal-content">
                <p className="vote-count">{proposal.votesForOptionA}</p>
              </div>
            </div>
            <div className="proposal-column">
              <div className="proposal-content">
                <p className="vote-label vote-label-b">Votes for Option B:</p>
              </div>
              <div className="proposal-content">
                <p className="vote-count">{proposal.votesForOptionB}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default ProposalCard;
