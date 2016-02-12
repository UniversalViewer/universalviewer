import ICanvas = require("./ICanvas");
import IRange = require("./IRange");

class MultiSelectState {
    ranges: IRange[];
    canvases: ICanvas[];
}

export = MultiSelectState;