import { Color } from "./color.js";
import { DrawStyle } from "./draw-style.js";

export class Gradient extends DrawStyle {
    private readonly colorStops = new Map<number, Color>();

    constructor(public x0: number, public y0: number, public x1: number, public y1: number) {
        super();
    }

    addColorStop(offset: number, color: Color) {
        this.colorStops.set(offset, color);
    }

    toCanvasStyle(context: CanvasRenderingContext2D): CanvasGradient {
        const gradient = context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);

        this.colorStops.forEach((color, offset) => gradient.addColorStop(offset, color.toCanvasStyle(context)));

        return gradient;
    }
}
