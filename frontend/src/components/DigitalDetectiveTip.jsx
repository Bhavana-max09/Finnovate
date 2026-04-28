import React from 'react';
import { Search, AlertCircle, Calendar, ShieldCheck } from 'lucide-react';

const DigitalDetectiveTip = () => {
  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '2rem', border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.5rem', background: 'var(--accent-primary)', borderRadius: '10px', color: 'white' }}>
          <Search size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🕵️ Digital Detective: 2026 Verification Guide</h2>
          <p className="card-subtitle">Ensure the numbers on screen match your future bank statement.</p>
        </div>
      </div>

      <div className="grid-3" style={{ gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            <AlertCircle size={16} /> 1. Processing Fees
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Sites show "starting from" rates. <strong>Actual fees</strong> depend on your credit score. 
            <br/><br/>
            💡 <strong>Tip:</strong> Always add <strong>18% GST</strong> to any processing fee shown. Ask for a <strong>Sanction Letter</strong> before signing; it's the only legally binding fee list.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontWeight: 700, fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> 2. V-KYC Verification
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Not all "Digital" accounts are paperless. Look for the <strong>"V-KYC"</strong> tag.
            <br/><br/>
            ⚠️ <strong>Beware:</strong> If they ask to "Schedule a biometric appointment," it's not 100% remote. Ensure your browser has <strong>Camera & Location</strong> permissions enabled.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Calendar size={16} /> 3. Interest Frequency
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Compounding matters! <strong>Monthly credit</strong> is superior to Quarterly as your interest earns interest sooner.
            <br/><br/>
            🔍 <strong>Verify:</strong> Search the bank's official site for "Frequency". Check if "Headline Rates" (e.g. 7%) only apply to large balances (₹10L+).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalDetectiveTip;
