export class Transformation {
    // TODO take coordinates?
    public static translate(x: number, y: number): Transformation {
        return new Transformation(context => context.translate(x, y));
    }

    public static rotate(angle: number): Transformation {
        return new Transformation(context => context.rotate(angle));
    }

    public static scale(factor: number): Transformation {
        return new Transformation(context => context.scale(factor, factor));
    }

    private constructor(public readonly transform: (context: CanvasRenderingContext2D) => void) { }
}
