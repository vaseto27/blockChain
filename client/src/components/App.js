import React, { useState, useEffect } from "react";
import { Blocks } from "./Blocks";

export function App() {
  const [walletInfo, setWalletInfo] = useState({ address: "", balance: 0 });
  useEffect(() => {
    fetch("http://localhost:3000/api/wallet-info")
      .then((res) => res.json())
      .then((data) => {
        setWalletInfo({ address: data.address, balance: data.balance });
      });
  }, []);

  return (
    <div>
      <div>BlockChain...</div>
      <div>Adress: {walletInfo.address}</div>
      <div>Balance: {walletInfo.balance}</div>
      <br/>
      <Blocks/>
    </div>
  );
}
