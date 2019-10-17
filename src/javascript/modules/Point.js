class Point {
    constructor(position, direction, velocity) {
        this.position = position;
        this.direction = direction;
        this.velocity = velocity;
    }
    
    updateDirection(width, height) {
        if (this.position.x >= width || this.position.x < 0) {
            this.direction.x *= -1;
        } 
        if (this.position.y >= height || this.position.y < 0 ) {
            this.direction.y *= -1;
        }
    }

    update(deltaTime) {
        this.position.x += this.direction.x * this.velocity * deltaTime;
        this.position.y += this.direction.y * this.velocity * deltaTime;
    }

    draw(ctx, color) {
        const radius = 1.5;

        ctx.save();
        
        ctx.translate(this.position.x, this.position.y);
        if (color) {
            ctx.fillStyle = color;
        } else {
            ctx.fillStyle = 'transparent';
        }
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

}

export default Point;