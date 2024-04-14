import {
  InsuranceAddress,
  InsuranceSecret,
  RecipientAddress,
  RecipientSecret,
} from "./constants";

import React, { useState } from "react";
const xrpl = require("xrpl");

function XRPTransaction() {
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
    <div>
      <button onClick={sendXRPTransaction}>Send XRP Transaction</button>
      <pre>{transactionResult}</pre>
    </div>
  );
}

export default XRPTransaction;
