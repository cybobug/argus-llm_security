import React, { useState } from 'react';
import { Flame, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SecurityScoreGaugeProps {
  score: number;
}

export const SecurityScoreGauge: React.FC<SecurityScoreGaugeProps> = ({ score }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Semi-circle gauge calculation
  const radius = 62;
  const circumference = Math.PI * radius; // 180 deg semi circle
  const scorePercent = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="argus-card col-span-3" style={{ height: '220px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 0',
        color: 'var(--text-secondary)',
        fontSize: '0.88rem',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Security Score</span>
          <button 
            onClick={() => setShowBreakdown(prev => !prev)}
            title="View Score Breakdown"
            style={{
              background: 'none',
              border: 'none',
              color: showBreakdown ? 'var(--accent-red-glow)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            <HelpCircle size={14} />
          </button>
        </div>
        <button 
          onClick={() => setShowBreakdown(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{showBreakdown ? 'Close' : 'Explain'}</span>
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--accent-green)'
        }}>
          <span>↑ 12% vs last scan</span>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '10px'
      }}>
        {/* SVG Semi Circle Gauge */}
        <div 
          onClick={() => setShowBreakdown(prev => !prev)}
          style={{ position: 'relative', width: '150px', height: '85px', cursor: 'pointer' }}
          title="Click to see mathematical deduction factors"
        >
          <svg width="150" height="90" viewBox="0 0 150 90">
            {/* Background Arc */}
            <path
              d="M 15 80 A 60 60 0 0 1 135 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Filled Arc */}
            <path
              d="M 15 80 A 60 60 0 0 1 135 80"
              fill="none"
              stroke="url(#score-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Number Display */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <span style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-bright)',
              lineHeight: 1
            }}>
              {score}
            </span>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'block',
              marginTop: '2px'
            }}>
              / 100
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div 
          onClick={() => setShowBreakdown(prev => !prev)}
          style={{
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--accent-red-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--accent-red-glow)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Flame size={12} fill="var(--accent-red)" color="var(--accent-red)" />
          High Risk
        </div>
      </div>

      {/* Explanatory Breakdown Modal/Drawer */}
      {showBreakdown && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(11, 14, 23, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-lg)',
          zIndex: 20,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Score Derivation Model
              </span>
              <button 
                onClick={() => setShowBreakdown(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Baseline Perfect Posture</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-bright)' }}>100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-red-glow)' }}>
                <span>• 2 Critical Findings (LLM01, LLM04)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
                <span>• 4 High Severity Findings</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-10</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
                <span>• RAG Vector Traversal Exposure</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>-14</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                <span>• LlamaGuard & Mitigations Active</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>+8</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '6px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Net Computed Score</span>
            <span style={{ color: 'var(--accent-red-glow)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
              72 / 100
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
