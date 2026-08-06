import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';

@Injectable()
export class DeveloperAgent extends BaseAgent {
  readonly agentName = 'DeveloperAgent';
  readonly roleDescription =
    'Expert PariLink platform developer assistant. Has deep knowledge of the NestJS backend, Next.js frontend, Prisma schema, REST API, Marketplace SDK, and Integration Hub. Provides typed code examples and architectural guidance.';

  constructor(llmManager: LlmManagerService) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'lookup_api_endpoint',
      description:
        'Look up information about a PariLink API endpoint. Input: {"module": "loads|trips|drivers|ai|marketplace|integrations|billing", "operation": "string?"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const endpoints: Record<string, string> = {
          loads:
            'GET /api/v1/loads — List loads\nPOST /api/v1/loads — Create load\nGET /api/v1/loads/:id — Get load\nPUT /api/v1/loads/:id — Update load\nDELETE /api/v1/loads/:id — Delete load',
          trips:
            'GET /api/v1/trips — List trips\nPOST /api/v1/trips — Create trip\nGET /api/v1/trips/:id — Get trip\nPOST /api/v1/trips/:id/start — Start trip',
          ai: 'POST /api/v1/ai/interact — Chat with AI agent\nPOST /api/v1/ai/recommend/:domain/:id — Get recommendation\nGET /api/v1/ai/metrics — AI platform metrics\nPOST /api/v1/ai/copilot/sessions/:id/chat — Copilot chat',
          marketplace:
            'GET /api/v1/marketplace/apps — List marketplace apps\nPOST /api/v1/marketplace/install — Install app\nGET /api/v1/marketplace/installed — Installed apps',
        };
        return (
          endpoints[parsed.module] ||
          `API reference for ${parsed.module}: Visit /api/docs for full interactive Swagger documentation.`
        );
      },
    }),
    new DynamicTool({
      name: 'generate_sdk_example',
      description:
        'Generate a code example for using a PariLink capability. Input: {"capability": "string", "language": "typescript|javascript|python"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        if (parsed.capability.toLowerCase().includes('ai')) {
          return `// PariLink AI Copilot Chat Example (${parsed.language})
const response = await fetch('/api/v1/ai/copilot/sessions/[SESSION_ID]/chat', {
  method: 'POST',
  headers: { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Summarize today\\'s active loads' })
});
const { aiMessage, citations } = await response.json();`;
        }
        return `// PariLink SDK Example for: ${parsed.capability}
// Full API documentation: GET /api/docs
// Authentication: Bearer JWT token required
// See the PariLink Knowledge Hub for detailed examples.`;
      },
    }),
  ];
}
