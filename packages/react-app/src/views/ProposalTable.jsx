import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import ProposalCard from "../views/ProposalCard";

const ProposalTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/proposals")
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const mapData = data => {
    return data.map(proposal => {
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
      {mapData(data).map(proposal => (
        <Col key={proposal.id} xs={24} sm={12} md={8} lg={6}>
          <ProposalCard proposal={proposal} />
        </Col>
      ))}
    </Row>
  );
};

export default ProposalTable;
