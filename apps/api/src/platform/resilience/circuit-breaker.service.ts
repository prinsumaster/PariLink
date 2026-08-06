import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

// ---------------------------------------------------------------------------
// Circuit Breaker with Retry Policy and Bulkhead
//
// Pattern: Netflix Hystrix / resilience4j design applied to Node.js.
//
// States:
//   CLOSED     — Normal operation. Failures increment counter.
//   OPEN       — Rejecting all calls. Entered after FAILURE_THRESHOLD failures.
//   HALF_OPEN  — Testing one probe call. Success → CLOSED, failure → OPEN.
//
// Retry Policy:
//   Exponential backoff with jitter. Max 3 retries by default.
//   Only retried on transient errors (not 4xx HTTP errors).
//
// Bulkhead:
//   Each integration has a separate concurrency limit.
//   Prevents one slow integration from exhausting the thread pool.
// ---------------------------------------------------------------------------

interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  lastFailureAt: number;
  lastProbeAt?: number;
  concurrentCalls: number;
}

export interface CircuitBreakerOptions {
  failureThreshold?: number; // failures before OPEN (default: 5)
  resetTimeoutMs?: number; // time in OPEN before trying HALF_OPEN (default: 30s)
  maxConcurrent?: number; // bulkhead: max parallel calls (default: 10)
  retryCount?: number; // max retry attempts (default: 3)
  retryBaseDelayMs?: number; // base delay for exponential backoff (default: 200ms)
}

const DEFAULT_OPTIONS: Required<CircuitBreakerOptions> = {
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
  maxConcurrent: 10,
  retryCount: 3,
  retryBaseDelayMs: 200,
};

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly states = new Map<string, CircuitBreakerState>();
  private readonly options = new Map<string, Required<CircuitBreakerOptions>>();

  /** Configure a named circuit (call once at module init or on first use). */
  configure(name: string, opts: CircuitBreakerOptions): void {
    this.options.set(name, { ...DEFAULT_OPTIONS, ...opts });
  }

  /**
   * Execute `action` inside a circuit breaker + retry wrapper.
   * @param name    Unique identifier for this integration (e.g., 'LOCONAV', 'QUICKBOOKS')
   * @param action  The async operation to execute
   * @param opts    Per-call overrides (optional)
   */
  async execute<T>(
    name: string,
    action: () => Promise<T>,
    opts?: CircuitBreakerOptions,
  ): Promise<T> {
    const cfg: Required<CircuitBreakerOptions> = {
      ...DEFAULT_OPTIONS,
      ...(this.options.get(name) ?? {}),
      ...(opts ?? {}),
    };

    const state = this.getState(name);

    // Bulkhead check
    if (state.concurrentCalls >= cfg.maxConcurrent) {
      throw new ServiceUnavailableException(
        `[Bulkhead] Integration "${name}" at max concurrency (${cfg.maxConcurrent})`,
      );
    }

    // Circuit open check
    const now = Date.now();
    if (state.status === 'OPEN') {
      if (now - state.lastFailureAt < cfg.resetTimeoutMs) {
        throw new ServiceUnavailableException(
          `[CircuitBreaker] "${name}" is OPEN — pausing calls`,
        );
      }
      // Transition to HALF_OPEN for probe
      state.status = 'HALF_OPEN';
      state.lastProbeAt = now;
      this.logger.log(`[CircuitBreaker] "${name}" entering HALF_OPEN (probe)`);
    }

    state.concurrentCalls++;
    try {
      const result = await this.withRetry(name, action, cfg);
      this.onSuccess(name, state);
      return result;
    } catch (error) {
      this.onFailure(name, state, cfg);
      throw error;
    } finally {
      state.concurrentCalls = Math.max(0, state.concurrentCalls - 1);
    }
  }

  getStatus(name: string): {
    status: string;
    failures: number;
    concurrent: number;
  } {
    const s = this.states.get(name);
    return s
      ? {
          status: s.status,
          failures: s.failures,
          concurrent: s.concurrentCalls,
        }
      : { status: 'CLOSED', failures: 0, concurrent: 0 };
  }

  // ─────────────────────────────────────────────────────────────────────────
  private async withRetry<T>(
    name: string,
    action: () => Promise<T>,
    cfg: Required<CircuitBreakerOptions>,
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= cfg.retryCount; attempt++) {
      try {
        return await action();
      } catch (err: any) {
        lastError = err;
        // Don't retry client errors (4xx)
        if (err?.status >= 400 && err?.status < 500) throw err;
        if (attempt < cfg.retryCount) {
          // Exponential backoff with ±20% jitter
          const delay = cfg.retryBaseDelayMs * Math.pow(2, attempt);
          const jitter = delay * (0.8 + Math.random() * 0.4);
          this.logger.warn(
            `[Retry] "${name}" attempt ${attempt + 1}/${cfg.retryCount} failed — retrying in ${Math.round(jitter)}ms`,
          );
          await this.sleep(jitter);
        }
      }
    }
    throw lastError;
  }

  private onSuccess(name: string, state: CircuitBreakerState): void {
    if (state.status !== 'CLOSED') {
      this.logger.log(`[CircuitBreaker] "${name}" CLOSED (recovered)`);
    }
    state.status = 'CLOSED';
    state.failures = 0;
  }

  private onFailure(
    name: string,
    state: CircuitBreakerState,
    cfg: Required<CircuitBreakerOptions>,
  ): void {
    state.failures++;
    state.lastFailureAt = Date.now();

    if (state.status === 'HALF_OPEN') {
      state.status = 'OPEN';
      this.logger.error(
        `[CircuitBreaker] "${name}" probe failed — returning to OPEN`,
      );
      return;
    }

    if (state.failures >= cfg.failureThreshold) {
      state.status = 'OPEN';
      this.logger.error(
        `[CircuitBreaker] "${name}" TRIPPED (OPEN) after ${state.failures} failures`,
      );
    }
  }

  private getState(name: string): CircuitBreakerState {
    if (!this.states.has(name)) {
      this.states.set(name, {
        status: 'CLOSED',
        failures: 0,
        lastFailureAt: 0,
        concurrentCalls: 0,
      });
    }
    return this.states.get(name)!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
