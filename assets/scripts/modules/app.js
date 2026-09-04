import { RohdomopoTimer } from './rohdomopo-timer.js';

/**
 * `RohdomopoTimer` とUIを橋渡しし、アプリを実行するクラス
 */
export class RohdomopoApp {

  /**
   * DOMで取得した "このWebアプリでは音声が流れます" ダイアログの要素
   * @type {HTMLDialogElement}
   */
  soundDialogElement;

  /**
   * DOMで取得したタイマーの残り時間を表示するパラグラフ要素
   * @type {HTMLParagraphElement}
   */
  timerDisplayElement;

  /**
   * DOMで取得した "カウントダウンを開始・停止" ボタンの要素
   * @type {HTMLButtonElement}
   */
  startPauseButtonElement;

  /**
   * アプリで使用する `RohdomopoTimer` のインスタンス
   * @type {RohdomopoTimer}
   */
  rohdomopoTimer;

  /**
   * `window.requestAnimationFrame()` の返り値である requestId
   * @type {number | null}
   */
  requestAnimationId = null;

  /**
   * `RohdomopoApp` のインスタンスを生成します
   * @param {HTMLDialogElement} soundDialogElement DOMで取得した "このWebアプリでは音声が流れます" と表示する `<dialog>` 要素
   * @param {HTMLParagraphElement} timerDisplayElement DOMで取得したタイマーの残り時間を表示する `<p>` 要素
   * @param {HTMLButtonElement} startPauseButtonElement DOMで取得したカウントダウンを開始・停止する `<button>` 要素
   */
  constructor(
    soundDialogElement,
    timerDisplayElement,
    startPauseButtonElement,
  ) {
    this.soundDialogElement = soundDialogElement;
    this.timerDisplayElement = timerDisplayElement;
    this.startPauseButtonElement = startPauseButtonElement;

    this.rohdomopoTimer = new RohdomopoTimer(
      5 * 1000,
      25 * 1000,
      (state) => {
        console.log(`state changed to ${state}`);
      }
    );
  }

  /**
   * タイマーUIのアニメーション (UI更新) を要求します
   * @type {() => void}
   */
  requestUpdatingTimerDisplay = () => {
    this.timerDisplayElement.textContent = this.rohdomopoTimer.textContent;
    this.requestAnimationId = window.requestAnimationFrame(this.requestUpdatingTimerDisplay);
  }

  /**
   * タイマーUIのアニメーション (UI更新) をキャンセルします
   */
  async cancelUpdatingTimerDisplay() {
    if (this.requestAnimationId != null) {
      window.cancelAnimationFrame(this.requestAnimationId);
      this.requestAnimationId = null;
    }
  }

  /**
   * "カウントダウンを開始・停止" ボタンがクリックされた際の動作です
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
   */
  async initialize() {
    this.soundDialogElement.showModal();
    this.startPauseButtonElement.addEventListener('click', this.onClickStartPauseButton);
  }

}
