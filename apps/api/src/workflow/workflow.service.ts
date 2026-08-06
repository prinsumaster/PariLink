/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkflowRuleDto,
  EvaluateWorkflowDto,
  UpdateWorkflowRuleDto,
  SimulateRuleDto,
  ImportRulesDto,
} from './dto/workflow.dto';
import { ConditionEngineService } from './engine/condition.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    private prisma: PrismaService,
    private conditionEngine: ConditionEngineService,
    private eventEmitter: EventEmitter2,
  ) {}

  // --- CRUD API ---

  async createRule(companyId: string, dto: CreateWorkflowRuleDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.workflowRule.create({
        data: {
          companyId,
          name: dto.name,
          entityType: dto.entityType,
          trigger: dto.trigger,
          conditions: dto.conditions,
          actions: dto.actions,
          priority: dto.priority || 0,
          version: 1,
        },
      });
    });
  }

  async getRules(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.workflowRule.findMany({
        orderBy: { priority: 'desc' },
      });
    });
  }

  async getRuleById(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rule = await tx.workflowRule.findUnique({
        where: { id, companyId },
      });
      if (!rule) throw new NotFoundException(`Rule ${id} not found`);
      return rule;
    });
  }

  async updateRule(companyId: string, id: string, dto: UpdateWorkflowRuleDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      await this.getRuleById(companyId, id); // Ensure it exists
      return tx.workflowRule.update({
        where: { id, companyId },
        data: {
          name: dto.name,
          trigger: dto.trigger,
          conditions: dto.conditions,
          actions: dto.actions,
          priority: dto.priority,
        },
      });
    });
  }

  async deleteRule(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      await this.getRuleById(companyId, id);
      return tx.workflowRule.delete({ where: { id, companyId } });
    });
  }

  async activateRule(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      await this.getRuleById(companyId, id);
      return tx.workflowRule.update({
        where: { id, companyId },
        data: { isActive: true },
      });
    });
  }

  async deactivateRule(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      await this.getRuleById(companyId, id);
      return tx.workflowRule.update({
        where: { id, companyId },
        data: { isActive: false },
      });
    });
  }

  async cloneRule(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rule = await this.getRuleById(companyId, id);
      return tx.workflowRule.create({
        data: {
          companyId,
          name: `${rule.name} (Clone)`,
          entityType: rule.entityType,
          trigger: rule.trigger,
          conditions: rule.conditions || [],
          actions: rule.actions || [],
          priority: rule.priority,
          isActive: false, // Default to inactive when cloned
          version: 1,
        },
      });
    });
  }

  // --- VERSIONING ---

  async createVersion(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rule = await this.getRuleById(companyId, id);

      // Deactivate current version
      await tx.workflowRule.update({
        where: { id, companyId },
        data: { isActive: false, name: `${rule.name} (v${rule.version})` },
      });

      // Create new version incrementing the version number
      return tx.workflowRule.create({
        data: {
          companyId,
          name: rule.name.replace(/ \(v\d+\)$/, ''), // Strip old version tags if any
          entityType: rule.entityType,
          trigger: rule.trigger,
          conditions: rule.conditions || [],
          actions: rule.actions || [],
          priority: rule.priority,
          isActive: true, // The new version is the active one
          version: rule.version + 1,
        },
      });
    });
  }

  async getRuleHistory(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.ruleExecutionHistory.findMany({
        where: { companyId, ruleId: id },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  // --- SIMULATION ---

  async simulateRule(companyId: string, dto: SimulateRuleDto) {
    const startTime = Date.now();
    let conditionsNode: any = null;
    let actionsNode: any[] = [];
    let ruleName = 'Simulated Rule';

    if (dto.ruleId) {
      // Simulate existing rule
      const rule = await this.getRuleById(companyId, dto.ruleId);
      conditionsNode = rule.conditions;
      actionsNode = (rule.actions as any[]) || [];
      ruleName = rule.name;
    } else if (dto.ruleDefinition) {
      // Simulate arbitrary definition
      conditionsNode = dto.ruleDefinition.conditions;
      actionsNode = dto.ruleDefinition.actions;
      ruleName = dto.ruleDefinition.name;
    } else {
      throw new Error('Must provide ruleId or ruleDefinition for simulation');
    }

    let isMatch = true;
    let explanation = 'All conditions met.';
    let result = 'PASS';

    try {
      if (conditionsNode && Object.keys(conditionsNode).length > 0) {
        isMatch = this.conditionEngine.evaluate(conditionsNode, dto.entityData);
      }
      if (!isMatch) {
        result = 'FAIL';
        explanation = 'Condition evaluation returned false.';
      }
    } catch (e: any) {
      isMatch = false;
      result = 'FAIL';
      explanation = `Error evaluating rule: ${e.message}`;
    }

    return {
      ruleName,
      result,
      explanation,
      matchedConditions: isMatch ? conditionsNode : null,
      executedActions: isMatch ? actionsNode : [],
      executionTimeMs: Date.now() - startTime,
      simulationMode: true,
      databaseMutated: false, // Explicit guarantee for API consumers
    };
  }

  // --- IMPORT / EXPORT ---

  async exportRules(companyId: string) {
    const rules = await this.getRules(companyId);
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      rules: rules.map((r) => ({
        name: r.name,
        entityType: r.entityType,
        trigger: r.trigger,
        conditions: r.conditions,
        actions: r.actions,
        priority: r.priority,
        version: r.version,
      })),
    };
  }

  async importRules(companyId: string, dto: ImportRulesDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const createdRules = [];
      const skippedRules = [];

      const existingRules = await tx.workflowRule.findMany({
        where: {
          companyId,
          name: { in: dto.rules.map((r) => r.name) },
        },
        select: { name: true, trigger: true },
      });

      const existingSet = new Set(
        existingRules.map((r) => `${r.name}:${r.trigger}`),
      );

      for (const ruleDef of dto.rules) {
        // Simple duplicate detection by Name + Trigger in memory
        if (existingSet.has(`${ruleDef.name}:${ruleDef.trigger}`)) {
          skippedRules.push({ name: ruleDef.name, reason: 'Duplicate found' });
          continue;
        }

        const newRule = await tx.workflowRule.create({
          data: {
            companyId,
            name: ruleDef.name,
            entityType: ruleDef.entityType,
            trigger: ruleDef.trigger,
            conditions: ruleDef.conditions || [],
            actions: ruleDef.actions || [],
            priority: 0,
            version: 1,
            isActive: false, // Imported rules default to inactive
          },
        });
        createdRules.push(newRule);
      }

      return {
        imported: createdRules.length,
        skipped: skippedRules.length,
        skippedDetails: skippedRules,
      };
    });
  }

  // --- EVALUATION ENGINE ---

  async evaluateRules(companyId: string, dto: EvaluateWorkflowDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rules = await tx.workflowRule.findMany({
        where: {
          entityType: dto.entityType,
          trigger: dto.trigger,
          isActive: true,
        },
        orderBy: { priority: 'desc' },
      });

      const triggeredActions = [];

      for (const rule of rules) {
        const startTime = Date.now();
        const conditionsNode = rule.conditions as any;

        let isMatch = true;
        let explanation = 'All conditions met.';
        let result = 'PASS';

        try {
          if (conditionsNode && Object.keys(conditionsNode).length > 0) {
            isMatch = this.conditionEngine.evaluate(
              conditionsNode,
              dto.entityData,
            );
          }
          if (!isMatch) {
            result = 'FAIL';
            explanation = 'Condition evaluation returned false.';
          }
        } catch (e: any) {
          isMatch = false;
          result = 'FAIL';
          explanation = `Error evaluating rule: ${e.message}`;
        }

        if (isMatch) {
          triggeredActions.push(...(rule.actions as any[]));
          this.logger.log(`Rule matched: ${rule.name} executing actions`);
        }

        // Record execution history
        await tx.ruleExecutionHistory.create({
          data: {
            companyId,
            ruleId: rule.id,
            entityId: dto.entityData.id || 'unknown',
            entityType: dto.entityType,
            result,
            explanation,
            matchedConditions: isMatch ? conditionsNode : [],
            executedActions: isMatch ? (rule.actions as any[]) : [],
            executionTimeMs: Date.now() - startTime,
          },
        });

        // Publish internal domain event for successful rule execution
        if (isMatch) {
          this.eventEmitter.emit('workflow.rule.passed', {
            companyId,
            ruleId: rule.id,
            entityType: dto.entityType,
            entityId: dto.entityData.id,
            actions: rule.actions,
            timestamp: new Date().toISOString(),
          });
        } else {
          this.eventEmitter.emit('workflow.rule.failed', {
            companyId,
            ruleId: rule.id,
            entityType: dto.entityType,
            entityId: dto.entityData.id,
            reason: explanation,
            timestamp: new Date().toISOString(),
          });
        }
      }

      return { triggeredActions };
    });
  }
}
