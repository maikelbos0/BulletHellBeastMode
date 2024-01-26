import { Coordinates } from "./coordinates";

export abstract class Transformation {
    public static translate(coordinates: Coordinates): Transformation {
        return new Translation(coordinates);
    }
    
    public static rotate(angle: number): Transformation {
        return new Rotation(angle);
    }

    public static scale(factor: number): Transformation {
        return new Scaling(factor);
    }

    abstract transform(context: CanvasRenderingContext2D): void;
}

class Translation extends Transformation {
    constructor(public readonly coordinates: Coordinates) {
        super();
    }

    transform(context: CanvasRenderingContext2D): void {
        context.translate(this.coordinates.x, this.coordinates.y);
    }
}

class Rotation extends Transformation {
    constructor(public readonly angle: number) {
        super();
    }

    transform(context: CanvasRenderingContext2D): void {
        context.rotate(this.angle);
    }
}

class Scaling extends Transformation {
    constructor(public readonly factor: number) {
        super();
    }

    transform(context: CanvasRenderingContext2D): void {
        context.scale(this.factor, this.factor);
    }
}
