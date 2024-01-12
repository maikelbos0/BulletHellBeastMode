import { Coordinates } from './coordinates.js';

// TODO maybe merge with renderable
export class ShapeGroup {
    readonly anchor: Coordinates;

    constructor(anchor: Coordinates) {
        this.anchor = anchor;
    }
}