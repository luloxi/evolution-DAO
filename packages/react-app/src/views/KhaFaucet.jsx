import React, { useState } from "react";
import { Button, Input, Typography, Card } from "antd";
// import { useContractReader, useContractLoader, useContractAt } from "../hooks";
import { ethers } from "ethers";

const { Text } = Typography;

export default function KhaFaucetUI({ provider, address }) {
  //   const contracts = useContractLoader(provider);
  //   const khaFaucet = useContractAt(contracts.KhaFaucet, address);

  const [amount, setAmount] = useState(0);
  //   const balance = useContractReader({ KhaFaucet: khaFaucet }, "KhaFaucet", "balanceOf");

  const requestTokens = async () => {
    // if (khaFaucet) {
    //   const tx = await khaFaucet.requestTokens(ethers.utils.parseEther(amount));
    //   await tx.wait();
    // }
  };

  return (
    <Card title="KhaFaucet" style={{ maxWidth: 600 }}>
      {/* <Text>Balance: {balance && ethers.utils.formatEther(balance)} KHA</Text> */}
      <br />
      <br />
      <Input
        placeholder="Amount of KHA tokens"
        onChange={e => setAmount(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={requestTokens} type="primary">
        Request KHA Tokens
      </Button>
    </Card>
  );
}
