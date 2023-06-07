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
            };
          }),
        );
      }

      // Set the list of proposals,
      // with the order reversed to show the newest at the top

      Promise.all(promises).then(results => {
        setProposals(results);
      });
    }
  }, [proposalCount, readContracts.Khazi]);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ margin: 32 }}>
        <Row gutter={[16, 16]} justify="end">
          {proposals.map((proposal, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={8}>
              <ProposalCard
                proposal={proposal}
                proposalId={index}
                tx={tx}
                readContracts={readContracts}
                writeContracts={writeContracts}
                address={address}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
