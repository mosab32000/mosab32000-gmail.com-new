import { Result } from "@/domain/shared/result";
import { DomainError } from "@/domain/shared/domain-error";
import { ExecutionContext } from "@/application/execution-context";

/**
 * Abstract Repository Port in the Application Layer, decoupled from specific ORMs or databases.
 */
export interface RepositoryPort<T> {
  findById(id: string, context: ExecutionContext): Promise<Result<T | null, DomainError>>;
  findAllByTenant(tenantId: string, context: ExecutionContext): Promise<Result<readonly T[], DomainError>>;
  save(entity: T, context: ExecutionContext): Promise<Result<T, DomainError>>;
}

/**
 * Unified CQRS UseCase Contract enforcing ExecutionContext and Result<Output, DomainError>.
 */
export interface UseCase<Input, Output> {
  execute(input: Input, context: ExecutionContext): Promise<Result<Output, DomainError>>;
}
