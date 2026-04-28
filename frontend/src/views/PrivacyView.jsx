import React, { useState, useEffect } from 'react';
import { Shield, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import API_BASE from '../config';

const PrivacyView = () => {
  const [purposeData, setPurposeData] = useState(null);
  const [erasureStatus, setErasureStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/compliance/purpose_limitation`)
      .then(res => res.json())
      .then(data => {
        setPurposeData(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Failed to load privacy data:", err));
  }, []);

  const handleEraseData = async () => {
    if (!window.confirm("Are you sure you want to completely erase your data? This action cannot be undone.")) return;
    
    setErasureStatus('deleting');
    try {
      // Mocking user index 0 for demonstration
      const res = await fetch(`${API_BASE}/compliance/erasure/0`, { method: 'POST' });
      if (res.ok) {
        setErasureStatus('success');
      } else {
        setErasureStatus('error');
      }
    } catch (error) {
      setErasureStatus('error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Data Privacy Hub</h1>
        <p className="page-subtitle">Control your financial data. DPDP Act 2023 Compliant.</p>
        <span className="page-tag">🛡️ Privacy · Consent · Right to Erasure</span>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Shield size={24} color="var(--accent-teal)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Data Purpose Map</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Exactly how your data is used across our AI systems.
          </p>
          
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading privacy map...</div>
          ) : purposeData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(purposeData.Mapping).map(([purpose, fields]) => (
                <div key={purpose} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '0.5rem' }}>{purpose}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {fields.map(field => (
                      <span key={field} className="badge info" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)' }}>
                        {field.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--danger)' }}>Failed to load compliance data.</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Trash2 size={24} color="var(--danger)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--danger)' }}>Right to Erasure</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Under the DPDP Act 2023, you have the right to request permanent deletion of all your personal data from our active databases and models.
            </p>
            
            {erasureStatus === 'success' ? (
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600 }}>
                <CheckCircle size={20} /> Data successfully purged.
              </div>
            ) : (
              <button 
                onClick={handleEraseData} 
                className="btn-primary" 
                style={{ width: '100%', background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}
                disabled={erasureStatus === 'deleting'}
              >
                {erasureStatus === 'deleting' ? 'Deleting...' : 'Permanently Delete My Data'}
              </button>
            )}
            {erasureStatus === 'error' && (
              <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={14} /> Deletion failed. Please try again.
              </div>
            )}
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Compliance Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DPDP Act 2023</span>
                <span className="badge success">Compliant</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>RBI Data Localization</span>
                <span className="badge success">Verified</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Consent Management</span>
                <span className="badge success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyView;
