import React from 'react';

interface ScanStatusCardProps {
  onOpenScanModal: () => void;
}

export const ScanStatusCard: React.FC<ScanStatusCardProps> = ({ onOpenScanModal }) => {
  const percent = 62;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="argus-card col-span-4" style={{ height: '310px', display: 'flex', flexDirection: 'column' }}>
      <div className="argus-card-header">
        <span>Scan Status</span>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
          View Details →
        </span>
      </div>

      <div style={{
        flex: 1,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Circular Progress Gauge */}
        <div 
          onClick={onOpenScanModal}
          style={{
            position: 'relative',
            width: '125px',
            height: '125px',
            cursor: 'pointer',
            flexShrink: 0
          }}
          title="Click to view live red-team execution"
        >
          <svg width="125" height="125" viewBox="0 0 125 125" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="62.5"
              cy="62.5"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="10"
            />
            <circle
              cx="62.5"
              cy="62.5"
              r={radius}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))',
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>

          {/* Center Text in Gauge */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <span style={{
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              display: 'block',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Scanning...
            </span>
            <span style={{
              fontSize: '1.55rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-bright)',
              lineHeight: 1.1
            }}>
              62%
            </span>
          </div>
        </div>

        {/* Live Telemetry Metadata matching reference image */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.74rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Started At</span>
            <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>15 Jul, 2025 10:24 AM</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Elapsed Time</span>
            <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>2m 14s</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tests Executed</span>
            <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>217 / 350</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Current Phase</span>
            <span style={{
              color: 'var(--accent-red-glow)',
              fontWeight: 600,
              fontSize: '0.72rem'
            }}>
              RAG Attack Tests
            </span>
          </div>

          <div 
            onClick={onOpenScanModal}
            style={{
              marginTop: '4px',
              padding: '5px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'var(--accent-blue-glow)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>📜 View Live Logs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
