import { Renderable } from "./renderable.js";
import { Game } from "./game.js";
import { RenderingContext } from "./rendering-context.js";
import { Color2, GradientStyle } from "./draw-style.js";

export class Background implements Renderable {
    static readonly speed: number = 200;
    static readonly lineCount: number = 5;

    readonly lineHeight: number;
    offset: number;

    constructor() {
        this.lineHeight = Game.height / Background.lineCount;
        this.offset = 0;
    }

    processFrame(duration: number): void {
        this.offset += duration * Background.speed;

        while (this.offset >= this.lineHeight) {
            this.offset -= this.lineHeight;
        }
    }

    render(context: RenderingContext): void {
        for (var i = -1; i < Background.lineCount; i++) {
            const gradient = new GradientStyle(0, this.offset + i * this.lineHeight, 0, this.offset + (i + 1) * this.lineHeight);

            gradient.addColorStop(0.5, new Color2(0, 0, 0));
            gradient.addColorStop(1, new Color2(0, 102, 204));

            context.rectangle(0, this.offset + i * this.lineHeight, Game.width, this.lineHeight, { fill: gradient });
        }
    }
}