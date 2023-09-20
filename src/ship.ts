import { Acceleration } from './acceleration.js';
import { Coordinates } from './coordinates.js';
import { Direction } from './direction.js';
import { Velocity } from './velocity.js';

export class Ship {
    static readonly maximumSpeed: number = 700;
    static readonly maximumAcceleration: number = 1000;
    static readonly directionalAcceleration: number = 700;

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

        return new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(distance / stoppingTime);
    }

    getDirectionalAcceleration(direction: Direction, duration: number, allowDeceleration: boolean): Acceleration {
        let acceleration = new Acceleration(0, 0);

        if ((direction & Direction.Up) == Direction.Up) {
            acceleration = acceleration.add(new Acceleration(0, -Ship.directionalAcceleration));
        }

        if ((direction & Direction.Down) == Direction.Down) {
            acceleration = acceleration.add(new Acceleration(0, Ship.directionalAcceleration));
        }

        if ((direction & Direction.Left) == Direction.Left) {
            acceleration = acceleration.add(new Acceleration(-Ship.directionalAcceleration, 0));
        }

        if ((direction & Direction.Right) == Direction.Right) {
            acceleration = acceleration.add(new Acceleration(Ship.directionalAcceleration, 0));
        }

        // TODO deceleration to take into account actual velocity
        if (allowDeceleration && (direction & Direction.Vertical) == Direction.None && this.velocity.y != 0) {
            let verticalDeceleration = Ship.directionalAcceleration;

            if (verticalDeceleration * duration > Math.abs(this.velocity.y)) {
                verticalDeceleration = Math.abs(this.velocity.y) / duration;
            }

            acceleration = acceleration.add(new Acceleration(0, Math.sign(this.velocity.y) * -verticalDeceleration));
        }

        if (allowDeceleration && (direction & Direction.Horizontal) == Direction.None && this.velocity.x != 0) {
            let horizontalDeceleration = Ship.directionalAcceleration;

            if (horizontalDeceleration * duration > Math.abs(this.velocity.x)) {
                horizontalDeceleration = Math.abs(this.velocity.x) / duration;
            }

            acceleration = acceleration.add(new Acceleration(Math.sign(this.velocity.x) * -horizontalDeceleration, 0));
        }

        return acceleration;
    }

    getAccelerationFromDesiredPosition(desiredPosition: Coordinates, duration: number): Acceleration {
        let positionDelta = desiredPosition.subtract(this.position);
        let distance = positionDelta.getMagnitude();
        let stoppingTime = Math.sqrt(2 * distance / Ship.maximumAcceleration);

        if (stoppingTime == 0) {
            return new Acceleration(0, 0);
        }

        let desiredVelocityMagnitude = distance / stoppingTime;
        let desiredVelocity = new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(desiredVelocityMagnitude).limitMagnitude(Ship.maximumSpeed);
        let velocityDelta = desiredVelocity.subtract(this.velocity);

        return velocityDelta.getAcceleration(duration);
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