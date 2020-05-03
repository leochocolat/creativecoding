import _ from 'underscore';
import { TweenLite, TweenMax, Power0 } from 'gsap';

import CanvasComponent from './components/CanvasComponent';
import SoundManager from './components/SoundManager';

class App {
    constructor() {
        _.bindAll(this, '_audioLoadedHandler', '_startClickHandler');

        this._setup();
    }

    start() {
        this._canvasComponent.start();
        this._soundManager.play();
    }

    _introAnimation() {
        TweenMax.staggerFromTo('.btn__start span', 1.5, { y: 100 }, { y: 0, ease: Power3.easeOut }, -0.08);
    }

    _setup() {
        this._setupSoundManager();
        this._setupCanvas();
        this._setupEventListeners();
    }

    _setupCanvas() {
        this._canvasComponent = new CanvasComponent({
            el: document.querySelector('.js-canvas'),
            modules: { soundManager: this._soundManager }
        });
    }

    _setupSoundManager() {
        this._soundManager = new SoundManager();
        this._soundManager.loadAudio().then(this._audioLoadedHandler);
    }

    _setupEventListeners() {
        document.querySelector('.btn__start').addEventListener('click', this._startClickHandler);
    }

    _startClickHandler() {
        this.start();
        TweenLite.to('.btn__start', .5, { autoAlpha: 0 });
    }

    _audioLoadedHandler() {
        this._introAnimation();
    }
}

export default new App();