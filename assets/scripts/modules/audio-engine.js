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
   * 音量を調節する `GainNode` のインスタンス
   * 
   * @type {GainNode}
   */
  gainNode;

  /**
   * 音量の値 (`0.0` 〜 `1.0`)
   * 
   * @type {number}
   */
  get gain() {
    return this.gainNode.gain.value;
  }

  /**
   * 音量の値 (`0.0` 〜 `1.0`)
   * 
   * @type {number}
   */
  set gain(newValue) {
    this.gainNode.gain.value = newValue;
  }

  /**
   * hell.mp3 の HTML からの相対パス
   * 
   * @type {string}
   */
  hellAudioPath;

  /**
   * heaven.mp3 の HTML からの相対パス
   * 
   * @type {string}
   */
  heavenAudioPath;

  /**
   * count.mp3 の HTML からの相対パス
   * 
   * @type {string}
   */
  countAudioPath;

  /**
   * `AudioContext.decodeAudioData()` で取得した、 hell.mp3 の `AudioBuffer` のインスタンス
   * 
   * @type {AudioBuffer}
   */
  hellAudioBuffer = null;

  /**
   * `AudioContext.decodeAudioData()` で取得した、 heaven.mp3 の `AudioBuffer` のインスタンス
   * 
   * @type {AudioBuffer}
   */
  heavenAudioBuffer = null;

  /**
   * `AudioContext.decodeAudioData()` で取得した、 count.mp3 の `AudioBuffer` のインスタンス
   * 
   * @type {AudioBuffer}
   */
  countAudioBuffer = null;

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

    this.hellAudioPath = hellAudioPath;
    this.heavenAudioPath = heavenAudioPath;
    this.countAudioPath = countAudioPath;

  }

  /** 
   * 音声を再生します
   * 
   * @param {AudioBuffer} audioBuffer 再生する音声の `AudioBuffer`
   * @param {string} fileName 再生失敗時のエラーメッセージに表示するオーディオファイルの名前
   * @throws
   */
  #playAudio(audioBuffer, fileName) {
    
    if (audioBuffer === null) {
      throw new Error(`Audio file ${fileName} not loaded.`);
    }

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
   * 
   * @throws
   */
  playHellAudio() {
    this.#playAudio(this.hellAudioBuffer, 'hell.mp3');
  }

  /**
   * heaven.mp3 を再生します
   * 
   * @throws
   */
  playHeavenAudio() {
    this.#playAudio(this.heavenAudioBuffer, 'heaven.mp3');
  }

  /**
   * count.mp3 を再生します
   * 
   * @throws
   */
  playCountAudio() {
    this.#playAudio(this.countAudioBuffer, 'count.mp3');
  }

  /**
   * オーディオファイルを読み込みます
   * 
   * @async
   */
  async load() {
    
    /**
     * 個別のオーディオファイルを読み込み、 `AudioBuffer` をメンバに代入します
     * 
     * @async
     * @param {string} path オーディオのパス
     * @param {(audioBuffer: AudioBuffer) => void} assignAudioBuffer `AudioBuffer` をメンバに代入するコールバック
     */
    let loadIndividualAudio = async (path, assignAudioBuffer) => {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      assignAudioBuffer(audioBuffer);
    }

    const promises = [
      loadIndividualAudio(this.hellAudioPath, (audioBuffer) => {
        this.hellAudioBuffer = audioBuffer;
      }),
      loadIndividualAudio(this.heavenAudioPath, (audioBuffer) => {
        this.heavenAudioBuffer = audioBuffer;
      }),
      loadIndividualAudio(this.countAudioPath, (audioBuffer) => {
        this.countAudioBuffer = audioBuffer;
      })
    ];

    await Promise.all(promises);

  }

  /**
   * `AudioContext` を破棄して終了します
   */
  close() {
    this.audioContext.close();
  }

}
