import React, { useState } from 'react';
import { Users, ShieldCheck, Scale, AlertTriangle, CheckCircle } from 'lucide-react';
import API_BASE from '../config';

const AgenticReviewView = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [profile, setProfile] = useState({
    age: 35, income: 75000, credit: 1500000, score: 680
  });

  const handleRunReview = async () => {
    setLoading(true);
    setResult(null);
    try {
      const applicantData = {
        DAYS_BIRTH: -profile.age * 365,
        CODE_GENDER: "M",
        AMT_INCOME_TOTAL: profile.income,
        AMT_CREDIT: profile.credit,
        ZIP_CODE: "110001",
        NAME_EDUCATION_TYPE: "Higher education",
        EXT_SOURCE_1: profile.score / 900,
        EXT_SOURCE_2: profile.score / 900,
        EXT_SOURCE_3: profile.score / 900,
      };

      const response = await fetch(`${API_BASE}/agentic_deliberation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicantData)
      });
      if (response.ok) {
        setResult(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Agentic Credit Committee</h1>
        <p className="page-subtitle">Multi-agent deliberation pipeline for unbiased loan auditing.</p>
        <span className="page-tag">👥 Multi-Agent · Consensus Engine · Transparent Auditing</span>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>📋 Mock Application for Review</h2>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: Number(e.target.value)})} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Annual Income ($)</label>
              <input type="number" value={profile.income} onChange={e => setProfile({...profile, income: Number(e.target.value)})} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Requested Credit ($)</label>
              <input type="number" value={profile.credit} onChange={e => setProfile({...profile, credit: Number(e.target.value)})} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Credit Score (Mock)</label>
              <input type="number" value={profile.score} onChange={e => setProfile({...profile, score: Number(e.target.value)})} className="form-input" />
            </div>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={handleRunReview}
            disabled={loading}
          >
            {loading ? 'Committee is deliberating...' : '🚀 Trigger Agentic Deliberation'}
          </button>
        </div>

        {result && (
          <div className="animate-fade-in">
            {result.error ? (
              <div className="glass-card" style={{ border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
                <h3 style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>⚠️ Deliberation Error</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{result.error}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem', opacity: 0.7 }}>
                  Tip: Make sure your <code>GEMINI_API_KEY</code> in <code>backend/.env</code> is valid and restart the backend server.
                </p>
              </div>
            ) : (
            <div className="glass-card" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>⚖️ Committee Decision: {result.final_consensus}</h2>
                <span className={`badge ${result.final_consensus === 'Approve' ? 'success' : 'danger'}`}>
                  {result.final_consensus}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--accent-teal)' }}>
                    <ShieldCheck size={18} /> <strong style={{ fontSize: '0.85rem' }}>Risk Auditor View</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.risk_auditor_view}</p>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>
                    <Scale size={18} /> <strong style={{ fontSize: '0.85rem' }}>Fairness Guardian View</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.fairness_guardian_view}</p>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
                    <Users size={18} /> <strong style={{ fontSize: '0.85rem' }}>Compliance Officer View</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.compliance_officer_view}</p>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
                <strong>Committee Notes:</strong> {result.committee_notes}
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenticReviewView;
