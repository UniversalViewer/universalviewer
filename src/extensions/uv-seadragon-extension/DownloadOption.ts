class DownloadOption {
    static currentViewAsJpg = new DownloadOption("currentViewAsJpg");
    static entireDocumentAsPDF = new DownloadOption("entireDocumentAsPDF");
    static wholeImageHighResAsJpg = new DownloadOption("wholeImageHighResAsJpg");
    static wholeImageLowResAsJpg = new DownloadOption("wholeImageLowResAsJpg");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = DownloadOption;