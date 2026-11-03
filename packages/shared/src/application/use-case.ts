import { Result } from "../domain/result";
import { DomainError } from "../domain/domain-error";
import { ExecutionContext } from "./execution-context";

/**
 * Application layer UseCase contract.
 * Implementations must remain free of HTTP, Prisma, Kafka, or vendor SDK imports.
 */
export interface UseCase<TInput, TOutput> {
  execute(context: ExecutionContext, input: TInput): Promise<Result<TOutput, DomainError>>;
}
