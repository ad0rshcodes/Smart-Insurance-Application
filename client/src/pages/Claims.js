import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

export default function Claims() {
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [claimResult, setClaimResult] = useState(null);
  useEffect(() => {
    // Cleanup socket listeners on component unmount
    return () => {
      socket.off("claim_result");
      socket.off("response");
    };
  }, []);

  const handleClaimSubmission = () => {
    if (!confirmationNumber) {
      alert("Please enter a confirmation number.");
      return;
    }
    // Emit claim check event
    socket.emit("check_claim", { confirmation_number: confirmationNumber });

    // Listen for the claim result from the server
    socket.on("claim_result", (data) => {
      if (data.reimbursementStatus) {
        setClaimResult(data.reimbursementStatus);
      } else {
        alert("Failed to process claim.");
      }
    });

    // Listen for any server-side errors
    socket.on("response", (error) => {
      alert(`Error from server: ${error.error}`);
    });
  };

  return (
    <div>
      <h1>Insurance Claims Processing</h1>
      <input
        type="text"
        value={confirmationNumber}
        onChange={(e) => setConfirmationNumber(e.target.value)}
        placeholder="Enter confirmation number"
      />
      <button onClick={handleClaimSubmission}>Submit Claim</button>
      {claimResult && (
        <p>
          Claim Result:{" "}
          {claimResult === "Reimbursement Approved"
            ? "Approved"
            : "No reimbursement necessary"}
        </p>
      )}
    </div>
  );
}
