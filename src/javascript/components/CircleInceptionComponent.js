import Point from '../modules/Point';
import Line from '../modules/Line';
import Circle from '../modules/Circle';
import SimplexNoise from 'simplex-noise';

class CircleInception {
    constructor(id, props, ctx) {
        this._props = props;
        this._id = id;
        this._ctx = ctx;

        this._width = this._props.width;
        this._height = this._props.height;

        this._position = {
            x: this._props.x,
            y: this._props.y,
        }

        this._settings = {
            clear: true,
            radius: (this._width / 2) - 30 ,
        }

        this._delta = 0;

        this._setup();
    }

    _setup() {
        this._setupRotatingCircle();
        this._setupCircleCenter();
    }

    _setupRotatingCircle() {
        let radius = 20;
        let center = {
            x: this._width/2 + Math.cos(0) * this._settings.radius,
            y: this._height/2 + Math.sin(0) * this._settings.radius
        }
        this._rotatingCircle = new Circle(center, radius);
    }

    _setupCircleCenter() {
        
    }

    _drawCircleContainer() {
        this._ctx.strokeStyle = 'white';
        this._ctx.beginPath();
        this._ctx.arc(this._width/2, this._height/2, this._settings.radius, 0, Math.PI * 2);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    _drawRotatingCircle() {
        this._rotatingCircle.draw(this._ctx);
    }

    draw() {
        this._delta += 1;

        this._ctx.save();
        this._ctx.translate(this._position.x, this._position.y);

        //DRAW
        this._drawCircleContainer();
        this._drawRotatingCircle();


        this._ctx.restore();
    }

}

export default CircleInception;