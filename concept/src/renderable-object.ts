import { Coordinates } from "./coordinates.js";
import { Polygon } from "./polygon.js";
import { Renderable } from "./renderable.js";
import { Color } from "./color.js";

export abstract class RenderableObject implements Renderable {
    static readonly deathAnimationDuration: number = 2;

    private deadForDuration: number | undefined;

    abstract readonly polygons: Polygon[];
    abstract readonly color: Color;

    position: Coordinates;

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

    // TODO introduce mockable context
    render(context: CanvasRenderingContext2D): void {
        if (this.deadForDuration !== undefined && this.deadForDuration > RenderableObject.deathAnimationDuration) {
            return;
        }

        context.beginPath();
        context.strokeStyle = this.color.toRgba((RenderableObject.deathAnimationDuration - (this.deadForDuration ?? 0)) / RenderableObject.deathAnimationDuration);
        context.lineWidth = 2;
        context.transform(1, 0, 0, 1, this.position.x, this.position.y);

        this.polygons.forEach(polygon => polygon.render(context, this.deadForDuration));

        context.stroke();

        context.resetTransform();
    }

    kill(): void {
        if (this.deadForDuration === undefined) {
            this.deadForDuration = 0;
        }
    }
}
