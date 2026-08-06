import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// ─── PII Patterns ──────────────────────────────────────────────────────────

const PII_PATTERNS: Array<{
  name: string;
  pattern: RegExp;
  replacement: string;
}> = [
  {
    name: 'SSN',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: '[SSN REDACTED]',
  },
  { name: 'SSN_NO_DASH', pattern: /\b\d{9}\b/g, replacement: '[ID REDACTED]' },
  {
    name: 'CREDIT_CARD',
    pattern: /\b(?:\d[ -]?){13,16}\b/g,
    replacement: '[CC REDACTED]',
  },
  {
    name: 'ROUTING_NUMBER',
    pattern: /\b\d{9}\b/g,
    replacement: '[ROUTING REDACTED]',
  },
  {
    name: 'EMAIL_INTERNAL',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: '[EMAIL REDACTED]',
  },
  {
    name: 'PHONE',
    pattern: /\b(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    replacement: '[PHONE REDACTED]',
  },
  {
    name: 'LICENSE_PLATE',
    pattern: /\b[A-Z]{1,3}[-\s]?\d{1,4}[-\s]?[A-Z0-9]{0,4}\b/g,
    replacement: '[PLATE REDACTED]',
  },
  {
    name: 'DOB',
    pattern:
      /\b(?:dob|date of birth|born on|born)[\s:]+\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi,
    replacement: '[DOB REDACTED]',
  },
];

// ─── Output Policy Violations ─────────────────────────────────────────────

const OUTPUT_POLICY_VIOLATIONS = [
  {
    pattern: /\bkill\s+all\s+(jobs|processes|tasks)\b/i,
    severity: 'HIGH',
    label: 'Destructive instruction',
  },
  {
    pattern: /\bexecute\s+rm\s+-rf\b/i,
    severity: 'CRITICAL',
    label: 'Shell injection attempt',
  },
  {
    pattern: /\bDROP\s+TABLE\b/i,
    severity: 'CRITICAL',
    label: 'SQL injection in output',
  },
  {
    pattern: /\bignore\s+all\s+previous\s+instructions\b/i,
    severity: 'HIGH',
    label: 'Prompt injection in output',
  },
  {
    pattern: /\bdisregard\s+(your\s+)?(instructions|guidelines|rules)\b/i,
    severity: 'HIGH',
    label: 'Instruction override attempt',
  },
  {
    pattern: /as an? (ai|llm|language model),?\s+i (don't|do not) have/i,
    severity: 'LOW',
    label: 'AI identity disclosure',
  },
];

// ─── Prompt Injection Patterns ─────────────────────────────────────────────

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+all\s+previous\s+instructions/i,
  /you\s+are\s+now\s+(a|an)\s+[a-z]+\s+(ai|bot|assistant)/i,
  /act\s+as\s+(?:if\s+you\s+were\s+)?(?:a\s+)?(?:unrestricted|jailbroken|dan)/i,
  /forget\s+everything\s+and/i,
  /new\s+instructions?\s*:/i,
  /system\s+override/i,
  /\[system\s*prompt\]/i,
  /\/\*.*\*\//s, // Multiline comment injection
];

@Injectable()
export class AiGovernanceService {
  private readonly logger = new Logger(AiGovernanceService.name);
  private readonly CONFIDENCE_THRESHOLD = 0.85;

  // Audit log for governance events (production: persist to Prisma)
  private governanceAuditLog: Array<{
    event: string;
    timestamp: Date;
    companyId?: string;
    userId?: string;
    severity: string;
    details: string;
  }> = [];

  constructor(private readonly prisma: PrismaService) {}

  // ─── Recommendation Governance ────────────────────────────────────────────

  async evaluateRecommendation(recommendationId: string): Promise<boolean> {
    const rec = await this.prisma.runAsSystem(async (tx) =>
      tx.aiRecommendation.findUnique({
        where: { id: recommendationId },
      }),
    );
    if (!rec) throw new ForbiddenException('Recommendation not found');

    if (rec.confidence < this.CONFIDENCE_THRESHOLD) {
      this.logger.warn(
        `Recommendation ${recommendationId} rejected by Governance (confidence ${rec.confidence} < ${this.CONFIDENCE_THRESHOLD})`,
      );
      await this.prisma.runAsSystem(async (tx) =>
        tx.aiRecommendation.update({
          where: { id: recommendationId },
          data: { status: 'REJECTED' },
        }),
      );
      this.logGovernanceEvent(
        'RECOMMENDATION_REJECTED',
        'MEDIUM',
        `Confidence ${rec.confidence} below threshold`,
        rec.companyId,
      );
      return false;
    }
    return true;
  }

  async acceptRecommendation(recommendationId: string, userId: string) {
    this.logGovernanceEvent(
      'RECOMMENDATION_ACCEPTED',
      'LOW',
      `Accepted by ${userId}`,
    );
    return this.prisma.runAsSystem(async (tx) =>
      tx.aiRecommendation.update({
        where: { id: recommendationId },
        data: {
          status: 'ACCEPTED',
          actionTakenAt: new Date(),
          actionTakenBy: userId,
        },
      }),
    );
  }

  // ─── PII Redaction ────────────────────────────────────────────────────────

  /**
   * Scrub PII from user input before sending to LLM providers.
   * Returns the redacted text and a list of what was found.
   */
  redactPii(text: string): { redacted: string; found: string[] } {
    let redacted = text;
    const found: string[] = [];

    for (const { name, pattern, replacement } of PII_PATTERNS) {
      const before = redacted;
      redacted = redacted.replace(pattern, replacement);
      if (before !== redacted) {
        found.push(name);
      }
    }

    if (found.length > 0) {
      this.logger.warn(`PII detected and redacted: ${found.join(', ')}`);
      this.logGovernanceEvent(
        'PII_REDACTED',
        'MEDIUM',
        `Redacted: ${found.join(', ')}`,
      );
    }

    return { redacted, found };
  }

  // ─── Prompt Injection Protection ─────────────────────────────────────────

  /**
   * Detect and neutralize prompt injection attacks in user input.
   */
  sanitizeInput(input: string): string {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        this.logger.warn(
          `Prompt injection attempt detected and blocked: "${input.substring(0, 80)}..."`,
        );
        this.logGovernanceEvent(
          'PROMPT_INJECTION_BLOCKED',
          'HIGH',
          `Pattern matched: ${pattern.toString().substring(0, 50)}`,
        );
        // Strip the malicious segment and replace with a warning
        return input.replace(pattern, '[BLOCKED: Policy violation]');
      }
    }
    return input;
  }

  // ─── Output Validation ────────────────────────────────────────────────────

  /**
   * Validate AI output for policy violations before returning to user.
   * Returns {valid: true} or {valid: false, violations: [...]}.
   */
  validateOutput(output: string): {
    valid: boolean;
    violations: Array<{ label: string; severity: string }>;
  } {
    const violations: Array<{ label: string; severity: string }> = [];

    for (const rule of OUTPUT_POLICY_VIOLATIONS) {
      if (rule.pattern.test(output)) {
        violations.push({ label: rule.label, severity: rule.severity });
        this.logger.warn(
          `Output policy violation: ${rule.label} (${rule.severity})`,
        );
        this.logGovernanceEvent(
          'OUTPUT_POLICY_VIOLATION',
          rule.severity,
          rule.label,
        );
      }
    }

    return { valid: violations.length === 0, violations };
  }

  // ─── Compliance Reporting ─────────────────────────────────────────────────

  /**
   * Generate a governance compliance report for a company.
   */
  getComplianceReport(companyId?: string): {
    reportGeneratedAt: string;
    companyId: string;
    totalGovernanceEvents: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    recentEvents: Array<{
      event: string;
      severity: string;
      timestamp: Date;
      details: string;
    }>;
    complianceScore: number;
  } {
    const relevantLogs = companyId
      ? this.governanceAuditLog.filter(
          (l) => !l.companyId || l.companyId === companyId,
        )
      : this.governanceAuditLog;

    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    for (const log of relevantLogs) {
      byCategory[log.event] = (byCategory[log.event] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
    }

    // Score: start at 100, deduct for violations
    let score = 100;
    score -= (bySeverity['CRITICAL'] || 0) * 20;
    score -= (bySeverity['HIGH'] || 0) * 10;
    score -= (bySeverity['MEDIUM'] || 0) * 3;
    score -= (bySeverity['LOW'] || 0) * 1;
    score = Math.max(0, Math.min(100, score));

    return {
      reportGeneratedAt: new Date().toISOString(),
      companyId: companyId || 'GLOBAL',
      totalGovernanceEvents: relevantLogs.length,
      byCategory,
      bySeverity,
      recentEvents: relevantLogs
        .slice(-10)
        .reverse()
        .map((l) => ({
          event: l.event,
          severity: l.severity,
          timestamp: l.timestamp,
          details: l.details,
        })),
      complianceScore: score,
    };
  }

  // ─── RBAC for AI ──────────────────────────────────────────────────────────

  /**
   * Validate that a user has the required AI permission before executing an action.
   */
  async assertAiPermission(
    userId: string,
    companyId: string,
    requiredPermission: string,
  ): Promise<void> {
    try {
      const user = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.user.findFirst({
          where: { id: userId, companyId },
          include: { role: true },
        }),
      );

      if (!user) throw new ForbiddenException('User not found');

      const userPermissions =
        (user.role as any)?.permissions?.map((p: any) => p.action) || [];
      const hasPermission =
        userPermissions.includes(requiredPermission) ||
        userPermissions.includes('*') ||
        userPermissions.includes('ai:*');

      if (!hasPermission) {
        this.logGovernanceEvent(
          'AI_PERMISSION_DENIED',
          'HIGH',
          `User ${userId} denied access to ${requiredPermission}`,
          companyId,
          userId,
        );
        throw new ForbiddenException(
          `Insufficient AI permissions. Required: ${requiredPermission}`,
        );
      }
    } catch (e: any) {
      if (e instanceof ForbiddenException) throw e;
      // DB error — fail open in dev, fail closed in prod
      if (process.env.NODE_ENV === 'production') {
        throw new ForbiddenException('Permission verification failed');
      }
    }
  }

  // ─── Internal Logging ─────────────────────────────────────────────────────

  private logGovernanceEvent(
    event: string,
    severity: string,
    details: string,
    companyId?: string,
    userId?: string,
  ) {
    this.governanceAuditLog.push({
      event,
      timestamp: new Date(),
      companyId,
      userId,
      severity,
      details,
    });
    // Keep last 5000 entries
    if (this.governanceAuditLog.length > 5000) this.governanceAuditLog.shift();
  }
}
