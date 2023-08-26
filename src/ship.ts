import { Acceleration } from './acceleration.js';
import { Coordinates } from './coordinates.js';
import { Direction } from './direction.js';
import { Velocity } from './velocity.js';

export class Ship {
    static readonly maximumSpeed: number = 500;
    static readonly maximumAcceleration: number = 300;
    static readonly directionalAcceleration: number = 200;

    position: Coordinates;
    velocity: Velocity;

    constructor(startingPosition: Coordinates) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }
    processFrame(direction: Direction, customAcceleration: Acceleration, duration: number) {
        let isStopped = this.velocity.x == 0 && this.velocity.y == 0;
        let isAccelerating = direction != Direction.None || customAcceleration.x != 0 || customAcceleration.y != 0;
        let isDecelerating = !isStopped && !isAccelerating;
        let acceleration = new Acceleration(0, 0);

        if (isAccelerating) {
            if (direction & Direction.Up) {
                acceleration = acceleration.add(new Acceleration(0, -Ship.directionalAcceleration));
            }

            if (direction & Direction.Down) {
                acceleration = acceleration.add(new Acceleration(0, Ship.directionalAcceleration));
            }

            if (direction & Direction.Left) {
                acceleration = acceleration.add(new Acceleration(-Ship.directionalAcceleration, 0));
            }

            if (direction & Direction.Right) {
                acceleration = acceleration.add(new Acceleration(Ship.directionalAcceleration, 0));
            }

            acceleration = acceleration.add(customAcceleration).limitMagnitude(Ship.maximumAcceleration);
        }
        else if (isDecelerating) {
            acceleration = new Acceleration(-this.velocity.x, -this.velocity.y).adjustMagnitude(Ship.maximumAcceleration);

            duration = Math.min(duration, this.velocity.getMagnitude() / acceleration.getMagnitude());
        }

        if (!isStopped) {
            this.position = this.position.move(this.velocity, duration / 2);
            this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
            this.position = this.position.move(this.velocity, duration / 2);
        }
    }
}