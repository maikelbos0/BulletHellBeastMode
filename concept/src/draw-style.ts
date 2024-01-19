// TODO split files
// TODO add tests
export abstract class DrawStyle {
    abstract toCanvasStyle(context: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
}

export class GradientStyle extends DrawStyle {
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