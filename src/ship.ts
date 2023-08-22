import { Acceleration } from './acceleration';
import { Coordinates } from './coordinates';
import { Direction } from './direction';
import { Velocity } from './velocity';

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

    // TODO deceleration
    processFrame(direction: Direction, customAcceleration: Acceleration, duration: number) {
        let acceleration = new Acceleration(0, 0);

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

        this.position = this.position.move(this.velocity, duration / 2);
        this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
        this.position = this.position.move(this.velocity, duration / 2);
    }
}