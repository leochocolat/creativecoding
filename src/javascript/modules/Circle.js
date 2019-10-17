class Circle {
    constructor(position, radius, direction, velocity) {
        this.position = position;
        this.radius = radius;
        this.direction = direction;
        this.velocity = velocity;
    }

    draw(ctx, color) {
        if (color) {
            ctx.strokeStyle = color;
        } else {
            ctx.strokeStyle = 'white';
        }
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

}

export default Circle;