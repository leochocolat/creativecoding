class Circle {
    constructor(position, radius, alpha) {
        this.position = position;
        this.radius = radius;
        this.alpha = alpha;
    }

    animate(value) {
        this.alpha = value;
    }

    draw(ctx, color) {
        ctx.strokeStyle = color || 'white';
        ctx.fillStyle = 'transparent';

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

}

export default Circle;