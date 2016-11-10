class SearchResultRect {
    public canvasIndex: number;
    public chars: string;
    public height: number;
    public index: number;
    public isVisible: boolean = true;
    public viewportX: number;
    public viewportY: number;
    public width: number;
    public x: number;
    public y: number;

    constructor(result: any) {
        this.index = result.resource.resultIndex;
        var xywh = result.on.match(/.*xywh=(\d*),(\d*),(\d*),(\d*)/);
        this.x = Number(xywh[1]);
        this.y = Number(xywh[2]);
        this.width = Number(xywh[3]);
        this.height = Number(xywh[4]);
        this.chars = result.resource.chars;
    }
}

export = SearchResultRect;