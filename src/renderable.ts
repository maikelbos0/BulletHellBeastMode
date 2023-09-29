export interface Renderable {
    render(context: CanvasRenderingContext2D): void;

    processFrame(duration: number): void;
}