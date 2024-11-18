export class TFragment {
  public t: number | [number, number];

  constructor(t: number | [number, number]) {
    this.t = t;
  }

  toString(): string {
    return `${this.t}`;
  }

  static fromString(time: string): TFragment {
    time = time.replace("t=", "");
    if (time.includes(",")) {
      const [start, end] = time.split(",");
      return new TFragment([Number(start), Number(end)]);
    }
    return new TFragment(Number(time));
  }
}
