import { ShapeGroup } from './shape-group.js';
import { Coordinates } from './coordinates.js';

export class Polygon {
    readonly shapeGroup: ShapeGroup;
    readonly coordinates: Coordinates[];

    constructor(shapeGroup: ShapeGroup, ...coordinates: Coordinates[]) {
        const coordinateCount = coordinates.length;
        const angles: number[] = [];

        if (coordinateCount  < 3) {
            throw new Error("Polygon requires at least 3 coordinates")
        }

        this.shapeGroup = shapeGroup;
        this.coordinates = coordinates;
    }
}
