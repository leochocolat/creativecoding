import _ from 'underscore';

class SoundManager {

  constructor() {
    _.bindAll(this, '_onAudioReadyHandler');
    this._last = 0;
    this._setup();
  }

  _setup() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this._audioContext = new AudioContext();
    let request = new XMLHttpRequest();
    
    //48bpm
    request.open("GET", "../../assets/sounds/shanghai.mp3", true);
    request.responseType = "arraybuffer";
    request.onload = () => {
        this._audioContext.decodeAudioData(request.response, this._onAudioReadyHandler);
    }
    request.send();
  }

  play(buffer) {
    var bufferSource = this._audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(this._audioContext.destination);
    bufferSource.start();
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
