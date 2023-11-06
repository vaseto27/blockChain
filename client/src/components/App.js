import React, {useState} from 'react';

export function App() {
    const [walletInfo, setWalletInfo] = useState({address: '', balance: 0})
    fetch('http://localhost:3000/api/wallet-info')
    .then((res) => res.json())
    .then((data) => {
        setWalletInfo({address: data.address, balance: data.balance})
    })
        return (
            <div>
                <div>BlockChain...</div>
                <div>Adress: {walletInfo.address}</div>
                <div>Balance: {walletInfo.balance}</div>
            </div>
        );
}
