import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ComparisonTable from '../components/ComparisonTable';
import { calculateEMI } from '../utils/calculators';
import bankData from '../data/bank_data.json';
import DigitalDetectiveTip from '../components/DigitalDetectiveTip';

const LoansView = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [comparing, setComparing] = useState([]);
  const [emiCalc, setEmiCalc] = useState({ principal: 2000000, rate: 8.5, tenure: 20 });

  const loans = bankData.loans[activeTab] || [];
  const emi = calculateEMI(emiCalc.principal, emiCalc.rate, emiCalc.tenure * 12);
  const totalPay = emi * emiCalc.tenure * 12;
  const totalInterest = totalPay - emiCalc.principal;

  const toggleCompare = (product) => {
    setComparing(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Loan Comparison</h1>
        <p className="page-subtitle">Compare interest rates, processing fees, and apply to India's best banks.</p>
        <span className="page-tag">🏠 Home · 🚗 Car · 🎓 Education · 💰 Personal</span>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        {[
          { key: 'home', label: '🏠 Home' }, { key: 'car', label: '🚗 Car' },
          { key: 'education', label: '🎓 Education' }, { key: 'personal', label: '💰 Personal' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => { setActiveTab(t.key); setComparing([]); }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {/* Loan Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loans.map(loan => (
            <ProductCard
              key={loan.id}
              product={loan}
              type="loan"
              onCompare={toggleCompare}
              isComparing={!!comparing.find(c => c.id === loan.id)}
            />
          ))}
        </div>

        {/* EMI Calculator */}
        <div className="glass-card" style={{ alignSelf: 'flex-start', position: 'sticky', top: '1rem' }}>
          <h2>🧮 EMI Calculator</h2>
          <p className="card-subtitle">Calculate your monthly payment.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Loan Amount — ₹{emiCalc.principal.toLocaleString()}</label>
              <input type="range" min="100000" max="10000000" step="50000" value={emiCalc.principal} onChange={e => setEmiCalc(p => ({ ...p, principal: parseInt(e.target.value) }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Interest Rate — {emiCalc.rate}%</label>
              <input type="range" min="5" max="20" step="0.1" value={emiCalc.rate} onChange={e => setEmiCalc(p => ({ ...p, rate: parseFloat(e.target.value) }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tenure — {emiCalc.tenure} years</label>
              <input type="range" min="1" max="30" step="1" value={emiCalc.tenure} onChange={e => setEmiCalc(p => ({ ...p, tenure: parseInt(e.target.value) }))} />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Monthly EMI</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>₹{emi.toLocaleString()}</span>
            </div>
            <div className="section-divider" style={{ margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Interest</span>
              <span style={{ fontWeight: 600, color: 'var(--warning)' }}>₹{totalInterest.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.3rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Payment</span>
              <span style={{ fontWeight: 600 }}>₹{totalPay.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {comparing.length >= 2 && (
        <ComparisonTable products={comparing} type="loan" onRemove={(id) => setComparing(prev => prev.filter(p => p.id !== id))} />
      )}

      <DigitalDetectiveTip />
    </div>
  );
};

export default LoansView;
