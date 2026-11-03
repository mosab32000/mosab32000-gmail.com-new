/**
 * Base Entity class ensuring stable identity equality independent of mutable attributes.
 */
export abstract class Entity<Props> {
  protected readonly _id: string;
  protected readonly props: Props;

  protected constructor(props: Props, id?: string) {
    this._id = id ?? `ent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.props = Object.freeze({ ...props });
  }

  public get id(): string {
    return this._id;
  }

  public equals(object?: Entity<Props>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!(object instanceof Entity)) {
      return false;
    }
    return this._id === object._id;
  }
}
