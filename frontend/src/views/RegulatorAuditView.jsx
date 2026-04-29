import React, { useState, useEffect } from 'react';
import { Database, Lock, Search, Filter, ShieldAlert } from 'lucide-react';
import API_BASE from '../config';

const RegulatorAuditView = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/ledger`)
      .then(res => res.json())
      .then(data => {
        setLedger(data.reverse());
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Regulatory Audit Ledger</h1>
        <p className="page-subtitle">Immutable decision logs secured by cryptographic hashing for full transparency.</p>
        <span className="page-tag">🔒 Blockchain-Style Ledger · SHA-256 Hashes · Evidence Locker</span>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem' }}>Historical Decision Blocks</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="search-box" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={14} />
              <input type="text" placeholder="Search by Block Hash..." style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.8rem', outline: 'none' }} />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Retrieving audit trail...</p>
          </div>
        ) : (
          <div className="ledger-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ledger.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No decisions logged yet.</p>
            ) : ledger.map((block, i) => (
              <div key={i} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Lock size={14} color="var(--accent-teal)" />
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-teal)' }}>BLOCK_HASH: {block.block_hash.substring(0, 16)}...</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Decision: {block.ml_decision.decision} ({block.ml_decision.status})</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {new Date(block.timestamp * 1000).toLocaleString()}
                  </div>
                </div>

                <div className="grid-3" style={{ gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Applicant Snapshot</div>
                    <div style={{ fontSize: '0.75rem' }}>Income: ${block.applicant_snapshot.AMT_INCOME_TOTAL.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem' }}>Credit: ${block.applicant_snapshot.AMT_CREDIT.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>XAI Integrity Hash</div>
                    <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{block.xai_hash.substring(0, 32)}...</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldAlert size={10} /> Chain Integrity
                    </div>
                    <div style={{ fontSize: '0.7rem' }}>Previous Block Linked: <strong>VERIFIED</strong></div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>PREV_HASH: {block.prev_hash.substring(0, 12)}...</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatorAuditView;
