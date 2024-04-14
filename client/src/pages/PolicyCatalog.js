import React, { useState } from "react";
import samplePolicies from "./sample_policies.json";
import PolicyDetailsModal from "./PolicyDetailsModal";
import "../styles/PolicyCatalog.css";

function PolicyCatalog() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const openModal = (policy) => {
    setSelectedPolicy(policy);
  };

  const closeModal = () => {
    setSelectedPolicy(null);
  };

  return (
    <div className="policy-catalog-container">
      <h1 className="catalog-title">Available Insurance Policies</h1>
      <div className="policy-list">
        {samplePolicies.map((policy) => (
          <div
            key={policy.id}
            className="policy-item"
            onClick={() => openModal(policy)}
          >
            <div className="policy-content">
              <h2 className="policy-title">{policy.name}</h2>
              <p className="policy-price">Price: ${policy.price}</p>
              <p className="policy-price">Claim Amount: ${policy.payout}</p>
              <button className="details-button">View Details</button>
            </div>
          </div>
        ))}
      </div>
      {selectedPolicy && (
        <PolicyDetailsModal policy={selectedPolicy} onClose={closeModal} />
      )}
    </div>
  );
}

export default PolicyCatalog;
