import { Coordinates } from './coordinates.js';
import { LineSegment } from './line-segment.js';
import { RenderingContext } from './rendering-context.js';

export class Polygon {
    readonly coordinates: Coordinates[];
    readonly centerPoint: Coordinates;

    constructor(...coordinates: Coordinates[]) {
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

            for (let j = i + 1; j < coordinateCount; j++) {
                // TODO add equals method?
                if (a.x === coordinates[j].x && a.y === coordinates[j].y) {
                    throw new Error("Polygon must be convex");
                }
            }
        }

        for (let i = 0; i < midPoints.length - 1; i++) {
            for (let j = i + 1; j < midPoints.length; j++) {
                let c = midPoints[i];
                let d = midPoints[j];

                if (sides.filter(side => side.intersectsLine(c, d)).length > 2) {
                    throw new Error("Polygon must be convex");
                }
            }
        }

        this.coordinates = coordinates;
        this.centerPoint = coordinates.reduce((c, coordinates) => c.add(coordinates), new Coordinates(0, 0));
        // TODO add divide operator?
        this.centerPoint = new Coordinates(this.centerPoint.x / coordinateCount, this.centerPoint.y / coordinateCount);
    }

    render(context: RenderingContext, deadForDuration: number | undefined): void {

        const startingCoordinates = this.transformCoordinates(this.coordinates[this.coordinates.length - 1], deadForDuration);
        context.moveTo(startingCoordinates.x, startingCoordinates.y);

        this.coordinates.forEach(coordinates => {
            const transformedCoordinates = this.transformCoordinates(coordinates, deadForDuration);
            context.lineTo(transformedCoordinates.x, transformedCoordinates.y);
        });
    }

    transformCoordinates(coordinates: Coordinates, deadForDuration: number | undefined): Coordinates {
        if (deadForDuration === undefined) {
            return coordinates;
        }

        const scale = 1 / (1 + deadForDuration);
        const driftSpeed = Math.sqrt(deadForDuration) * 5;

        return new Coordinates(
            scale * coordinates.x + driftSpeed * this.centerPoint.x,
            scale * coordinates.y + driftSpeed * this.centerPoint.y
        );
    }
}
