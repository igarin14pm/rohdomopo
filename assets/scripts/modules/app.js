/**
 * `RohdomopoTimer` とUIを橋渡しし、アプリを実行するクラス
 */
export class RohdomopoApp {

  /**
   * `RohdomopoApp` のインスタンスを生成します
   * @param {HTMLDialogElement} soundDialogElement DOMで取得した "このWebアプリでは音声が流れます" ダイアログの要素
   */
  constructor(
    soundDialogElement
  ) {
    this.soundDialogElement = soundDialogElement;
  }

  /**
   * 起動時に行う動作です
   * Webページ表示時に実行します
   */
  initialize() {
    this.soundDialogElement.showModal();
  }

}
