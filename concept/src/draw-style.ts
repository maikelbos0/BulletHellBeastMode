// TODO split files
// TODO add tests
export abstract class DrawStyle {
    abstract toCanvasStyle(context: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
}

export class GradientStyle extends DrawStyle {
    private readonly colorStops = new Map<number, Color2>();

    constructor(public x0: number, public y0: number, public x1: number, public y1: number) {
        super();
    }

    addColorStop(offset: number, color: Color2) {
        this.colorStops.set(offset, color);
    }

    toCanvasStyle(context: CanvasRenderingContext2D): CanvasGradient {
        const gradient = context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
        
        this.colorStops.forEach((color, offset) => gradient.addColorStop(offset, color.toCanvasStyle(context)));
        
        return gradient;
    }
}

export class Color2 extends DrawStyle {
    constructor(public r: number, public g: number, public b: number, public a: number = 1) {
        super();
    }

    toCanvasStyle(context: CanvasRenderingContext2D): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}