import { Injectable, Logger } from '@nestjs/common';
import { MockAIProvider } from './providers/mock-ai.provider';

@Injectable()
export class WorkflowGeneratorService {
  private readonly logger = new Logger(WorkflowGeneratorService.name);

  constructor(private readonly gemini: MockAIProvider) {}

  async generateWorkflowGraph(prompt: string) {
    this.logger.log(`Generating AI Workflow for prompt: ${prompt}`);

    const systemInstruction = `
      You are an Enterprise Workflow Automation expert.
      Generate a JSON Directed Acyclic Graph (DAG) for a workflow based on the user's prompt.
      The output must be EXACTLY a valid JSON object with 'nodes' and 'edges' arrays.
      Nodes must have id, type ('TRIGGER', 'CONDITION', 'ACTION', 'DELAY'), position {x,y}, and data object.
      Edges must have id, source, target.
      Only return JSON, nothing else.
    `;

    try {
      const response = await this.gemini.chat(prompt, systemInstruction);

      // Extract JSON from markdown if needed
      const jsonStr = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(jsonStr);
    } catch (e: any) {
      this.logger.error(`AI Workflow generation failed: ${e.message}`);
      // Fallback to a basic graph if AI fails
      return {
        nodes: [
          {
            id: '1',
            type: 'TRIGGER',
            position: { x: 250, y: 50 },
            data: { label: 'Generated Trigger' },
          },
          {
            id: '2',
            type: 'ACTION',
            position: { x: 250, y: 150 },
            data: { label: 'Generated Action' },
          },
        ],
        edges: [{ id: 'e1-2', source: '1', target: '2' }],
      };
    }
  }
}
