class Mode {
    static image = new Mode("image");
    static page = new Mode("page");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = Mode;