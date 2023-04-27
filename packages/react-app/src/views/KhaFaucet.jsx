import React, { useState } from "react";
import { Button, Input, Typography, Card } from "antd";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

const { Text } = Typography;

export default function KhaFaucetUI({ tx, writeContracts, readContracts, address }) {
  // const [amount, setAmount] = useState(0);

  const faucetBalance = useContractReader(readContracts, "KhaFaucet", "balanceOf", []);
  const yourBalance = useContractReader(readContracts, "KhaToken", "balanceOf", [address]);

  const requestTokens = async () => {
    const requestForTokens = await tx(writeContracts.KhaFaucet.requestTokens(ethers.utils.parseEther("5")));
  };

  return (
    <Card title="KhaFaucet" style={{ maxWidth: 300, margin: "2em auto", textAlign: "center" }}>
      <Text>Faucet Balance: {faucetBalance && parseInt(ethers.utils.formatEther(faucetBalance))} KHA</Text>
      <br />
      <Text>Your Balance: {yourBalance && parseInt(ethers.utils.formatEther(yourBalance))} KHA</Text>

      {/* <Input
        placeholder="Amount of KHA tokens"
        onChange={e => setAmount(e.target.value)}
        style={{ marginBottom: 16 }}
      /> */}

      <br />
      <Button style={{ margin: "1em auto" }} onClick={requestTokens} type="primary">
        Claim 5 KHA Tokens!
      </Button>
    </Card>
  );
}
