import { Acceleration } from './acceleration';
import { Coordinates } from './coordinates';
import { Direction } from './direction';
import { Velocity } from './velocity';

export class Ship {
    static readonly directionalAcceleration: number = 50;
    static readonly maximumAcceleration: number = 100;
    static readonly maximumSpeed: number = 500;

    position: Coordinates;
    speed: Velocity;

    constructor(startingPosition: Coordinates) {
        this.position = startingPosition;
        this.speed = new Velocity(0, 0);
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

        this.position = this.position.move(this.speed, duration / 2);
        this.speed = this.speed.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
        this.position = this.position.move(this.speed, duration / 2);
    }
}