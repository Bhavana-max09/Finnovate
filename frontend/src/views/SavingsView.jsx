import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ComparisonTable from '../components/ComparisonTable';
import { calculateFDMaturity, calculateRDMaturity } from '../utils/calculators';
import bankData from '../data/bank_data.json';
import DigitalDetectiveTip from '../components/DigitalDetectiveTip';

const SavingsView = () => {
  const [activeTab, setActiveTab] = useState('fd');
  const [comparing, setComparing] = useState([]);
  const [fdCalc, setFdCalc] = useState({ amount: 100000, rate: 7.1, years: 3 });
  const [rdCalc, setRdCalc] = useState({ monthly: 5000, rate: 6.8, months: 36 });

  const toggleCompare = (product) => {
    setComparing(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  const fdMaturity = calculateFDMaturity(fdCalc.amount, fdCalc.rate, fdCalc.years);
  const fdInterest = fdMaturity - fdCalc.amount;
  const rdMaturity = calculateRDMaturity(rdCalc.monthly, rdCalc.rate, rdCalc.months);
  const rdDeposited = rdCalc.monthly * rdCalc.months;
  const rdInterest = rdMaturity - rdDeposited;

  const renderProducts = () => {
    if (activeTab === 'fd') return bankData.savings.fd;
    if (activeTab === 'rd') return bankData.savings.rd;
    return bankData.savings.insurance;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Savings & Insurance</h1>
        <p className="page-subtitle">Fixed Deposits, Recurring Deposits, and Insurance plans from top banks.</p>
        <span className="page-tag">🏦 FD · 📈 RD · 🛡️ Insurance</span>
      </div>

      <div className="tab-row">
        {[
          { key: 'fd', label: '🏦 Fixed Deposits' },
          { key: 'rd', label: '📈 Recurring Deposits' },
          { key: 'insurance', label: '🛡️ Insurance' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => { setActiveTab(t.key); setComparing([]); }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* Product Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {renderProducts().map(p => (
            <ProductCard
              key={p.id}
              product={p}
              type={activeTab === 'insurance' ? 'insurance' : 'savings'}
              onCompare={activeTab !== 'insurance' ? toggleCompare : undefined}
              isComparing={!!comparing.find(c => c.id === p.id)}
            />
          ))}
        </div>

        {/* Calculator */}
        <div className="glass-card" style={{ alignSelf: 'flex-start', position: 'sticky', top: '1rem' }}>
          {activeTab === 'fd' && (
            <>
              <h2>🧮 FD Maturity Calculator</h2>
              <p className="card-subtitle">Calculate your Fixed Deposit returns.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Deposit Amount — ₹{fdCalc.amount.toLocaleString()}</label>
                  <input type="range" min="1000" max="5000000" step="1000" value={fdCalc.amount} onChange={e => setFdCalc(p => ({ ...p, amount: parseInt(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Interest Rate — {fdCalc.rate}%</label>
                  <input type="range" min="4" max="10" step="0.05" value={fdCalc.rate} onChange={e => setFdCalc(p => ({ ...p, rate: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenure — {fdCalc.years} years</label>
                  <input type="range" min="1" max="10" value={fdCalc.years} onChange={e => setFdCalc(p => ({ ...p, years: parseInt(e.target.value) }))} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Maturity Value</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>₹{fdMaturity.toLocaleString()}</span>
                </div>
                <div className="section-divider" style={{ margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Interest Earned</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>₹{fdInterest.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'rd' && (
            <>
              <h2>🧮 RD Maturity Calculator</h2>
              <p className="card-subtitle">Calculate your Recurring Deposit returns.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Monthly Deposit — ₹{rdCalc.monthly.toLocaleString()}</label>
                  <input type="range" min="100" max="100000" step="100" value={rdCalc.monthly} onChange={e => setRdCalc(p => ({ ...p, monthly: parseInt(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Interest Rate — {rdCalc.rate}%</label>
                  <input type="range" min="4" max="10" step="0.05" value={rdCalc.rate} onChange={e => setRdCalc(p => ({ ...p, rate: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenure — {rdCalc.months} months</label>
                  <input type="range" min="6" max="120" step="6" value={rdCalc.months} onChange={e => setRdCalc(p => ({ ...p, months: parseInt(e.target.value) }))} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Maturity Value</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>₹{rdMaturity.toLocaleString()}</span>
                </div>
                <div className="section-divider" style={{ margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Deposited</span>
                  <span style={{ fontWeight: 600 }}>₹{rdDeposited.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Interest Earned</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>₹{rdInterest.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'insurance' && (
            <>
              <h2>🛡️ Why Term Insurance?</h2>
              <p className="card-subtitle">Protect your family's future.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {[
                  '✓ High coverage at low premiums',
                  '✓ Tax benefits under Section 80C & 10(10D)',
                  '✓ Financial security for dependents',
                  '✓ Covers critical illness riders',
                  '✓ Easy online application',
                ].map((item, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {comparing.length >= 2 && (
        <ComparisonTable products={comparing} type={activeTab} onRemove={(id) => setComparing(prev => prev.filter(p => p.id !== id))} />
      )}

      <DigitalDetectiveTip />
    </div>
  );
};

export default SavingsView;
