class Point {
    constructor(position) {
        this.position = position;
    }

    draw(ctx, color) {
        const radius = 1.5;

        ctx.save();
        
        ctx.translate(this.position.x, this.position.y);
        
        ctx.fillStyle = color || 'white';
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

}

export default Point;