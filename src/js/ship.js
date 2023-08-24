import { Acceleration } from './acceleration.js';
import { Direction } from './direction.js';
import { Velocity } from './velocity.js';
export class Ship {
    constructor(startingPosition) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }
    // TODO deceleration
    processFrame(direction, customAcceleration, duration) {
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
Ship.maximumSpeed = 500;
Ship.maximumAcceleration = 300;
Ship.directionalAcceleration = 200;
//# sourceMappingURL=ship.js.map