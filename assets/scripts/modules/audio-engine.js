/**
 * @returns {AudioContext}
 */
export function getAudioContext() {
  
}

export class AudioEngine {

  /**
   * @type {AudioContext}
   */
  audioContext;

  /**
   * @type {AudioBuffer}
   */
  hellAudioBuffer;

  /**
   * @type {AudioBuffer}
   */
  heavenAudioBuffer;

  /**
   * 
   * @param {string} hellAudioPath 
   * @param {string} heavenAudioPath 
   */
  constructor(
    hellAudioPath,
    heavenAudioPath
  ) {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    /**
     * @param {string} path オーディオのパス
     * @param {(audioBuffer: AudioBuffer) => void} assignAudioBuffer AudioBuffer をメンバに代入する関数
     */
    let load = (path, assignAudioBuffer) => {
      fetch(path)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => assignAudioBuffer(audioBuffer));
    }
    load(
      hellAudioPath, 
      (audioBuffer) => {
        this.hellAudioBuffer = audioBuffer;
      }
    );
    load(
      heavenAudioPath,
      (audioBuffer) => {
        this.heavenAudioBuffer = audioBuffer;
      }
    );

  }

  /**
   * 
   * @param {AudioBuffer} audioBuffer 
   */
  #playAudio(audioBuffer) {
    
    if (audioBuffer === null) return;

    // iOS Safari 対策
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  playHellAudio() {
    this.#playAudio(this.hellAudioBuffer);
  }

  playHeavenAudio() {
    this.#playAudio(this.heavenAudioBuffer);
  }

}
