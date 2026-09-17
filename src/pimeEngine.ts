import { DetectedVector, PimeResponse, ThreatLevel, Verdict } from './types.ts';

export interface HeuristicRule {
  id: string;
  category: 'System Prompt Leakage' | 'Delimiter Hijacking' | 'Jailbreak Signature' | 'Indirect Prompt Injection';
  name: string;
  pattern: RegExp;
  severity: ThreatLevel;
  description: string;
  owasp_ref: string;
}

export const HEURISTIC_RULES: HeuristicRule[] = [
  // --- 1. SYSTEM PROMPT LEAKAGE ---
  {
    id: 'SPL-001',
    category: 'System Prompt Leakage',
    name: 'Ignore Prior Directives Override',
    pattern: /\b(?:ignore|disregard|forget|bypass|override|drop)\s+(?:all\s+)?(?:previous|prior|initial|system|above)\s+(?:instructions?|directives?|rules?|prompts?|context)\b/i,
    severity: 'CRITICAL',
    description: 'Adversarial attempt to force model to ignore initial system constraints or safety directives.',
    owasp_ref: 'OWASP LLM01: Prompt Injection',
  },
  {
    id: 'SPL-002',
    category: 'System Prompt Leakage',
    name: 'System Prompt Verbatim Exfiltration',
    pattern: /\b(?:repeat|output|display|show|reveal|print|echo|dump)\s+(?:your\s+)?(?:initial|original|secret|hidden|verbatim|full|base)\s+(?:system\s+)?(?:prompt|instructions?|rules?|directives?|guidelines?)\b/i,
    severity: 'CRITICAL',
    description: 'Direct exfiltration request targeting internal system instructions or developer guidance.',
    owasp_ref: 'OWASP LLM01: Prompt Injection / System Prompt Leakage',
  },
  {
    id: 'SPL-003',
    category: 'System Prompt Leakage',
    name: 'Repeat All Text Above / History Dump',
    pattern: /\b(?:repeat|print|output)\s+(?:all\s+)?(?:the\s+)?(?:text|words|sentences|messages|instructions)\s+(?:above|before|preceding)\b/i,
    severity: 'HIGH',
    description: 'Context history dumping vector attempting to leak pre-prompt system boundaries.',
    owasp_ref: 'OWASP LLM01: Prompt Injection',
  },
  {
    id: 'SPL-004',
    category: 'System Prompt Leakage',
    name: 'Reveal Hidden Rules Query',
    pattern: /\b(?:what\s+are\s+your|reveal|tell\s+me\s+your)\s+(?:hidden|internal|confidential|secret|system)\s+(?:rules?|prompts?|guidelines?|instructions?)\b/i,
    severity: 'HIGH',
    description: 'Targeted probe for hidden system operational boundaries and guardrails.',
    owasp_ref: 'OWASP LLM01: System Prompt Leakage',
  },

  // --- 2. DELIMITER HIJACKING ---
  {
    id: 'DLH-001',
    category: 'Delimiter Hijacking',
    name: 'System Tag Breakout Closure',
    pattern: /<\/?(?:system|system_instructions?|developer|instructions?|prompt|admin)[^>]*>/i,
    severity: 'CRITICAL',
    description: 'Unescaped tag manipulation attempt imitating internal LLM system delimiters.',
    owasp_ref: 'OWASP LLM01: Delimiter Hijacking',
  },
  {
    id: 'DLH-002',
    category: 'Delimiter Hijacking',
    name: 'Bracketed System Override Delimiter',
    pattern: /\[(?:SYSTEM\s+PROMPT\s+OVERRIDE|SYSTEM|SYS|ADMIN|ROOT|SUPERUSER|DEVELOPER\s+OVERRIDE)\]/i,
    severity: 'CRITICAL',
    description: 'Delimiter hijacking using standard bracketed markup syntax to impersonate authority.',
    owasp_ref: 'OWASP LLM01: Delimiter Hijacking',
  },
  {
    id: 'DLH-003',
    category: 'Delimiter Hijacking',
    name: 'Code-Fence System Channel Injection',
    pattern: /```+\s*(?:system|sys|prompt|instructions?|developer|admin)\b/i,
    severity: 'HIGH',
    description: 'Markdown code-block delimiter manipulation targeting model context separation.',
    owasp_ref: 'OWASP LLM01: Delimiter Hijacking',
  },
  {
    id: 'DLH-004',
    category: 'Delimiter Hijacking',
    name: 'PIME Enclosure Tag Spoofing',
    pattern: /<\/?escaped_prompt>/i,
    severity: 'CRITICAL',
    description: 'Adversarial attempt to break out of or preemptively close PIME structural enclosure boundary.',
    owasp_ref: 'OWASP LLM01: Delimiter Hijacking',
  },
  {
    id: 'DLH-005',
    category: 'Delimiter Hijacking',
    name: 'Comment-Based Boundary Hijacking',
    pattern: /(?:<!--\s*(?:system|override|admin|instruction)|\/\*\s*SYSTEM_OVERRIDE\s*\*\/)/i,
    severity: 'HIGH',
    description: 'Exploiting code or HTML comments to embed fake system-level boundary instructions.',
    owasp_ref: 'OWASP LLM01: Delimiter Hijacking',
  },

  // --- 3. JAILBREAKS ---
  {
    id: 'JBK-001',
    category: 'Jailbreak Signature',
    name: 'DAN (Do Anything Now) Persona',
    pattern: /\b(?:DAN|Do\s+Anything\s+Now)\b(?:\s+(?:mode|jailbreak|v\d+|\d+\.\d+|enabled|activated))?/i,
    severity: 'CRITICAL',
    description: 'Well-known adversarial persona designed to compel models into unrestricted operational modes.',
    owasp_ref: 'OWASP LLM01: Jailbreak / Persona Adoption',
  },
  {
    id: 'JBK-002',
    category: 'Jailbreak Signature',
    name: 'Developer Mode Bypass',
    pattern: /\b(?:developer\s+mode|devmode|god\s+mode)\s+(?:is\s+)?(?:enabled|activated|on|unlocked)\b/i,
    severity: 'CRITICAL',
    description: 'Fictitious developer mode activation vector designed to bypass safety policies.',
    owasp_ref: 'OWASP LLM01: Jailbreak',
  },
  {
    id: 'JBK-003',
    category: 'Jailbreak Signature',
    name: 'Hypothetical / Fictional Constraint Bypass',
    pattern: /\b(?:in\s+a\s+hypothetical\s+(?:world|scenario|universe)|pretend\s+you\s+(?:have\s+no|are\s+free\s+from)\s+(?:rules?|safety|filters?|guidelines?|ethics?)|acting\s+as\s+an\s+unfiltered\s+(?:ai|model))\b/i,
    severity: 'HIGH',
    description: 'Hypothetical reframing technique attempting to neutralize safety filters through fictional context.',
    owasp_ref: 'OWASP LLM01: Jailbreak',
  },
  {
    id: 'JBK-004',
    category: 'Jailbreak Signature',
    name: 'Opposite / Evil Twin Roleplay Injection',
    pattern: /\b(?:you\s+are\s+now\s+(?:evil|unfiltered|dark|unaligned|chaos|anti-gpt)|adopt\s+the\s+persona\s+of\s+an?\s+unrestricted)\b/i,
    severity: 'HIGH',
    description: 'Adversarial role reversal tricking LLM into generating restricted or unaligned responses.',
    owasp_ref: 'OWASP LLM01: Jailbreak',
  },

  // --- 4. INDIRECT PROMPT INJECTION ---
  {
    id: 'IND-001',
    category: 'Indirect Prompt Injection',
    name: 'Context Data Embedded Command',
    pattern: /\[(?:IMPORTANT\s+INSTRUCTION|NOTE\s+TO\s+ASSISTANT|ADMIN\s+TASK|SECRET\s+DIRECTIVE|URGENT\s+OVERRIDE)\s*:\s*[^\]]+\]/i,
    severity: 'CRITICAL',
    description: 'Malicious execution command smuggled inside context payload, document vector, or retrieved text.',
    owasp_ref: 'OWASP LLM01: Indirect Prompt Injection',
  },
  {
    id: 'IND-002',
    category: 'Indirect Prompt Injection',
    name: 'Exfiltration Image / Webhook Markdown Injection',
    pattern: /!\[[^\]]*\]\((?:https?:\/\/[^\s)]+(?:leak|steal|exfil|token|cookie|pwd|key|auth|session|callback|ping)[^\s)]*)\)/i,
    severity: 'CRITICAL',
    description: 'Data exfiltration vector attempting to leak conversational tokens through rendering image tags.',
    owasp_ref: 'OWASP LLM01: Indirect Prompt Injection & Exfiltration',
  },
  {
    id: 'IND-003',
    category: 'Indirect Prompt Injection',
    name: 'Data Delimiter Pivot & Hijack',
    pattern: /(?:END\s+(?:OF\s+)?(?:DATA|DOCUMENT|CONTEXT|USER\s+INPUT)|BEGIN\s+(?:NEW\s+)?INSTRUCTION)\s*[:;\n]/i,
    severity: 'HIGH',
    description: 'Falsified data termination boundary followed by rogue execution directive.',
    owasp_ref: 'OWASP LLM01: Indirect Prompt Injection',
  },
  {
    id: 'IND-004',
    category: 'Indirect Prompt Injection',
    name: 'Malicious Command Execution Smuggling',
    pattern: /\b(?:disregard\s+prior\s+task|instead\s+of\s+summarizing|rather\s+than\s+answering),\s*(?:send|forward|post|curl|email|fetch)\b/i,
    severity: 'CRITICAL',
    description: 'Instruction hijacking inside secondary processed content redirecting model behavior.',
    owasp_ref: 'OWASP LLM01: Indirect Prompt Injection',
  },
];

/**
 * Escapes HTML / XML entities to neutralize delimiter break-outs
 */
export function sanitizeHtmlEntities(input: string): {
  sanitized: string;
  modified: boolean;
  counts: Record<string, number>;
} {
  const counts: Record<string, number> = {
    '&': 0,
    '<': 0,
    '>': 0,
    '"': 0,
    "'": 0,
  };

  let modified = false;

  const sanitized = input.replace(/[&<>"']/g, (match) => {
    modified = true;
    counts[match] = (counts[match] || 0) + 1;
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#x27;';
      default:
        return match;
    }
  });

  return { sanitized, modified, counts };
}

/**
 * Executes the 5-stage PIME pipeline
 */
export function inspectPrompt(rawInput: string): PimeResponse {
  const startTime = performance.now();
  const detectedVectors: DetectedVector[] = [];

  // STAGE 1: INTERCEPT
  const input = rawInput ?? '';
  const inputLength = input.length;
  const stage1Log = `[Stage 1: INTERCEPT] Captured ${inputLength} characters (${new Blob([input]).size} bytes) from untrusted ingress channel.`;

  // STAGE 2: INSPECT
  let hasCriticalOrHigh = false;
  let highestSeverity: ThreatLevel = 'LOW';

  for (const rule of HEURISTIC_RULES) {
    const match = rule.pattern.exec(input);
    if (match) {
      detectedVectors.push({
        id: rule.id,
        category: rule.category,
        rule_name: rule.name,
        matched_text: match[0],
        severity: rule.severity,
        description: rule.description,
        owasp_ref: rule.owasp_ref,
        index: match.index,
      });

      if (rule.severity === 'CRITICAL') {
        hasCriticalOrHigh = true;
        highestSeverity = 'CRITICAL';
      } else if (rule.severity === 'HIGH') {
        hasCriticalOrHigh = true;
        if (highestSeverity !== 'CRITICAL') {
          highestSeverity = 'HIGH';
        }
      } else if (rule.severity === 'MEDIUM' && highestSeverity === 'LOW') {
        highestSeverity = 'MEDIUM';
      }
    }
  }

  const stage2Log = detectedVectors.length > 0
    ? `[Stage 2: INSPECT] Flagged ${detectedVectors.length} adversarial vector(s) across categories: [${Array.from(new Set(detectedVectors.map(v => v.category))).join(', ')}]. Immediate threat evaluation: ${highestSeverity}.`
    : `[Stage 2: INSPECT] Evaluated ${HEURISTIC_RULES.length} heuristic rules. No known adversarial signatures, leakage probes, or jailbreak heuristics triggered.`;

  // STAGE 3: SANITIZE
  const { sanitized, modified, counts } = sanitizeHtmlEntities(input);
  const totalEscaped = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

  const stage3Log = modified
    ? `[Stage 3: SANITIZE] Neutralized ${totalEscaped} raw XML/HTML syntax tokens (&:${counts['&']}, <:${counts['<']}, >:${counts['>']}, ":${counts['"']}, ':${counts["'"]}) with safe character entities.`
    : `[Stage 3: SANITIZE] Verified text contains zero ambiguous markup tags or delimiters requiring entity substitution.`;

  // STAGE 4: STRUCTURAL ENCLOSURE
  const enclosed = `<escaped_prompt>${sanitized}</escaped_prompt>`;
  const stage4Log = !hasCriticalOrHigh
    ? `[Stage 4: STRUCTURAL ENCLOSURE] Wrapped verified payload inside strict <escaped_prompt>...</escaped_prompt> container boundaries.`
    : `[Stage 4: STRUCTURAL ENCLOSURE] Suppressed enclosure step. Payload marked for immediate isolation drop.`;

  // STAGE 5: DECISION (FORWARD OR BLOCK)
  let verdict: Verdict = 'PASSED';
  let threatLevel: ThreatLevel = 'LOW';
  let sanitizedPayload: string | null = null;
  let downstreamPayload: string | null = null;
  let stage5Log = '';

  if (hasCriticalOrHigh) {
    verdict = 'BLOCKED';
    threatLevel = highestSeverity;
    sanitizedPayload = null;
    downstreamPayload = null;
    stage5Log = `[Stage 5: DECISION] BLOCKED. Adversarial threat detected (${detectedVectors.map(v => v.id).join(', ')}). Ingress terminated. Zero tokens forwarded to downstream model. Security event logged.`;
  } else if (modified) {
    verdict = 'SANITIZED';
    threatLevel = highestSeverity === 'MEDIUM' ? 'MEDIUM' : 'LOW';
    sanitizedPayload = enclosed;
    downstreamPayload = enclosed;
    stage5Log = `[Stage 5: DECISION] SANITIZED. Boundary delimiters secured. Payload encapsulated and cleared for downstream LLM ingress.`;
  } else {
    verdict = 'PASSED';
    threatLevel = 'LOW';
    sanitizedPayload = enclosed;
    downstreamPayload = enclosed;
    stage5Log = `[Stage 5: DECISION] PASSED. Payload verified safe. Context boundaries established and transmitted to model.`;
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

  const actionLog = [stage1Log, stage2Log, stage3Log, stage4Log, stage5Log].join(' ');

  return {
    pime_version: '1.0.0',
    execution_time_ms: executionTimeMs,
    verdict,
    threat_level: threatLevel,
    detected_vectors: detectedVectors,
    sanitized_payload: sanitizedPayload,
    action_log: actionLog,
    downstream_payload: downstreamPayload,
    timestamp: new Date().toISOString(),
    stage_details: {
      stage1_intercept: {
        raw_length: inputLength,
        char_encoding: 'UTF-8',
        raw_preview: input.length > 80 ? input.slice(0, 80) + '...' : input,
      },
      stage2_inspect: {
        scanned_rules_count: HEURISTIC_RULES.length,
        heuristics_triggered: detectedVectors.length,
        matched_categories: Array.from(new Set(detectedVectors.map(v => v.category))),
      },
      stage3_sanitize: {
        tags_escaped: totalEscaped,
        entities_converted: counts,
        sanitized_preview: sanitized.length > 80 ? sanitized.slice(0, 80) + '...' : sanitized,
      },
      stage4_enclosure: {
        boundary_tag: '<escaped_prompt>',
        enclosure_status: verdict === 'BLOCKED' ? 'SUPPRESSED' : 'APPLIED',
      },
      stage5_decision: {
        downstream_forwarded: verdict !== 'BLOCKED',
        tokens_allowed: verdict === 'BLOCKED' ? 0 : Math.ceil((downstreamPayload?.length || 0) / 4),
        block_reason: verdict === 'BLOCKED' ? detectedVectors.map(v => `${v.rule_name} (${v.id})`).join('; ') : null,
      },
    },
  };
}
