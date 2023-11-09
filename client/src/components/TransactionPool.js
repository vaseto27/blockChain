import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Transaction } from "./Transaction";
import { Button } from "react-bootstrap";

const POOL_INTERVAL_MS= 10000;

const TransactionPool = () => {
  const [transactionPoolMap, setMap] = useState({});

  const fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setMap(data)
    })
  };

  const fetchMyTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`)
    .then(response => {
      if(response.status === 200) {
        alert('success');
        history.push('/blocks')
      } else {
        alert("The mine-transaction block request did not complete.")
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactionPoolMap();
    }, POOL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [transactionPoolMap])

  return (
    <div className="transaction-pool">
      <Link to="/">Home</Link>
      <h3>Transaction Pool</h3>
      {Object.values(transactionPoolMap).map(transaction => {
        return <div key={transaction.id}>
            <hr/>
            <Transaction transaction={transaction}/>
        </div>
      })}
      <hr/>
      <Button variant="danger" size="sm" onClick={fetchMyTransactions}>Mine the Transactions</Button>
    </div>
  );
};

export default TransactionPool;
