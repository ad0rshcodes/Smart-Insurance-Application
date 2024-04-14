import React, { useState } from "react";
import "../styles/Dashboard.css";
import {
  InsuranceAddress,
  InsuranceSecret,
  RecipientAddress,
  RecipientSecret,
} from "./constants";
import unitedLogo from "../assets/united-airlines.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "../styles/PolicyDetailsModal.css";

const xrpl = require("xrpl");

const Dashboard = () => {
  const [transactionResult, setTransactionResult] = useState("");
  const [isTransactionInProcess, setIsTransactionInProcess] = useState(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    TxnSignature: "",
    hash: "",
    ledger_index: "",
  });

  const navigate = useNavigate(); // Add this line to use the navigate function
  const handleAddInsuranceClick = () => {
    navigate("/catalog");
  };

  const sendXRPTransaction = async () => {
    setIsTransactionInProcess(true);
    setIsTransactionSuccessful(false);
    setTransactionDetails({ TxnSignature: "", hash: "", ledger_index: "" }); // Resetting transaction details

    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    try {
      await client.connect();
      const existingWallet = xrpl.Wallet.fromSeed(InsuranceSecret);
      const destination = RecipientAddress;
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

  // State to track the insurance status
  const [insuranceStatus, setInsuranceStatus] = useState("Not Claimed");

  // Dummy insurance data
  const insuranceData = {
    flightConfirmationNumber: "DR2937",
    airline: "United Airlines",
    flight: "UA3499",
    insuranceType: "Missed Connection Insurance",
    status: insuranceStatus,
  };

  // Placeholder for the function to check flight status
  const handleClaim = () => {
    console.log("Checking flight status...");

    // Here you would implement the logic to check the flight status
    // For now, we will just simulate a successful check
    sendXRPTransaction();

    setTimeout(() => {
      console.log("Missed Flight Confirmed. Processing claim...");
      setInsuranceStatus("Claimed");
    }, 2000);
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="navbar">
        <div className="dashboard-title">Dashboard</div>
        <div className="Peoples Protect">CryptoInsure</div>
        <div className="logout">
          <a href="/signup">Logout</a>
        </div>
      </div>
      {/* First Insurance Box */}
      <div className="insurance-box">
        {/* Insurance Block data*/}
        <div className="insurance-info">
          <img
            src={unitedLogo}
            alt="United Airlines"
            className="airline-logo"
          />
          <p>
            <strong>Confirmation Number:</strong>{" "}
            {insuranceData.flightConfirmationNumber}
          </p>
          <p>
            <strong>Passenger Name:</strong> Adarsh Sharma
          </p>
          <p>
            <strong>Airlines:</strong> {insuranceData.airline}
          </p>
          <p>
            <strong>Flight Number:</strong> {insuranceData.flight}
          </p>
          <p>
            <strong>Confirmation Number:</strong>{" "}
            {insuranceData.flightConfirmationNumber}
          </p>
          <p>
            <strong>Insurance Type:</strong> {insuranceData.insuranceType}
          </p>
          <p>
            <strong>Status:</strong> {insuranceData.status}
          </p>
        </div>
        {/* Insurance Claim Button */}
        <div className="modal-footer insurance-claim">
          <button
            onClick={handleClaim}
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
              ? "Verifying Claim..."
              : isTransactionSuccessful
              ? "Transaction Successful!"
              : "Claim"}
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
            </div>
          )}
        </div>
      </div>
      {/* Add more insuarnaces and flights button */}
      <div
        className="additional-insurance-box"
        onClick={handleAddInsuranceClick}
      >
        <div className="additional-insurance-content">
          <span className="plus-symbol">+</span>
          <p>Click Here to buy other travel insurances or add flights.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
