'use strict';

import { setInterval } from '../../../common/scripts/timers-promises.js';

/**
 * カウントダウンを行うタイマーのクラスです
 */
export class CountDownTimer {

  /**
   * タイマーの長さ (センチ秒: 100分の1秒)
   * 
   * @type {number}
   */
  duration_cs;

  /**
   * タイマーの残り時間 (センチ秒: 100分の1秒)
   * 
   * @type {number}
   */
  currentTime_cs;

  /**
   * タイマーがカウントダウン中かどうかを表します  
   * タイマー作動中に `false` を代入するとタイマーが停止します  
   * `start()` 、 `pause()` 、 `reset()` によって制御されるため、通常この変数を直接操作することはありません
   * 
   * @private
   * @type {boolean}
   */
  #isCountingDown = false;

  /**
   * カウントダウン中に実行されるコールバック関数です
   * 
   * @function
   * @type {() => void}
   */
  onCountingDown;

  /**
   * 秒の位の値が減少した時に実行されるコールバック関数です
   * 
   * @function
   * @type {() => void}
   */
  onCountingSeconds;

  /**
   * タイマーのカウントダウンが終了したかどうか (残り0秒かどうか) を表します
   * 
   * @readonly
   * @type {boolean}
   */
  get isFinished() {
    return this.currentTime_cs === 0;
  }

  /**
   * UIに表示する時間の文字列を表します
   * 
   * @readonly
   * @type {string}
   */
  get textContent() {

    /**
     * 時刻表示用に、小数点以下を切り捨てし、1桁のときはゼロ埋めした、2桁以上の数値の文字列にフォーマットします
     * @param {number} number フォーマットする数値
     * @returns {string} フォーマットされた数値の文字列
     */
    function format(number) {
      const int = Math.floor(number)
      if (int < 10) {
        return `0${int}`;
      } else {
        return String(int);
      }
    }

    // 返り値を生成
    const minute = this.currentTime_cs / 100 / 60;
    const second = this.currentTime_cs / 100 % 60;
    const centiSecond = this.currentTime_cs % 100;
    return `${format(minute)}:${format(second)}.${format(centiSecond)}`;

  }

  /**
   * `CountDownTimer` のインスタンスを生成します
   * 
   * @param {number} duration_ms タイマーの長さ (ミリ秒) 100分の1秒単位で演算が行われるため、1の位の値は無視されます
   * @param {() => void} onCountingDown カウントダウン中に実行されるコールバック関数
   * @param {() => void} onCountingSeconds 秒の位の値が減少した時に実行されるコールバック関数
   */
  constructor(duration_ms, onCountingDown, onCountingSeconds) {
    this.duration_cs = Math.floor(duration_ms / 10);
    this.currentTime_cs = this.duration_cs;
    this.onCountingDown = onCountingDown;
    this.onCountingSeconds = onCountingSeconds;
  }

  /**
   * タイマーの長さを設定します
   * 
   * @param {number} duration_ms タイマーの長さ (ミリ秒)
   */
  setDuration(duration_ms) {
    this.duration_cs = Math.floor(duration_ms / 10);
    this.currentTime_cs = Math.floor(duration_ms / 10);
  }

  /**
   * タイマーを開始します
   * 
   * @async
   */
  async start() {

    // 残り時間が0秒以下のときは早期リターン
    if (this.currentTime_cs <= 0) {
      return;
    }

    // 関数呼び出し時の日時と `this.currentTime_cs` を取得
    const dateOnStart = new Date();
    const currentTimeOnStart_cs = this.currentTime_cs;

    // `this.onCountingSeconds()` の実行の制御に使用される、 `this.currentTime_cs` の一つ前の値
    let previousTime_cs = this.currentTime_cs;

    // `this.isCountingDown` の値を更新
    this.#isCountingDown = true;

    for await (const i of setInterval(10)) { // 10 ms 間隔でループ処理

      // ループ呼び出し時の日時と `start()` 呼び出し時の日時から経過時間を計算
      // 開発当初は `this.currentTime_cs += 1` としていたが、`setInterval()` によって無視できないレベルの時間の誤差が発生したため、現在時刻と開始時刻の差分で計算するように変更
      const date = new Date();
      this.currentTime_cs = currentTimeOnStart_cs - (date.getTime() - dateOnStart.getTime()) / 10;

      // カウントダウン中のコールバックを実行
      this.onCountingDown();

      // `this.currentTime_cs` が `0` 以下になったらタイマーを停止
      if (this.currentTime_cs <= 0) {
        this.currentTime_cs = 0;
        this.pause();
      }

      // `this.onCountingSeconds()` を実行
      if (Math.floor(this.currentTime_cs / 100) < Math.floor(previousTime_cs / 100)) {
        this.onCountingSeconds();
      }
      previousTime_cs = this.currentTime_cs;

      // `this.#isCountingDown` に `false` が代入されたらループを終了、タイマーを停止
      if (!this.#isCountingDown) {
        break;
      }
    }
  }

  /**
   * タイマーを一時停止します
   */
  pause() {
    this.#isCountingDown = false;
  }

  /**
   * タイマーをリセットします
   */
  reset() {
    this.#isCountingDown = false;
    this.currentTime_cs = this.duration_cs;
  }

}

/**
 * `RohdompoTimer.state` の値を静的プロパティに持つクラスです
 */
export class RohdomopoTimerState {

  /**
   * "五分間の徒労" 状態を表します
   * 
   * @readonly
   * @type {string}
   */
  static get HELL() {
    return 'hell'
  }

  /**
   * "二十五分間の解放" 状態を表します
   * 
   * @readonly
   * @type {string}
   */
  static get HEAVEN() {
    return 'heaven';
  }

  /**
   * タイマー開始前状態を表します
   * 
   * @readonly
   * @type {string}
   */
  static get NORMAL() {
    return 'normal';
  }

}

/**
 * "ロードモポ" で使用される2つの状態を持ったタイマーを表すクラスです
 */
export class RohdomopoTimer {

  /**
   * "五分間の徒労" 状態用の `CountDownTimer` のインスタンス
   * 
   * @type {CountDownTimer}
  */
  hellTimer;
 
  /**
   * "二十五分間の解放" 状態用の `CountDownTimer` のインスタンス
   * 
   * @type {CountDownTimer}
  */
  heavenTimer;

  /**
   * 状態が変化した際に呼び出されるコールバック
   * 
   * @function
   * @type {(state: string) => void}
   */
  onStateChanged;

  /**
   * カウントダウン中かどうかを表します  
   * `false` を代入するとタイマーが停止します  
   * `start()`　、 `pause()` によって制御され、通常この変数を直接操作することはありません
   * 
   * @private
   * @type {boolean}
   */
  #isCountingDown = false;

  /**
   * カウントダウン中かどうかを表します
   * 
   * @readonly
   * @type {boolean}
   */
  get isCountingDown() {
    return this.#isCountingDown;
  }

  /**
   * タイマーの状態を表すバッキングフィールドです  
   * `RohdomopoTimerState` のプロパティの値になります
   * 
   * @private
   * @type {string}
   */
  #state = RohdomopoTimerState.NORMAL;

  /**
   * タイマーの状態を表します  
   * `RohdomopoTimerState` のプロパティの値になります
   * 
   * @readonly
   * @type {string}
   */
  get state() {
    return this.#state;
  }

  /**
   * タイマーの残り時間 (センチ秒: 100分の1秒)  
   * `state` に応じた残り時間を取得します
   * 
   * @readonly
   * @type {number}
   */
  get currentTime_cs() {
    if (this.state === RohdomopoTimerState.HELL) { // "五分間の徒労" 時は `this.hellTimer` の時間を返す
      return this.hellTimer.currentTime_cs;
    } else if (this.state === RohdomopoTimerState.HEAVEN) { // "二十五分間の解放" 時は `this.heavenTimer` の値を返す
      return this.heavenTimer.currentTime_cs;
    } else {
      return 0;
    }
  }

  /**
   * タイマーのUIに表示する文字列です  
   * 状態に合わせてそれぞれのタイマーからの値を表示します
   * 
   * @readonly
   * @type {string}
   */
  get textContent() {
    if (this.state === RohdomopoTimerState.HELL) { // "五分間の徒労" 時は `this.hellTimer` の時間を返す
      return this.hellTimer.textContent;
    } else if (this.state === RohdomopoTimerState.HEAVEN) { // "二十五分間の解放" 時は `this.heavenTimer` の値を返す
      return this.heavenTimer.textContent;
    } else if (this.state === RohdomopoTimerState.NORMAL) { // タイマー開始前は `this.hellTimer` の時間を返す
      return this.hellTimer.textContent;
    } else {
      return '';
    }
  }

  /**
   * `RohdomopoTimer` のインスタンスを生成します
   * 
   * @param {number} hellDuration_ms "五分間の徒労" 状態用タイマーの長さ (ミリ秒) 100分の1秒単位で演算が行われるため、1の位の値は無視されます
   * @param {number} heavenDuration_ms "二十五分間の解放" 状態用のタイマーの長さ (ミリ秒) 100分の1秒単位で演算が行われるため、1の位の値は無視されます
   * @param {() => void} onCountingDown カウントダウン中に実行されるコールバック関数
   * @param {() => void} onCountingSeconds 秒の位の値が減少した時に実行されるコールバック関数
   * @param {(state: string) => void} onStateChanged 状態が変化した際に実行されるコールバック関数
   */
  constructor(
    hellDuration_ms,
    heavenDuration_ms,
    onCountingDown,
    onCountingSeconds,
    onStateChanged
  ) {
    this.hellTimer = new CountDownTimer(hellDuration_ms, onCountingDown, onCountingSeconds);
    this.heavenTimer = new CountDownTimer(heavenDuration_ms, onCountingDown, onCountingSeconds);
    this.onStateChanged = onStateChanged;
  }

  /**
   * タイマーの状態を切り替えます
   * 
   * @param {string} state `RohdomopoTimerState` のプロパティの値
   */
  switchState(state) {
    if (state === RohdomopoTimerState.HELL) {
      this.#state = RohdomopoTimerState.HELL;
      this.hellTimer.reset();
      this.heavenTimer.reset();
      this.onStateChanged(state);
    } else if (state === RohdomopoTimerState.HEAVEN) {
      this.#state = RohdomopoTimerState.HEAVEN;
      this.hellTimer.reset();
      this.heavenTimer.reset();
      this.onStateChanged(state);
    }
  }

  /**
   * タイマーを開始します
   * 
   * @async
   */
  async start() {

    // タイマー稼働中は早期リターン
    if (this.#isCountingDown) {
      return;
    }

    // 初回呼び出し時に状態を "五分間の徒労" に変更
    if (this.state != RohdomopoTimerState.HELL && this.state != RohdomopoTimerState.HEAVEN) {
      this.switchState(RohdomopoTimerState.HELL);
    }

    // `this.isCountingDown` の値を更新
    this.#isCountingDown = true;

    while (this.#isCountingDown) { // タイマー稼働開始、一時停止するまでループ処理
      if (this.state === RohdomopoTimerState.HELL) { // "五分間の徒労" 状態時

        // "五分間の徒労" タイマーを開始
        await this.hellTimer.start();
        // タイマー一時停止もしくは終了まで待機

        // タイマー終了時には "二十五分間の解放" 状態に切り替え
        if (this.hellTimer.isFinished) {
         this.switchState(RohdomopoTimerState.HEAVEN);
        }

      } else if (this.state === RohdomopoTimerState.HEAVEN) { // "二十五分間の解放" 状態時

        // "二十五分間の解放" タイマーを開始
        await this.heavenTimer.start();
        // タイマー一時停止もしくは終了まで待機

        // タイマー終了時には "五分間の徒労" 状態に切り替え
        if (this.heavenTimer.isFinished) {
          this.switchState(RohdomopoTimerState.HELL);
        }
      }
    }
  }

  /**
   * タイマーを停止します
   */
  pause() {
    this.hellTimer.pause();
    this.heavenTimer.pause();
    this.#isCountingDown = false;
  }

}
