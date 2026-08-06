export interface ExecutionContext {
  workflowId: string;
  runId: string;
  attempt: number;
  tenantId: string;
  userId?: string;
  logger: any; // In production, this would be a Temporal Logger or Winston instance
}

/**
 * The standard interface that every executable service in PariLink must implement.
 * This guarantees a unified lifecycle for Workflow Tasks, AI Prompts, and Scheduled Jobs.
 */
export interface PlatformExecutable<TInput, TOutput> {
  /** Setup phase before execution (e.g. fetching necessary state) */
  initialize(context: ExecutionContext): Promise<void>;

  /** Schema and permission validation */
  validate(payload: TInput): Promise<boolean>;

  /** The core idempotent business logic */
  execute(payload: TInput): Promise<TOutput>;

  /** Saga compensation logic if the workflow fails downstream */
  compensate(payload: TInput, error: Error): Promise<void>;

  /** Teardown (closing temporary connections, etc) */
  cleanup(): Promise<void>;
}
