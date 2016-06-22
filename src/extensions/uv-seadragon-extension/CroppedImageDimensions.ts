import Size = Utils.Measurements.Size;
import Point = require("../../modules/uv-shared-module/Point");

class CroppedImageDimensions {
    region: Size = new Size(0, 0);
    regionPos: Point = new Point(0, 0);
    size: Size = new Size(0, 0);
}

export = CroppedImageDimensions;