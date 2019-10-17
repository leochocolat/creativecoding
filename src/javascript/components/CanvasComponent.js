import _ from 'underscore';
import { TweenLite, Quint } from 'gsap';
import * as dat from 'dat.gui';

//components
import NoiseCircleComponent from './NoiseCircleComponent';
import CircleInceptionComponent from './CircleInceptionComponent';

class CanvasComponent {
    constructor() {
        _.bindAll(
            this, 
            '_tickHandler',
            '_resizeHandler',
            '_mousemoveHandler',
            '_settingsUpdateHandler'
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
        this._setupGUI();
        this._setupDeltaTime();
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

    _setupDeltaTime() {
        this._dateNow = Date.now()
        this._lastTime = this._dateNow;
        this._deltaTime = 16;
    }

    _setupGUI() {
        this._guiSettings = {
            clearOpacity: 0.01,
            speed: 0.1,
            rotationSpeedFactor: 50,
        }

        const gui = new dat.GUI();

        gui.add(this._guiSettings, 'clearOpacity', [0.01, 1])
            .onChange(() => { this._settingsUpdateHandler('clearOpacity') });
        gui.add(this._guiSettings, 'speed', 0, 5)
            .onChange(() => { this._settingsUpdateHandler('speed') })
            .step(0.001);
        gui.add(this._guiSettings, 'rotationSpeedFactor', 0, 500)
            .onChange(() => { this._settingsUpdateHandler('rotationSpeedFactor') });
    }

    _setupComponents() {
        // this.components.NoiseCircle = new NoiseCircleComponent(0, this._boxes[0], this._ctx);
        this.components.CircleInception1 = new CircleInceptionComponent(0, this._boxes[0], this._ctx);
        this.components.CircleInception2 = new CircleInceptionComponent(1, this._boxes[1], this._ctx);
        this.components.CircleInception3 = new CircleInceptionComponent(2, this._boxes[2], this._ctx);
        this.components.CircleInception4 = new CircleInceptionComponent(3, this._boxes[3], this._ctx);
        this.components.CircleInception5 = new CircleInceptionComponent(4, this._boxes[4], this._ctx);
        this.components.CircleInception6 = new CircleInceptionComponent(5, this._boxes[5], this._ctx);
    }

    _updateDeltaTime() {
        this._dateNow = Date.now();
        this._deltaTime = this._dateNow - this._lastTime;
        this._lastTime = this._dateNow;
    }

    _tick() {
        this._updateDeltaTime();
        // this.components.NoiseCircle.draw();
        this.components.CircleInception1.draw(this._deltaTime);
        this.components.CircleInception2.draw(this._deltaTime);
        this.components.CircleInception3.draw(this._deltaTime);
        this.components.CircleInception4.draw(this._deltaTime);
        this.components.CircleInception5.draw(this._deltaTime);
        this.components.CircleInception6.draw(this._deltaTime);

    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
        window.addEventListener('resize', this._resizeHandler);
        this._canvas.addEventListener('mousemove', this._mousemoveHandler);
    }

    _tickHandler() {
        this._tick();
    } 

    _resizeHandler() {
        this._resize();
        this._setupGrid();
        this._setupComponents();
    }

    _mousemoveHandler(e) {
        let mouse = {};
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        for (let i = 0; i < this._boxes.length; i++) {
            if (mouse.x >= this._boxes[i].x && mouse.x < this._boxes[i].x + this._boxes[i].width
                 &&
                mouse.y >= this._boxes[i].y && mouse.y < this._boxes[i].y + this._boxes[i].height)
            {
                this._activeBox = this._boxes[i];
            }
        }
    }

    _settingsUpdateHandler(props) {
        this.components.CircleInception1.updateSettings(props, this._guiSettings[props]);
        this.components.CircleInception2.updateSettings(props, this._guiSettings[props]);
        this.components.CircleInception3.updateSettings(props, this._guiSettings[props]);
        this.components.CircleInception4.updateSettings(props, this._guiSettings[props]);
        this.components.CircleInception5.updateSettings(props, this._guiSettings[props]);
        this.components.CircleInception6.updateSettings(props, this._guiSettings[props]);
    }


}

export default CanvasComponent;