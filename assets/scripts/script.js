'use strict';

import { RohdomopoApp } from './modules/app.js';
import { AudioEngine } from './modules/audio-engine.js';
import { setTimeout } from '../../common/scripts/timers-promises.js';

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
 * 音声を再生する `AudioEngine` のインスタンス
 * 
 * @type {AudioEngine}
 */
const audioEngine = new AudioEngine(
  './assets/audio/hell.mp3',
  './assets/audio/heaven.mp3',
  './assets/audio/count.mp3'
);

/**
 * Webアプリを実行する `RohdomopoApp` のインスタンス
 * 
 * @type {RohdomopoApp}
 */
const rohdomopoApp = new RohdomopoApp(
  body,
  soundDialogElement,
  stateHeadingElement,
  stateMessageElement,
  timerDisplayElement,
  startPauseButtonElement,
  audioEngine
);

// DOM読み込み終了時に実行
window.addEventListener('DOMContentLoaded', async () => {
  rohdomopoApp.initialize();
});

// これは何だ？？？
function doSomething(str) {
  const bi = atob(str);
  const by = Uint8Array.from(bi, (m) => m.codePointAt(0));
  return new TextDecoder().decode(by);
}
console.info(
  doSomething('JWPwn5GB77iPIPCfkYHvuI8='),
  doSomething('Zm9udC1zaXplOiA2NHB4')
);
console.info(
  doSomething('JWMi44Kz44Oz44K944O844Or44KS6KaX44GP44Go44GN44CB44Kz44Oz44K944O844Or44KC44G+44Gf44GT44Gh44KJ44KS6KaX44GE44Gm44GE44KL44Gu44Gg44CCIg=='),
  doSomething('Zm9udC1zaXplOiAxNnB4OyBmb250LXN0eWxlOiBpdGFsaWM7IGZvbnQtd2VpZ2h0OiA2MDA7')
);
console.info(
  doSomething('8J+klPCfkq0g44KP44GW44KP44GW44Kz44Oz44K944O844Or44KS6ZaL44GP44Gq44KT44Gm44CB44KC44GX44GL44GX44Gm44CB44K944O844K544Kz44O844OJ44Gr6IiI5ZGz44GM44GK44GC44KK44Gn44GZ44Gt77yf77yf44GT44Gh44KJ44GL44KJ44Gp44GG44Ge77yB77yBDQrwn5GH8J+Pu/CfkYfwn4+78J+Rh/Cfj7sNCmh0dHBzOi8vZ2l0aHViLmNvbS9pZ2FyaW4xNHBtL3JvaGRvbW9wbw==')
);

/**
 * 時間の値 (ミリ秒) をタイマーの長さの値 (1/100秒) に変換します
 * 
 * @param {number} duration_ms 時間の値 (ミリ秒)
 * @returns {number} タイマーの長さの値 (1/100秒)
 */
export function getValidDuration(duration_ms) {
  let result;
  if (duration_ms > 59 * 60 * 1000 + 59 * 1000 + 990) {
    result = (59 * 60 * 1000 + 59 * 1000 + 990);
  } else if (duration_ms < 10) {
    result = 10;
  } else {
    result = duration_ms;
  }
  return result;
}

/**
 * コンソールから "五分間の徒労" タイマーの長さを設定するためのメソッドです
 * 
 * @function
 * @param {number} duration_ms タイマーの長さ (ミリ秒)
 */
window.setHellTimerDuration = async (duration_ms) => {
  const validDuration_ms = getValidDuration(duration_ms);
  const rohdomopoTimer = rohdomopoApp.rohdomopoTimer;
  const hellTimer = rohdomopoTimer.hellTimer;

  rohdomopoTimer.pause();
  await setTimeout(20);
  hellTimer.setDuration(validDuration_ms);
  timerDisplayElement.textContent = rohdomopoTimer.textContent;
  rohdomopoApp.onCountingDown();

  console.log(`hellTimer duration set to ${hellTimer.duration_cs * 10} ms.`);
}

/**
 * コンソールから "二十五分間の解放" タイマーの長さを設定するためのメソッドです
 * 
 * @function
 * @param {number} duration_ms タイマーの長さ (ミリ秒)
 */
window.setHeavenTimerDuration = async (duration_ms) => {
  const validDuration_ms = getValidDuration(duration_ms);
  const rohdomopoTimer = rohdomopoApp.rohdomopoTimer;
  const heavenTimer = rohdomopoTimer.heavenTimer;

  rohdomopoTimer.pause();
  await setTimeout(20);
  heavenTimer.setDuration(validDuration_ms);
  timerDisplayElement.textContent = rohdomopoTimer.textContent;
  rohdomopoApp.onCountingDown();

  console.log(`heavenTimer duration set to ${heavenTimer.duration_cs * 10} ms.`);
}
