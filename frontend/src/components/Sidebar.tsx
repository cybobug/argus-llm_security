import React from 'react';
import { 
  Radar, 
  Network, 
  Bug, 
  GitPullRequest, 
  BrainCircuit, 
  FileText, 
  Blocks, 
  Settings,
  Activity,
  Bot,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const coreNav = [
    { id: 'overview', label: 'SOC Dashboard', icon: Activity },
    { id: 'target-chatbot', label: 'Target Chatbot', icon: Bot, badge: 'Live RAG' },
    { id: 'scans', label: 'Security Assessments', icon: Radar },
  ];

  const graphNav = [
    { id: 'digital-twin', label: 'Digital Twin Graph', icon: Network },
    { id: 'vulnerabilities', label: 'Vulnerability Matrix', icon: Bug, badge: '6 Findings' },
    { id: 'attack-paths', label: 'Exploit Attack Paths', icon: GitPullRequest },
  ];

  const secondaryNav = [
    { id: 'threat-intel', label: 'Threat Intelligence', icon: BrainCircuit },
    { id: 'reports', label: 'Executive Reports', icon: FileText },
    { id: 'integrations', label: 'Integrations & SIEM', icon: Blocks },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      userSelect: 'none',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '22px 20px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <img 
          src="/logo.png" 
          alt="ARGUS Logo" 
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.45))'
          }}
        />
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-bright)',
            lineHeight: 1
          }}>
            ARGUS
          </h1>
          <span style={{
            fontSize: '0.62rem',
            color: 'var(--accent-red)',
            letterSpacing: '0.12em',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            AI SECURITY PLATFORM
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
        
        {/* Section 1: Core Operations */}
        <div style={{
          padding: '8px 20px 6px',
          fontSize: '0.66rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase'
        }}>
          Operations
        </div>
        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {coreNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--accent-red-bg)' : 'transparent',
                  color: isActive ? 'var(--accent-red-glow)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid var(--accent-red)' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isActive ? 'var(--accent-red)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.64rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--accent-blue-glow)',
                    fontWeight: 700,
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Section 2: Attack Surface & Knowledge Graph */}
        <div style={{
          padding: '16px 20px 6px',
          fontSize: '0.66rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase'
        }}>
          Attack Surface
        </div>
        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {graphNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--accent-red-bg)' : 'transparent',
                  color: isActive ? 'var(--accent-red-glow)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid var(--accent-red)' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isActive ? 'var(--accent-red)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.64rem',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: 'var(--accent-red)',
                    fontWeight: 700,
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Section 3: Intelligence & Management */}
        <div style={{
          padding: '16px 20px 6px',
          fontSize: '0.66rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase'
        }}>
          Intelligence & Audits
        </div>
        <nav style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--accent-red-bg)' : 'transparent',
                  color: isActive ? 'var(--accent-red-glow)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid var(--accent-red)' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-red)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Status Capsule */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-green)',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-bright)', lineHeight: 1.1 }}>
              SOC System Live
            </span>
            <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
              Port 7003 • 8000
            </span>
          </div>
        </div>
        <span style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)'
        }}>
          v1.0.4
        </span>
      </div>
    </aside>
  );
};
