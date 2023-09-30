import { Renderable } from "./renderable";

export class Background implements Renderable {
    static readonly speed: number = 200;
    static readonly lineCount: number = 5;

    readonly width: number;
    readonly height: number;
    readonly lineHeight: number;
    offset: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.lineHeight = height / Background.lineCount;
        this.offset = 0;
    }

    processFrame(duration: number): void {
        this.offset += duration * Background.speed;

        while (this.offset >= this.lineHeight) {
            this.offset -= this.lineHeight;
        }
    }

    render(context: CanvasRenderingContext2D): void {    
        context.beginPath();

        for (var i = -1; i < Background.lineCount; i++) {
            const gradient = context.createLinearGradient(0, this.offset + i * this.lineHeight, 0, this.offset + (i + 1) * this.lineHeight);
            
            gradient.addColorStop(0.5, "#000000");
            gradient.addColorStop(1, "#0066cc");

            context.fillStyle = gradient;
            context.fillRect(0, this.offset + i * this.lineHeight, this.width, this.lineHeight);
        }
    }
}