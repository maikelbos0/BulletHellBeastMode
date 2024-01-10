import { Coordinates } from './coordinates.js';

export class Polygon {
    readonly anchor: Coordinates;
    readonly coordinates: Coordinates[];

    constructor(anchor: Coordinates, ...coordinates: Coordinates[]) {
        this.anchor = anchor;
        this.coordinates = coordinates;
    }
}
