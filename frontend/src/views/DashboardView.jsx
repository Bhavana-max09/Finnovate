import React from 'react';
import { CreditCard, Home, PiggyBank, ArrowRightLeft, ClipboardCheck, TrendingUp } from 'lucide-react';
import bankData from '../data/bank_data.json';
import DigitalDetectiveTip from '../components/DigitalDetectiveTip';

const MODULES = [
  { key: 'cards', icon: CreditCard, emoji: '💳', label: 'Credit & Debit Cards', desc: 'Compare rewards, fees, and apply instantly.', color: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  { key: 'loans', icon: Home, emoji: '🏠', label: 'Loans', desc: 'Home, Car, Education, Personal loan comparison.', color: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  { key: 'savings', icon: PiggyBank, emoji: '🏦', label: 'Savings & Insurance', desc: 'FD, RD yield calculators and insurance plans.', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  { key: 'forex', icon: ArrowRightLeft, emoji: '💱', label: 'Forex Exchange', desc: 'Real-time currency conversion & rates.', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  { key: 'eligibility', icon: ClipboardCheck, emoji: '✅', label: 'Eligibility Checker', desc: 'Check your eligibility across all products.', color: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
];

const DashboardView = ({ onNavigate, user }) => {
  const totalProducts = bankData.cards.length +
    Object.values(bankData.loans).flat().length +
    Object.values(bankData.savings).flat().length;
  const bestHomeRate = Math.min(...bankData.loans.home.map(l => l.interest_rate));
  const bestFDRate = Math.max(...bankData.savings.fd.map(f => f.interest_rate));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name || 'User'} 👋</h1>
        <p className="page-subtitle">Your financial services dashboard. Compare, calculate, and apply — all in one place.</p>
        <span className="page-tag">🚀 EthiCredit Pro · Financial Aggregator</span>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: '📋', label: 'Products Available', value: totalProducts },
          { icon: '🏦', label: 'Banks Covered', value: bankData.banks.length },
          { icon: '🏠', label: 'Best Home Loan', value: `${bestHomeRate}%`, sub: 'Starting rate' },
          { icon: '📈', label: 'Best FD Rate', value: `${bestFDRate}%`, sub: 'p.a.' },
        ].map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            {k.sub && <div className="kpi-sub">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {MODULES.map(mod => (
          <div
            key={mod.key}
            className="glass-card"
            onClick={() => onNavigate(mod.key)}
            style={{ cursor: 'pointer', background: mod.color, border: `1px solid ${mod.border}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{mod.emoji}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{mod.label}</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{mod.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Explore <TrendingUp size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid-2">
        <div className="glass-card">
          <h2>🏆 Best Rates Today</h2>
          <p className="card-subtitle">Top offers across all categories.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
            {[
              { cat: 'Home Loan', bank: 'SBI', rate: '8.40%', icon: '🏠' },
              { cat: 'Car Loan', bank: 'SBI', rate: '8.85%', icon: '🚗' },
              { cat: 'Education', bank: 'SBI', rate: '8.15%', icon: '🎓' },
              { cat: 'Personal', bank: 'HDFC', rate: '10.50%', icon: '💰' },
              { cat: 'Fixed Deposit', bank: 'HDFC', rate: '7.25%', icon: '🏦' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.cat}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.bank}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem' }}>{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h2>📊 Market Overview</h2>
          <p className="card-subtitle">Key forex rates and economic indicators.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
            {Object.entries(bankData.forex_base_rates).slice(0, 6).map(([code, rate]) => (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.65rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', minWidth: '30px' }}>{code}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>₹{rate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DigitalDetectiveTip />
    </div>
  );
};

export default DashboardView;
