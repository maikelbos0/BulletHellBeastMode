import { Acceleration } from './acceleration.js';
import { Direction } from './direction.js';
import { Velocity } from './velocity.js';
export class Ship {
    constructor(startingPosition) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }
    processFrame(direction, customAcceleration, duration) {
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
Ship.maximumSpeed = 500;
Ship.maximumAcceleration = 300;
Ship.directionalAcceleration = 200;
//# sourceMappingURL=ship.js.map