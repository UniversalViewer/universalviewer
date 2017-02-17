import Size = Utils.Measurements.Size;
import {Point} from "../../modules/uv-shared-module/Point";

export class CroppedImageDimensions {
    region: Size = new Size(0, 0);
    regionPos: Point = new Point(0, 0);
    size: Size = new Size(0, 0);
}