/**
 * Base ValueObject contract enforcing structural immutability and value equality.
 */
export abstract class ValueObject<TProps extends Record<string, unknown>> {
  public readonly props: Readonly<TProps>;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  public equals(other?: ValueObject<TProps>): boolean {
    if (!other || !other.props) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
