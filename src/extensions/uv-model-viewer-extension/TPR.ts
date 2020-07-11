// theta, phi, radius
export class TPR {
  public t: string;
  public p: string;
  public r: string;

  constructor(t: string, p: string, r: string) {
    this.t = t;
    this.p = p;
    this.r = r;
  }

  toString(): string {
    return `${this.t},${this.p},${this.r}`;
  }

  toAttributeString(): string {
    return `${this.t}rad ${this.p}rad ${this.r}m`;
  }

  static fromString(tpr: string): TPR {
    tpr = tpr.replace("tpr=", "");
    const tprArr: string[] = tpr.split(",");
    return new TPR(
      tprArr[0],
      tprArr[1],
      tprArr[2]
    );
  }
}
