'use strict';

import { RohdomopoApp } from './modules/app.js';

/**
 * HTMLの `<body>`
 * 
 * @type {HTMLBodyElement}
 */
const body = document.body;

/**
 * "このWebサイトでは音声が流れます" という表示の `<dialog>` 要素
 * 
 * @type {HTMLDialogElement}
 */
const soundDialogElement = document.querySelector('#sound-dialog');

/**
 * hell.mp3 を再生する `<audio>` 要素
 * 
 * @type {HTMLAudioElement}
 */
const hellAudioElement = document.querySelector('#hell-audio');

/**
 * heaven.mp3 を再生する `<audio>` 要素
 */
const heavenAudioElement = document.querySelector('#heaven-audio');

/**
 * タイマーの状態を表示する `<h1>` 要素
 * 
 * @type {HTMLHeadingElement}
 */
const stateHeadingElement = document.querySelector('#state-heading');

/**
 * 文学的な指示文を表示する `<p>` 要素
 * 
 * @type {HTMLParagraphElement}
 */
const stateMessageElement = document.querySelector('#state-message');

/**
 * タイマーの残り時間を表示する `<p>` 要素
 * 
 * @type {HTMLParagraphElement}
 */
const timerDisplayElement = document.querySelector('#timer-display');

/**
 * タイマーを開始・停止する `<button>` 要素
 * 
 * @type {HTMLButtonElement}
 */
const startPauseButtonElement = document.querySelector('#start-pause-button');

/**
 * Webアプリを実行する `RohdomopoApp` のインスタンス
 * 
 * @type {RohdomopoApp}
 */
const rohdomopoApp = new RohdomopoApp(
  body,
  soundDialogElement,
  hellAudioElement,
  heavenAudioElement,
  stateHeadingElement,
  stateMessageElement,
  timerDisplayElement,
  startPauseButtonElement,
  10 * 1000, // tmp
  25 * 1000 // tmp
);

// DOM読み込み終了時に実行
window.addEventListener('DOMContentLoaded', () => {
  rohdomopoApp.initialize();
});
