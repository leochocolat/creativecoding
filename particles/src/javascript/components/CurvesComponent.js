import _ from 'underscore';
import { TweenLite } from 'gsap';
import SimplexNoise from 'simplex-noise';
import Point from './Point';
import Line from './Line';
import * as dat from 'dat.gui';

const AMOUNT = 50;
const SCALE = 100;

class CurvesComponent {
    constructor() {
        _.bindAll(this, '_tickHandler')

        this._delta = 0;

        this._settings = {
            amount: 50,
            scale: 100,
            smooth: 2,
            clear: true,
            radius: 200,
        }

        const gui = new dat.GUI({ closed: false });
        gui.add(this._settings, 'amount', 1, 1000).step(1);
        gui.add(this._settings, 'scale', 1, 1000).step(1);
        gui.add(this._settings, 'radius', 1, 1000).step(1);
        gui.add(this._settings, 'smooth', 1, 50).step(0.1);
        gui.add(this._settings, 'clear');

        this._setup();
    }

    _setup() {
        this._setupCanvas();
        this._resize();
        this._setupSimplexNoise();
        this._initPoints();
        this._initLine();
        this._setupEventListeners();
    }

    _setupCanvas() {
        this._canvas = document.querySelector('.canvas');
        this._canvas.style.backgroundColor = 'black';
        this._ctx = this._canvas.getContext('2d');
    }

    _setupSimplexNoise() {
        this._simplexNoise = new SimplexNoise();
    }

    _initPoints() {
        this._points = [];

        let interval = this._width/this._settings.amount; 

        for (let i = 0; i <= this._settings.amount; i++) {
            let angle = i / this._settings.amount * Math.PI * 2;
            let noise = (this._simplexNoise.noise2D(i / this._settings.smooth, this._delta/200) * this._settings.scale);
            let position = {
                x: this._width/2 + Math.cos(angle * noise) * this._settings.radius,
                y: this._height/2 + Math.sin(angle * noise) * this._settings.radius
            }
            this._points.push(
                new Point(position)
            )
        }
    }

    _initLine() {
        this._line = new Line();
    }

    _draw() {
        if (this._settings.clear) {
            this._ctx.clearRect(0, 0, this._width, this._height);
        }

        this._initPoints();
        for (let i = 0; i < this._points.length; i++) {
            this._points[i].draw(this._ctx);
        }
        this._line.drawLines(this._ctx, this._points);
    }

    _tick() {
        this._delta += 1;
        this._draw();
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        // this._width = 700;
        // this._height = 500;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
    }

    _tickHandler() {
        this._tick()
    }
}

export default CurvesComponent;