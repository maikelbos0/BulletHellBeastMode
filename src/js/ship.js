import { Acceleration } from './acceleration.js';
import { Direction } from './direction.js';
import { Velocity } from './velocity.js';
export class Ship {
    constructor(startingPosition) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }
    getDirectionalVelocity(direction) {
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
    getVelocityFromDesiredPosition(desiredPosition) {
        let positionDelta = desiredPosition.subtract(this.position);
        let distance = positionDelta.getMagnitude();
        let stoppingTime = Math.sqrt(2 * distance / Ship.maximumAcceleration);
        if (stoppingTime == 0) {
            return new Velocity(0, 0);
        }
        return new Velocity(positionDelta.x, positionDelta.y).adjustMagnitude(distance / stoppingTime);
    }
    getDirectionalAcceleration(direction, duration, allowDeceleration) {
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
    getAccelerationFromDesiredPosition(desiredPosition, duration) {
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
    // TODO calculate desired speed from delta using max acceleration as deceleration when approaching target, with max speed? Use that in processframe?
    processFrame(direction, desiredPosition, duration) {
        // let isStopped = this.velocity.x == 0 && this.velocity.y == 0;
        // let isAccelerating = direction != Direction.None || customAcceleration.x != 0 || customAcceleration.y != 0;
        // let isDecelerating = !isStopped && !isAccelerating;
        let acceleration = this.getDirectionalAcceleration(direction, duration, desiredPosition == null);
        if (desiredPosition != null) {
            acceleration = acceleration.add(this.getAccelerationFromDesiredPosition(desiredPosition, duration));
        }
        acceleration = acceleration.limitMagnitude(Ship.maximumAcceleration);
        // since previous speed will be greater, and for half the duration it will apply to position, we need to subtract (0,0).move(prevspeed, duration/2) from desired velocity!!!
        // easiest way to do this might be to only use old or new speed when processing frame
        // if (isAccelerating) {
        //     acceleration = acceleration.add(customAcceleration).limitMagnitude(Ship.maximumAcceleration);
        // }
        // else if (isDecelerating) {
        //     acceleration = new Acceleration(-this.velocity.x, -this.velocity.y).adjustMagnitude(Ship.maximumAcceleration);
        //     duration = Math.min(duration, this.velocity.getMagnitude() / acceleration.getMagnitude());
        // }
        // if (isAccelerating || isDecelerating) {
        //this.position = this.position.move(this.velocity, duration / 2);
        // this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
        this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
        this.position = this.position.move(this.velocity, duration);
        // }
    }
}
Ship.maximumSpeed = 700;
Ship.maximumAcceleration = 1000;
Ship.directionalAcceleration = 700;
//# sourceMappingURL=ship.js.map