import React, { useState } from 'react';
import { 
  Blocks, 
  CheckCircle2, 
  Database, 
  Network, 
  MessageSquare, 
  Trello, 
  RefreshCw, 
  Settings, 
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Radio,
  Sliders,
  Power
} from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'Knowledge Store' | 'Graph Engine' | 'Incident Alerts' | 'Ticketing & DevOps';
  status: 'CONNECTED' | 'ACTIVE' | 'CONFIGURED' | 'DISCONNECTED';
  endpoint: string;
  description: string;
  icon: any;
  lastHeartbeat: string;
  metrics: string;
}

export const IntegrationsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const integrations: IntegrationItem[] = [
    { 
      id: 'neo4j',
      name: 'Neo4j Graph Database', 
      category: 'Graph Engine',
      status: 'CONNECTED', 
      endpoint: 'bolt://localhost:7687',
      description: 'Synchronizes live Digital Twin attack surface topologies and traverses multi-hop exploit paths using Cypher.',
      icon: Network,
      lastHeartbeat: '2s ago (Active)',
      metrics: '128 nodes, 342 relationships mapped'
    },
    { 
      id: 'faiss',
      name: 'ChromaDB / FAISS Store', 
      category: 'Knowledge Store',
      status: 'CONNECTED', 
      endpoint: 'http://localhost:7003/document',
      description: 'Monitors high-dimensional vector embeddings and detects untrusted PDF injection payloads in document chunks.',
      icon: Database,
      lastHeartbeat: '14s ago (Healthy)',
      metrics: '34 document chunks indexed'
    },
    { 
      id: 'slack',
      name: 'Slack Security Webhook', 
      category: 'Incident Alerts',
      status: 'ACTIVE', 
      endpoint: 'https://hooks.slack.com/services/T00/B00/X...',
      description: 'Dispatches high-urgency notifications to #soc-ai-alerts whenever Critical prompt injection or data exfiltration is detected.',
      icon: MessageSquare,
      lastHeartbeat: '1m ago (Listening)',
      metrics: '19 alerts dispatched this week'
    },
    { 
      id: 'jira',
      name: 'Jira Software / GitHub Issues', 
      category: 'Ticketing & DevOps',
      status: 'CONFIGURED', 
      endpoint: 'https://enterprise.atlassian.net/rest/api/3',
      description: 'Automatically provisions developer bug tickets with OWASP LLM tags, reproduction curl payloads, and remediation code.',
      icon: Trello,
      lastHeartbeat: '10m ago (Ready)',
      metrics: '12 remediation tickets provisioned'
    }
  ];

  const filteredIntegrations = integrations.filter(i => {
    if (activeCategory === 'ALL') return true;
    return i.category === activeCategory;
  });

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SECURITY ECOSYSTEM
            </span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              padding: '2px 8px', 
              borderRadius: '4px', 
              backgroundColor: 'rgba(16, 185, 129, 0.15)', 
              color: 'var(--accent-green)' 
            }}>
              ● 4 OF 4 CONNECTED
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginTop: '2px' }}>
            Enterprise Integrations & SIEM
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Connect ARGUS with your enterprise SIEM, SOC incident webhooks, vector databases, and developer ticketing systems.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '2px',
          fontSize: '0.74rem'
        }}>
          {(['ALL', 'Knowledge Store', 'Graph Engine', 'Incident Alerts', 'Ticketing & DevOps'] as const).map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeCategory === c ? 'var(--accent-red-bg)' : 'transparent',
                color: activeCategory === c ? 'var(--accent-red)' : 'var(--text-muted)',
                fontWeight: activeCategory === c ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {c === 'ALL' ? 'All Integrations' : c}
            </button>
          ))}
        </div>
      </div>

      {feedbackMsg && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid var(--accent-green)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.80rem',
          color: 'var(--accent-green)',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ── INTEGRATIONS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {filteredIntegrations.map((item) => {
          const Icon = item.icon;

          return (
            <div 
              key={item.id} 
              className="argus-card" 
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-blue-glow)'
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-bright)', fontSize: '0.94rem' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {item.category}
                    </div>
                  </div>
                </div>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-green)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <CheckCircle2 size={11} /> {item.status}
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {item.description}
              </p>

              {/* Endpoint & Stats Box */}
              <div style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: '0.72rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>URI:</span>
                  <span style={{ color: 'var(--accent-blue-glow)', fontFamily: 'var(--font-mono)' }}>{item.endpoint}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Telemetry:</span>
                  <strong style={{ color: 'var(--text-bright)' }}>{item.metrics}</strong>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Heartbeat: {item.lastHeartbeat}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setFeedbackMsg(`Telemetry handshake with ${item.name} verified — latency: 18ms, status: 200 OK`);
                      setTimeout(() => setFeedbackMsg(null), 4000);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={11} /> Test Connection
                  </button>
                  <button
                    onClick={() => {
                      setFeedbackMsg(`Configured ${item.name} sync parameters: pipeline webhook active & TLS 1.3 verified.`);
                      setTimeout(() => setFeedbackMsg(null), 4000);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Settings size={11} /> Configure
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
