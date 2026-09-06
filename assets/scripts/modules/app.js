'use strict';

import { RohdomopoTimer, RohdomopoTimerState } from './rohdomopo-timer.js';

/**
 * `RohdomopoTimer` とUIを橋渡しし、アプリを実行するクラス
 */
export class RohdomopoApp {

  /**
   * DOMで取得した HTML の `<body>`
   * 
   * @type {HTMLBodyElement}
   */
  body;

  /**
   * DOMで取得した "このWebアプリでは音声が流れます" ダイアログの要素
   * 
   * @type {HTMLDialogElement}
   */
  soundDialogElement;

  /**
   * DOMで取得した hell.mp3 を再生する `<audio>` 要素
   * 
   * @type {HTMLAudioElement}
   */
  hellAudioElement;

  /**
   * DOMで取得した heaven.mp3 を再生する `<audio>` 要素
   * 
   * @type {HTMLAudioElement}
   */
  heavenAudioElement;

  /**
   * DOMで取得したタイマーの状態を表示する `<h1>` 要素
   * 
   * @type {HTMLHeadingElement}
   */
  stateHeadingElement;

  /**
   * DOMで取得した文学的な指示文を表示する `<p>` 要素
   * 
   * @type {HTMLParagraphElement}
   */
  stateMessageElement;

  /**
   * DOMで取得したタイマーの残り時間を表示するパラグラフ要素
   * 
   * @type {HTMLParagraphElement}
   */
  timerDisplayElement;

  /**
   * DOMで取得した "カウントダウンを開始・停止" ボタンの要素
   * 
   * @type {HTMLButtonElement}
   */
  startPauseButtonElement;

  /**
   * アプリで使用する `RohdomopoTimer` のインスタンス
   * 
   * @type {RohdomopoTimer}
   */
  rohdomopoTimer;

  /**
   * `window.requestAnimationFrame()` の返り値である requestId
   * 
   * @type {number | null}
   */
  requestAnimationId = null;

  /**
   * `RohdomopoApp` のインスタンスを生成します
   * 
   * @param {HTMLBodyElement} body DOMで取得した HTML の `<body>`
   * @param {HTMLDialogElement} soundDialogElement DOMで取得した "このWebアプリでは音声が流れます" と表示する `<dialog>` 要素
   * @param {HTMLAudioElement} hellAudioElement DOMで取得した hell.mp3 を再生する `<audio>` 要素
   * @param {HTMLAudioElement} heavenAudioElement DOMで取得した heaven.mp3 を再生する `<audio>` 要素
   * @param {HTMLHeadingElement} stateHeadingElement DOMで取得したタイマーの状態を表示する `<h1>` 要素
   * @param {HTMLParagraphElement} stateMessageElement DOMで取得した文学的な指示文を表示する `<p>` 要素
   * @param {HTMLParagraphElement} timerDisplayElement DOMで取得したタイマーの残り時間を表示する `<p>` 要素
   * @param {HTMLButtonElement} startPauseButtonElement DOMで取得したカウントダウンを開始・停止する `<button>` 要素
   * @param {number} hellTimerDuration_ms "五分間の徒労" 状態タイマーの時間 (ミリ秒)
   * @param {number} heavenTimerDuration_ms "二十五分間の解放" 状態タイマーの時間 (ミリ秒)
   */
  constructor(
    body,
    soundDialogElement,
    hellAudioElement,
    heavenAudioElement,
    stateHeadingElement,
    stateMessageElement,
    timerDisplayElement,
    startPauseButtonElement,
    hellTimerDuration_ms = 5 * 60 * 1000,
    heavenTimerDuration_ms = 25 * 60 * 1000
  ) {
    this.body = body;
    this.soundDialogElement = soundDialogElement;
    this.hellAudioElement = hellAudioElement;
    this.heavenAudioElement = heavenAudioElement;
    this.stateHeadingElement = stateHeadingElement;
    this.stateMessageElement = stateMessageElement;
    this.timerDisplayElement = timerDisplayElement;
    this.startPauseButtonElement = startPauseButtonElement;

    this.rohdomopoTimer = new RohdomopoTimer(
      hellTimerDuration_ms,
      heavenTimerDuration_ms,
      this.onCountingDown,
      this.onStateChanged
    );
  }

  /**
   * カウントダウン中に実行されるコールバック関数です
   * 
   * @type {() => void}
   */
  onCountingDown = () => {
    const oneMinuteLeftClassName = 'one-minute-left'
    const currentTime_cs = this.rohdomopoTimer.currentTime_cs;
    if (currentTime_cs < 60 * 100 && !this.timerDisplayElement.classList.contains(oneMinuteLeftClassName)) {
      this.timerDisplayElement.classList.add(oneMinuteLeftClassName);
    } else if (currentTime_cs > 60 * 100 && this.timerDisplayElement.classList.contains(oneMinuteLeftClassName)) {
      this.timerDisplayElement.classList.remove(oneMinuteLeftClassName);
    }
  }

  /**
   * `rohdomopoTimer.state` が変化した際に呼び出されるコールバックです
   * 
   * @function
   * @param {string} state `rohdomopoTimer.state` の値 `hell` もしくは `heaven` です
   */
  onStateChanged = (state) => {
    if (state === RohdomopoTimerState.HELL) {
      this.body.classList.remove('heaven');
      this.body.classList.add('hell');

      this.stateHeadingElement.textContent = '五分間の徒労 〜 人間性の剥奪';
      this.stateMessageElement.textContent = '問うな。理由を求める時間は終わった。ただキーボードを叩け。';

      try {
        this.hellAudioElement.play();
      } catch(error) {
        console.error(`\"hell.mp3\" の再生に失敗しました\n${error.message}`);
      }
    } else if (state === RohdomopoTimerState.HEAVEN) {
      this.body.classList.remove('hell');
      this.body.classList.add('heaven');
      this.stateHeadingElement.textContent = '二十五分間の解放 〜 人間性の奪還';
      this.stateMessageElement.textContent = '見上げよ。世界は彩りに満ちている。思考の翼を広げ、どこへでも飛んでゆけ。';

      try {
        this.heavenAudioElement.play();
      } catch(error) {
        console.error(`\"heaven.mp3\" の再生に失敗しました\n${error.message}`);
      }
    }
  }

  /**
   * タイマーUIのアニメーション (UI更新) を要求します
   * 
   * @function
   */
  requestUpdatingTimerDisplay = () => {
    this.timerDisplayElement.textContent = this.rohdomopoTimer.textContent;
    this.requestAnimationId = window.requestAnimationFrame(this.requestUpdatingTimerDisplay);
  }

  /**
   * タイマーUIのアニメーション (UI更新) をキャンセルします
   * 
   * @async
   */
  async cancelUpdatingTimerDisplay() {
    if (this.requestAnimationId != null) {
      window.cancelAnimationFrame(this.requestAnimationId);
      this.requestAnimationId = null;
    }
  }

  /**
   * "カウントダウンを開始・停止" ボタンがクリックされた際の動作です
   * 
   * @type {() => void}
   */
  onClickStartPauseButton = () => {
    if (this.rohdomopoTimer.isCountingDown) {
      this.rohdomopoTimer.pause();
      this.cancelUpdatingTimerDisplay();
      this.startPauseButtonElement.textContent = 'カウントダウンを再開';
    } else {
      this.rohdomopoTimer.start();
      this.requestUpdatingTimerDisplay();
      this.startPauseButtonElement.textContent = 'カウントダウンを一時停止';
    }
  }

  /**
   * 起動時に行う動作です  
   * Webページ表示時に実行します
   */
  initialize() {
    this.soundDialogElement.showModal();
    this.startPauseButtonElement.addEventListener('click', this.onClickStartPauseButton);
  }

}
