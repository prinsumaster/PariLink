import { api } from './api';

export const aiApi = {
  // Recommendations & Interaction
  getRecommendation: (domain: string, id: string, prompt: string) => api.post(`/ai/recommend/${domain}/${id}`, { prompt }),
  interactWithAgent: (intent: string, domain: string, id: string) => api.post('/ai/interact', { intent, domain, id }),
  acceptRecommendation: (id: string) => api.post(`/ai/recommendation/${id}/accept`),
  getMetrics: () => api.get('/ai/metrics'),
  
  // Copilot Chat
  getSessions: () => api.get('/ai/copilot/sessions'),
  createSession: (title?: string) => api.post('/ai/copilot/sessions', { title }),
  getMessages: (sessionId: string) => api.get(`/ai/copilot/sessions/${sessionId}/messages`),
  chat: (sessionId: string, message: string) => api.post(`/ai/copilot/sessions/${sessionId}/chat`, { message }),
  getDailyBrief: () => api.get('/ai/copilot/daily-brief'),
  
  // Workflows
  listWorkflowExecutions: () => api.get('/ai/workflow/executions'),
  executeWorkflow: (workflowName: string, input: any) => api.post('/ai/workflow/execute', { workflowName, input }),
  approveWorkflowStep: (executionId: string, stepId: string) => api.post(`/ai/workflow/execution/${executionId}/approve/${stepId}`),
  rejectWorkflowStep: (executionId: string, stepId: string, reason: string) => api.post(`/ai/workflow/execution/${executionId}/reject/${stepId}`, { reason }),
  
  // Agents & Models
  listAgents: () => api.get('/ai/agents'),
  listModels: () => api.get('/ai/models'),
  listPromptTemplates: () => api.get('/ai/models/templates'),
  getAgentHealth: (agentName: string) => api.get(`/ai/agents/${agentName}/health`),
  
  // Memory
  getMemoryStats: () => api.get('/ai/memory/stats'),
  setWorkspaceMemory: (key: string, value: any) => api.post('/ai/memory/workspace', { key, value }),
  
  // Governance
  getComplianceReport: () => api.get('/ai/governance/compliance-report'),
  
  // Feedback
  submitFeedback: (interactionId: string, rating: number, comment?: string) => api.post('/ai/feedback', { interactionId, rating, comment }),
  reportHallucination: (interactionId: string, description: string, severity: string) => api.post('/ai/report-hallucination', { interactionId, description, severity }),
};
