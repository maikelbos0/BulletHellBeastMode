"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ship = void 0;
var acceleration_1 = require("./acceleration");
var direction_1 = require("./direction");
var velocity_1 = require("./velocity");
var Ship = exports.Ship = /** @class */ (function () {
    function Ship(startingPosition) {
        this.position = startingPosition;
        this.speed = new velocity_1.Velocity(0, 0);
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
        acceleration = acceleration
            .add(customAcceleration)
            .limitMagnitude(Ship.maximumAcceleration);
        this.speed = this.speed
            .accelerate(acceleration, duration)
            .limitMagnitude(Ship.maximumSpeed);
        this.position = this.position.move(this.speed, duration);
    };
    Ship.directionalAcceleration = 50;
    Ship.maximumAcceleration = 100;
    Ship.maximumSpeed = 500;
    return Ship;
}());
//# sourceMappingURL=ship.js.map