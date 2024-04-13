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
      <h1>Available Insurance Policies</h1>
      <div className="policy-grid">
        {samplePolicies.map((policy) => (
          <div
            key={policy.id}
            className="policy-item"
            onClick={() => openModal(policy)}
          >
            <h2>{policy.name}</h2>
            <p>Price: ${policy.price}</p>
            {/* Add more info and a button to view details */}
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
