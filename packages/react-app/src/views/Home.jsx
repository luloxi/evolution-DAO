import { useContractReader } from "eth-hooks";
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import ProposalCard from "../views/ProposalCard";

function Home({ yourLocalBalance, readContracts, tx, writeContracts, address }) {
  const [proposals, setProposals] = useState([]);

  const proposalCount = useContractReader(readContracts, "Khazi", "getProposalCount");

  // Information retrieve

  useEffect(() => {
    if (proposalCount && proposalCount.gt(0)) {
      const promises = [];

      // Search and retrieve data from all the proposals according to proposalCount

      for (let i = 0; i < proposalCount.toNumber(); i++) {
        promises.push(
          readContracts.Khazi.proposals(i).then(proposal => {
            return {
              ...proposal,
              votesForOptionA: parseInt(proposal.votesForOptionA, 10),
              votesForOptionB: parseInt(proposal.votesForOptionB, 10),
            };
          }),
        );
      }

      // Set the list of proposals,
      // with the order reversed to show the newest at the top

      Promise.all(promises).then(results => {
        setProposals(results.reverse());
      });
    }
  }, [proposalCount, readContracts.Khazi]);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ margin: 32 }}>
        <Row gutter={[16, 16]}>
          {proposals.map((proposal, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={8}>
              <ProposalCard
                proposal={proposal}
                proposalId={proposals.length - index - 1}
                tx={tx}
                readContracts={readContracts}
                writeContracts={writeContracts}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
