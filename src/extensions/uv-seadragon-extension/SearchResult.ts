import SearchResultRect = require("./SearchResultRect");

class SearchResult {
    public canvasIndex: number;
    public rects: SearchResultRect[] = [];

    constructor(resource: any, helper: Manifold.IHelper) {
        this.canvasIndex = helper.getCanvasIndexById(resource.on.match(/(.*)#/)[1]);
        this.addRect(resource);
    }

    addRect(resource: any): void {
        var rect: SearchResultRect = new SearchResultRect(resource);
        rect.canvasIndex = this.canvasIndex;
        this.rects.push(rect);
        // sort ascending
        this.rects.sort(function(a, b) {
            return a.index - b.index;
        });
    }
}

export = SearchResult;