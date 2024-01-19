import { DrawStyle } from "./draw-style.js";

export class Color extends DrawStyle {
    constructor(public readonly r: number, public readonly g: number, public readonly b: number, public readonly a: number = 1) {
        super();
    }

    withAlpha(a: number) {
        return new Color(this.r, this.g, this.b, a);
    }

    toCanvasStyle(context: CanvasRenderingContext2D): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
