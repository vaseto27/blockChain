import React, { useState } from "react";

const Transaction = ({ transaction }) => {
  console.log(transaction);
  const recipients = Object.keys(transaction.outputMap);
  return (
    <div className="transaction">
      {/* <div>From: {transaction.input.address} | Balance: {transaction.input.balance}</div> */}
      {recipients.map((recipient) => (
        <div key={recipient}>
          To: {`${recipient} | Send ${transaction.outputMap[recipient]}`}
        </div>
      ))}
    </div>
  );
};

export default Transaction;
