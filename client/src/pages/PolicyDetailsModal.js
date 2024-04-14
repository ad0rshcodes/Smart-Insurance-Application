import React, { useState } from "react";
import "../styles/PolicyDetailsModal.css";
import { useNavigate } from "react-router-dom";

// Assuming constants are defined elsewhere and imported correctly
import {
  InsuranceAddress,
  InsuranceSecret,
  RecipientAddress,
  RecipientSecret,
} from "./constants";

const xrpl = require("xrpl");

function PolicyDetailsModal({ policy, onClose }) {
  const [transactionResult, setTransactionResult] = useState("");
  const [flightConfirmation, setFlightConfirmation] = useState("");
  const [isTransactionInProcess, setIsTransactionInProcess] = useState(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    TxnSignature: "",
    hash: "",
    ledger_index: "",
  });
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const sendXRPTransaction = async () => {
    setIsTransactionInProcess(true);
    setIsTransactionSuccessful(false);
    setTransactionDetails({ TxnSignature: "", hash: "", ledger_index: "" }); // Resetting transaction details

    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    try {
      await client.connect();
      const existingWallet = xrpl.Wallet.fromSeed(RecipientSecret);
      const destination = InsuranceAddress;
      const amount = 1;

      const payment = {
        TransactionType: "Payment",
        Account: existingWallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: destination,
      };

      const prepared = await client.autofill(payment);
      const signed = existingWallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      console.log(result);

      const txnDetails = result.result.tx_json || result.result;

      console.log(txnDetails.TxnSignature);
      console.log(txnDetails.hash);
      console.log(txnDetails.ledger_index);

      setTransactionResult(JSON.stringify(result, null, 2));
      setIsTransactionSuccessful(true);
      setTransactionDetails({
        // Now updating the state with actual txn details
        TxnSignature: txnDetails.TxnSignature,
        hash: txnDetails.hash,
        ledger_index: txnDetails.ledger_index,
      });
    } catch (error) {
      console.error(error);
      setTransactionResult("Error: " + error.message);
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setIsTransactionInProcess(false);
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
          <input
            type="text"
            value={flightConfirmation}
            onChange={(e) => setFlightConfirmation(e.target.value)}
            placeholder="Enter Your Flight Confirmation Number"
            className="flight-confirmation-input"
          />
        </div>
        <div className="modal-footer">
          <button
            onClick={sendXRPTransaction}
            className={`purchase-button ${
              isTransactionInProcess
                ? "funds-transferring"
                : isTransactionSuccessful
                ? "transaction-successful"
                : ""
            }`}
            disabled={isTransactionInProcess || isTransactionSuccessful}
          >
            {isTransactionInProcess
              ? "Funds Transferring..."
              : isTransactionSuccessful
              ? "Transaction Successful!"
              : "Purchase"}
          </button>
          {isTransactionSuccessful && (
            <div className="transaction-details">
              <p>
                Transaction Signature:{" "}
                <code>{transactionDetails.TxnSignature}</code>
              </p>
              <p>
                Hash: <code>{transactionDetails.hash}</code>
              </p>
              <p>
                Ledger Index: <code>{transactionDetails.ledger_index}</code>
              </p>
              <p>
                View this transaction in ledger{" "}
                <a
                  href={`https://testnet.xrpl.org/transactions/${transactionDetails.hash}`}
                  target="_blank"
                >
                  here.
                </a>
              </p>
              <button className="dashboard-button" onClick={goToDashboard}>
                Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PolicyDetailsModal;
