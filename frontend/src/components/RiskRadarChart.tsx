import React from 'react';

export const RiskRadarChart: React.FC = () => {
  const data = [
    { label: 'Critical', count: 6, percent: '25%', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.6)' },
    { label: 'High', count: 8, percent: '33%', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.6)' },
    { label: 'Medium', count: 7, percent: '29%', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' },
    { label: 'Low', count: 3, percent: '13%', color: '#10B981', glow: 'rgba(16, 185, 129, 0.6)' },
  ];

  const total = 24;

  // Donut geometry
  const radius = 60;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius; // ~376.99

  // Cumulative offset calculations for segments
  const segments = [
    { percent: 0.25, color: '#EF4444' },
    { percent: 0.33, color: '#F59E0B' },
    { percent: 0.29, color: '#3B82F6' },
    { percent: 0.13, color: '#10B981' }
  ];

  let accumulated = 0;
  const renderedSegments = segments.map((seg) => {
    const strokeDasharray = `${seg.percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulated * circumference;
    accumulated += seg.percent;
    return { ...seg, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="argus-card col-span-4" style={{ height: '310px', display: 'flex', flexDirection: 'column' }}>
      <div className="argus-card-header">
        <span>Risk Distribution</span>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px'
      }}>
        {/* Modern Donut Chart with Center Total Findings */}
        <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
          <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />
            {renderedSegments.map((seg, idx) => (
              <circle
                key={idx}
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'all 0.5s ease' }}
              />
            ))}
          </svg>

          {/* Center Text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-bright)',
              lineHeight: 1
            }}>
              {total}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
              Total Findings
            </span>
          </div>
        </div>

        {/* Severity Legend Breakdown matching screenshot */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
          paddingLeft: '22px'
        }}>
          {data.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  boxShadow: `0 0 6px ${item.glow}`
                }} />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: item.color,
                  fontSize: '0.82rem'
                }}>
                  {item.count}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  fontSize: '0.74rem',
                  width: '32px',
                  textAlign: 'right'
                }}>
                  {item.percent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
