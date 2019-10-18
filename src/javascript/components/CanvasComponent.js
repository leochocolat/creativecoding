import _ from 'underscore';
import { TweenLite, Quint } from 'gsap';
import * as dat from 'dat.gui';
import SoundManager from './SoundManager';
import Modulo from '../utils/Modulo';

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
            '_settingsUpdateHandler',
            '_mousedownHandler',
            '_mouseupHandler'
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
        setTimeout(() => {
            this._start();
        }, 2000);
    }

    _start() {
        let interval = 250;
        for (let i = 1; i <= 6; i++) {
            setTimeout(() => {
                this.components[`CircleInception${i}`].animateIn();
            }, i * interval)
        }
        setTimeout(() => {
            TweenLite.to(this._guiSettings, 1, { clearOpacity: 0.02, onUpdate: () => {
                this._settingsUpdateHandler('clearOpacity', this._guiSettings.clearOpacity);
            }});
        }, 8500);
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
            clearOpacity: 1,
            speed: 0.8,
            rotationSpeedFactor: 50,
            dephasingFactor: 1
        }

        this._speedAnim = this._guiSettings.dephasingFactor;

        const gui = new dat.GUI({ closed: true });

        gui.add(this._guiSettings, 'clearOpacity', [0.01, 1])
            .onChange(() => { this._settingsUpdateHandler('clearOpacity') });
        gui.add(this._guiSettings, 'speed', 0, 10)
            .onChange(() => { this._settingsUpdateHandler('speed') })
            .step(0.1);
        gui.add(this._guiSettings, 'rotationSpeedFactor', 0, 500)
            .step(0.1)
            .onChange(() => { this._settingsUpdateHandler('rotationSpeedFactor') });
        gui.add(this._guiSettings, 'dephasingFactor', 0, 2)
            .step(0.00001)
            .onChange(() => { this._settingsUpdateHandler('dephasingFactor') });
    }

    _setupComponents() {
        // this.components.NoiseCircle = new NoiseCircleComponent(0, this._boxes[0], this._ctx);
        this.SoundManager = new SoundManager();
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

        if(!this._speedAnimationStarted) return;
        this._speedAnim += 0.01;
        this._guiSettings.dephasingFactor = Modulo(this._speedAnim, 2);
        this._settingsUpdateHandler('dephasingFactor', this._guiSettings.dephasingFactor);

    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
        window.addEventListener('resize', this._resizeHandler);
        this._canvas.addEventListener('mousemove', this._mousemoveHandler);
        setTimeout(() => {
            this._canvas.addEventListener('mousedown', this._mousedownHandler);
            this._canvas.addEventListener('mouseup', this._mouseupHandler);
        }, 8500);
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

    _mousedownHandler() {
        this._speedAnimationStarted = true;
        TweenLite.to(this._guiSettings, 2, { speed: 0.8 * 0.2, onUpdate: () => {
            this._settingsUpdateHandler('speed', this._guiSettings.speed);
        }
    });
    this.SoundManager.slowDown();
}

_mouseupHandler() {
    this._speedAnimationStarted = false;
    TweenLite.to(this._guiSettings, 2, { speed: 0.8 * 1, onUpdate: () => {
        this._settingsUpdateHandler('speed', this._guiSettings.speed)
    }});
    this.SoundManager.resetSpeed();
    }
}

export default CanvasComponent;