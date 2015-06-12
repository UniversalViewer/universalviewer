class CanvasType {
    static audio = new CanvasType("ixif:audio");
    static canvas = new CanvasType("sc:canvas");
    static pdf = new CanvasType("ixif:pdf");
    static video = new CanvasType("ixif:video");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = CanvasType;