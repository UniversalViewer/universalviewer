class RenderingFormat {
    static pdf = new RenderingFormat("application/pdf");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = RenderingFormat;