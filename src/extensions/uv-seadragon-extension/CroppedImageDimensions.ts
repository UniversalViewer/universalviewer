import Size = Utils.Measurements.Size;
import Vector = Utils.Maths.Vector;

class CroppedImageDimensions {
    region: Size = new Size(0, 0);
    regionPos: Vector = new Vector(0, 0);
    size: Size = new Size(0, 0);
}

export = CroppedImageDimensions;