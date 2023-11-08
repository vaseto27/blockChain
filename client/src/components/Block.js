import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

const Block = (props) => {
  const [displayTransaction, setDisplayTransaction] = useState(false);
    return (
    <div className="block">
        <div>Hash: {props.block.hash.substring(0, 15)}...</div>
        <div>TimeStamp: {new Date(props.block.timestamp).toLocaleString()}</div>
        <Button variant="danger" size="sm" onClick={() => setDisplayTransaction(!displayTransaction)}>Display Transaction</Button>
        {displayTransaction ? <Transaction transaction={props.block.data}></Transaction> : ''}
    </div>
  );
};

export default Block
