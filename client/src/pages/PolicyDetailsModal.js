import React from "react";
import "../styles/PolicyDetailsModal.css";

function PolicyDetailsModal({ policy, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h1>{policy.name}</h1>
        <p>{policy.description}</p>
        {/* Display other policy details */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PolicyDetailsModal;
