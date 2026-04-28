import React from 'react';
import { X, ExternalLink, Trophy } from 'lucide-react';

const ComparisonTable = ({ products, type = 'loan', onRemove }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>📊 Side-by-Side Comparison</h2>
        <span className="badge info">{products.length} selected</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Feature</th>
              {products.map(p => (
                <th key={p.id} style={{ minWidth: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{p.icon}</span> {p.bank}
                    <button onClick={() => onRemove(p.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px' }}>
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {type === 'loan' && (
              <>
                <CompRow label="Product" values={products.map(p => p.name)} />
                <CompRow label="Interest Rate" values={products.map(p => `${p.interest_rate}%`)} best={findBest(products.map(p => p.interest_rate), 'low')} />
                <CompRow label="Processing Fee" values={products.map(p => p.processing_fee)} />
                <CompRow label="Max Tenure" values={products.map(p => `${p.max_tenure} years`)} best={findBest(products.map(p => p.max_tenure), 'high')} />
                <CompRow label="Min Income" values={products.map(p => `₹${p.min_income?.toLocaleString()}`)} best={findBest(products.map(p => p.min_income), 'low')} />
                <CompRow label="Min Credit Score" values={products.map(p => p.min_credit_score || 'N/A')} />
              </>
            )}
            {type === 'card' && (
              <>
                <CompRow label="Product" values={products.map(p => p.name)} />
                <CompRow label="Rewards" values={products.map(p => p.rewards_rate)} />
                <CompRow label="Annual Fee" values={products.map(p => p.annual_fee === 0 ? 'FREE' : `₹${p.annual_fee}`)} best={findBest(products.map(p => p.annual_fee), 'low')} />
                <CompRow label="Joining Bonus" values={products.map(p => p.joining_bonus || 'Nil')} />
              </>
            )}
            {(type === 'savings' || type === 'fd' || type === 'rd') && (
              <>
                <CompRow label="Product" values={products.map(p => p.name)} />
                <CompRow label="Interest Rate" values={products.map(p => `${p.interest_rate}%`)} best={findBest(products.map(p => p.interest_rate), 'high')} />
                <CompRow label="Min Deposit" values={products.map(p => `₹${p.min_deposit?.toLocaleString()}`)} best={findBest(products.map(p => p.min_deposit), 'low')} />
              </>
            )}
            <tr>
              <td style={{ fontWeight: 600 }}>Apply</td>
              {products.map(p => (
                <td key={p.id}>
                  <a href={p.official_link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.72rem', padding: '0.4rem 0.75rem', textDecoration: 'none' }}>
                    Apply <ExternalLink size={11} />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function CompRow({ label, values, best }) {
  return (
    <tr>
      <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</td>
      {values.map((v, i) => (
        <td key={i} style={{ fontWeight: best === i ? 700 : 400, color: best === i ? 'var(--success)' : 'var(--text-primary)' }}>
          {best === i && <Trophy size={12} style={{ marginRight: '0.3rem', display: 'inline' }} />}
          {v}
        </td>
      ))}
    </tr>
  );
}

function findBest(values, direction) {
  const nums = values.map(v => (typeof v === 'number' ? v : parseFloat(v)));
  if (nums.some(isNaN)) return -1;
  if (direction === 'low') return nums.indexOf(Math.min(...nums));
  return nums.indexOf(Math.max(...nums));
}

export default ComparisonTable;
