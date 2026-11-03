import { Result } from "../domain/result";
import { DomainError } from "../domain/domain-error";
import { ExecutionContext } from "./execution-context";

/**
 * Generic Repository Port enforcing tenant/school isolation on every persistence operation.
 */
export interface RepositoryPort<TEntity> {
  findById(context: ExecutionContext, id: string): Promise<Result<TEntity | null, DomainError>>;
  save(context: ExecutionContext, entity: TEntity): Promise<Result<TEntity, DomainError>>;
  deleteById(context: ExecutionContext, id: string): Promise<Result<boolean, DomainError>>;
}
