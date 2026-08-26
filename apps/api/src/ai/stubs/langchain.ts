// Stub for all @langchain/* imports to allow tsc to pass without installing the tier-3 dependencies

export class DynamicTool {
  constructor(public args: any) {}
  name: string = 'mock-tool';
  description: string = 'mock-tool';
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
export class DynamicStructuredTool extends DynamicTool {}
export class AgentExecutor {
  constructor(public args?: any) {}
  invoke(input: any): Promise<any> { return Promise.resolve({ output: 'mock' }); }
}
export function createToolCallingAgent(args?: any): any { return {}; }

export class ChatOpenAI {
  constructor(public args?: any) {}
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
export class AzureChatOpenAI {
  constructor(public args?: any) {}
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
export class ChatAnthropic {
  constructor(public args?: any) {}
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
export class SimpleChatModel {
  constructor(public args?: any) {}
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
export class BaseChatModel {
  constructor(public args?: any) {}
  invoke(input: any): Promise<any> { return Promise.resolve({ content: 'mock' }); }
  stream(input: any): any { return (async function* () { yield { content: 'mock' }; })(); }
  _llmType(): string { return 'mock'; }
}
export class BaseMessage {
  content: string = '';
}
export class HumanMessage extends BaseMessage {
  constructor(public content: any) { super(); }
}
export class SystemMessage extends BaseMessage {
  constructor(public content: any) { super(); }
}
export class ChatPromptTemplate {
  static fromTemplate(template: string) { return new ChatPromptTemplate(); }
  static fromMessages(messages: any[]) { return new ChatPromptTemplate(); }
  format(args: any) { return Promise.resolve('mock'); }
}
export class PromptTemplate {
  static fromTemplate(template: string) { return new PromptTemplate(); }
  format(args: any) { return Promise.resolve('mock'); }
}
export class StringOutputParser {}
export class RunnableSequence {
  static from(runnables: any[]) { return new RunnableSequence(); }
}
export class OpenAIEmbeddings {
  constructor(public args?: any) {}
  embedQuery(query: string) { return Promise.resolve([0, 0, 0]); }
}
export class ChatGoogleGenerativeAI extends BaseChatModel {
  constructor(public args?: any) { super(args); }
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
export class ChatOllama extends BaseChatModel {
  constructor(public args?: any) { super(args); }
  invoke(input: any): Promise<any> { return Promise.resolve('mock'); }
}
