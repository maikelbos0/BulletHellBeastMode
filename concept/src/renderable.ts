import { RenderingContext } from "./rendering-context";

export interface Renderable {
    render(context: RenderingContext): void;

    processFrame(duration: number): void;
}
