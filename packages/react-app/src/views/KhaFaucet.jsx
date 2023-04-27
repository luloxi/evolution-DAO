import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Card } from "antd";
import { ethers } from "ethers";

const { Text } = Typography;

export default function KhaFaucetUI({ tx, writeContracts, readContracts, address }) {
  const [amount, setAmount] = useState(0);
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [yourBalance, setYourBalance] = useState(0);
  console.log("Faucet: address:", address);

  // useEffect(() => {
  //   const getFaucetBalance = async () => {
  //     const balance = await readContracts.KhaFaucet.balanceOf();
  //     setFaucetBalance(balance.toString());
  //   };
  //   getFaucetBalance();

  //   const getYourBalance = async () => {
  //     if (address) {
  //       const balance = await readContracts.KhaToken.balanceOf(address);
  //       setYourBalance(balance.toString());
  //     }
  //   };
  //   getYourBalance();
  // }, [readContracts.KhaFaucet, readContracts.KhaToken, address]);

  const requestTokens = async () => {
    const requestForTokens = await tx(writeContracts.KhaFaucet.requestTokens(ethers.utils.parseEther(amount)));
    // await requestForTokens.wait();
  };

  return (
    <Card title="KhaFaucet" style={{ maxWidth: 300, margin: "2em auto", textAlign: "center" }}>
      {/* <Text>Faucet Balance: {ethers.utils.formatEther(faucetBalance)} KHA</Text>
      <br />
      <Text>Your Balance: {address && ethers.utils.formatEther(yourBalance)} KHA</Text> */}
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
