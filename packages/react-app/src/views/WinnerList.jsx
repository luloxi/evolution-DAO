import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

const WinnerList = ({ winners, proposalNumber }) => {
  const recentWinners = winners.slice(-5);

  return (
    <Card title="Recent winners" style={{ maxWidth: 300, margin: "2em auto", textAlign: "center" }}>
      {recentWinners.length > 0 ? (
        recentWinners.map((winner, index) => (
          <Text key={index} style={{ display: "block" }}>
            Proposal #{proposalNumber - index}: {winner.winnerName} - {winner.winnerAddress}
          </Text>
        ))
      ) : (
        <Text>No winners yet</Text>
      )}
    </Card>
  );
};

export default WinnerList;
