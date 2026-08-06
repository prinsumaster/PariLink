/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConditionEngineService {
  private readonly logger = new Logger(ConditionEngineService.name);

  /**
   * Evaluates a node's condition configuration against a given context payload
   * Supports complex logical nesting (AND, OR, NOT)
   */
  evaluate(conditionNode: any, payloadContext: any): boolean {
    if (!conditionNode || !conditionNode.operator) return true; // Default to true if empty

    const { operator, rules } = conditionNode;

    switch (operator) {
      case 'AND':
        return rules.every((rule: any) =>
          this.evaluateRule(rule, payloadContext),
        );
      case 'OR':
        return rules.some((rule: any) =>
          this.evaluateRule(rule, payloadContext),
        );
      case 'NOT':
        return !this.evaluateRule(rules[0] || conditionNode, payloadContext);
      default:
        // Single rule without AND/OR grouping
        return this.evaluateRule(conditionNode, payloadContext);
    }
  }

  public evaluateRule(rule: any, context: any): boolean {
    if (
      rule.operator === 'AND' ||
      rule.operator === 'OR' ||
      rule.operator === 'NOT'
    ) {
      return this.evaluate(rule, context);
    }

    const value = this.getValueFromPath(context, rule.field);
    const target = rule.value;

    switch (rule.operator) {
      case 'EQUALS':
        return value === target;
      case 'NOT_EQUALS':
        return value !== target;
      case 'GREATER_THAN':
        return value > target;
      case 'GREATER_THAN_OR_EQUAL':
        return value >= target;
      case 'LESS_THAN':
        return value < target;
      case 'LESS_THAN_OR_EQUAL':
        return value <= target;
      case 'CONTAINS':
        return typeof value === 'string' && value.includes(target);
      case 'STARTS_WITH':
        return typeof value === 'string' && value.startsWith(target);
      case 'ENDS_WITH':
        return typeof value === 'string' && value.endsWith(target);
      case 'REGEX':
        try {
          return new RegExp(target).test(String(value));
        } catch {
          return false;
        }
      case 'IN':
        return Array.isArray(target) && target.includes(value);
      case 'NOT_IN':
        return Array.isArray(target) && !target.includes(value);
      case 'BETWEEN':
        return (
          Array.isArray(target) &&
          target.length === 2 &&
          value >= target[0] &&
          value <= target[1]
        );
      case 'EXISTS':
        return value !== undefined && value !== null;
      case 'NOT_EXISTS':
        return value === undefined || value === null;
      default:
        this.logger.warn(`Unknown operator: ${rule.operator}`);
        return false;
    }
  }

  private getValueFromPath(obj: any, path: string): any {
    if (!path || !obj) return undefined;
    const parts = path.split('.');
    return parts.reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
      obj,
    );
  }
}
