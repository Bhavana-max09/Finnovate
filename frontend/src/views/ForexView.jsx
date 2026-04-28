import React from 'react';
import ForexConverter from '../components/ForexConverter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import bankData from '../data/bank_data.json';

const TT_STYLE = { background: 'rgba(10,12,20,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '0.8rem' };

const ForexView = () => {
  const rates = bankData.forex_base_rates;
  const chartData = Object.entries(rates).map(([code, rate]) => ({ currency: code, rate }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Forex Exchange</h1>
        <p className="page-subtitle">Convert currencies and track exchange rates against INR.</p>
        <span className="page-tag">💱 Forex · Currency Converter · Live Rates</span>
      </div>

      <div className="grid-2">
        <ForexConverter />

        <div className="glass-card">
          <h2>📊 INR Exchange Rates Chart</h2>
          <p className="card-subtitle">Visual comparison of exchange rates (₹ per unit).</p>
          <div style={{ height: '320px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 10, left: -10, bottom: 4 }}>
                <XAxis dataKey="currency" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} />
                <Tooltip contentStyle={TT_STYLE} formatter={(v) => [`₹${v}`, 'Rate']} />
                <Bar dataKey="rate" fill="#8b5cf6" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForexView;
