class Circle {
    constructor(position, radius, direction, velocity) {
        this.position = position;
        this.radius = radius;
        this.direction = direction;
        this.velocity = velocity;

        this._alpha = 0;
    }

    animate(value) {
        this._alpha = value;
    }

    draw(ctx, color) {
        if (color) {
            ctx.strokeStyle = color;
        } else {
            ctx.strokeStyle = 'white';
        }
        ctx.save();
        ctx.globalAlpha = this._alpha;
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

}

export default Circle;