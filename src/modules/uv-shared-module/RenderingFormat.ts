class RenderingFormat {
    static pdf = new RenderingFormat("application/pdf");
    static doc = new RenderingFormat("application/msword");
    static docx = new RenderingFormat("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = RenderingFormat;