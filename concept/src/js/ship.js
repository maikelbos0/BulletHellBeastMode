import { Coordinates } from './coordinates.js';
import { Direction } from './direction.js';
import { Game } from './game.js';
import { Velocity } from './velocity.js';
export class Ship {
    constructor(startingPosition) {
        this.position = startingPosition;
        this.velocity = new Velocity(0, 0);
    }
    getDirectionalVelocity(direction) {
        let velocity = new Velocity(0, 0);
        if ((direction & Direction.Up) == Direction.Up) {
            velocity = velocity.add(new Velocity(0, -1));
        }
        if ((direction & Direction.Down) == Direction.Down) {
            velocity = velocity.add(new Velocity(0, 1));
        }
        if ((direction & Direction.Left) == Direction.Left) {
            velocity = velocity.add(new Velocity(-1, 0));
        }
        if ((direction & Direction.Right) == Direction.Right) {
            velocity = velocity.add(new Velocity(1, 0));
        }
        if (velocity.hasMagnitude()) {
            velocity = velocity.adjustMagnitude(Ship.maximumSpeed);
        }
        return velocity;
    }
    getVelocityFromDesiredPosition(desiredPosition) {
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
    adjustVelocityToBounds(velocity) {
        let stoppedPosition = this.position.move(velocity, velocity.getMagnitude() / Ship.maximumAcceleration / 2);
        let horizontalVelocityAdjustment = 1;
        let verticalVelocityAdjustment = 1;
        if (stoppedPosition.x < 0) {
            horizontalVelocityAdjustment = 1 + stoppedPosition.x / (this.position.x - stoppedPosition.x);
        }
        else if (stoppedPosition.x > Game.width) {
            horizontalVelocityAdjustment = 1 - (stoppedPosition.x - Game.width) / (stoppedPosition.x - this.position.x);
        }
        if (stoppedPosition.y < 0) {
            verticalVelocityAdjustment = 1 + stoppedPosition.y / (this.position.y - stoppedPosition.y);
        }
        else if (stoppedPosition.y > Game.height) {
            verticalVelocityAdjustment = 1 - (stoppedPosition.y - Game.height) / (stoppedPosition.y - this.position.y);
        }
        horizontalVelocityAdjustment = Math.max(0, Math.min(1, horizontalVelocityAdjustment));
        verticalVelocityAdjustment = Math.max(0, Math.min(1, verticalVelocityAdjustment));
        return new Velocity(velocity.x * horizontalVelocityAdjustment, velocity.y * verticalVelocityAdjustment);
    }
    processInput(direction, desiredPosition, duration) {
        let desiredVelocity = this.getDirectionalVelocity(direction);
        if (desiredPosition != null) {
            desiredVelocity = desiredVelocity.add(this.getVelocityFromDesiredPosition(desiredPosition));
        }
        let velocityDelta = desiredVelocity.subtract(this.velocity);
        let acceleration = velocityDelta.getAcceleration(duration).limitMagnitude(Ship.maximumAcceleration);
        this.velocity = this.adjustVelocityToBounds(this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed));
    }
    processFrame(duration) {
        this.position = this.position.move(this.velocity, duration);
        this.position = new Coordinates(Math.max(0, Math.min(Game.width, this.position.x)), Math.max(0, Math.min(Game.height, this.position.y)));
    }
    render(context) {
        context.beginPath();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2;
        // Left wing
        context.moveTo(this.position.x - 30, this.position.y + 25);
        context.lineTo(this.position.x - 20, this.position.y + 20);
        context.lineTo(this.position.x - 20, this.position.y - 30);
        context.lineTo(this.position.x - 25, this.position.y - 25);
        context.lineTo(this.position.x - 30, this.position.y + 20);
        context.lineTo(this.position.x - 20, this.position.y - 10);
        // Right wing
        context.moveTo(this.position.x + 30, this.position.y + 25);
        context.lineTo(this.position.x + 20, this.position.y + 20);
        context.lineTo(this.position.x + 20, this.position.y - 30);
        context.lineTo(this.position.x + 25, this.position.y - 25);
        context.lineTo(this.position.x + 30, this.position.y + 20);
        context.lineTo(this.position.x + 20, this.position.y - 10);
        // Back spar
        context.moveTo(this.position.x - 20, this.position.y + 10);
        context.lineTo(this.position.x, this.position.y + 30);
        context.lineTo(this.position.x + 20, this.position.y + 10);
        // Front spar
        context.moveTo(this.position.x - 20, this.position.y - 10);
        context.lineTo(this.position.x - 10, this.position.y + 5);
        context.lineTo(this.position.x, this.position.y + 10);
        context.lineTo(this.position.x + 10, this.position.y + 5);
        context.lineTo(this.position.x + 20, this.position.y - 10);
        // Fuselage exterior
        context.moveTo(this.position.x - 5, this.position.y + 25);
        context.lineTo(this.position.x - 10, this.position.y + 5);
        context.lineTo(this.position.x, this.position.y - 20);
        context.lineTo(this.position.x + 10, this.position.y + 5);
        context.lineTo(this.position.x + 5, this.position.y + 25);
        // Fuselage central line
        context.moveTo(this.position.x, this.position.y - 20);
        context.lineTo(this.position.x, this.position.y + 30);
        context.stroke();
    }
}
Ship.maximumSpeed = 1000;
Ship.maximumAcceleration = 2000;
Ship.stoppingDistance = Ship.maximumAcceleration / 2 * Math.pow(Ship.maximumSpeed / Ship.maximumAcceleration, 2);
//# sourceMappingURL=ship.js.map