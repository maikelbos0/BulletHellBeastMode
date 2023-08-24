"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ship = void 0;
var acceleration_1 = require("./acceleration");
var direction_1 = require("./direction");
var velocity_1 = require("./velocity");
var Ship = exports.Ship = /** @class */ (function () {
    function Ship(startingPosition) {
        this.position = startingPosition;
        this.velocity = new velocity_1.Velocity(0, 0);
    }
    // TODO deceleration
    Ship.prototype.processFrame = function (direction, customAcceleration, duration) {
        var acceleration = new acceleration_1.Acceleration(0, 0);
        if (direction & direction_1.Direction.Up) {
            acceleration = acceleration.add(new acceleration_1.Acceleration(0, -Ship.directionalAcceleration));
        }
        if (direction & direction_1.Direction.Down) {
            acceleration = acceleration.add(new acceleration_1.Acceleration(0, Ship.directionalAcceleration));
        }
        if (direction & direction_1.Direction.Left) {
            acceleration = acceleration.add(new acceleration_1.Acceleration(-Ship.directionalAcceleration, 0));
        }
        if (direction & direction_1.Direction.Right) {
            acceleration = acceleration.add(new acceleration_1.Acceleration(Ship.directionalAcceleration, 0));
        }
        acceleration = acceleration.add(customAcceleration).limitMagnitude(Ship.maximumAcceleration);
        this.position = this.position.move(this.velocity, duration / 2);
        this.velocity = this.velocity.accelerate(acceleration, duration).limitMagnitude(Ship.maximumSpeed);
        this.position = this.position.move(this.velocity, duration / 2);
    };
    Ship.maximumSpeed = 500;
    Ship.maximumAcceleration = 300;
    Ship.directionalAcceleration = 200;
    return Ship;
}());
//# sourceMappingURL=ship.js.map