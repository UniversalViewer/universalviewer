export class Bounds {

    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    toString(): string {
        return `${this.x},${this.y},${this.w},${this.h}`
    }

    static fromString(bounds: string): Bounds {
        var boundsArr: string[] = bounds.split(',');
        return new Bounds(Number(boundsArr[0]), Number(boundsArr[1]), Number(boundsArr[2]), Number(boundsArr[3]));
    }
}
