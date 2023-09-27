import { Acceleration } from './acceleration.js';
import { Coordinates } from './coordinates.js';
import { Direction } from './direction.js';
import { Velocity } from './velocity.js';

export class Ship {
    static readonly maximumSpeed: number = 700;
    static readonly maximumAcceleration: number = 1000;
    static readonly directionalAcceleration: number = 700;
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
        let stoppingTime = Math.sqrt(2 * distance / Ship.maximumAcceleration);

        if (stoppingTime == 0) {
            return new Velocity(0, 0);
        }

        let velocity = new Velocity(positionDelta.x, positionDelta.y)

        if (distance > Ship.stoppingDistance) {
            velocity = velocity.adjustMagnitude(Ship.maximumSpeed);
        }
        else {
            velocity = velocity.adjustMagnitude(distance / stoppingTime);
        }

        return velocity;
    }

    processFrame(direction: Direction, desiredPosition: Coordinates | null, duration: number) {
        let desiredVelocity = this.getDirectionalVelocity(direction);

        if (desiredPosition != null) {
            desiredVelocity = desiredVelocity.add(this.getVelocityFromDesiredPosition(desiredPosition));
        }

        let velocityDelta = desiredVelocity.subtract(this.velocity);
        let acceleration = velocityDelta.getAcceleration(duration).limitMagnitude(Ship.maximumAcceleration);

        this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
        this.position = this.position.move(this.velocity, duration);
    }
}