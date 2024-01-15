import { Anchor } from './anchor.js';
import { Coordinates } from './coordinates.js';
import { LineSegment } from './line-segment.js';

export class Polygon {
    readonly anchor: Anchor;
    readonly coordinates: Coordinates[];
    readonly centerPoint: Coordinates;

    constructor(anchor: Anchor, ...coordinates: Coordinates[]) {
        const coordinateCount = coordinates.length;

        if (coordinateCount < 3) {
            throw new Error("Polygon requires at least 3 coordinates");
        }

        const midPoints: Coordinates[] = [];
        const sides: LineSegment[] = [];

        for (let i = 0; i < coordinateCount; i++) {
            const a = coordinates[i];
            const b = coordinates[(i + 1) % coordinateCount];

            midPoints.push(new Coordinates((a.x + b.x) / 2, (a.y + b.y) / 2));
            sides.push(new LineSegment(a, b));
        }

        for (let i = 0; i < midPoints.length - 1; i++) {
            for (let j = i + 1; j < midPoints.length; j++) {
                let c = midPoints[i];
                let d = midPoints[j];

                if (sides.reduce((n, side) => side.intersectsLine(c, d) ? n + 1 : n, 0) > 2) {
                    throw new Error("Polygon must be convex");
                }
            }
        }

        this.anchor = anchor;
        this.coordinates = coordinates;
        this.centerPoint = coordinates.reduce((c, coordinates) => c.add(coordinates), new Coordinates(0, 0));
        this.centerPoint = new Coordinates(this.centerPoint.x / coordinateCount, this.centerPoint.y / coordinateCount);
    }

    render(context: CanvasRenderingContext2D): void {
        const startingCoordinates = this.coordinates[this.coordinates.length - 1];
        context.moveTo(startingCoordinates.x, startingCoordinates.y);

        this.coordinates.forEach(coordinates => {
            context.lineTo(coordinates.x, coordinates.y);
        });
    }
}
