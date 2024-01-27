import { Coordinates } from './coordinates.js';
import { LineSegment } from './line-segment.js';
import { RenderingContext } from './rendering-context.js';
import { Transformation } from "./transformation.js";

export class Polygon {
    static readonly maximumRotationWhenDead: number = Math.PI * 2;
    static readonly minimumDriftWhenDead: number = 20;
    static readonly maximumDriftWhenDead: number = 40;

    readonly coordinates: Coordinates[];
    readonly centerPoint: Coordinates;
    readonly rotationWhenDead: number;
    readonly driftWhenDead: number;

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

        this.centerPoint = coordinates.reduce((c, coordinates) => c.add(coordinates), new Coordinates(0, 0)).divide(coordinateCount);
        this.coordinates = coordinates.map(coordinate => coordinate.subtract(this.centerPoint));
        this.rotationWhenDead = Math.random() * Polygon.maximumRotationWhenDead * 2 - Polygon.maximumRotationWhenDead;
        this.driftWhenDead = (Math.random() * (Polygon.maximumDriftWhenDead - Polygon.minimumDriftWhenDead) + Polygon.minimumDriftWhenDead) / Math.pow(this.centerPoint.getMagnitude(), 0.75);
    }

    render(context: RenderingContext, deadForDuration: number | undefined): void {
        let transformations: Transformation[];

        if (deadForDuration === undefined) {
            transformations = [
                Transformation.translate(this.centerPoint)
            ];
        }
        else {
            transformations = [
                Transformation.translate(this.centerPoint.multiply(1 + Math.sqrt(deadForDuration) * this.driftWhenDead)),
                Transformation.rotate(deadForDuration * this.rotationWhenDead),
                Transformation.scale(1 / (1 + deadForDuration))
            ];
        }
        
        context.transform
            (() => {
                context.moveTo(this.coordinates[this.coordinates.length - 1]);

                this.coordinates.forEach(coordinates => {
                    context.lineTo(coordinates);
                });
            },
            ...transformations
        );
    }
}
