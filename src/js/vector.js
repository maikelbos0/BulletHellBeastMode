"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.getSpeed = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    return Vector;
}());
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map