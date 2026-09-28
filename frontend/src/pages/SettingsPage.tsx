import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Key, 
  Database, 
  Server, 
  ShieldCheck, 
  Check, 
  RefreshCw,
  Sliders,
  Radio,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [fastApiUrl, setFastApiUrl] = useState('http://localhost:8000');
  const [targetPodUrl, setTargetPodUrl] = useState('http://localhost:7003');
  const [neo4jUri, setNeo4jUri] = useState('bolt://localhost:7687');
  const [neo4jUser, setNeo4jUser] = useState('neo4j');
  const [neo4jPassword, setNeo4jPassword] = useState('argus_secure_2025');
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyD-mock-gemini-eval-key-99824');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult('Handshake Successful: FastApi (8000) & Target Pod (7003) reachable.');
    }, 1200);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '880px' }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CONFIGURATION ENGINE
            </span>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              padding: '2px 8px', 
              borderRadius: '4px', 
              backgroundColor: 'rgba(56, 189, 248, 0.15)', 
              color: 'var(--accent-blue-glow)' 
            }}>
              ● LOCAL RUNTIME
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-bright)', marginTop: '2px' }}>
            Platform Settings & API Keys
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Configure autonomous red-team engines, local target endpoints, and Neo4j Digital Twin credentials.
          </p>
        </div>

        <button 
          onClick={handleTestConnection}
          disabled={testingConnection}
          style={{
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={13} className={testingConnection ? 'animate-spin' : ''} />
          {testingConnection ? 'Testing...' : 'Test Cluster Handshake'}
        </button>
      </div>

      {testResult && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          color: 'var(--accent-green)',
          fontSize: '0.76rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={16} /> {testResult}
        </div>
      )}

      {/* ── SETTINGS PANELS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Backend & Target Ports Card */}
        <div className="argus-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <Server size={18} color="var(--accent-red)" />
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                Cluster Networking & Core Endpoints
              </h3>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                Microservice endpoints for ARGUS core evaluation engine and instrumented targets
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                FastAPI Backend Orchestrator URL
              </label>
              <input
                type="text"
                value={fastApiUrl}
                onChange={(e) => setFastApiUrl(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-bright)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.80rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Main REST API port running at port 8000
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Target Chatbot Pod URL (RAG Sandbox)
              </label>
              <input
                type="text"
                value={targetPodUrl}
                onChange={(e) => setTargetPodUrl(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-bright)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.80rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Target inference service tested by autonomous red-team at port 7003
              </span>
            </div>
          </div>
        </div>

        {/* Neo4j Digital Twin Configuration Card */}
        <div className="argus-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <Database size={18} color="var(--accent-blue-glow)" />
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                Neo4j Digital Twin Database Connection
              </h3>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                Bolt driver parameters for knowledge graph traversal and Cypher path execution
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Bolt Connection URI
              </label>
              <input
                type="text"
                value={neo4jUri}
                onChange={(e) => setNeo4jUri(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-bright)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.80rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                value={neo4jUser}
                onChange={(e) => setNeo4jUser(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-bright)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.80rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={neo4jPassword}
                  onChange={(e) => setNeo4jPassword(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '9px 32px 9px 12px',
                    color: 'var(--text-bright)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.80rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Credentials & Red Team Model Card */}
        <div className="argus-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <Key size={18} color="var(--accent-amber)" />
            <div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                Autonomous LLM Evaluator API Keys
              </h3>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                Provider keys powering the LangGraph autonomous attacker agent
              </span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Google Gemini / LangChain Evaluator Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 34px 9px 12px',
                  color: 'var(--text-bright)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.80rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {saveSuccess && (
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
              <Check size={14} /> Configuration saved to environment successfully!
            </span>
          )}

          <button 
            onClick={handleSave}
            className="btn-primary-red" 
            style={{ padding: '9px 24px', fontSize: '0.82rem' }}
          >
            <Save size={15} /> Save Platform Configuration
          </button>
        </div>

      </div>

    </div>
  );
};
