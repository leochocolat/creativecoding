import _ from 'underscore';
import { TweenLite } from 'gsap';

class SoundManager {

    constructor() {
        _.bindAll(this, '_onAudioReadyHandler');
        this._tweenObject = {
            playBackRate: 1
        }
        this._last = 0;
        this._setup();
    }

    _setup() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();
        let request = new XMLHttpRequest();
        
        //48bpm
        request.open("GET", "../../sounds/shanghai.mp3", true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            this._audioContext.decodeAudioData(request.response, this._onAudioReadyHandler);
        }
        request.send();
    }

    play(buffer) {
        this._bufferSource = this._audioContext.createBufferSource();
        this._bufferSource.buffer = buffer;
        this._bufferSource.loop = true;
        this._bufferSource.connect(this._audioContext.destination);
        this._bufferSource.start();
    }
    
    updatePlayBackRate(value) {
        this._bufferSource.playbackRate.value = value;
    }

    slowDown() {
        TweenLite.to(this._tweenObject, 2, { playBackRate: 0.5, onUpdate: () => { this.updatePlayBackRate(this._tweenObject.playBackRate) } });
    }
    
    resetSpeed() {
        TweenLite.to(this._tweenObject, 2, { playBackRate: 1, onUpdate: () => { this.updatePlayBackRate(this._tweenObject.playBackRate) } });
    }

    _setupAnalyser() {
        this._analyser = this._audioContext.createAnalyser();
        this._analyser.fftSize = 2048;
        this._microphone.connect(this._analyser);
    }

    _onAudioReadyHandler(buffer) {
        this.play(buffer);
    }
}

export default SoundManager;
