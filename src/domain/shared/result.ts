/**
 * Standard Result pattern implementation for type-safe error handling without throwing.
 */
export type Result<T, E> = 
  | { readonly isSuccess: true; readonly isFailure: false; readonly value: T }
  | { readonly isSuccess: false; readonly isFailure: true; readonly error: E };

export function success<T, E = never>(value: T): Result<T, E> {
  return { isSuccess: true, isFailure: false, value };
}

export function failure<E, T = never>(error: E): Result<T, E> {
  return { isSuccess: false, isFailure: true, error };
}

export function isSuccess<T, E>(result: Result<T, E>): result is { readonly isSuccess: true; readonly isFailure: false; readonly value: T } {
  return result.isSuccess;
}

export function isFailure<T, E>(result: Result<T, E>): result is { readonly isSuccess: false; readonly isFailure: true; readonly error: E } {
  return result.isFailure;
}
