import React, { useState, useEffect } from "react";
import logo_blockchain from "../../assets/img/logo_blockchain.png";
import { Link } from 'react-router-dom';

const App = () => {
  const [walletInfo, setWalletInfo] = useState({ address: "", balance: 0 });
  useEffect(() => {
    fetch(`${document.location.origin}/api/wallet-info`)
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
      <br/> 
      <div><Link to='/blocks'>Blocks</Link></div>
      <div><Link to='/conduct-transaction'>Conduct Transaction</Link></div>
      <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
      <br />
      <div className="wallet-info">
        <div>Adress: {walletInfo.address}</div>
        <div>Balance: {walletInfo.balance}</div>
      </div>

      <br />
    </div>
  );
}

export default App;
