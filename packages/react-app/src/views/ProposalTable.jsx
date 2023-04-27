// Container of Component

import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import ProposalCard from "../views/ProposalCard";

const ProposalTable = (tx, writeContracts) => {
  const [data, setData] = useState([]);
  console.log("ProposalTable writeContracts:", writeContracts);
  console.log("ProposalTable tx:", tx);

  useEffect(() => {
    fetch("http://localhost:3001/proposals")
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const mapData = data => {
    return data.map((proposal, key) => {
      // console.log("Proposal content:", proposal);
      // console.log("Proposal key:", key);
      return {
        ...proposal,
        proposalDeadline: parseInt(proposal.proposalDeadline, 10),
        minimumVotes: parseInt(proposal.minimumVotes, 10),
        votesForOptionA: parseInt(proposal.votesForOptionA, 10),
        votesForOptionB: parseInt(proposal.votesForOptionB, 10),
      };
    });
  };

  return (
    <Row gutter={[16, 16]}>
      {mapData(data).map((proposal, key) => (
        <Col key={proposal.id} xs={24} sm={24} md={12} lg={8}>
          <ProposalCard proposal={proposal} proposalId={key} tx={tx} writeContracts={writeContracts} />
        </Col>
      ))}
    </Row>
  );
};

export default ProposalTable;
