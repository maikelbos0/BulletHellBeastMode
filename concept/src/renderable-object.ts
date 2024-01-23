import { Coordinates } from "./coordinates.js";
import { Polygon } from "./polygon.js";
import { Renderable } from "./renderable.js";
import { RenderingContext } from "./rendering-context.js";
import { Color } from "./color.js";
import { Transformation } from "./transformation.js";

export abstract class RenderableObject implements Renderable {
    static readonly deathAnimationDuration: number = 2;

    deadForDuration: number | undefined;
    position: Coordinates;
    abstract polygons: Polygon[];
    abstract color: Color;

    constructor(startingPosition: Coordinates) {
        this.position = startingPosition;
    }

    processFrame(duration: number): void {
        if (this.deadForDuration !== undefined) {
            this.deadForDuration += duration;
        }

        this.processFrameTransform(duration);
    }

    abstract processFrameTransform(duration: number): void;

    render(context: RenderingContext): void {
        if (this.deadForDuration !== undefined && this.deadForDuration > RenderableObject.deathAnimationDuration) {
            return;
        }

        context.transform(
            () => {
                context.path(() => {
                    this.polygons.forEach(polygon => polygon.render(context, this.deadForDuration));
                },
                {
                    stroke: this.color.withAlpha((RenderableObject.deathAnimationDuration - (this.deadForDuration ?? 0)) / RenderableObject.deathAnimationDuration)
                });
            },
            Transformation.translate(this.position.x, this.position.y)
        );
    }

    kill(): void {
        if (this.deadForDuration === undefined) {
            this.deadForDuration = 0;
        }
    }
}
