import { RohdomopoTimer } from './rohdomopo-timer.js';

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
   * @param {HTMLHeadingElement} stateHeadingElement DOMで取得したタイマーの状態を表示する `<h1>` 要素
   * @param {HTMLParagraphElement} stateMessageElement DOMで取得した文学的な指示文を表示する `<p>` 要素
   * @param {HTMLParagraphElement} timerDisplayElement DOMで取得したタイマーの残り時間を表示する `<p>` 要素
   * @param {HTMLButtonElement} startPauseButtonElement DOMで取得したカウントダウンを開始・停止する `<button>` 要素
   */
  constructor(
    body,
    soundDialogElement,
    stateHeadingElement,
    stateMessageElement,
    timerDisplayElement,
    startPauseButtonElement,
  ) {
    this.body = body;
    this.soundDialogElement = soundDialogElement;
    this.stateHeadingElement = stateHeadingElement;
    this.stateMessageElement = stateMessageElement;
    this.timerDisplayElement = timerDisplayElement;
    this.startPauseButtonElement = startPauseButtonElement;

    this.rohdomopoTimer = new RohdomopoTimer(
      5 * 1000,
      25 * 1000,
      this.onStateChanged
    );
  }

  /**
   * `rohdomopoTimer.state` が変化した際に呼び出されるコールバックです
   * 
   * @param {string} state `rohdomopoTimer.state` の値 `hell` もしくは `heaven` です
   */
  onStateChanged = (state) => {
    if (state === 'hell') {
      this.body.classList.remove('heaven');
      this.body.classList.add('hell');
      this.stateHeadingElement.textContent = '五分間の徒労 〜 人間性の剥奪';
      this.stateMessageElement.textContent = '問うな。理由を求める時間は終わった。ただキーボードを叩け。';
    } else if (state === 'heaven') {
      this.body.classList.remove('hell');
      this.body.classList.add('heaven');
      this.stateHeadingElement.textContent = '二十五分間の解放 〜 人間性の奪還';
      this.stateMessageElement.textContent = '見上げよ。世界は彩りに満ちている。思考の翼を広げ、どこへでも飛んでゆけ。';
    }
  }

  /**
   * タイマーUIのアニメーション (UI更新) を要求します
   * 
   * @type {() => void}
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
   * 起動時に行う動作です Webページ表示時に実行します
   * 
   * @async
   */
  async initialize() {
    this.soundDialogElement.showModal();
    this.startPauseButtonElement.addEventListener('click', this.onClickStartPauseButton);
  }

}
