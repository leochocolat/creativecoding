import Point from '../modules/Point';
import Line from '../modules/Line';
import SimplexNoise from 'simplex-noise';

class NoiseCircleComponent {
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
            amount: 50,
            scale: 100,
            smooth: 2,
            clear: true,
            radius: (this._width / 2) - 60 ,
        }

        this._delta = 0;

        this._setup();
    }

    _setup() {
        this._setupNoise();
        this._setupPoints();
        this._setupLine();
    }

    _setupNoise() {
        this._noise = new SimplexNoise();
    }

    _setupPoints() {
        this._points = [];

        for (let i = 0; i <= this._settings.amount; i++) {
            let angle = i / this._settings.amount * Math.PI * 2;
            let noise = this._delta;
            // let noise = (this._noise.noise2D(i / this._settings.smooth, this._delta/200) * this._settings.scale);
            let position = {
                x: this._width/2 + Math.cos(angle * noise) * this._settings.radius,
                y: this._height/2 + Math.sin(angle * noise) * this._settings.radius
            }
            this._points.push(
                new Point(position)
            )
        }
    }

    _setupLine() {
        this._line = new Line();
    }

    _drawPoints() {
        for (let i = 0; i < this._points.length; i++) {
            this._points[i].draw(this._ctx);
        }
    }

    _drawLines() {
        this._line.drawLines(this._ctx, this._points);
    }

    _updatePoints() {
        let radiusX = Math.sin(this._delta * 0.01) * 200;
        let radiusY = 200;

        for (let i = 0; i < this._points.length; i++) {
            let angle = i / this._settings.amount * Math.PI * 2;
            // let noise = this._delta;
            let noise = (this._noise.noise2D(i / this._settings.smooth, this._delta/200) * this._settings.scale);
            let position = {
                x: this._width/2 + Math.cos(angle + (noise)) * radiusX,
                y: this._height/2 + Math.sin(angle + (noise)) * radiusY
            }
            this._points[i].position.x = position.x;
            this._points[i].position.y = position.y;
        }
    }

    _clear(opacity) {
        this._ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        this._ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
    }

    draw() {
        this._delta += 1;

        this._clear(1);

        this._ctx.save();
        this._ctx.translate(this._position.x, this._position.y);

        this._drawPoints();
        this._drawLines();
        this._updatePoints();

        this._ctx.restore();
    }

}

export default NoiseCircleComponent;