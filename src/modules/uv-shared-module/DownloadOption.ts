class DownloadOption {
    static currentViewAsJpg = new DownloadOption("currentViewAsJpg");
    static dynamicCanvasRenderings = new DownloadOption("dynamicCanvasRenderings");
    static dynamicImageRenderings = new DownloadOption("dynamicImageRenderings");
    static dynamicSequenceRenderings = new DownloadOption("dynamicSequenceRenderings");
    static entireFileAsOriginal = new DownloadOption("entireFileAsOriginal");
    static selection = new DownloadOption("selection");
    static wholeImageHighRes = new DownloadOption("wholeImageHighRes");
    static wholeImageLowResAsJpg = new DownloadOption("wholeImageLowResAsJpg");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = DownloadOption;