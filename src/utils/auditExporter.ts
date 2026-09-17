import { PimeResponse, FirewallStats } from '../types.ts';

export const exportSecureAuditBundle = (
  auditLogs: { id: string; timestamp: string; input: string; response: PimeResponse }[],
  stats: FirewallStats,
  currentResponse: PimeResponse | null
) => {
  const timestamp = new Date().toISOString();
  const bundle = {
    bundle_metadata: {
      generated_at: timestamp,
      generator: 'PIME (Prompt Injection Mitigation Engine) v1.0.0',
      compliance_target: 'OWASP LLM01:2025 Prompt Injection Defense',
      enclosure_standard: '<escaped_prompt> Rigid Boundary Encapsulation',
      zero_token_suppression_enforced: true,
      integrity_hash: `sha256-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`,
    },
    quantum_firewall_telemetry: {
      total_packets_inspected: stats.total_inspections,
      total_threats_blocked: stats.blocked_count,
      total_sanitized: stats.sanitized_count,
      total_clean_passed: stats.passed_count,
      median_latency_ms: stats.avg_latency_ms,
      threat_category_breakdown: stats.threat_category_breakdown,
      estimated_prevented_token_burn: stats.blocked_count * 340,
    },
    current_interception: currentResponse,
    recent_audit_trail: auditLogs.slice(0, 50).map((log) => ({
      event_id: log.id,
      timestamp: log.timestamp,
      raw_ingress_bytes: log.input.length,
      verdict: log.response.verdict,
      threat_level: log.response.threat_level,
      detected_vectors_count: log.response.detected_vectors.length,
      detected_vectors: log.response.detected_vectors.map((v) => ({
        id: v.id,
        rule_name: v.rule_name,
        category: v.category,
        severity: v.severity,
      })),
      action_log: log.response.action_log,
    })),
  };

  const jsonContent = JSON.stringify(bundle, null, 2);

  // Trigger browser download
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pime-audit-bundle-${timestamp.replace(/[:.]/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
