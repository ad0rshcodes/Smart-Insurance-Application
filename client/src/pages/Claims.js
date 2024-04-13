import React, { useState } from "react";
import axios from "axios";

function Claims() {
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [flightDetails, setFlightDetails] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setConfirmationNumber(event.target.value);
  };

  const checkClaim = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/check-claim",
        {
          confirmation_number: confirmationNumber,
        }
      );
      setFlightDetails(response.data);
      setError("");
      console.log("API call successful: ", response.data);
    } catch (err) {
      console.error("API call failed: ", err);
      if (err.response) {
        setError(
          err.response.data.error ||
            "An error occurred while fetching the claim details."
        );
      } else if (err.request) {
        setError("No response from server, check your network connection.");
      } else {
        setError("Error: " + err.message);
      }
      setFlightDetails(null);
    }
  };

  return (
    <div>
      <h1>Check Your Flight Claim</h1>
      <input
        type="text"
        value={confirmationNumber}
        onChange={handleInputChange}
        placeholder="Enter Confirmation Number"
      />
      <button onClick={checkClaim}>Check Claim</button>
      {error && <p className="error">{error}</p>}
      {flightDetails && (
        <div>
          <h2>Flight Details:</h2>
          <p>Status: {flightDetails.flightDetails.status}</p>
          <p>Reimbursement Status: {flightDetails.reimbursementStatus}</p>
          {/* Render more details as needed */}
        </div>
      )}
    </div>
  );
}

export default Claims;
