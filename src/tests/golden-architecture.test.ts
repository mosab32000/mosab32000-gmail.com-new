import { describe, it, expect } from "vitest";
import { Entity } from "@/domain/shared/entity";
import { ValueObject } from "@/domain/shared/value-object";
import { success, failure, isSuccess, isFailure } from "@/domain/shared/result";
import { ValidationError } from "@/domain/shared/domain-error";

class SampleEntity extends Entity<{ name: string }> {
  constructor(name: string, id?: string) {
    super({ name }, id);
  }
}

class RubricCodeVO extends ValueObject<{ code: string; level: string }> {
  constructor(code: string, level: string) {
    super({ code, level });
  }
}

describe("Golden Reference Architecture: Entity, ValueObject & Result<T, E> Edge Cases", () => {
  it("handles Entity identity equality and edge cases with undefined", () => {
    const ent1 = new SampleEntity("Unit 1", "id-100");
    const ent2 = new SampleEntity("Modified Name", "id-100");
    const ent3 = new SampleEntity("Unit 1", "id-200");

    expect(ent1.equals(ent2)).toBe(true);
    expect(ent1.equals(ent3)).toBe(false);
    expect(ent1.equals(undefined)).toBe(false);
  });

  it("handles ValueObject structural immutability and comparison with undefined", () => {
    const vo1 = new RubricCodeVO("D1", "Distinction");
    const vo2 = new RubricCodeVO("D1", "Distinction");
    const vo3 = new RubricCodeVO("M1", "Merit");

    expect(vo1.equals(vo2)).toBe(true);
    expect(vo1.equals(vo3)).toBe(false);
    expect(vo1.equals(undefined)).toBe(false);
    expect(Object.isFrozen(vo1.props)).toBe(true);
  });

  it("enforces type-safe Result<T, E> guards without throwing exceptions", () => {
    const ok = success<number, ValidationError>(95);
    const err = failure<ValidationError, number>(new ValidationError("Invalid score"));

    expect(isSuccess(ok)).toBe(true);
    expect(isFailure(ok)).toBe(false);
    expect(isFailure(err)).toBe(true);
    expect(isSuccess(err)).toBe(false);
  });
});
