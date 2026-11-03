/**
 * Unified Domain Error hierarchy for strict typed error handling without generic Error throwing.
 */
export abstract class DomainError {
  abstract readonly code: string;
  readonly timestamp: string;

  constructor(
    public readonly message: string,
    public readonly details?: Record<string, unknown>
  ) {
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";
}

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";
}

export class UnauthorizedError extends DomainError {
  readonly code = "UNAUTHORIZED_ERROR";
}

export class ForbiddenRoleError extends DomainError {
  readonly code = "FORBIDDEN_ROLE_ERROR";
}

export class TenantIsolationError extends DomainError {
  readonly code = "TENANT_ISOLATION_VIOLATION";
}

export class ConflictError extends DomainError {
  readonly code = "CONFLICT_ERROR";
}

export class EvaluationError extends DomainError {
  readonly code = "EVALUATION_ERROR";
}

export class LabExecutionError extends DomainError {
  readonly code = "LAB_EXECUTION_ERROR";
}
