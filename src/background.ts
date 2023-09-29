import { Renderable } from "./renderable";

export class Background implements Renderable {
    static readonly speed: number = 200;
    static readonly lineCount: number = 5;

    readonly width: number;
    readonly height: number;
    linePositions: number[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.linePositions = Array.from(
            { length: Background.lineCount },
            (_, i) => height / Background.lineCount * i
        );
    }
    
    processFrame(duration: number): void {
        for (var i = 0; i < Background.lineCount; i++) {
            this.linePositions[i] += duration * Background.speed;

            if (this.linePositions[i] > this.height) {
                this.linePositions[i] -= this.height;
            }
        }
    }

    render(context: CanvasRenderingContext2D): void {
        context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        context.lineWidth = 1;

        for (var i = 0; i < Background.lineCount; i++) {
            context.moveTo(0, this.linePositions[i]);
            context.lineTo(this.width, this.linePositions[i]);
            context.stroke();
        }
    }
}