import { DrawStyle } from "./draw-style.js";

export class RenderingContext {
    constructor(private context: CanvasRenderingContext2D) { }

    translate(func: () => void, x: number, y: number): void {
        this.context.save();
        this.context.transform(1, 0, 0, 1, x, y);

        func();

        this.context.restore();
    }

    path(func: () => void, options: Options): void {
        this.context.save();
        this.context.beginPath();

        func();

        if (options.stroke) {
            this.context.strokeStyle = options.stroke.toCanvasStyle(this.context);
            this.context.lineWidth = 2;
            this.context.stroke();
        }

        if (options.fill) {
            this.context.fillStyle = options.fill.toCanvasStyle(this.context);
            this.context.fill();
        }

        this.context.restore();
    }

    moveTo(x: number, y: number): void {
        this.context.moveTo(x, y);
    }

    lineTo(x: number, y: number): void {
        this.context.lineTo(x, y);
    }

    rectangle(x: number, y: number, width: number, height: number, options: Options) {
        this.context.save();

        if (options.stroke) {
            this.context.strokeStyle = options.stroke.toCanvasStyle(this.context);
            this.context.lineWidth = 2;
            this.context.strokeRect(x, y, width, height);
        }

        if (options.fill) {
            this.context.fillStyle = options.fill.toCanvasStyle(this.context);
            this.context.fillRect(x, y, width, height);
        }

        this.context.restore();
    }

    clearRectangle(x: number, y: number, width: number, height: number): void {
        this.context.clearRect(x, y, width, height);
    }
}

// TODO own file
export interface Options {
    fill?: DrawStyle;
    stroke?: DrawStyle;
}
