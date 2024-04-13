import React from "react";
import "../styles/PolicyDetailsModal.css";

function PolicyDetailsModal({ policy, onClose }) {
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
          <button className="purchase-button" onClick={onClose}>
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

export default PolicyDetailsModal;
