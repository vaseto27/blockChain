import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks";
import "./index.css";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter history={history}>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/blocks" element={<Blocks />} />
      <Route path="/conduct-transaction" element={<ConductTransaction />} />
      <Route path="/transaction-pool" element={<TransactionPool />} />
    </Routes>
  </BrowserRouter>
);
