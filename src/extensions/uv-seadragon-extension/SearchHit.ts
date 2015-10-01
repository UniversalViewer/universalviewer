import IProvider = require("../../modules/uv-shared-module/IProvider");
import SearchHitRect = require("./SearchHitRect");

class SearchHit {
    public canvasIndex: number;
    public rects: SearchHitRect[] = [];

    constructor(resource: any, provider: IProvider) {
        this.canvasIndex = provider.getCanvasIndexById(resource.on.match(/(.*)#/)[1]);
        this.addRect(resource);
    }

    addRect(resource: any): void {
        var rect = new SearchHitRect(resource);
        this.rects.push(rect);
        // sort ascending
        this.rects.sort(function(a, b) {
            return a.index - b.index;
        });
    }
}

export = SearchHit;