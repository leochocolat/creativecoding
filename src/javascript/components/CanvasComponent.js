import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as dat from 'dat.gui';

//components
import NoiseCircleComponent from './NoiseCircleComponent';
import CircleInceptionComponent from './CircleInceptionComponent';

class CanvasComponent {
    constructor() {
        _.bindAll(
            this, 
            '_tickHandler',
            '_resizeHandler'
        );

        this.components = {};

        this._settings = {
            columns: 3,
            rows: 2
        }

        this._setup();
    }

    _setup() {
        this._setupCanvas();
        this._resize();
        this._setupGrid();
        this._setupComponents();
        this._setupEventListeners();
    }

    _setupCanvas() {
        this._canvas = document.querySelector('.js-canvas');
        this._ctx = this._canvas.getContext('2d');
    }

    _resize() {
        this._width = window.innerWidth;   
        this._height = window.innerHeight;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _setupGrid() {
        this._boxes = [];
        for (let i = 0; i < this._settings.rows; i++) {
            for (let j = 0; j < this._settings.columns; j++) {
                let box = {
                    x: j * this._width / this._settings.columns,
                    y: i * this._height / this._settings.rows,
                    width: this._width / this._settings.columns,
                    height: this._height / this._settings.rows,
                }
                this._boxes.push(box);
            }
        }
    }

    _setupComponents() {
        this.components.NoiseCircle = new NoiseCircleComponent(0, this._boxes[0], this._ctx);
        this.components.CircleInception = new CircleInceptionComponent(1, this._boxes[1], this._ctx);
    }

    _drawBoxes() {
        for (let i = 0; i < this._boxes.length; i++) {
            let color = 255 - ((1 - i/(this._boxes.length)) * 254);
            this._ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${color})`;
            this._ctx.fillRect(this._boxes[i].x, this._boxes[i].y, this._boxes[i].width, this._boxes[i].height);
        }
    }

    _tick() {
        this._ctx.clearRect(0, 0, this._width, this._height);

        this._drawBoxes();
        this.components.NoiseCircle.draw();
        this.components.CircleInception.draw();
    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
        window.addEventListener('resize', this._resizeHandler);
    }

    _tickHandler() {
        this._tick();
    } 

    _resizeHandler() {
        this._resize();
        this._setupGrid();
        this._setupComponents();
    }


}

export default CanvasComponent;