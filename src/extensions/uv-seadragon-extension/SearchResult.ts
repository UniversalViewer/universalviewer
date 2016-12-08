import SearchResultRect = require("./SearchResultRect");

class SearchResult {
    public canvasIndex: number;
    public rects: SearchResultRect[] = [];

    constructor(resource: any, canvasIndex: number) {
        this.canvasIndex = canvasIndex;
        this.addRect(resource);
    }

    addRect(resource: any): void {
        const rect: SearchResultRect = new SearchResultRect(resource);
        rect.canvasIndex = this.canvasIndex;
        rect.index = this.rects.length;
        this.rects.push(rect);
        // sort ascending
        this.rects.sort((a, b) => {
            return a.index - b.index;
        });
    }
}

export = SearchResult;