import React, { useState, useEffect } from "react";
// import { Blocks } from "./Blocks";
import logo_blockchain from "../../assets/img/logo_blockchain.png";

const App = () => {
  const [walletInfo, setWalletInfo] = useState({ address: "", balance: 0 });
  useEffect(() => {
    fetch("http://localhost:3000/api/wallet-info")
      .then((res) => res.json())
      .then((data) => {
        setWalletInfo({ address: data.address, balance: data.balance });
      });
  }, []);

  return (
    <div className="app">
      <img className="logo" src={logo_blockchain}></img>
      <br />
      <div>BlockChain...</div>
      <br />
      <div className="wallet-info">
        <div>Adress: {walletInfo.address}</div>
        <div>Balance: {walletInfo.balance}</div>
      </div>

      <br />
      {/* <Blocks /> */}
    </div>
  );
}

export default App;
