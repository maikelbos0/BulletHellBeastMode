import { Transformation } from "./transformation.js";
import { RenderingOptions } from "./rendering-options.js";

export class RenderingContext {
    constructor(private context: CanvasRenderingContext2D) { }

    transform(func: () => void, ...transformations: Transformation[]) {
        this.context.save();

        transformations.forEach(transformation => transformation.transform(this.context));

        func();

        this.context.restore();
    }

    // TODO remove?
    translate(func: () => void, x: number, y: number): void {
        this.context.save();
        this.context.translate(x, y);

        func();

        this.context.restore();
    }

    path(func: () => void, options: RenderingOptions): void {
        this.context.beginPath();

        func();

        if (options.fill) {
            this.context.fillStyle = options.fill.toCanvasStyle(this.context);
            this.context.fill();
        }

        if (options.stroke) {
            this.context.strokeStyle = options.stroke.toCanvasStyle(this.context);
            this.context.lineWidth = 2;
            this.context.stroke();
        }
    }

    // TODO make it accept coordinates?
    moveTo(x: number, y: number): void {
        this.context.moveTo(x, y);
    }

    // TODO make it accept coordinates?
    lineTo(x: number, y: number): void {
        this.context.lineTo(x, y);
    }

    rectangle(x: number, y: number, width: number, height: number, options: RenderingOptions) {
        if (options.fill) {
            this.context.fillStyle = options.fill.toCanvasStyle(this.context);
            this.context.fillRect(x, y, width, height);
        }

        if (options.stroke) {
            this.context.strokeStyle = options.stroke.toCanvasStyle(this.context);
            this.context.lineWidth = 2;
            this.context.strokeRect(x, y, width, height);
        }
    }

    clearRectangle(x: number, y: number, width: number, height: number): void {
        this.context.clearRect(x, y, width, height);
    }
}
