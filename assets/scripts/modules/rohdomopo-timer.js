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
    function format(number) {
      const int = Math.floor(number)
      if (int < 10) {
        return `0${int}`;
      } else {
        return String(int);
      }
    }
    const minute = this.currentTime_cs / 100 / 60;
    const second = this.currentTime_cs / 100 % 60;
    const centiSecond = this.currentTime_cs % 100;
    return `${format(minute)}:${format(second)}.${format(centiSecond)}`;
  }

  /**
   * `CountDownTimer` のインスタンスを生成します
   * 
   * @param {number} duration_ms タイマーの長さ (ミリ秒) 100分の1秒単位で演算が行われるため、1の位の値は無視されます
   * @param {() => void} onCountingDown カウントダウン中に実行されるコールバック関数です
   */
  constructor(duration_ms, onCountingDown) {
    this.duration_cs = Math.floor(duration_ms / 10);
    this.currentTime_cs = this.duration_cs;
    this.onCountingDown = onCountingDown;
  }

  /**
   * タイマーを開始します
   * 
   * @async
   */
  async start() {
    if (this.currentTime_cs <= 0) {
      return;
    }

    const dateOnStart = new Date();
    const currentTimeOnStart_cs = this.currentTime_cs;

    this.#isCountingDown = true;
    for await (const i of setInterval(10)) {
      const date = new Date();
      this.currentTime_cs = currentTimeOnStart_cs - (date.getTime() - dateOnStart.getTime()) / 10;

      this.onCountingDown();

      if (this.currentTime_cs <= 0) {
        this.currentTime_cs = 0;
        this.pause();
      }
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
   * タイマーの状態を表します  
   * `RohdomopoTimerState` のプロパティの値になります
   * 
   * @type {string}
   */
  set state(newValue) {
    this.#state = newValue;
    this.onStateChanged(this.#state);
  }

  /**
   * タイマーの残り時間 (センチ秒: 100分の1秒)  
   * `state` に応じた残り時間を取得します
   * 
   * @readonly
   * @type {number}
   */
  get currentTime_cs() {
    if (this.state === RohdomopoTimerState.HELL) {
      return this.hellTimer.currentTime_cs;
    } else if (this.state === RohdomopoTimerState.HEAVEN) {
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
    if (this.state === RohdomopoTimerState.HELL) {
      return this.hellTimer.textContent;
    } else if (this.state === RohdomopoTimerState.HEAVEN) {
      return this.heavenTimer.textContent;
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
   * @param {(state: string) => void} onStateChanged 状態が変化した際に呼び出されるコールバック関数
   */
  constructor(
    hellDuration_ms,
    heavenDuration_ms,
    onCountingDown,
    onStateChanged
  ) {
    this.hellTimer = new CountDownTimer(hellDuration_ms, onCountingDown);
    this.heavenTimer = new CountDownTimer(heavenDuration_ms, onCountingDown);
    this.onStateChanged = onStateChanged;
  }

  /**
   * タイマーを開始します
   * 
   * @async
   */
  async start() {
    if (this.#isCountingDown) {
      return;
    }

    if (this.state != RohdomopoTimerState.HELL && this.state != RohdomopoTimerState.HEAVEN) {
      this.state = RohdomopoTimerState.HELL;
    }

    this.#isCountingDown = true;
    while (this.#isCountingDown) {
      if (this.state === RohdomopoTimerState.HELL) {
        await this.hellTimer.start();
        if (this.hellTimer.isFinished) {
          this.state = RohdomopoTimerState.HEAVEN;
          this.hellTimer.reset();
        }
      } else if (this.state === RohdomopoTimerState.HEAVEN) {
        await this.heavenTimer.start();
        if (this.heavenTimer.isFinished) {
          this.state = RohdomopoTimerState.HELL;
          this.heavenTimer.reset();
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
