/**
 * 音声を再生するクラス
 */
export class AudioEngine {

  /**
   * `AudioContext` のインスタンス
   * 
   * @type {AudioContext}
   */
  audioContext;

  /**
   * 音量を調節するノード
   * 
   * @type {GainNode}
   */
  gainNode;

  /**
   * 音量の値 (`0.0` 〜 `1.0`)
   */
  get gain() {
    return this.gainNode.gain.value;
  }

  /**
   * 音量の値 (`0.0` 〜 `1.0`)
   */
  set gain(newValue) {
    this.gainNode.gain.value = newValue
  }

  /**
   * `AudioContext.decodeAudioData()` で取得した、 hell.mp3 の `AudioBuffer` のインスタンス
   * 
   * @type {AudioBuffer}
   */
  hellAudioBuffer;

  /**
   * `AudioContext.decodeAudioData()` で取得した、 heaven.mp3 の `AudioBuffer` のインスタンス
   * 
   * @type {AudioBuffer}
   */
  heavenAudioBuffer;

  /**
   * `AudioContext.decodeAudioData()` で取得した、 count.mp3 の `AudioBuffer` のインスタンス
   * 
   * @type {AudioBuffer}
   */
  countAudioBuffer;

  /**
   * `AudioEngine` のインスタンスを生成します
   * 
   * @param {string} hellAudioPath hell.mp3 の HTML からの相対パス
   * @param {string} heavenAudioPath heaven.mp3 の HTML からの相対パス
   * @param {string} countAudioPath count.mp3 の HTML からの相対パス
   */
  constructor(
    hellAudioPath,
    heavenAudioPath,
    countAudioPath
  ) {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.gainNode = this.audioContext.createGain();

    /**
     * オーディオを読み込みます
     * 
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
    load(
      countAudioPath,
      (audioBuffer) => {
        this.countAudioBuffer = audioBuffer;
      }
    )

  }

  /** 
   * 音声を再生します
   * 
   * @param {AudioBuffer} audioBuffer 再生する音声の `AudioBuffer`
   */
  #playAudio(audioBuffer) {
    
    if (audioBuffer === null) return;

    // iOS Safari 対策
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    source.start(0);

  }

  /**
   * hell.mp3 を再生します
   */
  playHellAudio() {
    this.#playAudio(this.hellAudioBuffer);
  }

  /**
   * heaven.mp3 を再生します
   */
  playHeavenAudio() {
    this.#playAudio(this.heavenAudioBuffer);
  }

  /**
   * count.mp3 を再生します
   */
  playCountAudio() {
    this.#playAudio(this.countAudioBuffer);
  }

  /**
   * `AudioContext` を破棄して終了します
   */
  close() {
    this.audioContext.close();
  }

}
