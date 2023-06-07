import { useContractReader } from "eth-hooks";
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { KhaFaucet } from "./";
import ProposalCard from "./ProposalCard";
import WinnerList from "./WinnerList";

function Home({ yourLocalBalance, readContracts, tx, writeContracts, address }) {
  const [proposals, setProposals] = useState([]);
  const [winners, setWinners] = useState([]);

  const proposalCount = useContractReader(readContracts, "Khazum", "getProposalCount");

  /* Fetch proposals */
  useEffect(() => {
    if (proposalCount && proposalCount.gt(0)) {
      const promises = [];

      // Search and retrieve data from all the proposals according to proposalCount
      for (let i = proposalCount.toNumber() - 1; i >= 0; i--) {
        promises.push(
          readContracts.Khazum.proposals(i).then(proposal => {
            return {
              ...proposal,
            };
          }),
        );
      }

      Promise.all(promises).then(results => {
        setProposals(results);
      });
    }
  }, [proposalCount, readContracts.Khazum]);

  /* Fetch winners */
  const fetchWinners = async () => {
    const winnerList = [];
    for (let i = 0; i < proposalCount; i++) {
      const [winnerName, winnerAddress] = await readContracts.Khazum.getWinner(i);
      winnerList.push({ winnerName: winnerName, winnerAddress: winnerAddress });
    }
    setWinners(winnerList);
  };

  useEffect(() => {
    fetchWinners();
  }, [readContracts]);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div style={{ margin: 32 }}>
        <KhaFaucet readContracts={readContracts} tx={tx} address={address} writeContracts={writeContracts} />
        <WinnerList winners={winners} />
        <Row gutter={[16, 16]} justify="end">
          {/* Render each proposal card */}
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
