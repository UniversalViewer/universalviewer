export declare class Orbit {
    t: string;
    p: string;
    r: string;
    constructor(t: string, p: string, r: string);
    toString(): string;
    toAttributeString(): string;
    static fromString(orbit: string): Orbit;
}
