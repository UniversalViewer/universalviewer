export class DownloadOption {
    static currentViewAsJpg = new DownloadOption("currentViewAsJpg");
    static dynamicCanvasRenderings = new DownloadOption("dynamicCanvasRenderings");
    static dynamicImageRenderings = new DownloadOption("dynamicImageRenderings");
    static dynamicSequenceRenderings = new DownloadOption("dynamicSequenceRenderings");
    static entireFileAsOriginal = new DownloadOption("entireFileAsOriginal");
    static rangeRendering = new DownloadOption("rangeRendering");
    static selection = new DownloadOption("selection");
    static wholeImageHighRes = new DownloadOption("wholeImageHighRes");
    static wholeImageLowResAsJpg = new DownloadOption("wholeImageLowResAsJpg");
    static wholeImagesHighRes = new DownloadOption("wholeImagesHighRes");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}