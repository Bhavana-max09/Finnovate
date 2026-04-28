import React, { useState } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import bankData from '../data/bank_data.json';

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', rate: 1 },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: bankData.forex_base_rates.USD },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: bankData.forex_base_rates.EUR },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: bankData.forex_base_rates.GBP },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: bankData.forex_base_rates.JPY },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rate: bankData.forex_base_rates.AED },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rate: bankData.forex_base_rates.SGD },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: bankData.forex_base_rates.CAD },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: bankData.forex_base_rates.AUD },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: bankData.forex_base_rates.CHF },
];

const ForexConverter = () => {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState('INR');
  const [to, setTo] = useState('USD');

  const fromCurr = CURRENCIES.find(c => c.code === from);
  const toCurr = CURRENCIES.find(c => c.code === to);

  const convert = () => {
    if (!fromCurr || !toCurr) return 0;
    const inrAmount = from === 'INR' ? amount : amount * fromCurr.rate;
    const result = to === 'INR' ? inrAmount : inrAmount / toCurr.rate;
    return result.toFixed(2);
  };

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="glass-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ArrowRightLeft size={18} style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ fontSize: '1rem' }}>Currency Converter</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '120px' }}>
          <label className="form-label">Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="form-input" min="0" />
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '120px' }}>
          <label className="form-label">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="form-select">
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
          </select>
        </div>
        <button onClick={swap} style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--accent-primary)', cursor: 'pointer', marginBottom: '0.3rem' }}>
          <RefreshCw size={18} />
        </button>
        <div className="form-group" style={{ flex: 1, minWidth: '120px' }}>
          <label className="form-label">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="form-select">
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
          </select>
        </div>
      </div>

      {/* Result */}
      <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '14px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Converted Amount</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {toCurr?.flag} {parseFloat(convert()).toLocaleString()} {to}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          1 {from} = {from === 'INR' ? (1 / toCurr?.rate).toFixed(4) : (fromCurr?.rate / (to === 'INR' ? 1 : toCurr?.rate)).toFixed(4)} {to}
        </div>
      </div>

      {/* Rate Table */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>📊 INR Exchange Rates</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
          {CURRENCIES.filter(c => c.code !== 'INR').map(c => (
            <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.65rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
              <span>{c.flag}</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.code}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>₹{c.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForexConverter;
