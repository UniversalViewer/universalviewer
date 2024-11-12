// theta, phi, radius
export class Orbit {
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

  static fromString(orbit: string): Orbit {
    orbit = orbit.replace("orbit=", "");
    const orbitArr: string[] = orbit.split(",");
    return new Orbit(orbitArr[0], orbitArr[1], orbitArr[2]);
  }
}
