import { useContractLoader, useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { KhaFaucet } from "./";
import ProposalCard from "../views/ProposalCard";

function Home({ yourLocalBalance, readContracts, tx, writeContracts, address }) {
  const [proposals, setProposals] = useState([]);

  const proposalCount = useContractReader(readContracts, "Khazum", "getProposalCount");

  useEffect(() => {
    if (proposalCount && proposalCount.gt(0)) {
      const promises = [];

      for (let i = 0; i < proposalCount.toNumber(); i++) {
        promises.push(
          readContracts.Khazum.proposals(i).then(proposal => {
            return {
              ...proposal,
              proposalDeadline: parseInt(proposal.proposalDeadline, 10),
              minimumVotes: parseInt(proposal.minimumVotes, 10),
              votesForOptionA: parseInt(proposal.votesForOptionA, 10),
              votesForOptionB: parseInt(proposal.votesForOptionB, 10),
            };
          }),
        );
      }

      Promise.all(promises).then(results => {
        setProposals(results);
      });
    }
  }, [proposalCount]);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ margin: 32 }}>
        <KhaFaucet readContracts={readContracts} tx={tx} address={address} writeContracts={writeContracts} />
        <Row gutter={[16, 16]}>
          {proposals.map((proposal, key) => (
            <Col key={key} xs={24} sm={24} md={12} lg={8}>
              <ProposalCard
                proposal={proposal}
                proposalId={key}
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
