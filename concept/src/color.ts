export class Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toRgba(alpha: number | undefined): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha ?? 1})`;
    }
}
