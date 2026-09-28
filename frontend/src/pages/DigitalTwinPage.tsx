import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Database, 
  Cpu, 
  FileText, 
  Mail, 
  User, 
  Globe, 
  Terminal,
  AlertTriangle,
  FolderGit2,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Filter,
  Copy,
  Check,
  Radio,
  ExternalLink,
  Code
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  name: string;
  category: string;
  risk: 'CRITICAL' | 'HIGH' | 'LOW' | 'NEUTRAL';
  score: string;
  icon: any;
  x: number;
  y: number;
  status: 'critical' | 'risk' | 'normal';
  cypher: string;
  description: string;
  connectedNodes: string[];
  attackPaths: number;
  lastTested: string;
  findings: string[];
}

export const DigitalTwinPage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('llm');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'TOOLS'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copiedCypher, setCopiedCypher] = useState(false);
  const [highlightAttackPath, setHighlightAttackPath] = useState(true);

  // Full enterprise asset nodes in 800x520 coordinate space
  const nodes: GraphNode[] = [
    {
      id: 'llm',
      label: 'Target LLM Core',
      name: 'GPT-4o / Gemini 1.5 Flash',
      category: 'Inference Engine / Orchestrator',
      risk: 'CRITICAL',
      score: '9.8/10',
      icon: Cpu,
      x: 400,
      y: 260,
      status: 'critical',
      cypher: 'MATCH (u:User)-[r:PROMPT_INJECTION]->(m:LLM)-[:ACCESS]->(t:Tool) RETURN u, m, t',
      description: 'Central agent reasoning runtime with zero input sanitization. Exposed to direct prompt override, context manipulation, and tool privilege escalation.',
      connectedNodes: ['user', 'webapp', 'vectordb', 'documents', 'filesystem', 'externaltools', 'email'],
      attackPaths: 4,
      lastTested: 'Continuous (Active)',
      findings: ['OWASP LLM01: Direct & Indirect Prompt Injection', 'OWASP LLM04: Model Denial of Service']
    },
    {
      id: 'user',
      label: 'External User',
      name: 'Adversary & Client Origin',
      category: 'Untrusted Ingress Boundary',
      risk: 'NEUTRAL',
      score: '4.2/10',
      icon: User,
      x: 120,
      y: 130,
      status: 'normal',
      cypher: 'MATCH (u:User {role: "anonymous"})-[:SUBMITS_PAYLOAD]->(w:WebApp) RETURN u, w',
      description: 'External client interaction origin. Red-team test suites execute blackbox payloads (DAN, roleplay personas, token floods) through this boundary.',
      connectedNodes: ['llm', 'webapp'],
      attackPaths: 4,
      lastTested: 'Just now',
      findings: ['5 Red-Team Adversarial Payloads Injected']
    },
    {
      id: 'webapp',
      label: 'Web App Client',
      name: 'REST / WebSocket API Gateway',
      category: 'Ingress Interface',
      risk: 'HIGH',
      score: '8.4/10',
      icon: Globe,
      x: 400,
      y: 90,
      status: 'risk',
      cypher: 'MATCH (w:WebApp)-[r:ROUTES_INPUT {sanitized: false}]->(m:LLM) RETURN w, r, m',
      description: 'Public-facing reverse proxy and conversational chat interface without client-side payload sanitization or rate-limiting.',
      connectedNodes: ['user', 'llm'],
      attackPaths: 3,
      lastTested: '2 mins ago',
      findings: ['Cross-Site Scripting (Reflected via LLM output)', 'Missing Ingress Guardrail Filter']
    },
    {
      id: 'vectordb',
      label: 'FAISS Vector DB',
      name: 'Vector Store (Embeddings Index)',
      category: 'RAG Knowledge Store',
      risk: 'CRITICAL',
      score: '9.2/10',
      icon: Database,
      x: 680,
      y: 140,
      status: 'critical',
      cypher: 'MATCH (d:Doc)-[:EMBEDDED_IN]->(v:VectorDB)-[:INJECTS_CHUNK]->(m:LLM) RETURN d, v, m',
      description: 'High-dimensional similarity search index hosting 34 company document chunks. Contains poisoned executive summary embedding with credential override tokens.',
      connectedNodes: ['documents', 'llm'],
      attackPaths: 2,
      lastTested: '14 mins ago',
      findings: ['OWASP LLM03: Poisoned Semantic Chunk Retrieval', 'Sensitive Corporate Policy Exposure']
    },
    {
      id: 'documents',
      label: 'Doc Repository',
      name: 'Internal PDF / Text Store',
      category: 'Static Knowledge Data',
      risk: 'LOW',
      score: '3.1/10',
      icon: FileText,
      x: 700,
      y: 370,
      status: 'normal',
      cypher: 'MATCH (d:Document {type: "pdf"})-[:INDEXED_BY]->(v:VectorDB) RETURN d, v',
      description: 'Storage backend for ingested executive memos and employee manuals. Ingestion pipeline lacks cryptographic signature or origin validation.',
      connectedNodes: ['vectordb', 'llm'],
      attackPaths: 1,
      lastTested: '25 mins ago',
      findings: ['No file-integrity monitoring on upload endpoint']
    },
    {
      id: 'filesystem',
      label: 'File System',
      name: 'Confidential Volume (/data/reports)',
      category: 'Local Storage Host',
      risk: 'HIGH',
      score: '8.1/10',
      icon: FolderGit2,
      x: 560,
      y: 440,
      status: 'risk',
      cypher: 'MATCH (m:LLM)-[r:INVOKES_TOOL]->(f:FileSystem {root: "/data"}) RETURN m, f',
      description: 'File system tool sink callable by model. Susceptible to path traversal (../../) to exfiltrate private financial reports and audit logs.',
      connectedNodes: ['llm'],
      attackPaths: 1,
      lastTested: '18 mins ago',
      findings: ['Insecure Direct Object Reference (IDOR)', 'CWE-22: Path Traversal']
    },
    {
      id: 'externaltools',
      label: 'External Tools',
      name: 'Dynamic Plugin & Webhook Sink',
      category: 'Tool Execution Interface',
      risk: 'HIGH',
      score: '8.6/10',
      icon: Wrench,
      x: 240,
      y: 440,
      status: 'risk',
      cypher: 'MATCH (m:LLM)-[r:TOOL_CALL]->(t:Plugin {sandbox: false}) RETURN m, t',
      description: 'Runtime environment executing model-requested external tool invocations. Absence of sandboxing enables Server-Side Request Forgery (SSRF).',
      connectedNodes: ['llm'],
      attackPaths: 2,
      lastTested: '4 mins ago',
      findings: ['OWASP LLM08: Excessive Agency', 'CWE-918: Server-Side Request Forgery']
    },
    {
      id: 'email',
      label: 'Email API Tool',
      name: 'SMTP Relay (send_email)',
      category: 'Side-Effect Communication Sink',
      risk: 'CRITICAL',
      score: '9.6/10',
      icon: Mail,
      x: 120,
      y: 350,
      status: 'critical',
      cypher: 'MATCH (m:LLM)-[r:CALLS {to: "external"}]->(e:EmailAPI) RETURN m, e',
      description: 'Automated email dispatch tool. Model can invoke this tool with arbitrary recipient parameters without human confirmation, allowing instant corporate data exfiltration.',
      connectedNodes: ['llm'],
      attackPaths: 2,
      lastTested: '3 mins ago',
      findings: ['OWASP LLM08: Unbounded Side-Effect Dispatch', 'OWASP LLM07: System Exfiltration Sink']
    }
  ];

  // Edges definition
  const edges = [
    { source: 'user', target: 'llm', label: 'PROMPT_INJECT', isAttack: true, type: 'dashed' },
    { source: 'user', target: 'webapp', label: 'HTTP_REQUEST', isAttack: false, type: 'solid' },
    { source: 'webapp', target: 'llm', label: 'UNSANITIZED_STREAM', isAttack: true, type: 'dashed' },
    { source: 'vectordb', target: 'llm', label: 'POISONED_CONTEXT', isAttack: true, type: 'dashed' },
    { source: 'documents', target: 'vectordb', label: 'INDEXED_INTO', isAttack: false, type: 'solid' },
    { source: 'documents', target: 'llm', label: 'METADATA_READ', isAttack: false, type: 'solid' },
    { source: 'llm', target: 'filesystem', label: 'TOOL_READ', isAttack: true, type: 'dashed' },
    { source: 'llm', target: 'externaltools', label: 'TOOL_INVOKE', isAttack: true, type: 'dashed' },
    { source: 'llm', target: 'email', label: 'EXFIL_DISPATCH', isAttack: true, type: 'dashed' },
  ];

  const getNodePos = (id: string) => nodes.find(n => n.id === id) || { x: 0, y: 0 };
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Filtering
  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          n.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          n.category.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'CRITICAL') return n.risk === 'CRITICAL';
    if (activeFilter === 'HIGH') return n.risk === 'HIGH';
    if (activeFilter === 'TOOLS') return n.category.includes('Tool') || n.category.includes('Store');
    return true;
  });

  const handleCopyCypher = () => {
    navigator.clipboard.writeText(selectedNode.cypher);
    setCopiedCypher(true);
    setTimeout(() => setCopiedCypher(false), 2000);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 84px)' }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              KNOWLEDGE GRAPH RUNTIME
            </span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '5px', 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              padding: '2px 8px', 
              borderRadius: '4px', 
              backgroundColor: 'rgba(56, 189, 248, 0.15)', 
              color: 'var(--accent-blue-glow)',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <Radio size={10} className="animate-pulse" /> LIVE NEO4J TOPOLOGY
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginTop: '2px' }}>
            Digital Twin & Asset Topology
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time graph model mapping AI models, vector stores, RAG document corpora, and high-privilege execution sinks.
          </p>
        </div>

        {/* Top Controls & Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Quick Filter Pills */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
            fontSize: '0.74rem'
          }}>
            {(['ALL', 'CRITICAL', 'HIGH', 'TOOLS'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '4px 10px',
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

          {/* Search Node */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '5px 12px',
            width: '200px'
          }}>
            <Search size={13} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-bright)',
                fontSize: '0.76rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* Toggle Attack Path Overlay */}
          <button
            onClick={() => setHighlightAttackPath(!highlightAttackPath)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: highlightAttackPath ? 'var(--accent-red-bg)' : 'var(--bg-card)',
              color: highlightAttackPath ? 'var(--accent-red)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={13} /> {highlightAttackPath ? 'Paths Highlighted' : 'Normal Graph'}
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: GRAPH CANVAS + ASSET INSPECTOR ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', minHeight: 0 }}>
        
        {/* Graph Canvas Container */}
        <div className="argus-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          
          {/* Canvas Sub-header */}
          <div className="argus-card-header" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={16} color="var(--accent-red)" />
              <span style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '0.86rem' }}>
                Neo4j Topology Visualizer
              </span>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                ({nodes.length} Components • {edges.length} Active Relations)
              </span>
            </div>

            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.70rem', fontWeight: 600 }}
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
            </div>
          </div>

          {/* Graph Interactive Viewport */}
          <div style={{
            flex: 1,
            position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, var(--bg-card) 0%, var(--bg-app) 100%)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Cyber Topology Matrix Dotted Grid */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.35,
                backgroundImage: `radial-gradient(var(--border-glass) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
                pointerEvents: 'none'
              }} 
            />

            {/* Scalable SVG Network Viewport */}
            <div style={{
              width: '100%',
              height: '100%',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 800 520" 
                preserveAspectRatio="xMidYMid meet"
                style={{ position: 'absolute', inset: 0 }}
              >
                <defs>
                  <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.3" />
                    <stop offset="60%" stopColor="var(--accent-red)" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Central LLM Aura & Range Ring */}
                <circle cx="400" cy="260" r="130" fill="none" stroke="var(--accent-red)" strokeWidth="1" strokeDasharray="3,6" opacity="0.35" />
                <circle cx="400" cy="260" r="90" fill="url(#center-glow)" />

                {/* Connection Edges */}
                {edges.map((edge, idx) => {
                  const p1 = getNodePos(edge.source);
                  const p2 = getNodePos(edge.target);
                  const isHighlighted = highlightAttackPath && edge.isAttack;
                  const isConnectedToSelected = selectedNodeId ? (edge.source === selectedNodeId || edge.target === selectedNodeId) : true;
                  const edgeOpacity = isConnectedToSelected 
                    ? (isHighlighted ? 0.95 : 0.75) 
                    : 0.18;

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={isHighlighted ? 'var(--accent-red)' : isConnectedToSelected ? 'var(--accent-blue-glow)' : 'var(--text-muted)'}
                        strokeWidth={isConnectedToSelected ? (isHighlighted ? '2.5' : '1.8') : '1'}
                        strokeDasharray={edge.type === 'dashed' ? '5,5' : 'none'}
                        opacity={edgeOpacity}
                      />

                      {/* Animated Attack Packets */}
                      {isHighlighted && isConnectedToSelected && (
                        <circle r="3.5" fill="var(--accent-red)">
                          <animateMotion
                            path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                            dur={`${2.8 + (idx % 3) * 0.4}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Edge Label */}
                      <text
                        x={(p1.x + p2.x) / 2}
                        y={(p1.y + p2.y) / 2 - 6}
                        fill={isHighlighted ? 'var(--accent-red-glow)' : isConnectedToSelected ? 'var(--accent-blue-glow)' : 'var(--text-muted)'}
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fontWeight="700"
                        textAnchor="middle"
                        opacity={isConnectedToSelected ? (isHighlighted ? 0.95 : 0.8) : 0.2}
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Interactive SVG ForeignObject Nodes */}
                {nodes.map((node) => {
                  const Icon = node.icon;
                  const isCenter = node.id === 'llm';
                  const isSelected = selectedNodeId === node.id;
                  const isVisible = filteredNodes.some(fn => fn.id === node.id);
                  const isConnected = selectedNodeId 
                    ? (selectedNodeId === node.id || selectedNode.connectedNodes.includes(node.id) || node.connectedNodes.includes(selectedNodeId))
                    : true;

                  const width = isCenter ? 150 : 130;
                  const height = isCenter ? 85 : 75;
                  const circleSize = isCenter ? 54 : 42;
                  const nodeOpacity = !isVisible ? 0.2 : isSelected ? 1 : isConnected ? 0.95 : 0.28;

                  return (
                    <foreignObject
                      key={node.id}
                      x={node.x - width / 2}
                      y={node.y - circleSize / 2}
                      width={width}
                      height={height}
                      style={{ 
                        overflow: 'visible',
                        opacity: nodeOpacity,
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      <div
                        onClick={() => setSelectedNodeId(node.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        {/* Circle / Icon Container */}
                        <div
                          style={{
                            width: `${circleSize}px`,
                            height: `${circleSize}px`,
                            borderRadius: isCenter ? '16px' : '50%',
                            backgroundColor: isCenter ? 'var(--bg-input)' : 'var(--bg-card)',
                            border: isCenter 
                              ? '2.5px solid var(--accent-red)' 
                              : isSelected 
                              ? '2.5px solid var(--accent-blue)' 
                              : node.status === 'critical'
                              ? '1.5px solid var(--accent-red)'
                              : node.status === 'risk'
                              ? '1.5px solid var(--accent-amber)'
                              : '1.5px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isSelected 
                              ? 'var(--shadow-glow-blue)' 
                              : isCenter 
                              ? 'var(--shadow-glow-red)' 
                              : 'var(--shadow-card)',
                            transform: isSelected ? 'scale(1.14)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            zIndex: isCenter ? 10 : 5
                          }}
                        >
                          {isCenter ? (
                            <ShieldAlert size={28} color="var(--accent-red)" className="animate-glow" />
                          ) : (
                            <Icon 
                              size={20} 
                              color={isSelected ? 'var(--accent-blue)' : node.status === 'critical' ? 'var(--accent-red)' : node.status === 'risk' ? 'var(--accent-amber)' : 'var(--text-secondary)'} 
                            />
                          )}
                        </div>

                        {/* Node Label Badge */}
                        <div
                          style={{
                            marginTop: '6px',
                            fontSize: isCenter ? '0.78rem' : '0.72rem',
                            fontWeight: isCenter ? 800 : 600,
                            color: isSelected ? 'var(--accent-blue)' : isCenter ? 'var(--text-bright)' : 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-card)',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            border: isSelected 
                              ? '1px solid var(--accent-blue)' 
                              : isCenter
                              ? '1px solid var(--accent-red)'
                              : '1px solid var(--border-subtle)',
                            whiteSpace: 'nowrap',
                            boxShadow: 'var(--shadow-card)'
                          }}
                        >
                          {node.label}
                        </div>
                      </div>
                    </foreignObject>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Floating Legend */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '2px', backgroundColor: 'var(--text-muted)' }} />
                Standard Link
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '2px', borderTop: '2px dashed var(--accent-red)' }} />
                Exploitable Vector
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }} />
                Active Packet Flow
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT PANEL: ADVANCED ASSET / NODE INSPECTOR ── */}
        <div className="argus-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--accent-red)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                Node Inspector
              </h3>
            </div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: selectedNode.risk === 'CRITICAL' ? 'var(--accent-red-bg)' : selectedNode.risk === 'HIGH' ? 'var(--accent-amber-bg)' : 'var(--accent-green-bg)',
              color: selectedNode.risk === 'CRITICAL' ? 'var(--accent-red)' : selectedNode.risk === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-green)',
              border: '1px solid var(--border-glass)'
            }}>
              RISK: {selectedNode.risk} ({selectedNode.score})
            </span>
          </div>

          {/* Asset Identity Card */}
          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ASSET IDENTITY
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-bright)' }}>
              {selectedNode.name}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-blue-glow)', fontWeight: 600 }}>
              {selectedNode.category}
            </div>
          </div>

          {/* Topology Reachability Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem' }}>
            <div style={{ backgroundColor: 'var(--bg-input)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Connected Nodes:</span>
              <strong style={{ color: 'var(--text-bright)', fontSize: '0.88rem' }}>{selectedNode.connectedNodes.length} Links</strong>
            </div>
            <div style={{ backgroundColor: 'var(--bg-input)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Attack Reachability:</span>
              <strong style={{ color: 'var(--accent-red)', fontSize: '0.88rem' }}>{selectedNode.attackPaths} Vectors</strong>
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              ARCHITECTURE & ATTACK SURFACE
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {selectedNode.description}
            </p>
          </div>

          {/* Active Findings on this Asset */}
          <div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              ASSOCIATED VULNERABILITIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedNode.findings.map((f, i) => (
                <div key={i} style={{
                  fontSize: '0.72rem',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertTriangle size={12} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cypher Graph Query Box */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Terminal size={12} /> Cypher Graph Query
              </span>
              <button
                onClick={handleCopyCypher}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedCypher ? 'var(--accent-green)' : 'var(--accent-blue-glow)',
                  cursor: 'pointer',
                  fontSize: '0.68rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                {copiedCypher ? <Check size={11} /> : <Copy size={11} />}
                {copiedCypher ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              fontSize: '0.70rem',
              color: 'var(--accent-blue-glow)',
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-all',
              lineHeight: 1.4
            }}>
              {selectedNode.cypher}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
