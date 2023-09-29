export class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.linePositions = Array.from({ length: Background.lineCount }, (_, i) => height / Background.lineCount * i);
    }
    processFrame(duration) {
        for (var i = 0; i < Background.lineCount; i++) {
            this.linePositions[i] += duration * Background.speed;
            if (this.linePositions[i] > this.height) {
                this.linePositions[i] -= this.height;
            }
        }
    }
    render(context) {
        context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        context.lineWidth = 1;
        for (var i = 0; i < Background.lineCount; i++) {
            context.moveTo(0, this.linePositions[i]);
            context.lineTo(this.width, this.linePositions[i]);
            context.stroke();
        }
    }
}
Background.speed = 200;
Background.lineCount = 5;
//# sourceMappingURL=background.js.map