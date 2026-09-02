import { RohdomopoApp } from './modules/app.js';

/**
 * "このWebサイトでは音声が流れます" ダイアログの要素
 * @type {HTMLDialogElement}
 */
const soundDialogElement = document.querySelector('#sound-dialog');

/**
 * Webアプリを実行する `RohdomopoApp` のインスタンス
 * @type {RohdomopoApp}
 */
const rohdomopoApp = new RohdomopoApp(
  soundDialogElement
);
rohdomopoApp.initialize();
