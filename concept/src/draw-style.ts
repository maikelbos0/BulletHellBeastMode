export abstract class DrawStyle {
    abstract toCanvasStyle(context: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
}
