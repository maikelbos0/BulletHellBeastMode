import { Coordinates } from './coordinates.js';
import { LineSegment } from './line-segment.js';
import { RenderingContext } from './rendering-context.js';
import { Transformation } from "./transformation.js";

export class Polygon {
    static readonly maximumRotationWhenDead: number = Math.PI * 2;

    readonly coordinates: Coordinates[];
    readonly centerPoint: Coordinates;
    readonly rotationWhenDead: number;

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
                if (a.equals(coordinates[j])) {
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
        this.centerPoint = coordinates.reduce((c, coordinates) => c.add(coordinates), new Coordinates(0, 0)).divide(coordinateCount);
        this.rotationWhenDead = Math.random() * Polygon.maximumRotationWhenDead * 2 - Polygon.maximumRotationWhenDead;
    }

    // TODO perhaps refactor - map coordinates around center point and only add transformations in if, it saves a bunch of math in the render loop when dead
    render(context: RenderingContext, deadForDuration: number | undefined): void {
        if (deadForDuration === undefined) {
            context.moveTo(this.coordinates[this.coordinates.length - 1]);

            this.coordinates.forEach(coordinates => {
                context.lineTo(coordinates);
            });
        }
        else {
            context.transform
                (() => {
                    context.moveTo(this.transformCoordinates(this.coordinates[this.coordinates.length - 1]));

                    this.coordinates.forEach(coordinates => {
                        context.lineTo(this.transformCoordinates(coordinates));
                    });
                },
                Transformation.translate(this.centerPoint.multiply(1 + Math.sqrt(deadForDuration) * 5)), // TODO make drift variable
                Transformation.rotate(deadForDuration * this.rotationWhenDead),
                Transformation.scale(1 / (1 + deadForDuration))
            );
        }
    }

    transformCoordinates(coordinates: Coordinates): Coordinates {
        return new Coordinates(
            coordinates.x - this.centerPoint.x,
            coordinates.y - this.centerPoint.y
        );
    }
}
