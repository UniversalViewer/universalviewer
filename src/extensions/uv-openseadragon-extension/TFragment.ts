export class TFragment {
  public t: number;

  constructor(t: number) {
    this.t = t;
  }

  toString(): string {
    return `${this.t}`;
  }

  static fromString(time: string): TFragment {
    time = time.replace("t=", "");
    return new TFragment(Number(time));
  }
}
