import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Plus, 
  ShieldAlert, 
  Bot, 
  Network, 
  Radar, 
  CheckCircle2, 
  Terminal,
  ChevronDown,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenScanModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenScanModal, 
  theme, 
  onToggleTheme,
  onNavigateTab 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Comprehensive Search Database for Fast Interactive Navigation
  const searchableItems = [
    { title: 'Target Chatbot (RAG Assistant)', category: 'Application', tab: 'target-chatbot', icon: Bot, desc: 'Enterprise chatbot with FAISS vectors & live tools' },
    { title: 'Prompt Injection (Direct & Indirect)', category: 'Vulnerability', tab: 'vulnerabilities', icon: ShieldAlert, desc: 'OWASP LLM01:2025 verified finding' },
    { title: 'Excessive Agency & Tool Abuse', category: 'Vulnerability', tab: 'vulnerabilities', icon: ShieldAlert, desc: 'OWASP LLM08:2025 verified finding' },
    { title: 'Digital Twin Topology Graph', category: 'Topology', tab: 'digital-twin', icon: Network, desc: 'Neo4j interactive asset and sink attack paths' },
    { title: 'Attack Path: PDF -> Vector -> Email', category: 'Attack Path', tab: 'attack-paths', icon: Terminal, desc: 'Critical multi-hop traversal exploit' },
    { title: 'Autonomous Security Scans', category: 'Assessments', tab: 'scans', icon: Radar, desc: 'Automated Red Team scan jobs and execution logs' },
    { title: 'ChromaDB Knowledge Store', category: 'Asset', tab: 'digital-twin', icon: Network, desc: 'Internal Vector Store Node' },
    { title: 'Employee Database (SQL)', category: 'Asset', tab: 'digital-twin', icon: Network, desc: 'Direct SQL Tool Sink' },
    { title: 'Corporate Mailer (send_email)', category: 'Asset', tab: 'digital-twin', icon: Network, desc: 'External Dispatch Tool Sink' },
  ];

  const filteredResults = searchQuery.trim() === '' ? [] : searchableItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-card)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    }}>
      {/* Modern High-End Search Bar */}
      <div ref={searchRef} style={{ position: 'relative', width: '440px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0 14px',
          height: '40px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.2s ease'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder="Search threats, assets, scans, or command palette..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.86rem',
              fontWeight: 500,
              outline: 'none'
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-glass)',
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            marginLeft: '8px',
            flexShrink: 0
          }}>
            <span>⌘</span>K
          </div>
        </div>

        {/* Search Results / Command Palette Dropdown */}
        {isSearchOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            width: '100%',
            minWidth: '500px',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
            zIndex: 100,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card-header)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {searchQuery ? `Matching Results (${filteredResults.length})` : 'Suggested Quick Access'}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                esc to dismiss
              </span>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
              {(searchQuery ? filteredResults : searchableItems.slice(0, 5)).map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectResult(item.tab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--accent-red-bg)',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-red-glow)',
                      flexShrink: 0
                    }}>
                      <ItemIcon size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--border-subtle)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-secondary)',
                      fontWeight: 600
                    }}>
                      {item.category}
                    </span>
                  </div>
                );
              })}

              {searchQuery && filteredResults.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  No threats, assets, or findings matched "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Header Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Primary Action Button */}
        <button 
          onClick={onOpenScanModal}
          className="btn-primary-red"
          style={{ height: '38px', padding: '0 16px', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontWeight: 600 }}
        >
          <Plus size={15} />
          <span>New Assessment</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-red)',
              color: 'white',
              fontSize: '0.62rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
            }}>
              2
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: '380px',
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-card-header)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color="var(--accent-red)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                    Security Alerts
                  </span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--accent-red-bg)',
                  color: 'var(--accent-red-glow)',
                  fontWeight: 800
                }}>
                  2 NEW
                </span>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <div style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '12px',
                  backgroundColor: 'rgba(244, 63, 94, 0.04)'
                }}>
                  <AlertTriangle size={18} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                      Critical Prompt Injection Detected
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.4 }}>
                      Payload bypassed system instructions in Target Chatbot (Vector RAG).
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                      2 mins ago • OWASP LLM01
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '14px 18px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <ShieldCheck size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                      Continuous Monitor Node Active
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.4 }}>
                      Digital Twin synced 128 nodes with real-time vector embeddings.
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                      14 mins ago • Telemetry Engine
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '10px 18px',
                borderTop: '1px solid var(--border-subtle)',
                textAlign: 'center',
                backgroundColor: 'var(--bg-card-header)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--accent-red-glow)'
              }}
              onClick={() => {
                setIsNotificationsOpen(false);
                if (onNavigateTab) onNavigateTab('threat-intel');
              }}>
                View Threat Intelligence Feed →
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button 
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
        >
          {theme === 'dark' ? (
            <Sun size={16} color="var(--accent-amber)" />
          ) : (
            <Moon size={16} color="var(--accent-blue-glow)" />
          )}
        </button>

        {/* User Profile Capsule */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsProfileOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '4px 10px 4px 5px',
              cursor: 'pointer',
              height: '38px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: '0.8rem'
            }}>
              A
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.1 }}>
                Admin SOC
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                Security Lead
              </span>
            </div>
            <ChevronDown size={12} color="var(--text-muted)" style={{ marginLeft: '2px' }} />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: '200px',
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
              zIndex: 100,
              padding: '6px'
            }}>
              <div 
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('settings');
                  setIsProfileOpen(false);
                }}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Platform Settings
              </div>
              <div 
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('scans');
                  setIsProfileOpen(false);
                }}
                style={{
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Audit History
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
