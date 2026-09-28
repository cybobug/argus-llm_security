import React, { useState } from 'react';
import { 
  Maximize2, 
  User, 
  Globe, 
  Database, 
  FileText, 
  FolderGit2, 
  Mail, 
  ShieldAlert,
  Cpu,
  Wrench,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Layers
} from 'lucide-react';

interface NodeItem {
  id: string;
  label: string;
  category: string;
  icon: any;
  cx: number;
  cy: number;
  status: 'normal' | 'risk' | 'critical';
}

interface DigitalTwinGraphProps {
  onNavigateTab?: (tab: string) => void;
}

export const DigitalTwinGraph: React.FC<DigitalTwinGraphProps> = ({ onNavigateTab }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  // SVG coordinate canvas size: 700 x 280
  // LLM Center: (350, 140)
  // Perfectly placed radial nodes:
  // User Ingress (left-top): (90, 75)
  // Web App Gateway (top): (350, 42)
  // FAISS Vector DB (right-top): (600, 75)
  // Email API Tool (left-bottom): (90, 205)
  // External Tools (bottom-left): (225, 235)
  // File System (bottom-right): (475, 235)
  // Document Store (right-bottom): (600, 205)
  const nodes: NodeItem[] = [
    { id: 'llm', label: 'Target LLM', category: 'Inference Engine', icon: Cpu, cx: 350, cy: 140, status: 'critical' },
    { id: 'user', label: 'User Ingress', category: 'External Boundary', icon: User, cx: 90, cy: 75, status: 'normal' },
    { id: 'webapp', label: 'Web App Gateway', category: 'API Reverse Proxy', icon: Globe, cx: 350, cy: 42, status: 'risk' },
    { id: 'vectordb', label: 'FAISS Vector DB', category: 'RAG Knowledge Store', icon: Database, cx: 600, cy: 75, status: 'risk' },
    { id: 'documents', label: 'Document Store', category: 'PDF Knowledge Base', icon: FileText, cx: 600, cy: 205, status: 'normal' },
    { id: 'filesystem', label: 'File System', category: 'Local Storage (/data)', icon: FolderGit2, cx: 475, cy: 235, status: 'risk' },
    { id: 'externaltools', label: 'External Tools', category: 'Dynamic Webhook Sink', icon: Wrench, cx: 225, cy: 235, status: 'risk' },
    { id: 'email', label: 'Email API Tool', category: 'SMTP Dispatch Relay', icon: Mail, cx: 90, cy: 205, status: 'critical' },
  ];

  // Direct relations - clean and meaningful topology:
  // External User -> WebApp -> Target LLM
  // Target LLM <-> FAISS Vector DB
  // Document Store -> FAISS Vector DB (Indexing pipeline)
  // Target LLM -> File System, External Tools, Email API
  const links = [
    { source: 'user', target: 'llm', isRisk: true },
    { source: 'webapp', target: 'llm', isRisk: true },
    { source: 'vectordb', target: 'llm', isRisk: true },
    { source: 'documents', target: 'vectordb', isRisk: false },
    { source: 'filesystem', target: 'llm', isRisk: true },
    { source: 'externaltools', target: 'llm', isRisk: true },
    { source: 'email', target: 'llm', isRisk: true },
  ];

  const getNode = (id: string) => nodes.find(n => n.id === id) || nodes[0];

  // Telemetry details for active security investigation
  const nodeDetails: Record<string, {
    title: string;
    type: string;
    risk: 'CRITICAL' | 'HIGH' | 'LOW' | 'NEUTRAL';
    connectedComponents: number;
    attackPaths: number;
    lastTested: string;
    impact: string;
    findings: string[];
  }> = {
    llm: {
      title: 'Target LLM (Gemini 1.5 / GPT-4o)',
      type: 'Core AI Agent / Inference Host',
      risk: 'CRITICAL',
      connectedComponents: 6,
      attackPaths: 4,
      lastTested: 'Just now (Continuous)',
      impact: 'Arbitrary tool invocation, unauthorized knowledge base retrieval, and system prompt leakage.',
      findings: ['OWASP LLM01: Prompt Injection', 'OWASP LLM04: Model Denial of Service']
    },
    email: {
      title: 'Email API (send_email)',
      type: 'External Communication Tool',
      risk: 'CRITICAL',
      connectedComponents: 1,
      attackPaths: 2,
      lastTested: '3 mins ago',
      impact: 'Unauthorized exfiltration of corporate memory to attacker-controlled recipient.',
      findings: ['OWASP LLM07: System Information Leakage', 'OWASP LLM08: Excessive Agency']
    },
    vectordb: {
      title: 'FAISS Vector DB',
      type: 'RAG Knowledge Embeddings',
      risk: 'HIGH',
      connectedComponents: 2,
      attackPaths: 2,
      lastTested: '12 mins ago',
      impact: 'Indirect prompt injection via poisoned chunk storage in similarity index.',
      findings: ['OWASP LLM02: Sensitive Information Disclosure']
    },
    filesystem: {
      title: 'Local File System (/data/reports)',
      type: 'Confidential Storage Volume',
      risk: 'HIGH',
      connectedComponents: 1,
      attackPaths: 1,
      lastTested: '18 mins ago',
      impact: 'Path traversal during tool agent execution yielding internal report leaks.',
      findings: ['Insecure Direct Object Reference (IDOR)']
    },
    webapp: {
      title: 'Web App Client',
      type: 'Ingress Interface (REST/WebSocket)',
      risk: 'HIGH',
      connectedComponents: 1,
      attackPaths: 3,
      lastTested: '1 min ago',
      impact: 'Untrusted user input boundary without client-side input sanitization.',
      findings: ['Cross-Site Scripting (Reflected via LLM)']
    },
    documents: {
      title: 'Corporate PDF Repository',
      type: 'Static Data Source',
      risk: 'LOW',
      connectedComponents: 1,
      attackPaths: 1,
      lastTested: '25 mins ago',
      impact: 'Host for benign documentation and user-uploaded verification samples.',
      findings: ['No active vulnerabilities found']
    },
    externaltools: {
      title: 'External Tools & Webhook Agent',
      type: 'Dynamic Plugin Interface',
      risk: 'HIGH',
      connectedComponents: 2,
      attackPaths: 2,
      lastTested: '4 mins ago',
      impact: 'Arbitrary code execution or SSRF via external tool integration parameters.',
      findings: ['OWASP LLM08: Excessive Agency', 'CWE-918: SSRF']
    },
    user: {
      title: 'External User Persona',
      type: 'Adversary & Client Origin',
      risk: 'NEUTRAL',
      connectedComponents: 1,
      attackPaths: 4,
      lastTested: 'Active',
      impact: 'Adversarial interaction source attempting jailbreak prompts.',
      findings: ['Origin of 5 blackbox red-team payloads']
    }
  };

  const activeDetail = selectedNode ? nodeDetails[selectedNode] : null;

  return (
    <div className="argus-card col-span-7" style={{ height: '390px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* ── CARD HEADER ── */}
      <div className="argus-card-header" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--text-bright)', fontWeight: 700, fontSize: '0.9rem' }}>
            Attack Surface (Digital Twin)
          </span>
          <span style={{ 
            fontSize: '0.68rem', 
            color: 'var(--accent-red-glow)', 
            fontFamily: 'var(--font-mono)', 
            backgroundColor: 'var(--accent-red-bg)', 
            padding: '2px 8px', 
            borderRadius: '4px',
            border: '1px solid rgba(239, 68, 68, 0.25)'
          }}>
            Click any node to inspect
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Graph View / List View Toggle Switch */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
            fontSize: '0.74rem'
          }}>
            <button
              onClick={() => setViewMode('graph')}
              style={{
                padding: '3px 12px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: viewMode === 'graph' ? 'var(--accent-red)' : 'transparent',
                color: viewMode === 'graph' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: viewMode === 'graph' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Graph View
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '3px 12px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'var(--accent-red)' : 'transparent',
                color: viewMode === 'list' ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: viewMode === 'list' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              List View
            </button>
          </div>

          {/* Expand to full page link */}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('digital-twin')}
              title="Open Full Digital Twin Knowledge Graph"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <Maximize2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── VIEWPORT CONTENT: CONDITIONAL GRAPH OR LIST ── */}
      {viewMode === 'graph' ? (
        <div style={{
          flex: 1,
          position: 'relative',
          backgroundColor: 'rgba(7, 9, 12, 0.4)',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Integrated Unified SVG Graph Canvas */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 700 280" 
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <radialGradient id="llm-center-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </radialGradient>
            </defs>

            {/* Central Radial Glow on LLM */}
            <circle cx="350" cy="140" r="72" fill="url(#llm-center-glow)" />

            {/* Connection Edges & Packets */}
            {links.map((link, idx) => {
              const p1 = getNode(link.source);
              const p2 = getNode(link.target);
              const isSelectedRel = selectedNode ? (link.source === selectedNode || link.target === selectedNode) : true;
              const pathD = `M ${p1.cx} ${p1.cy} L ${p2.cx} ${p2.cy}`;
              
              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={p1.cx}
                    y1={p1.cy}
                    x2={p2.cx}
                    y2={p2.cy}
                    stroke={link.isRisk ? '#EF4444' : '#64748B'}
                    strokeWidth={link.isRisk ? 1.8 : 1.2}
                    strokeDasharray={link.isRisk ? '5,5' : 'none'}
                    opacity={isSelectedRel ? 0.9 : 0.25}
                  />
                  {link.isRisk && isSelectedRel && (
                    <circle r="3" fill="#FF2E2E">
                      <animateMotion
                        path={pathD}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Interactive SVG Nodes */}
            {nodes.map((node) => {
              const isCenter = node.id === 'llm';
              const isSelected = selectedNode === node.id;
              const isCritical = node.status === 'critical';
              const isRisk = node.status === 'risk';

              const strokeColor = isCenter 
                ? '#EF4444' 
                : isSelected 
                ? '#38BDF8' 
                : isCritical 
                ? '#EF4444' 
                : isRisk 
                ? '#F59E0B' 
                : '#64748B';

              const iconColor = isSelected 
                ? '#38BDF8' 
                : isCritical 
                ? '#EF4444' 
                : isRisk 
                ? '#F59E0B' 
                : '#94A3B8';

              const NodeIcon = node.icon;

              return (
                <g 
                  key={node.id}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selection highlight ring */}
                  {isSelected && (
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isCenter ? 36 : 28} 
                      fill="none" 
                      stroke="#38BDF8" 
                      strokeWidth="2" 
                      strokeDasharray="4,4" 
                      opacity="0.8" 
                    />
                  )}

                  {/* Node Background Shape */}
                  {isCenter ? (
                    <rect 
                      x={node.cx - 28} 
                      y={node.cy - 28} 
                      width="56" 
                      height="56" 
                      rx="14" 
                      fill="#161B26" 
                      stroke={strokeColor} 
                      strokeWidth="2.2" 
                    />
                  ) : (
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r="22" 
                      fill="#11151F" 
                      stroke={strokeColor} 
                      strokeWidth="1.8" 
                    />
                  )}

                  {/* Node Icon */}
                  <foreignObject 
                    x={node.cx - (isCenter ? 14 : 11)} 
                    y={node.cy - (isCenter ? 14 : 11)} 
                    width={isCenter ? 28 : 22} 
                    height={isCenter ? 28 : 22} 
                    style={{ pointerEvents: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      {isCenter ? (
                        <ShieldAlert size={26} color="#FF2E2E" />
                      ) : (
                        <NodeIcon size={18} color={iconColor} />
                      )}
                    </div>
                  </foreignObject>

                  {/* Label Pill Box */}
                  <foreignObject
                    x={node.cx - 65}
                    y={node.cy + (isCenter ? 32 : 26)}
                    width="130"
                    height="24"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <span style={{
                        fontSize: isCenter ? '0.76rem' : '0.68rem',
                        fontWeight: isCenter ? 800 : 600,
                        color: isSelected ? '#38BDF8' : isCenter ? '#FFFFFF' : 'var(--text-bright)',
                        backgroundColor: 'rgba(11, 14, 20, 0.92)',
                        padding: '1px 8px',
                        borderRadius: '4px',
                        border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                      }}>
                        {node.label}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* Node Investigation Popover Panel */}
          {activeDetail && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '12px',
              width: '260px',
              backgroundColor: 'rgba(11, 14, 23, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
              zIndex: 30,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: activeDetail.risk === 'CRITICAL' ? 'var(--accent-red-bg)' : 'var(--accent-amber-bg)',
                  color: activeDetail.risk === 'CRITICAL' ? 'var(--accent-red-glow)' : 'var(--accent-amber)',
                  border: '1px solid var(--border-glass)'
                }}>
                  RISK: {activeDetail.risk}
                </span>
                <button 
                  onClick={() => setSelectedNode(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  ✕
                </button>
              </div>

              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                  {activeDetail.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {activeDetail.type}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.68rem', backgroundColor: 'var(--bg-card-header)', padding: '5px 8px', borderRadius: '4px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Connected:</span>
                  <strong style={{ color: 'var(--text-bright)' }}>{activeDetail.connectedComponents} Nodes</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Attack Paths:</span>
                  <strong style={{ color: 'var(--accent-red-glow)' }}>{activeDetail.attackPaths} Active</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Potential Impact:</span>
                {activeDetail.impact}
              </div>

              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px' }}>
                Last Verified: {activeDetail.lastTested}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── LIST VIEW MODE (Structured Asset Inventory) ── */
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          minHeight: 0
        }}>
          {nodes.map((node) => {
            const Icon = node.icon;
            const detail = nodeDetails[node.id];
            const isCritical = node.status === 'critical';
            const isRisk = node.status === 'risk';

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedNode === node.id ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                  border: selectedNode === node.id ? '1px solid var(--accent-blue-glow)' : '1px solid var(--border-subtle)',
                  borderLeft: isCritical ? '3px solid #EF4444' : isRisk ? '3px solid #F59E0B' : '3px solid #10B981',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '5px',
                    backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.15)' : isRisk ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCritical ? '#EF4444' : isRisk ? '#F59E0B' : '#10B981',
                    flexShrink: 0
                  }}>
                    <Icon size={13} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                        {node.label}
                      </span>
                      <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                        • {node.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {detail?.impact || 'Asset mapped in digital twin knowledge graph'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: isCritical ? 'var(--accent-red-bg)' : isRisk ? 'var(--accent-amber-bg)' : 'var(--accent-green-bg)',
                    color: isCritical ? 'var(--accent-red)' : isRisk ? 'var(--accent-amber)' : 'var(--accent-green)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {detail?.risk || 'NORMAL'}
                  </span>
                  <ChevronRight size={12} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── GRAPH / LIST FOOTER ── */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}>
        {viewMode === 'graph' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '16px', height: '2px', backgroundColor: '#6B7280' }} />
              Normal Connection
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '16px', height: '2px', borderTop: '2px dashed #EF4444' }} />
              High Risk Path
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF2E2E' }} />
              Data Flow
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>8 Components Mapped</span>
            <span>•</span>
            <span>7 Active Relations</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-red)' }}>4 Exploitable Attack Paths</span>
          </div>
        )}

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('digital-twin')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              color: 'var(--accent-blue-glow)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <span>Full 3D Topology</span>
            <ExternalLink size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
