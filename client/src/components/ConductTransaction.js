import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from '../history'

const ConductTransaction = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const updateRecipient = (event) => {
    const recipient = event.target.value;
    setRecipient(recipient);
  };
  const updateAmount = (event) => {
    const amount = Number(event.target.value);
    setAmount(amount);
  };

  const conductTransaction = () => {
    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || data.type);
        history.push('/transaction-pool')
      });
  };

  return (
    <div className="conduct-transactions">
      <Link to="/">Home</Link>
      <h3>Conduct a Transaction</h3>
      <FormGroup>
        <FormControl
          input="text"
          placeholder="recipient"
          value={recipient}
          onChange={updateRecipient}
        />
      </FormGroup>
      <br />
      <FormGroup>
        <FormControl
          input="number"
          placeholder="amount"
          value={amount}
          onChange={updateAmount}
        />
      </FormGroup>
      <div>
        <Button variant="danger" size="sm" onClick={conductTransaction}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ConductTransaction;
