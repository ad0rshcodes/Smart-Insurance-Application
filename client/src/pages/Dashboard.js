import React, { useState } from "react";
import "../styles/Dashboard.css";
import {
  InsuranceAddress,
  InsuranceSecret,
  RecipientAddress,
  RecipientSecret,
} from "./constants";
import unitedLogo from "../assets/united-airlines.png";

const xrpl = require("xrpl");

const Dashboard = () => {
  const [transactionResult, setTransactionResult] = useState("");

  const sendXRPTransaction = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    try {
      await client.connect();
      console.log("Connected to XRPL Testnet");

      const existingWallet = xrpl.Wallet.fromSeed(
        InsuranceSecret // Recipient's secret
      );
      const destination = RecipientAddress; // Insurance's address
      const amount = 250;

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
      <div className="insurance-box">
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
        <div className="insurance-claim">
          <button onClick={handleClaim} className="claim-button">
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
