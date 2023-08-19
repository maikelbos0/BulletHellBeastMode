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
//# sourceMappingURL=vector.js.map