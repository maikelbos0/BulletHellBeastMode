import { Color } from "../src/color";
import { Coordinates } from "../src/coordinates";
import { Polygon } from "../src/polygon";
import { RenderableObject } from "../src/renderable-object";

export class RenderableTestObject extends RenderableObject {
    readonly polygons: Polygon[] = [];

    readonly color: Color = new Color(0, 0, 0);

    constructor() {
        super(new Coordinates(0, 0));
    }

    processFrameTransform(duration: number): void { }
}
