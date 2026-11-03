/**
 * Specific DomainError hierarchy for expected failures across Domain and Application layers.
 * Never throw generic Error for domain control flow.
 */
export abstract class DomainError {
  public abstract readonly code: string;
  public readonly timestamp: string;

  public constructor(
    public readonly message: string,
    public readonly details?: Readonly<Record<string, unknown>>,
  ) {
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends DomainError {
  public readonly code = "VALIDATION_ERROR";
}

export class NotFoundError extends DomainError {
  public readonly code = "NOT_FOUND";
}

export class ConflictError extends DomainError {
  public readonly code = "CONFLICT_ERROR";
}

export class AuthorizationError extends DomainError {
  public readonly code = "AUTHORIZATION_ERROR";
}

export class InfrastructureError extends DomainError {
  public readonly code = "INFRASTRUCTURE_ERROR";
}
