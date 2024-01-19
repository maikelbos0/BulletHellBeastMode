import { Coordinates } from "./coordinates.js";
import { Polygon } from "./polygon.js";
import { Renderable } from "./renderable.js";
import { Color } from "./color.js";
import { RenderingContext } from "./rendering-context.js";
import { Color2 } from "./draw-style.js";

export abstract class RenderableObject implements Renderable {
    static readonly deathAnimationDuration: number = 2;

    private deadForDuration: number | undefined;

    abstract readonly polygons: Polygon[];
    abstract readonly color: Color;

    position: Coordinates;

    constructor(startingPosition: Coordinates) {
        this.position = startingPosition;
    }

    // TODO add tests

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

        context.translate(() => {
            context.path(() => {
                this.polygons.forEach(polygon => polygon.render(context, this.deadForDuration));
            },
            {
                stroke: new Color2(this.color.r, this.color.g, this.color.b, (RenderableObject.deathAnimationDuration - (this.deadForDuration ?? 0)) / RenderableObject.deathAnimationDuration)
            });

        }, this.position.x, this.position.y);
    }

    kill(): void {
        if (this.deadForDuration === undefined) {
            this.deadForDuration = 0;
        }
    }
}
