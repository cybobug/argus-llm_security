import React from 'react';
import { SecurityScoreGauge } from '../components/SecurityScoreGauge';
import { MetricCard } from '../components/MetricCard';
import { DigitalTwinGraph } from '../components/DigitalTwinGraph';
import { AttackTimeline } from '../components/AttackTimeline';
import { RiskRadarChart } from '../components/RiskRadarChart';
import { VulnerabilitiesList } from '../components/VulnerabilitiesList';
import { ScanStatusCard } from '../components/ScanStatusCard';
import { 
  Bot, 
  Radar, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenScanModal: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onOpenScanModal, onNavigateTab }) => {
  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* 🚀 Minimal Sleek Quickstart Stepper Banner */}
      <div className="argus-card" style={{
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%)',
        border: '1px solid var(--border-glass)',
        padding: '16px 20px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-red-glow)" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-bright)', letterSpacing: '-0.01em' }}>
              Quick Evaluation Workflow
            </h3>
          </div>
          <span style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            3-STEP SOC AUDIT
          </span>
        </div>

        {/* 3 Steps Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          
          {/* Step 1 */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('target-chatbot')}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue-glow)',
              flexShrink: 0
            }}>
              <Bot size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-bright)' }}>
                1. Target Chatbot
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Upload PDF & test injection prompts
              </p>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </div>

          {/* Step 2 */}
          <div 
            onClick={onOpenScanModal}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-red)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-red-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-red-glow)',
              flexShrink: 0
            }}>
              <Radar size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-bright)' }}>
                2. Autonomous Scan
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Run LangGraph OWASP red-team
              </p>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('vulnerabilities')}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-green-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-green)',
              flexShrink: 0
            }}>
              <ShieldCheck size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-bright)' }}>
                3. Inspect Findings
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Review PoC exploits & copy fixes
              </p>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </div>

        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Top Row: Metric Cards */}
        <SecurityScoreGauge score={72} />
        
        <MetricCard
          title="Critical Findings"
          value={6}
          changeText="↑ 2 new detected"
          isIncrease={true}
          trendColor="red"
          sparklineData={[3, 4, 3, 5, 4, 6]}
        />

        <MetricCard
          title="Assets Mapped"
          value={128}
          changeText="↗ 18 in Digital Twin"
          isIncrease={true}
          trendColor="blue"
          sparklineData={[90, 95, 104, 110, 115, 128]}
        />

        <MetricCard
          title="Attacks Blocked"
          value={347}
          changeText="↘ 98.2% mitigated"
          isIncrease={false}
          trendColor="green"
          sparklineData={[420, 390, 410, 370, 350, 347]}
        />

        {/* Middle Row: Digital Twin Graph + Attack Timeline */}
        <DigitalTwinGraph onNavigateTab={onNavigateTab} />
        <AttackTimeline />

        {/* Bottom Row: Risk Radar + Vulnerabilities + Scan Status */}
        <RiskRadarChart />
        <VulnerabilitiesList />
        <ScanStatusCard onOpenScanModal={onOpenScanModal} />
      </div>
    </div>
  );
};
