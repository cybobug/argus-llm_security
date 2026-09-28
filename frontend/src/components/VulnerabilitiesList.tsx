import React from 'react';
import { X } from 'lucide-react';

interface VulnItem {
  name: string;
  score: number;
  color?: string;
}

export const VulnerabilitiesList: React.FC = () => {
  const vulns: VulnItem[] = [
    { name: 'Prompt Injection', score: 9.8, color: '#EF4444' },
    { name: 'RAG Poisoning', score: 8.4, color: '#F59E0B' },
    { name: 'Tool Abuse', score: 7.1, color: '#3B82F6' },
    { name: 'Jailbreak Attempts', score: 6.9, color: '#38BDF8' }
  ];

  return (
    <div className="argus-card col-span-4" style={{ height: '310px', display: 'flex', flexDirection: 'column' }}>
      <div className="argus-card-header">
        <span>Top Vulnerabilities</span>
        <X size={15} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
      </div>

      <div style={{
        flex: 1,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
        {vulns.map((item, idx) => {
          const percent = (item.score / 10) * 100;
          return (
            <div key={idx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                marginBottom: '6px'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {item.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: item.color
                }}>
                  {item.score.toFixed(1)}<span style={{ color: 'var(--text-muted)' }}>/10</span>
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{
                width: '100%',
                height: '7px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percent}%`,
                  height: '100%',
                  backgroundColor: item.color,
                  borderRadius: '9999px',
                  boxShadow: `0 0 8px ${item.color}80`,
                  transition: 'width 1s ease-in-out'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
