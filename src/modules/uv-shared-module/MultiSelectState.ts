import ICanvas = require("./ICanvas");
import IRange = require("./IRange");

class MultiSelectState {
    enabled: boolean;
    ranges: IRange[];
    canvases: ICanvas[];
}

export = MultiSelectState;