"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiDecisionProposalSchema = void 0;
var zod_1 = require("zod");
exports.AiDecisionProposalSchema = zod_1.z.object({
    category: zod_1.z.enum([
        'ASSIGNMENT',
        'ROUTING',
        'MAINTENANCE',
        'FINANCE',
        'OPERATIONS',
    ]),
    actionIntent: zod_1.z
        .string()
        .describe('The specific system action to execute, e.g., ASSIGN_DRIVER_JD442_TO_TRIP_801'),
    riskLevel: zod_1.z
        .enum(['LOW', 'MEDIUM', 'HIGH'])
        .describe('LOW: Auto-execute. MEDIUM: One-click approve. HIGH: Requires manual review.'),
    confidenceScore: zod_1.z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score from 0.0 to 1.0'),
    businessImpact: zod_1.z
        .string()
        .describe('Explanation of how this impacts operations (e.g., Saves 45 minutes of delay)'),
    costImpact: zod_1.z
        .string()
        .describe('Financial impact (e.g., Saves $120 in fuel, avoids $500 SLA penalty)'),
    reasoning: zod_1.z
        .string()
        .describe('Detailed explanation of WHY this decision was made and WHY NOW.'),
    alternativeOptions: zod_1.z
        .array(zod_1.z.string())
        .describe('List of other options considered and why they were rejected.'),
    expectedOutcome: zod_1.z
        .string()
        .describe('What will happen if this decision is executed.'),
    rollbackStrategy: zod_1.z
        .string()
        .describe('How to reverse this action if it causes an issue.'),
});
