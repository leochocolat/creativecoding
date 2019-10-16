class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    draw(ctx) {
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.closePath();
        ctx.stroke();
    }
    
    drawLines(ctx, points) {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(points[0].position.x, points[0].position.y)
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].position.x, points[i].position.y)
        }
        ctx.moveTo(points[0].position.x, points[0].position.y)
        ctx.closePath();
        ctx.stroke();
    }
}

export default Line;