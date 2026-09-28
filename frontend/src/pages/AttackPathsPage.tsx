import React, { useState } from 'react';
import { 
  GitPullRequest, 
  ShieldAlert, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Terminal,
  Play,
  Zap,
  Check,
  ExternalLink,
  Lock,
  Radio,
  FileText,
  Database,
  Mail,
  Cpu,
  CornerDownRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AttackPathsPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const AttackPathsPage: React.FC<AttackPathsPageProps> = ({ onNavigateTab }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [expandedPathId, setExpandedPathId] = useState<string | null>('path-1');
  const [severedPaths, setSeveredPaths] = useState<Record<string, boolean>>({});

  const toggleSever = (pathId: string) => {
    setSeveredPaths(prev => ({ ...prev, [pathId]: !prev[pathId] }));
  };

  const attackPaths = [
    {
      id: 'path-1',
      title: 'Path #1: Indirect Prompt Injection ➔ RAG Poisoning ➔ Unauthorized Email Exfiltration',
      reachability: 'CRITICAL',
      hops: 6,
      entryPoint: 'Attacker PDF Ingestion',
      criticalSink: 'send_email() SMTP Relay',
      riskScore: 98,
      cypherQuery: 'MATCH (d:Doc {status: "poisoned"})-[:INDEXED_IN]->(v:VectorDB)-[:RETRIEVED]->(m:LLM)-[:INVOKES]->(t:EmailAPI) RETURN d, v, m, t',
      remediationSummary: 'Require human authorization before the send_email tool is allowed to execute, or validate PDF uploads against an LLM-Guard classifier before vectorizing.',
      steps: [
        { title: '1. Attacker PDF Upload', desc: 'Hidden instructions injected into executive memo', icon: FileText, isSink: false },
        { title: '2. FAISS Vector Store', desc: 'Poisoned vector chunk embedded in index', icon: Database, isSink: false },
        { title: '3. RAG Retrieval', desc: 'Assistant semantic query matches poisoned chunk', icon: Layers, isSink: false },
        { title: '4. Gemini Assistant', desc: 'Context hijack suppresses refusal constraints', icon: Cpu, isSink: false },
        { title: '5. Email Tool Sink', desc: 'send_email() invoked with admin logs payload', icon: Mail, isSink: true },
        { title: '6. Attacker Inbox', desc: 'Confidential employee records exfiltrated', icon: Terminal, isSink: true }
      ]
    },
    {
      id: 'path-2',
      title: 'Path #2: Direct Chat Injection ➔ SQL Database Search ➔ Credential Leakage',
      reachability: 'HIGH',
      hops: 4,
      entryPoint: 'Adversarial Web Chat Query',
      criticalSink: 'search_database() Parameter Sink',
      riskScore: 88,
      cypherQuery: 'MATCH (u:User)-[r:PROMPT_INJECT]->(m:LLM)-[:EXECUTES_SQL]->(db:SQLDatabase) RETURN u, m, db',
      remediationSummary: 'Enforce Role-Based Access Control (RBAC) on the search_database tool and sanitize queries using parameterized templates.',
      steps: [
        { title: '1. External Chat Prompt', desc: 'Adversarial jailbreak query submitted', icon: Terminal, isSink: false },
        { title: '2. Gemini Assistant', desc: 'Unfiltered system prompt passes prompt', icon: Cpu, isSink: false },
        { title: '3. search_database()', desc: 'Executed without auth checks or parameter limits', icon: Database, isSink: true },
        { title: '4. Passwords Returned', desc: 'admin_root credentials leaked in response stream', icon: ShieldAlert, isSink: true }
      ]
    },
    {
      id: 'path-3',
      title: 'Path #3: Roleplay Persona Bypass ➔ Local File System Traversal ➔ Audit Log Extraction',
      reachability: 'HIGH',
      hops: 4,
      entryPoint: 'DAN Persona Override',
      criticalSink: 'file_system() Read Volume',
      riskScore: 84,
      cypherQuery: 'MATCH (u:User)-[:PERSONA_OVERRIDE]->(m:LLM)-[:PATH_TRAVERSAL]->(f:FileSystem) RETURN u, m, f',
      remediationSummary: 'Jail all file system operations inside an isolated chroot sandbox and strip relative directory tokens (../../) from tool arguments.',
      steps: [
        { title: '1. DAN Mode Payload', desc: 'Persona override commands model compliance', icon: Terminal, isSink: false },
        { title: '2. Guardrail Evasion', desc: 'Model assumes unrestricted roleplay mode', icon: Cpu, isSink: false },
        { title: '3. file_system() Read', desc: 'Path traversal query for /data/reports/audit.log', icon: Layers, isSink: true },
        { title: '4. File Stream Leaked', desc: 'Proprietary financial audits displayed in cleartext', icon: ShieldAlert, isSink: true }
      ]
    }
  ];

  const filteredPaths = attackPaths.filter(p => {
    if (activeFilter === 'CRITICAL') return p.reachability === 'CRITICAL';
    if (activeFilter === 'HIGH') return p.reachability === 'HIGH';
    return true;
  });

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              GRAPH REACHABILITY ENGINE
            </span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              padding: '2px 8px', 
              borderRadius: '4px', 
              backgroundColor: 'var(--accent-red-bg)', 
              color: 'var(--accent-red)' 
            }}>
              3 EXPLOITABLE PATHWAYS
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginTop: '2px' }}>
            Exploit Attack Path Analysis (Digital Twin Traversal)
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Calculated graph trajectories mapping how external adversaries can step-by-step traverse from untrusted inputs to confidential data sinks.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
            fontSize: '0.74rem'
          }}>
            {(['ALL', 'CRITICAL', 'HIGH'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeFilter === f ? 'var(--accent-red-bg)' : 'transparent',
                  color: activeFilter === f ? 'var(--accent-red)' : 'var(--text-muted)',
                  fontWeight: activeFilter === f ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('digital-twin')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.76rem' }}
          >
            <Layers size={13} color="var(--accent-blue-glow)" /> View in 3D Graph
          </button>
        </div>
      </div>

      {/* ── EXPLANATORY BANNER ── */}
      <div className="argus-card" style={{ padding: '14px 18px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <HelpCircle size={18} color="var(--accent-blue-glow)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--accent-blue-glow)', fontWeight: 700, fontSize: '0.84rem' }}>
            What is an AI Attack Path?
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
            Just like Google Maps calculates routes between cities, Argus AI traverses your Digital Twin Neo4j knowledge graph to find every sequence of hops an adversary could chain to bypass guardrails and compromise high-privilege execution sinks (e.g., databases, mail relays, file systems).
          </p>
        </div>
      </div>

      {/* ── ATTACK PATH CARDS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPaths.map((path) => {
          const isCritical = path.reachability === 'CRITICAL';
          const isSevered = severedPaths[path.id];
          const isExpanded = expandedPathId === path.id;

          return (
            <div 
              key={path.id} 
              className="argus-card" 
              style={{ 
                padding: '20px', 
                borderLeft: isSevered ? '4px solid var(--accent-green)' : isCritical ? '4px solid var(--accent-red)' : '4px solid var(--accent-amber)',
                transition: 'all 0.2s ease',
                opacity: isSevered ? 0.85 : 1
              }}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert size={20} color={isSevered ? 'var(--accent-green)' : isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'} />
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                      {path.title}
                    </h3>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span><strong>Hops:</strong> {path.hops}</span>
                      <span>•</span>
                      <span><strong>Entry:</strong> {path.entryPoint}</span>
                      <span>•</span>
                      <span><strong>Target Sink:</strong> <span style={{ color: 'var(--accent-red-glow)', fontFamily: 'var(--font-mono)' }}>{path.criticalSink}</span></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    padding: '3px 10px', 
                    background: isSevered ? 'var(--accent-green-bg)' : isCritical ? 'var(--accent-red-bg)' : 'var(--accent-amber-bg)', 
                    border: `1px solid ${isSevered ? 'var(--accent-green)' : isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'}`, 
                    borderRadius: '20px', 
                    color: isSevered ? 'var(--accent-green)' : isCritical ? 'var(--accent-red)' : 'var(--accent-amber)', 
                    fontWeight: 800 
                  }}>
                    {isSevered ? '✓ PATH SEVERED (SECURED)' : `${path.reachability} REACHABILITY`}
                  </span>

                  <button
                    onClick={() => setExpandedPathId(isExpanded ? null : path.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isExpanded ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-bright)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isExpanded ? <><ChevronUp size={13} /> Collapse</> : <><ChevronDown size={13} /> Expand Path</>}
                  </button>

                  <button
                    onClick={() => toggleSever(path.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSevered ? 'var(--accent-green-bg)' : 'var(--bg-input)',
                      border: `1px solid ${isSevered ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                      color: isSevered ? 'var(--accent-green)' : 'var(--text-bright)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isSevered ? <><Check size={12} /> Severed</> : <><Lock size={12} /> Simulate Severing</>}
                  </button>
                </div>
              </div>

              {/* Collapsible Stepper & Cypher via Progressive Disclosure */}
              {isExpanded && (
                <div>

              {/* Visual Stepper / Hop Chain */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                overflowX: 'auto',
                marginBottom: '14px'
              }}>
                {path.steps.map((step, idx, arr) => {
                  const StepIcon = step.icon;
                  const isEnd = idx === arr.length - 1;
                  const isStart = idx === 0;

                  return (
                    <React.Fragment key={idx}>
                      <div style={{
                        padding: '10px 14px',
                        backgroundColor: isEnd ? 'rgba(239, 68, 68, 0.15)' : isStart ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card)',
                        border: isEnd ? '1.5px solid var(--accent-red)' : isStart ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-bright)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        minWidth: '150px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <StepIcon size={14} color={isEnd ? 'var(--accent-red)' : isStart ? 'var(--accent-blue-glow)' : 'var(--text-muted)'} />
                          <span>{step.title}</span>
                        </div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'normal', lineHeight: 1.3 }}>
                          {step.desc}
                        </div>
                      </div>
                      {idx < arr.length - 1 && (
                        <ArrowRight size={16} color={isCritical ? 'var(--accent-red)' : 'var(--accent-amber)'} style={{ flexShrink: 0 }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Actionable Severing Solution & Cypher Query */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--accent-green)', display: 'block', marginBottom: '4px' }}>🛡️ How to Sever This Path:</strong>
                  {path.remediationSummary}
                </div>

                <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.70rem', color: 'var(--accent-blue-glow)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '2px' }}>NEO4J CYPHER TRAVERSAL:</span>
                  {path.cypherQuery}
                </div>
              </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
