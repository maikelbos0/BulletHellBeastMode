import { Coordinates } from './coordinates.js';
import { Direction } from './direction.js';
import { Renderable } from './renderable.js';
import { Velocity } from './velocity.js';

export class Ship implements Renderable {
    static readonly maximumSpeed: number = 1000;
    static readonly maximumAcceleration: number = 2000;
    static readonly stoppingDistance: number = Ship.maximumAcceleration / 2 * Math.pow(Ship.maximumSpeed / Ship.maximumAcceleration, 2);

    position: Coordinates;
    velocity: Velocity;

    constructor(startingPosition: Coordinates) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }

    getDirectionalVelocity(direction: Direction): Velocity {
        let velocity = new Velocity(0, 0);

        if ((direction & Direction.Up) == Direction.Up) {
            velocity = velocity.add(new Velocity(0, -Ship.maximumSpeed));
        }

        if ((direction & Direction.Down) == Direction.Down) {
            velocity = velocity.add(new Velocity(0, Ship.maximumSpeed));
        }

        if ((direction & Direction.Left) == Direction.Left) {
            velocity = velocity.add(new Velocity(-Ship.maximumSpeed, 0));
        }

        if ((direction & Direction.Right) == Direction.Right) {
            velocity = velocity.add(new Velocity(Ship.maximumSpeed, 0));
        }

        return velocity;
    }

    getVelocityFromDesiredPosition(desiredPosition: Coordinates): Velocity {
        let positionDelta = desiredPosition.subtract(this.position);
        let distance = positionDelta.getMagnitude();

        if (distance == 0) {
            return new Velocity(0, 0);
        }
        else if (distance > Ship.stoppingDistance) {
            return new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(Ship.maximumSpeed);
        }
        else {
            let stoppingTime = Math.sqrt(2 * distance / Ship.maximumAcceleration);

            return new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(distance / stoppingTime);
        }
    }

    processInput(direction: Direction, desiredPosition: Coordinates | null, duration: number) {
        let desiredVelocity = this.getDirectionalVelocity(direction);

        if (desiredPosition != null) {
            desiredVelocity = desiredVelocity.add(this.getVelocityFromDesiredPosition(desiredPosition));
        }

        let velocityDelta = desiredVelocity.subtract(this.velocity);
        let acceleration = velocityDelta.getAcceleration(duration).limitMagnitude(Ship.maximumAcceleration);

        this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
    }

    processFrame(duration: number): void {
        this.position = this.position.move(this.velocity, duration);
    }
    
    render(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2;

        context.moveTo(this.position.x - 20, this.position.y + 5);
        context.lineTo(this.position.x - 10, this.position.y);
        context.lineTo(this.position.x - 5, this.position.y + 5);
        context.lineTo(this.position.x, this.position.y - 20);
        context.lineTo(this.position.x + 5, this.position.y + 5);
        context.lineTo(this.position.x + 10, this.position.y);
        context.lineTo(this.position.x + 20, this.position.y + 5);
        context.lineTo(this.position.x + 15, this.position.y + 10);
        context.lineTo(this.position.x + 5, this.position.y + 5);
        context.lineTo(this.position.x, this.position.y + 15);
        context.lineTo(this.position.x - 5, this.position.y + 5);
        context.lineTo(this.position.x - 15, this.position.y + 10);
        context.lineTo(this.position.x - 20, this.position.y + 5);
        context.lineTo(this.position.x - 20, this.position.y - 5);
        context.lineTo(this.position.x - 15, this.position.y + 10);

        context.moveTo(this.position.x - 10, this.position.y - 10);
        context.lineTo(this.position.x, this.position.y + 5);
        context.lineTo(this.position.x + 10, this.position.y - 10);
        context.lineTo(this.position.x + 10, this.position.y);
        
        context.moveTo(this.position.x + 20, this.position.y + 5);
        context.lineTo(this.position.x + 20, this.position.y - 5);
        context.lineTo(this.position.x + 15, this.position.y + 10);
        
        context.moveTo(this.position.x - 10, this.position.y - 10);
        context.lineTo(this.position.x - 10, this.position.y);
        context.stroke();
    }
}