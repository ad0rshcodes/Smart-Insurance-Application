import React, { useState } from "react";
import "../styles/PolicyDetailsModal.css";
import { Link } from "react-router-dom";

import {
  InsuranceAddress,
  InsuranceSecret,
  RecipientAddress,
  RecipientSecret,
} from "./constants";

const xrpl = require("xrpl");

function PolicyDetailsModal({ policy, onClose }) {
  const [transactionResult, setTransactionResult] = useState("");

  const sendXRPTransaction = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    try {
      await client.connect();
      console.log("Connected to XRPL Testnet");

      const existingWallet = xrpl.Wallet.fromSeed(
        RecipientSecret // Recipient's secret
      );
      const destination = InsuranceAddress; // Insurance's address
      const amount = 100;

      const payment = {
        TransactionType: "Payment",
        Account: existingWallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: destination,
      };

      const prepared = await client.autofill(payment);
      const signed = existingWallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      console.log("Payment result:", result);
      setTransactionResult(JSON.stringify(result, null, 2)); // Update state with formatted result
    } catch (error) {
      console.error(error);
      setTransactionResult("Error: " + error.message); // Update state with error message
    } finally {
      await client.disconnect();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title">{policy.name}</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{policy.description}</p>
          {/* You can add more policy details here */}
        </div>
        <div className="modal-footer">
          <button onClick={sendXRPTransaction} className="purchase-button">
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

export default PolicyDetailsModal;
