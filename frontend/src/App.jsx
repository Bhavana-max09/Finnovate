import React, { useState, useEffect } from 'react';
import { CreditCard, Home, PiggyBank, ArrowRightLeft, ClipboardCheck, Sun, Moon, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import DashboardView from './views/DashboardView';
import CardsView from './views/CardsView';
import LoansView from './views/LoansView';
import SavingsView from './views/SavingsView';
import ForexView from './views/ForexView';
import EligibilityView from './views/EligibilityView';
import PrivacyView from './views/PrivacyView';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ethicredit-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('ethicredit-theme') || 'dark');
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ethicredit-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { name: loginForm.name || loginForm.email.split('@')[0], email: loginForm.email };
    localStorage.setItem('ethicredit-user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('ethicredit-user');
    setUser(null);
  };

  // ── LOGIN SCREEN ──
  if (!user) {
    return (
      <div className="login-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
              EthiCredit Pro
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Financial Services Aggregator
            </p>
          </div>

          <div className="tab-row" style={{ marginBottom: '1.5rem' }}>
            <button className={`tab-btn ${!isSignUp ? 'active' : ''}`} onClick={() => setIsSignUp(false)}>Sign In</button>
            <button className={`tab-btn ${isSignUp ? 'active' : ''}`} onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>

          <form onSubmit={handleLogin}>
            {isSignUp && (
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <input type="text" value={loginForm.name} onChange={e => setLoginForm(f => ({ ...f, name: e.target.value }))} className="form-input" placeholder="John Doe" required={isSignUp} />
              </div>
            )}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email Address</label>
              <input type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Password</label>
              <input type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              {isSignUp ? '🚀 Create Account' : '🔑 Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '1.5rem', opacity: 0.6 }}>
            Powered by EthiCredit Pro · Secure & Private
          </p>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  const NAV_ITEMS = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'cards', icon: CreditCard, label: 'Cards' },
    { key: 'loans', icon: Home, label: 'Loans' },
    { key: 'savings', icon: PiggyBank, label: 'Savings' },
    { key: 'forex', icon: ArrowRightLeft, label: 'Forex' },
    { key: 'eligibility', icon: ClipboardCheck, label: 'Eligibility' },
    { key: 'privacy', icon: ShieldCheck, label: 'Privacy' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':   return <DashboardView onNavigate={setActiveTab} user={user} />;
      case 'cards':       return <CardsView />;
      case 'loans':       return <LoansView />;
      case 'savings':     return <SavingsView />;
      case 'forex':       return <ForexView />;
      case 'eligibility': return <EligibilityView />;
      case 'privacy':     return <PrivacyView />;
      default:            return <DashboardView onNavigate={setActiveTab} user={user} />;
    }
  };

  return (
    <div className="app-container">
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <aside className="sidebar">
        <div style={{ flex: 1 }}>
          <div className="brand">EthiCredit Pro</div>
          <div className="brand-sub">Financial Aggregator</div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              width: '100%', padding: '0.65rem 1rem', borderRadius: '12px',
              background: theme === 'dark' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)',
              border: `1px solid ${theme === 'dark' ? 'rgba(245,158,11,0.25)' : 'rgba(139,92,246,0.25)'}`,
              color: theme === 'dark' ? '#f59e0b' : '#7c3aed',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              marginBottom: '1.25rem', fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            {theme === 'dark' ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
          </button>

          <div className="nav-section-label">Modules</div>
          <nav>
            {NAV_ITEMS.map(item => (
              <div
                key={item.key}
                className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <item.icon size={20} /><span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--info))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{user.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.75rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'inherit' }}>
            <LogOut size={14} /> Sign Out
          </button>
          <div className="sidebar-status" style={{ marginTop: '0.75rem' }}>
            <div className="status-dot" />
            <span>System Online</span>
          </div>
        </div>
      </aside>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
