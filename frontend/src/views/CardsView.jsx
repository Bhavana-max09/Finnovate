import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ComparisonTable from '../components/ComparisonTable';
import bankData from '../data/bank_data.json';
import DigitalDetectiveTip from '../components/DigitalDetectiveTip';

const CardsView = () => {
  const [filter, setFilter] = useState('all');
  const [comparing, setComparing] = useState([]);

  const cards = bankData.cards.filter(c => filter === 'all' || c.type === filter);

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
        <h1 className="page-title">Credit & Debit Cards</h1>
        <p className="page-subtitle">Compare rewards, annual fees, and apply directly to India's top banks.</p>
        <span className="page-tag">💳 Cards · Compare · Apply Now</span>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: '💳', label: 'Total Cards', value: bankData.cards.length },
          { icon: '🏦', label: 'Banks', value: new Set(bankData.cards.map(c => c.bank)).size },
          { icon: '✨', label: 'Free Cards', value: bankData.cards.filter(c => c.annual_fee === 0).length },
          { icon: '📊', label: 'Comparing', value: comparing.length },
        ].map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="tab-row">
        {[{ key: 'all', label: '🃏 All Cards' }, { key: 'credit', label: '💳 Credit' }, { key: 'debit', label: '🏧 Debit' }].map(t => (
          <button key={t.key} className={`tab-btn ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid-3">
        {cards.map(card => (
          <ProductCard
            key={card.id}
            product={card}
            type="card"
            onCompare={toggleCompare}
            isComparing={!!comparing.find(c => c.id === card.id)}
          />
        ))}
      </div>

      {/* Comparison Table */}
      {comparing.length >= 2 && (
        <ComparisonTable products={comparing} type="card" onRemove={(id) => setComparing(prev => prev.filter(p => p.id !== id))} />
      )}

      <DigitalDetectiveTip />
    </div>
  );
};

export default CardsView;
