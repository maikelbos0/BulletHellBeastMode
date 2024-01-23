export abstract class Transformation {
    // TODO take coordinates?
    public static translate(x: number, y: number): Transformation {
        return new Translation(x, y);
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
    constructor(public readonly x: number, public readonly y: number) {
        super();
    }

    transform(context: CanvasRenderingContext2D): void {
        context.translate(this.x, this.y);
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
