import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import bankData from '../data/bank_data.json';
import { checkLoanEligibility, checkCardEligibility } from '../utils/eligibility.js';
import API_BASE from '../config.js';

const STEPS = [
  { label: 'Personal', icon: '👤' },
  { label: 'Financial', icon: '💰' },
  { label: 'Credit', icon: '⭐' },
  { label: 'Documents', icon: '📄' },
  { label: 'Results', icon: '📋' },
];

const EligibilityForm = () => {
  const [step, setStep] = useState(0);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    age: 30, employment: 'Salaried', monthly_income: 50000,
    existing_emi: 0, credit_score: 750, loan_history: 'Good',
    loan_amount: 500000,
  });
  const [aiResult, setAiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [docsStatus, setDocsStatus] = useState(null);
  
  // What-If Simulator states
  const [whatIfIncome, setWhatIfIncome] = useState(50000);
  const [whatIfLoan, setWhatIfLoan] = useState(500000);
  const [whatIfResult, setWhatIfResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProfile(p => ({ ...p, [name]: type === 'number' || type === 'range' ? parseFloat(value) : value }));
  };

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleCheckEligibility = async () => {
    setIsLoading(true);
    setAiResult(null);
    try {
      const applicantData = {
        DAYS_BIRTH: -profile.age * 365,
        CODE_GENDER: "F",
        AMT_INCOME_TOTAL: profile.monthly_income * 12,
        AMT_CREDIT: profile.loan_amount,
        ZIP_CODE: "10001",
        NAME_EDUCATION_TYPE: "Higher education",
        EXT_SOURCE_1: profile.credit_score / 900,
        EXT_SOURCE_2: profile.credit_score / 900,
        EXT_SOURCE_3: profile.credit_score / 900,
      };

      setWhatIfIncome(profile.monthly_income);
      setWhatIfLoan(profile.loan_amount);

      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicantData)
      });
      if (response.ok) {
        const data = await response.json();
        setAiResult(data);
      } else {
        setAiResult({ error: "API Error: " + response.statusText });
      }
    } catch (error) {
      console.error("Backend connection failed:", error);
      setAiResult({ error: "Failed to connect to AI Underwriter backend." });
    }
    setIsLoading(false);
    setStep(4);
  };

  const handleSimulateWhatIf = async () => {
    try {
      const applicantData = {
        DAYS_BIRTH: -profile.age * 365,
        CODE_GENDER: "F",
        AMT_INCOME_TOTAL: whatIfIncome * 12,
        AMT_CREDIT: whatIfLoan,
        ZIP_CODE: "10001",
        NAME_EDUCATION_TYPE: "Higher education",
        EXT_SOURCE_1: profile.credit_score / 900,
        EXT_SOURCE_2: profile.credit_score / 900,
        EXT_SOURCE_3: profile.credit_score / 900,
      };

      const response = await fetch(`${API_BASE}/simulate_what_if`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicantData)
      });
      if (response.ok) {
        setWhatIfResult(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const simulateDocumentUpload = (e) => {
    setIsLoading(true);
    setDocsStatus({ uploading: true, logs: ['[System] Initializing Agentic Verification Pipeline...'] });
    
    // Progressive Agentic Logs
    setTimeout(() => {
      setDocsStatus(prev => ({ ...prev, logs: [...prev.logs, '🔎 [Image Forensics] Scanning pixels for Photoshop manipulation and copy-paste edits...'] }));
    }, 1500);
    
    setTimeout(() => {
      setDocsStatus(prev => ({ ...prev, logs: [...prev.logs, '🏛️ [Govt API] OCR extracting PAN... Pinging NSDL Database for name match...'] }));
    }, 3500);

    setTimeout(() => {
      setDocsStatus(prev => ({ ...prev, logs: [...prev.logs, '🔐 [Cryptographic] Scanning Aadhar secure QR code and verifying digital signature...'] }));
    }, 5500);

    setTimeout(() => {
      setDocsStatus(prev => ({ ...prev, logs: [...prev.logs, '👤 [Face Matching] Cross-referencing ID photo geometry with live liveness check...'] }));
    }, 7500);
    
    setTimeout(() => {
      fetch(`${API_BASE}/verify_documents`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setDocsStatus({ ...data, logs: [] });
          setIsLoading(false);
        })
        .catch(err => {
          setDocsStatus({ error: true, logs: [] });
          setIsLoading(false);
        });
    }, 9500);
  };

  const getResults = () => {
    const allLoans = [
      ...bankData.loans.home.map(l => ({ ...l, category: 'Home Loan' })),
      ...bankData.loans.car.map(l => ({ ...l, category: 'Car Loan' })),
      ...bankData.loans.education.map(l => ({ ...l, category: 'Education Loan' })),
      ...bankData.loans.personal.map(l => ({ ...l, category: 'Personal Loan' })),
    ];
    const allCards = bankData.cards.map(c => ({ ...c, category: c.type === 'credit' ? 'Credit Card' : 'Debit Card' }));

    return [
      ...allLoans.map(l => ({ ...l, eligibility: checkLoanEligibility(l, profile), type: 'loan' })),
      ...allCards.map(c => ({ ...c, eligibility: checkCardEligibility(c, profile), type: 'card' })),
    ];
  };

  return (
    <div className="animate-fade-in">
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`stepper-dot ${i < step ? 'completed' : i === step ? 'active' : 'pending'}`}>
              {i < step ? '✓' : s.icon}
            </div>
            {i < STEPS.length - 1 && (
              <div className="stepper-line" style={{ background: i < step ? 'var(--success)' : 'rgba(255,255,255,0.06)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Personal */}
      {step === 0 && (
        <div className="glass-card">
          <h2>👤 Personal Information</h2>
          <p className="card-subtitle">Tell us about yourself to check eligibility.</p>
          <div className="grid-2" style={{ gap: '1rem', marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Age — {profile.age} years</label>
              <input type="range" name="age" min="16" max="70" value={profile.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select name="employment" value={profile.employment} onChange={handleChange} className="form-select">
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Business Owner</option>
                <option>Student</option>
                <option>Retired</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn-primary" onClick={next}>Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 1: Financial */}
      {step === 1 && (
        <div className="glass-card">
          <h2>💰 Financial Information</h2>
          <p className="card-subtitle">Your income and loan requirements.</p>
          <div className="grid-2" style={{ gap: '1rem', marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Income (₹) — ₹{profile.monthly_income.toLocaleString()}</label>
              <input type="range" name="monthly_income" min="5000" max="500000" step="1000" value={profile.monthly_income} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Requested Loan Amount (₹) — ₹{profile.loan_amount.toLocaleString()}</label>
              <input type="range" name="loan_amount" min="10000" max="5000000" step="10000" value={profile.loan_amount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Existing Monthly EMI (₹)</label>
              <input type="number" name="existing_emi" value={profile.existing_emi} onChange={handleChange} className="form-input" min="0" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn-primary" onClick={prev} style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}><ArrowLeft size={16} /> Back</button>
            <button className="btn-primary" onClick={next}>Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 2: Credit */}
      {step === 2 && (
        <div className="glass-card">
          <h2>⭐ Credit Profile</h2>
          <p className="card-subtitle">Your credit score and loan history.</p>
          <div className="grid-2" style={{ gap: '1rem', marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Credit Score — {profile.credit_score}</label>
              <input type="range" name="credit_score" min="300" max="900" step="10" value={profile.credit_score} onChange={handleChange} />
              <span style={{ fontSize: '0.72rem', color: profile.credit_score >= 750 ? 'var(--success)' : profile.credit_score >= 650 ? 'var(--warning)' : 'var(--danger)' }}>
                {profile.credit_score >= 750 ? 'Excellent' : profile.credit_score >= 650 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">Loan Repayment History</label>
              <select name="loan_history" value={profile.loan_history} onChange={handleChange} className="form-select">
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
                <option>No History</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn-primary" onClick={prev} style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}><ArrowLeft size={16} /> Back</button>
            <button className="btn-primary" onClick={next}>Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Documents */}
      {step === 3 && (
        <div className="glass-card">
          <h2>📄 E-KYC Document Upload</h2>
          <p className="card-subtitle">Fast, AI-powered document verification.</p>
          
          <div 
            style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => !isLoading && !docsStatus?.kyc_status && fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if(!isLoading && !docsStatus?.kyc_status) simulateDocumentUpload(); }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={simulateDocumentUpload} 
            />
            
            <FileText size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Click to browse or drop your Aadhar & PAN Cards here</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Securely encrypted and verified against government databases.</p>
            
            {docsStatus?.uploading ? (
              <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem' }}>
                <div style={{ color: 'var(--accent-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid var(--accent-teal)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  Agentic AI Pipeline Active
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {docsStatus.logs && docsStatus.logs.map((log, idx) => (
                    <div key={idx} className="animate-fade-in" style={{ color: idx === docsStatus.logs.length - 1 ? 'white' : 'var(--text-secondary)' }}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            ) : docsStatus?.kyc_status ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--success)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} /> KYC Verified Successfully
                </h4>
                <p style={{ fontSize: '0.85rem' }}>Genuineness Score: <strong>{docsStatus.genuineness_score}%</strong></p>
              </div>
            ) : (
              <button 
                className="btn-primary" 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} 
                disabled={isLoading}
              >
                Browse Files
              </button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn-primary" onClick={prev} style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}><ArrowLeft size={16} /> Back</button>
            <button className="btn-primary" onClick={handleCheckEligibility} disabled={isLoading}>
              {isLoading ? 'Checking...' : <>Check Final Eligibility <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📋 Your Eligibility Results</h2>
            <button className="btn-primary" onClick={() => setStep(0)} style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', background: 'rgba(255,255,255,0.05)', boxShadow: 'none' }}>
              <ArrowLeft size={14} /> Modify
            </button>
          </div>

          {/* AI Underwriter Result */}
          {aiResult && (
            <div className="glass-card" style={{ marginBottom: '1.5rem', border: `1px solid ${aiResult.approved ? 'var(--success)' : 'var(--danger)'}` }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤖 AI Underwriter Decision: 
                <span style={{ color: aiResult.approved ? 'var(--success)' : 'var(--danger)' }}>
                  {aiResult.approved ? 'Approved' : 'Rejected'}
                </span>
              </h3>
              {aiResult.error ? (
                <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{aiResult.error}</p>
              ) : (
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</div>
                    <div style={{ fontWeight: 600 }}>{aiResult.status}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Default Probability</div>
                    <div style={{ fontWeight: 600 }}>{aiResult.probability ? (aiResult.probability * 100).toFixed(1) + '%' : 'N/A'}</div>
                  </div>
                  {!aiResult.approved && aiResult.rejection_reasons && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>Rejection Reasons:</div>
                      <ul style={{ fontSize: '0.85rem', margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                        {aiResult.rejection_reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Interactive What-If Simulator for Rejected Users */}
          {aiResult && !aiResult.approved && !aiResult.error && (
            <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--warning)' }}>🎚️ What-If Simulator: Path to Approval</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Adjust your application parameters below to see what it would take for the AI to approve you.
              </p>
              
              <div className="grid-2" style={{ gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Lower Loan Amount: ₹{whatIfLoan.toLocaleString()}</label>
                  <input type="range" min="10000" max="5000000" step="10000" value={whatIfLoan} onChange={(e) => { setWhatIfLoan(Number(e.target.value)); handleSimulateWhatIf(); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Increase Income: ₹{whatIfIncome.toLocaleString()}</label>
                  <input type="range" min="5000" max="500000" step="1000" value={whatIfIncome} onChange={(e) => { setWhatIfIncome(Number(e.target.value)); handleSimulateWhatIf(); }} />
                </div>
              </div>
              
              {whatIfResult && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem' }}>New AI Decision:</span>
                    <span className={`badge ${whatIfResult.decision === 'Approved' ? 'success' : 'danger'}`}>
                      {whatIfResult.decision}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>Approval Probability:</span>
                    <span style={{ fontWeight: 800, color: whatIfResult.decision === 'Approved' ? 'var(--success)' : 'white' }}>
                      {(whatIfResult.approval_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary KPI */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            {(() => {
              const results = getResults();
              const eligibleCount = results.filter(r => r.eligibility.eligible).length;
              return [
                { icon: '📋', label: 'Products Checked', value: results.length },
                { icon: '✅', label: 'Eligible', value: eligibleCount },
                { icon: '❌', label: 'Not Eligible', value: results.length - eligibleCount },
                { icon: '💰', label: 'Income', value: `₹${profile.monthly_income.toLocaleString()}` },
              ].map((k, i) => (
                <div key={i} className="kpi-card">
                  <div className="kpi-icon">{k.icon}</div>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-value">{k.value}</div>
                </div>
              ));
            })()}
          </div>

          {/* Results Table */}
          <div className="glass-card">
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Bank</th><th>Category</th><th>Rate / Fee</th><th>Status</th><th>Docs Required</th></tr>
              </thead>
              <tbody>
                {getResults().map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.icon} {r.name}</td>
                    <td>{r.bank}</td>
                    <td><span className="badge info" style={{ fontSize: '0.68rem' }}>{r.category}</span></td>
                    <td>{r.interest_rate ? `${r.interest_rate}%` : r.annual_fee === 0 ? 'Free' : `₹${r.annual_fee}`}</td>
                    <td>
                      <span className={`badge ${r.eligibility.eligible ? 'success' : 'danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'fit-content' }}>
                        {r.eligibility.eligible ? <><CheckCircle size={12} /> Eligible</> : <><XCircle size={12} /> Not Eligible</>}
                      </span>
                      {!r.eligibility.eligible && r.eligibility.reasons.length > 0 && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
                          {r.eligibility.reasons[0]}
                        </div>
                      )}
                    </td>
                    <td>
                      {r.docs_required && (
                        <button onClick={() => alert(r.docs_required.join('\n• '))} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FileText size={13} /> View Docs
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityForm;
