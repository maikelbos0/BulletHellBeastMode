import { Coordinates } from './coordinates.js';
import { Direction } from './direction.js';
import { Color } from "./color.js";
import { Game } from './game.js';
import { Polygon } from './polygon.js';
import { RenderableObject } from './renderable-object.js';
import { Velocity } from './velocity.js';

export class Ship extends RenderableObject {
    static readonly maximumSpeed: number = 1000;
    static readonly maximumAcceleration: number = 2000;
    static readonly stoppingDistance: number = Ship.maximumAcceleration / 2 * Math.pow(Ship.maximumSpeed / Ship.maximumAcceleration, 2);

    color: Color = new Color(255, 255, 255);
    polygons: Polygon[] = [
        // Back left wing
        new Polygon(
            new Coordinates(-30, 25),
            new Coordinates(-20, 20),
            new Coordinates(-20, -10)
        ),
        // Front left wing
        new Polygon(
            new Coordinates(-20, -30),
            new Coordinates(-20, -10),
            new Coordinates(-30, 25),
            new Coordinates(-25, -25)
        ),
        // Left spar
        new Polygon(
            new Coordinates(-20, 10),
            new Coordinates(-5, 25),
            new Coordinates(-10, 5),
            new Coordinates(-20, -10)
        ),
        // Front left fuselage
        new Polygon(
            new Coordinates(-10, 5),
            new Coordinates(0, 10),
            new Coordinates(0, -20),
        ),
        // Back left fuselage
        new Polygon(
            new Coordinates(-5, 25),
            new Coordinates(0, 30),
            new Coordinates(0, 10),
            new Coordinates(-10, 5)
        ),
        // Back right wing
        new Polygon(
            new Coordinates(30, 25),
            new Coordinates(20, 20),
            new Coordinates(20, -10)
        ),
        // Front right wing
        new Polygon(
            new Coordinates(20, -30),
            new Coordinates(20, -10),
            new Coordinates(30, 25),
            new Coordinates(25, -25)
        ),
        // Right spar
        new Polygon(
            new Coordinates(20, 10),
            new Coordinates(5, 25),
            new Coordinates(10, 5),
            new Coordinates(20, -10)
        ),
        // Front right fuselage
        new Polygon(
            new Coordinates(10, 5),
            new Coordinates(0, 10),
            new Coordinates(0, -20),
        ),
        // Back right fuselage
        new Polygon(
            new Coordinates(5, 25),
            new Coordinates(0, 30),
            new Coordinates(0, 10),
            new Coordinates(10, 5)
        )
    ];
    velocity: Velocity = new Velocity(0, 0);

    getDirectionalVelocity(direction: Direction): Velocity {
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

    adjustVelocityToBounds(velocity: Velocity): Velocity {
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

    processInput(direction: Direction, desiredPosition: Coordinates | null, duration: number) {
        let desiredVelocity = this.getDirectionalVelocity(direction);

        if (desiredPosition != null) {
            desiredVelocity = desiredVelocity.add(this.getVelocityFromDesiredPosition(desiredPosition));
        }

        let velocityDelta = desiredVelocity.subtract(this.velocity);
        let acceleration = velocityDelta.getAcceleration(duration).limitMagnitude(Ship.maximumAcceleration);

        this.velocity = this.adjustVelocityToBounds(this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed));
    }

    processFrameTransform(duration: number): void {
        this.position = this.position.move(this.velocity, duration);
        this.position = new Coordinates(Math.max(0, Math.min(Game.width, this.position.x)), Math.max(0, Math.min(Game.height, this.position.y)));
    }
}
