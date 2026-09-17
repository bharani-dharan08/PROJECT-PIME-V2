export type Verdict = 'PASSED' | 'SANITIZED' | 'BLOCKED';
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DetectedVector {
  id: string;
  category: 'System Prompt Leakage' | 'Delimiter Hijacking' | 'Jailbreak Signature' | 'Indirect Prompt Injection';
  rule_name: string;
  matched_text: string;
  severity: ThreatLevel;
  description: string;
  owasp_ref: string;
  index: number;
}

export interface PimeResponse {
  pime_version: string;
  execution_time_ms: number;
  verdict: Verdict;
  threat_level: ThreatLevel;
  detected_vectors: DetectedVector[];
  sanitized_payload: string | null;
  action_log: string;
  downstream_payload: string | null;
  // Extended telemetry details for UI and auditing
  timestamp?: string;
  stage_details?: {
    stage1_intercept: {
      raw_length: number;
      char_encoding: string;
      raw_preview: string;
    };
    stage2_inspect: {
      scanned_rules_count: number;
      heuristics_triggered: number;
      matched_categories: string[];
    };
    stage3_sanitize: {
      tags_escaped: number;
      entities_converted: Record<string, number>;
      sanitized_preview: string;
    };
    stage4_enclosure: {
      boundary_tag: string;
      enclosure_status: string;
    };
    stage5_decision: {
      downstream_forwarded: boolean;
      tokens_allowed: number;
      block_reason: string | null;
    };
  };
  downstream_result?: {
    model: string;
    status: 'EXECUTED' | 'SUPPRESSED_ZERO_TOKENS' | 'SKIPPED';
    response_text?: string;
    execution_time_ms?: number;
  };
}

export interface InspectionPreset {
  id: string;
  title: string;
  category: 'Leakage' | 'Delimiter' | 'Jailbreak' | 'Indirect' | 'Benign';
  threatExpected: Verdict;
  prompt: string;
  explanation: string;
}

export interface FirewallStats {
  total_inspections: number;
  blocked_count: number;
  sanitized_count: number;
  passed_count: number;
  avg_latency_ms: number;
  threat_category_breakdown: Record<string, number>;
}
