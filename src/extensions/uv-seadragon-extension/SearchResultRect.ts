class SearchResultRect {
    public index: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(result: any) {
        this.index = result.resource.resultIndex;
        var xywh = result.on.match(/.*xywh=(\d*),(\d*),(\d*),(\d*)/);
        this.x = xywh[1];
        this.y = xywh[2];
        this.width = xywh[3];
        this.height = xywh[4];
    }
}

export = SearchResultRect;