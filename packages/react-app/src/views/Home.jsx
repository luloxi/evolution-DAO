import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { KhaFaucet } from "./";
import ProposalCard from "../views/ProposalCard";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, tx, writeContracts, address }) {
  console.log("Home: account:", address);
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [data, setData] = useState([]);
  // console.log("Home writeContracts:", writeContracts);
  // console.log("Home tx:", tx);

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
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ margin: 32 }}>
        <KhaFaucet readContracts={readContracts} tx={tx} address={address} writeContracts={writeContracts} />
        <Row gutter={[16, 16]}>
          {mapData(data).map((proposal, key) => (
            <Col key={proposal.id} xs={24} sm={24} md={12} lg={8}>
              <ProposalCard proposal={proposal} proposalId={key} tx={tx} writeContracts={writeContracts} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
