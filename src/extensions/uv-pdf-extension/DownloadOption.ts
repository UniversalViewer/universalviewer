class DownloadOption {
    static entireFileAsOriginal = new DownloadOption("entireFileAsOriginal");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = DownloadOption;