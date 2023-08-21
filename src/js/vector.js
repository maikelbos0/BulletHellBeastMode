"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.getMagnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector.prototype.limitMagnitude = function (maximumMagnitude) {
        var magnitude = this.getMagnitude();
        var factor = 1;
        if (magnitude > maximumMagnitude) {
            factor = maximumMagnitude / magnitude;
        }
        return new Vector(this.x * factor, this.y * factor);
    };
    Vector.prototype.add = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };
    return Vector;
}());
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map