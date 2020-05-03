import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as dat from 'dat.gui';
import Modulo from '../utils/Modulo';

//components
import NoiseCircleComponent from './NoiseCircleComponent';
import CircleInceptionComponent from './CircleInceptionComponent';

class CanvasComponent {
    constructor(options) {
        _.bindAll(
            this, 
            '_tickHandler',
            '_resizeHandler',
            '_settingsUpdateHandler',
            '_mousedownHandler',
            '_mouseupHandler'
        );

        this.el = options.el;
        this.modules = options.modules;
        this.components = {};

        this._settings = {
            columns: 4,
            rows: 4
        }

        this._setup();
    }

    _setup() {
        this._setupDeltaTime();
        this._setupGUI();
        
        this._setupCanvas();
        this._resize();
        this._setupGrid();
        this._setupComponents();
    }

    _setupDeltaTime() {
        this._dateNow = Date.now()
        this._lastTime = this._dateNow;
        this._deltaTime = 16;
    }

    _setupGUI() {
        this._guiSettings = {
            clearOpacity: 1,
            globalClearOpacity: 1,
            speed: 0.4,
            rotationSpeedFactor: 50,
            dephasingFactor: 1,
        }

        this._speedAnim = this._guiSettings.dephasingFactor;

        const gui = new dat.GUI({ closed: true });

        gui.add(this._guiSettings, 'clearOpacity', 0, 1)
            .step(0.01)
            .onChange(() => { this._settingsUpdateHandler('clearOpacity') });
        gui.add(this._guiSettings, 'globalClearOpacity', 0, 1)
            .step(0.01)


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

    start() {
        setTimeout(() => {
            this._introAnimation();
            this._start();
        }, 2000);
    }

    _introAnimation() {
        let interval = 200;

        let index = 0;
        for (let i in this.components) {
            index++;
            setTimeout(() => {
                this.components[i].animateIn();
            }, index * interval)
        }

        setTimeout(() => {
            TweenLite.to(this._guiSettings, 1, { clearOpacity: 0.02, onUpdate: () => {
                this._settingsUpdateHandler('clearOpacity', this._guiSettings.clearOpacity);
            }});
        }, 8500);
    }

    _start() {
        this._setupEventListeners();
    }

    _setupCanvas() {
        this._canvas = this.el;
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

        this._centerBox = {
            x: 0,
            y: 0,
            width: this._width,
            height: this._height,
        }
    }

    _setupComponents() {
        const amount = this._boxes.length;
        
        for (let i = 0; i < amount; i++) {
            // this.components[`NoiseCircle${i}`] = new NoiseCircleComponent(i, this._boxes[i], this._ctx);
            // this.components[`CircleInception${i}`] = new CircleInceptionComponent(i, this._boxes[i], this._ctx);
            this.components[`CircleInception${i}`] = new CircleInceptionComponent(i, this._centerBox, this._ctx);  
        }
    }

    _updateDeltaTime() {
        this._dateNow = Date.now();
        this._deltaTime = this._dateNow - this._lastTime;
        this._lastTime = this._dateNow;
    }

    _tick() {
        this._updateDeltaTime();
        this._ctx.fillStyle = `rgba(0, 0, 0, ${this._guiSettings.globalClearOpacity})`;
        this._ctx.fillRect(0, 0, this._width, this._height);

        //try
        // this._drawLines();

        for (let i in this.components) {
            this.components[i].draw(this._deltaTime);
        }

        this._updateSpeed();
    }

    _drawLines() {
        let tangentPoints = [];
        let tangentOpositePoints = [];

        for (let i in this.components) {
            const circlePoints = this.components[i].getPoints();
            const tangentPoint = circlePoints[0];
            const tangentOpositePoint = circlePoints[1];

            tangentPoints.push(tangentPoint);
            tangentOpositePoints.push(tangentOpositePoint);
        }

        //tangent points
        this._ctx.strokeStyle = 'white';

        this._ctx.beginPath();

        this._ctx.moveTo(tangentPoints[0].x, tangentPoints[0].y);

        for (let i = 0; i < tangentPoints.length; i++) {
            const position = tangentPoints[i];
            this._ctx.lineTo(position.x, position.y);
        }
        
        this._ctx.stroke();
        this._ctx.closePath();

        //tangent oposite points
        this._ctx.strokeStyle = 'white';

        this._ctx.beginPath();

        this._ctx.moveTo(tangentOpositePoints[0].x, tangentOpositePoints[0].y);

        for (let i = 0; i < tangentOpositePoints.length; i++) {
            const position = tangentOpositePoints[i];
            this._ctx.lineTo(position.x, position.y);
        }
        
        this._ctx.stroke();
        this._ctx.closePath();

    }

    _updateSpeed() {
        if(!this._speedAnimationStarted) return;

        this._speedAnim += 0.01;
        this._guiSettings.dephasingFactor = Modulo(this._speedAnim, 2);
        this._settingsUpdateHandler('dephasingFactor', this._guiSettings.dephasingFactor);
    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);

        window.addEventListener('resize', this._resizeHandler);

        setTimeout(() => {
            this.el.addEventListener('mousedown', this._mousedownHandler);
            this.el.addEventListener('mouseup', this._mouseupHandler);
        }, 8500);
    }

    _tickHandler() {
        this._tick();
    } 

    _resizeHandler() {
        this._resize();
        this._setupGrid();
    }

    _settingsUpdateHandler(props) {
        for (let i in this.components) {
            this.components[i].updateSettings(props, this._guiSettings[props]);
        }
    }

    _mousedownHandler() {
        this._speedAnimationStarted = true;

        TweenLite.to(this._guiSettings, 2, { speed: 0.8 * 0.2, onUpdate: () => {
            this._settingsUpdateHandler('speed', this._guiSettings.speed);
        } });

        this.modules.soundManager.slowDown();
    }

    _mouseupHandler() {
        this._speedAnimationStarted = false;

        TweenLite.to(this._guiSettings, 2, { speed: 0.8 * 1, onUpdate: () => {
            this._settingsUpdateHandler('speed', this._guiSettings.speed)
        }});

        this.modules.soundManager.resetSpeed();
    }
}

export default CanvasComponent;