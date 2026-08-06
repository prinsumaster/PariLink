import { z } from 'zod';

export const AiDecisionProposalSchema = z.object({
  category: z.enum([
    'ASSIGNMENT',
    'ROUTING',
    'MAINTENANCE',
    'FINANCE',
    'OPERATIONS',
  ]),
  actionIntent: z
    .string()
    .describe(
      'The specific system action to execute, e.g., ASSIGN_DRIVER_JD442_TO_TRIP_801',
    ),
  riskLevel: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .describe(
      'LOW: Auto-execute. MEDIUM: One-click approve. HIGH: Requires manual review.',
    ),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score from 0.0 to 1.0'),
  businessImpact: z
    .string()
    .describe(
      'Explanation of how this impacts operations (e.g., Saves 45 minutes of delay)',
    ),
  costImpact: z
    .string()
    .describe(
      'Financial impact (e.g., Saves $120 in fuel, avoids $500 SLA penalty)',
    ),
  reasoning: z
    .string()
    .describe(
      'Detailed explanation of WHY this decision was made and WHY NOW.',
    ),
  alternativeOptions: z
    .array(z.string())
    .describe('List of other options considered and why they were rejected.'),
  expectedOutcome: z
    .string()
    .describe('What will happen if this decision is executed.'),
  rollbackStrategy: z
    .string()
    .describe('How to reverse this action if it causes an issue.'),
});

export type AiDecisionProposal = z.infer<typeof AiDecisionProposalSchema>;
