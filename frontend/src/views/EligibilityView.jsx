import React from 'react';
import EligibilityForm from '../components/EligibilityForm';

const EligibilityView = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Eligibility Checker</h1>
        <p className="page-subtitle">Check your eligibility across all banking products in 3 simple steps.</p>
        <span className="page-tag">✅ Eligibility · Multi-step Wizard · Document Checklist</span>
      </div>
      <EligibilityForm />
    </div>
  );
};

export default EligibilityView;
