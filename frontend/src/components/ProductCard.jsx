import React, { useState } from 'react';
import { ExternalLink, CheckCircle, XCircle, GitCompareArrows, FileText, ArrowRight, X } from 'lucide-react';

const ProductCard = ({ product, type = 'loan', onCompare, isComparing, eligibility }) => {
  const [showChecklist, setShowChecklist] = useState(false);
  const eligible = eligibility?.eligible !== false;

  return (
    <div className={`glass-card ${isComparing ? 'ring-compare' : ''}`} style={{ 
      position: 'relative',
      overflow: 'hidden',
      border: isComparing ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--glass-border)',
      boxShadow: isComparing ? '0 0 20px rgba(139,92,246,0.15)' : 'none'
    }}>
      {/* Document Checklist Overlay */}
      {showChecklist && (
        <div className="animate-fade-in" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(7, 9, 15, 0.98)',
          zIndex: 20,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Required Documents</h3>
            </div>
            <button onClick={() => setShowChecklist(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Please ensure you have scanned copies of these documents ready:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {product.docs_required?.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  {doc}
                </div>
              ))}
            </div>
          </div>

          <a 
            href={product.official_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary" 
            style={{ textDecoration: 'none', fontSize: '0.82rem', width: '100%' }}
            onClick={() => setShowChecklist(false)}
          >
            Continue to Official Site <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* Main Card Content */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{product.icon}</span>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{product.name}</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{product.bank}</p>
          </div>
        </div>
        {eligibility && (
          <span className={`badge ${eligible ? 'success' : 'danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {eligible ? <><CheckCircle size={12} /> Eligible</> : <><XCircle size={12} /> Not Eligible</>}
          </span>
        )}
      </div>

      {type === 'loan' && (
        <div className="grid-3" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(139,92,246,0.08)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 600 }}>Interest</p>
            <p style={{ fontSize: '1.15rem', fontWeight: 800 }}>{product.interest_rate}%</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Fee</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{product.processing_fee}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Tenure</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{product.max_tenure} yrs</p>
          </div>
        </div>
      )}

      {type === 'card' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {[
            { l: 'Rewards', v: product.rewards_rate },
            { l: 'Annual Fee', v: product.annual_fee === 0 ? 'FREE ✨' : `₹${product.annual_fee}` },
            product.joining_bonus && { l: 'Bonus', v: product.joining_bonus },
          ].filter(Boolean).map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{r.l}</span>
              <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%', fontSize: '0.78rem' }}>{r.v}</span>
            </div>
          ))}
        </div>
      )}

      {type === 'savings' && (
        <div className="grid-2" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--success)', fontWeight: 600 }}>Rate</p>
            <p style={{ fontSize: '1.15rem', fontWeight: 800 }}>{product.interest_rate}%</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Min Deposit</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{product.min_deposit?.toLocaleString()}</p>
          </div>
        </div>
      )}

      {type === 'insurance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {[
            { l: 'Cover', v: product.cover },
            { l: 'Premium', v: product.premium_from },
            { l: 'Claim Ratio', v: product.claim_ratio },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{r.l}</span>
              <span style={{ fontWeight: 600, color: i === 2 ? 'var(--success)' : 'var(--text-primary)' }}>{r.v}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {product.v_kyc !== undefined && (
            <span style={{ fontSize: '0.68rem', color: product.v_kyc ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              {product.v_kyc ? '✅ 100% Remote (V-KYC)' : '⚠️ Physical Visit Required'}
            </span>
          )}
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              alert(`🕵️ Digital Detective Tip:\n1. Processing fees usually exclude 18% GST.\n2. Always verify the 'Standard Schedule of Service Charges' (SSSC) PDF on the bank's site.\n3. Check compounding frequency (Monthly vs Quarterly).`); 
            }} 
            style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', textDecoration: 'underline', cursor: 'help' }}
          >
            Verify Charges
          </a>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setShowChecklist(true)} 
            className="btn-primary" 
            style={{ flex: 1, fontSize: '0.8rem', padding: '0.55rem 1rem' }}
          >
            Apply Now <ExternalLink size={13} />
          </button>
          {onCompare && (
            <button onClick={() => onCompare(product)} className="btn-primary" style={{ padding: '0.55rem 0.75rem', background: isComparing ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', boxShadow: 'none', border: `1px solid ${isComparing ? 'rgba(139,92,246,0.4)' : 'var(--glass-border)'}`, color: isComparing ? 'var(--accent-primary)' : 'var(--text-secondary)' }} title="Compare">
              <GitCompareArrows size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
