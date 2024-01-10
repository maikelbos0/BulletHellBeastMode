import { Coordinates } from './coordinates.js';

export class Polygon {
    readonly anchor: Coordinates;
    readonly points: Coordinates[];

    constructor(anchor: Coordinates, ...points: Coordinates[]) {
        if (points.length < 3) {
            throw new Error("Polygon requires at least 3 coordinates")
        }

        this.anchor = anchor;
        this.points = points;
    }
}
