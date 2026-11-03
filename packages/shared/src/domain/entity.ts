/**
 * Base Entity contract enforcing identity equality and audit timestamps.
 */
export abstract class Entity<TProps> {
  protected readonly props: TProps;
  public readonly id: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  protected constructor(props: TProps, id: string, createdAt?: string, updatedAt?: string) {
    this.id = id;
    this.props = Object.freeze({ ...props });
    const now = new Date().toISOString();
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;
  }

  public equals(other?: Entity<TProps>): boolean {
    if (!other || !(other instanceof Entity)) {
      return false;
    }
    return this.id === other.id;
  }
}
