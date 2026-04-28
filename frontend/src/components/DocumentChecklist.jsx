import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

const DocumentChecklist = ({ product }) => {
  if (!product || !product.docs_required) return null;

  return (
    <div className="glass-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ fontSize: '1rem' }}>Required Documents</h2>
      </div>
      <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
        Checklist for <strong>{product.name}</strong> at {product.bank}.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {product.docs_required.map((doc, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '10px',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ color: 'var(--success)' }}>
              <CheckCircle2 size={18} />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{doc}</span>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: 'rgba(59,130,246,0.08)', 
        borderLeft: '4px solid var(--info)',
        borderRadius: '0 8px 8px 0',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)'
      }}>
        💡 <strong>Pro Tip:</strong> Keep scanned copies of these documents ready in PDF/JPG format for a faster application process on the bank's portal.
      </div>
    </div>
  );
};

export default DocumentChecklist;
