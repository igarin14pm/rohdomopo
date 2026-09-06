'use strict';

import { afterEach, beforeEach, expect, test } from './modules/test.js';
import * as RohdomopoTimer from '../../../assets/scripts/modules/rohdomopo-timer.js';
import * as App from '../../../assets/scripts/modules/app.js';
import * as TimersPromises from '../../../common/scripts/timers-promises.js';

/**
 * テストを実行する関数
 * 
 * @async
 */
async function startTests() {

  // -------- テストを開始したことを示すメッセージ --------

  console.info('-------- Test run started... 🫡 --------');

  // -------- html --------

  /**
   * テスト用のHTML要素を子要素として持つ `<div>` 要素
   * 
   * @type {HTMLDivElement}
   */
  const htmlContainer = document.createElement('div');

  beforeEach(() => {
    htmlContainer.innerHTML = 
      '<dialog closedby="any" id="sound-dialog">' +
      '  <h1>🔊</h1>' +
      '  <h1>このWebアプリでは音声が流れます</h1>' +
      '  <p>歓喜と絶望を音でお知らせします</p>' +
      '  <button class="button" commandfor="sound-dialog" command="close">閉じる</button>' +
      '</dialog>' +
      '<main>' +
      '  <div>' +
      '    <h1 id="state-heading">徒労のカウントダウンを開始する</h1>' +
      '    <p id="state-message"></p>' +
      '    <p id="timer-display" class="timer-display">05:00.00</p>' +
      '    <button id="start-pause-button" class="button">カウントダウンを開始</button>' +
      '  </div>' +
      '</main>';
  });

  afterEach(() => {
    const body = document.body;
    body.classList.remove('hell');
    body.classList.remove('heaven');

    const hellAudio = document.querySelector('#hell-audio');
    const heavenAudio = document.querySelector('#heaven-audio');
    hellAudio.pause();
    heavenAudio.pause();
  });

  // -------- /assets/scripts/modules/app.js --------

  // `RohdomopoApp`

  await test('`RohdomopoApp.constructor()`', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');

    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    expect(rohdomopoApp.soundDialogElement).toBe(soundDialogElement);
    expect(rohdomopoApp.stateHeadingElement).toBe(stateHeadingElement);
    expect(rohdomopoApp.stateMessageElement).toBe(stateMessageElement);
    expect(rohdomopoApp.timerDisplayElement).toBe(timerDisplayElement);
    expect(rohdomopoApp.startPauseButtonElement).toBe(startPauseButtonElement);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"五分間の徒労\" 状態に変化時に `<body>` の class が `hell` になる', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    await rohdomopoApp.onStateChanged('hell');

    expect(body.classList.contains('hell')).toBe(true);
    expect(body.classList.contains('heaven')).toBe(false);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"五分間の徒労\" 状態に変化時に hell.mp3 が再生される', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    await rohdomopoApp.onStateChanged('hell');

    const isHellAudioPlaying = !hellAudioElement.paused && !hellAudioElement.ended;
    expect(isHellAudioPlaying).toBe(true);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"五分間の徒労\" 状態に変化時にテキストが変化する', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    await rohdomopoApp.onStateChanged('hell');

    expect(stateHeadingElement.textContent).toBe('五分間の徒労 〜 人間性の剥奪');
    expect(stateMessageElement.textContent).toBe('問うな。理由を求める時間は終わった。ただキーボードを叩け。');
  });

  await test('`RohdomopoApp.onStateChanged()` - \"二十五分間の解放\" 状態に変化時に `<body>` の class が `heaven` になる', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    await rohdomopoApp.onStateChanged('heaven');

    expect(body.classList.contains('hell')).toBe(false);
    expect(body.classList.contains('heaven')).toBe(true);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"二十五分間の解放\" 状態に変化時に heaven.mp3 が再生される', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    await rohdomopoApp.onStateChanged('heaven');

    const isHeavenAudioPlaying = !heavenAudioElement.paused && !heavenAudioElement.ended;
    expect(isHeavenAudioPlaying).toBe(true);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"二十五分間の解放\" 状態に変化時にテキストが変化する', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    await rohdomopoApp.onStateChanged('heaven');

    expect(stateHeadingElement.textContent).toBe('二十五分間の解放 〜 人間性の奪還');
    expect(stateMessageElement.textContent).toBe('見上げよ。世界は彩りに満ちている。思考の翼を広げ、どこへでも飛んでゆけ。');
  });

  await test('`RohdomopoApp.requestUpdatingTimerDisplay()` - `requestAnimationId` に値が代入される', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    const requestAnimationId1 = rohdomopoApp.requestAnimationId;
    rohdomopoApp.requestUpdatingTimerDisplay();
    const requestAnimationId2 = rohdomopoApp.requestAnimationId;
    rohdomopoApp.cancelUpdatingTimerDisplay();
    
    expect(requestAnimationId1).toBe(null);
    expect(requestAnimationId2).toBeTypeOf('number');
  });

  await test('`RohdomopoApp.cancelUpdatingTimerDisplay()` - `requestAnimationId` に `null` が代入される', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    rohdomopoApp.requestUpdatingTimerDisplay();
    rohdomopoApp.cancelUpdatingTimerDisplay();

    expect(rohdomopoApp.requestAnimationId).toBe(null);
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマー開始時', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(10);
    const isCountingDown = rohdomopoApp.rohdomopoTimer.isCountingDown;
    const textContent = rohdomopoApp.startPauseButtonElement.textContent;
    rohdomopoApp.rohdomopoTimer.pause();

    expect(isCountingDown).toBe(true);
    expect(textContent).toBe('カウントダウンを一時停止');
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマー一時停止時', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const hellAudioElement = document.querySelector('#hell-audio');
    const heavenAudioElement = document.querySelector('#heaven-audio');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      hellAudioElement,
      heavenAudioElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(10);
    rohdomopoApp.onClickStartPauseButton();

    expect(rohdomopoApp.rohdomopoTimer.isCountingDown).toBe(false);
    expect(rohdomopoApp.startPauseButtonElement.textContent).toBe('カウントダウンを再開');
  });

  // -------- /assets/scripts/modules/rohdomopo-timer.js --------

  // `CountDownTimer`

  await test('`CountDownTimer.constructor()`', () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560);

    expect(countDownTimer1.duration_cs).toBe(3000);
    expect(countDownTimer1.currentTime_cs).toBe(3000);
    expect(countDownTimer2.duration_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
    expect(countDownTimer2.currentTime_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
  });

  await test('`CountDonwTimer.isFinished`', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200);

    const isFinished1_1 = countDownTimer1.isFinished;
    const isFinished2_1 = countDownTimer2.isFinished;
    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(50);
    const isFinished1_2 = countDownTimer1.isFinished;
    const isFinished2_2 = countDownTimer2.isFinished;
    await TimersPromises.setTimeout(200);
    const isFinished1_3 = countDownTimer1.isFinished;
    const isFinished2_3 = countDownTimer2.isFinished;

    expect(isFinished1_1).toBe(false);
    expect(isFinished1_2).toBe(false);
    expect(isFinished1_3).toBe(true);
    expect(isFinished2_1).toBe(false);
    expect(isFinished2_2).toBe(false);
    expect(isFinished2_3).toBe(true);
  })

  await test('`CountDownTimer.textContent`', () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560);

    expect(countDownTimer1.textContent).toBe('00:30.00');
    expect(countDownTimer2.textContent).toBe('12:34.56');
  });

  await test('`CountDonwTimer.start()` - `CountDownTimer.currentTime_cs` が減少する', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560);

    countDownTimer1.start();
    await TimersPromises.setTimeout(100);
    countDownTimer1.pause();
    
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);
    countDownTimer2.pause()

    expect(countDownTimer1.currentTime_cs).toBeLessThan(30000);
    expect(countDownTimer2.currentTime_cs).toBeLessThan(12 * 60 * 1000 + 34 * 1000 + 560);
  });

  await test('`CountDownTimer.start()` - `CountDownTimer.currenTime_cs` が `0` で停止する', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200);

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(250);

    expect(countDownTimer1.currentTime_cs).toBe(0);
    expect(countDownTimer2.currentTime_cs).toBe(0);
  });

  await test('`CountDownTimer.pause()`', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560);

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);
    countDownTimer1.pause();
    countDownTimer2.pause();
    await TimersPromises.setTimeout(10);
    const currentTime1_1 = countDownTimer1.currentTime_cs;
    const currentTime2_1 = countDownTimer2.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const currentTime1_2 = countDownTimer1.currentTime_cs;
    const currentTime2_2 = countDownTimer2.currentTime_cs;

    expect(currentTime1_1).toBe(currentTime1_2);
    expect(currentTime2_1).toBe(currentTime2_2);
  });

  await test('`CountDownTimer.reset()`', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560);
    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);
    countDownTimer1.pause();
    countDownTimer2.pause();
    const timeBeforeReset1 = countDownTimer1.currentTime_cs;
    const timeBeforeReset2 = countDownTimer2.currentTime_cs;

    countDownTimer1.reset();
    countDownTimer2.reset();

    expect(timeBeforeReset1).not.toBe(30000);
    expect(timeBeforeReset2).not.toBe(12 * 60 * 1000 + 34 * 1000 + 560);
    expect(countDownTimer1.currentTime_cs).toBe(3000);
    expect(countDownTimer2.currentTime_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
  });

  // `RohdomopoTimer`

  await test('`RohdomopoTimer.constructor()`', () => {
    const onStateChanged = (state) => {
      console.log(`state changed to ${state}`);
    };

    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, onStateChanged);

    expect(rohdomopoTimer.hellTimer.duration_cs).toBe(5 * 60 * 100);
    expect(rohdomopoTimer.heavenTimer.duration_cs).toBe(25 * 60 * 100);
    expect(rohdomopoTimer.onStateChanged).toBe(onStateChanged);
  });

  await test('`RohdomopoTimer.isCountingDown`', async () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, () => { });
    
    const valueBeforeStarting = rohdomopoTimer.isCountingDown;
    rohdomopoTimer.start();
    await TimersPromises.setTimeout(10);
    const valueAfterStarting = rohdomopoTimer.isCountingDown;
    rohdomopoTimer.pause();
    await TimersPromises.setTimeout(10);
    const valueAfterPausing = rohdomopoTimer.isCountingDown;

    expect(valueBeforeStarting).toBe(false);
    expect(valueAfterStarting).toBe(true);
    expect(valueAfterPausing).toBe(false);
  });

  await test('`RohdomopoTimer.state` - getter', async () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(200, 200, () => {});

    const state1 = rohdomopoTimer.state;
    rohdomopoTimer.start();
    await TimersPromises.setTimeout(100);
    const state2 = rohdomopoTimer.state;
    await TimersPromises.setTimeout(200);
    const state3 = rohdomopoTimer.state;
    await TimersPromises.setTimeout(200);
    const state4 = rohdomopoTimer.state;
    rohdomopoTimer.pause();

    expect(state1).toBe('normal');
    expect(state2).toBe('hell');
    expect(state3).toBe('heaven');
    expect(state4).toBe('hell');
  });

  await test('`RohdomopoTimer.setState()`', async () => {
    let isOnStateChangedCallbackCalled1 = false;
    let isOnStateChangedCallbackCalled2 = false;
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => {
        isOnStateChangedCallbackCalled1 = true;
      }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => {
        isOnStateChangedCallbackCalled2 = true;
      }
    );

    rohdomopoTimer1.setState('hell');
    rohdomopoTimer2.setState('heaven');

    expect(rohdomopoTimer1.state).toBe('hell');
    expect(isOnStateChangedCallbackCalled1).toBe(true);
    expect(rohdomopoTimer2.state).toBe('heaven');
    expect(isOnStateChangedCallbackCalled2).toBe(true);
  });

  await test('`RohdomopoTimer.textContent`', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100,
      () => { }
    );

    const noState1 = rohdomopoTimer1.textContent;
    const noState2 = rohdomopoTimer2.textContent;
    rohdomopoTimer1.setState('hell');
    rohdomopoTimer2.setState('hell');
    const hell1 = rohdomopoTimer1.textContent;
    const hell2 = rohdomopoTimer2.textContent;
    rohdomopoTimer1.setState('heaven');
    rohdomopoTimer2.setState('heaven');
    const heaven1 = rohdomopoTimer1.textContent;
    const heaven2 = rohdomopoTimer2.textContent;

    expect(noState1).toBe('');
    expect(noState2).toBe('');
    expect(hell1).toBe('05:00.00');
    expect(hell2).toBe('12:34.56');
    expect(heaven1).toBe('25:00.00');
    expect(heaven2).toBe('54:32.10');
  });

  await test('`RohdomopoTimer.start()` - 初回呼び出し時に `state` に `\'hell\'` が代入される', () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, () => { });

    const state1 = rohdomopoTimer.state;
    rohdomopoTimer.start();
    const state2 = rohdomopoTimer.state;
    rohdomopoTimer.pause();

    expect(state1).toBe('normal');
    expect(state2).toBe('hell')
  });

  await test('`RohdomopoTimer.start()` - `state` に合わせたタイマーが開始される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, () => { });
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, () => { });
    rohdomopoTimer1.setState('hell');
    rohdomopoTimer2.setState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(rohdomopoTimer1.hellTimer.currentTime_cs).toBeLessThan(5 * 60 * 100);
    expect(rohdomopoTimer1.heavenTimer.currentTime_cs).toBe(25 * 60 * 100);
    expect(rohdomopoTimer2.hellTimer.currentTime_cs).toBe(5 * 60 * 100);
    expect(rohdomopoTimer2.heavenTimer.currentTime_cs).toBeLessThan(25 * 60 * 1000);
  });

  await test('`RohdomopoTimer.start()` - タイマー終了時に自動的にリセットされる', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(100, 25 * 60 * 1000, () => { });
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 100, () => { });
    rohdomopoTimer1.setState('hell');
    rohdomopoTimer2.setState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(50);
    const value1BeforeStateChanged = rohdomopoTimer1.hellTimer.currentTime_cs;
    const value2BeforeStateChanged = rohdomopoTimer2.heavenTimer.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const value1AfterStateChanged = rohdomopoTimer1.hellTimer.currentTime_cs;
    const value2AfterStateChanged = rohdomopoTimer2.heavenTimer.currentTime_cs;
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(value1BeforeStateChanged).toBeLessThan(10);
    expect(value1AfterStateChanged).toBe(10);
    expect(value2BeforeStateChanged).toBeLessThan(10);
    expect(value2AfterStateChanged).toBe(10);
  });

  await test('`RohdomopoTimer.start()` - タイマー終了時に自動的に `state` が切り替わる', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(100, 25 * 60 * 1000, () => { });
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 100, () => { });
    rohdomopoTimer1.setState('hell');
    rohdomopoTimer2.setState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(200);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(rohdomopoTimer1.state).toBe('heaven');
    expect(rohdomopoTimer1.heavenTimer.currentTime_cs).toBeLessThan(25 * 60 * 100);
    expect(rohdomopoTimer2.state).toBe('hell');
    expect(rohdomopoTimer2.hellTimer.currentTime_cs).toBeLessThan(5 * 60 * 100);
  });

  await test('`RohdomopoTimer.pause()`', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, () => { });
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(5 * 60 * 1000, 25 * 60 * 1000, () => { });
    rohdomopoTimer1.setState('hell');
    rohdomopoTimer2.setState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();
    await TimersPromises.setTimeout(10);
    const currentTime1_1 = rohdomopoTimer1.hellTimer.currentTime_cs;
    const currentTime2_1 = rohdomopoTimer2.heavenTimer.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const currentTime1_2 = rohdomopoTimer1.hellTimer.currentTime_cs;
    const currentTime2_2 = rohdomopoTimer2.heavenTimer.currentTime_cs;

    expect(currentTime1_1).toBe(currentTime1_2);
    expect(currentTime2_1).toBe(currentTime2_2);
  })

  // -------- /common/scripts/timers-promises.js --------

  await test('`setTimeout()` - Test 1', async () => {
    const timeoutStarted = new Date();

    await TimersPromises.setTimeout(100);
    const timeoutFinished = new Date();
    const time = timeoutFinished.getTime() - timeoutStarted.getTime();
    
    expect(time).toBeGreaterThan(100 * 0.9);
    expect(time).toBeLessThan(100 * 1.1);
  });

  await test('`setTimeout()` - Test 2', async () => {
    const timeoutStarted = new Date();

    await TimersPromises.setTimeout(250);
    const timeoutFinished = new Date();
    const time = timeoutFinished.getTime() - timeoutStarted.getTime();
    
    expect(time).toBeGreaterThan(250 * 0.9);
    expect(time).toBeLessThan(250 * 1.1);
  });

  await test('`setInterval()` - Test 1', async () => {
    const intervalStarted = new Date();
    
    let count = -1;
    for await (const i of TimersPromises.setInterval(500)) {
      if (i >= 0) {
        count = i
        break;
      }
    }
    const intervalFinished = new Date();
    const time = intervalFinished.getTime() - intervalStarted.getTime();
    
    expect(count).toBe(0);
    expect(time).toBeGreaterThan(500 * 0.9);
    expect(time).toBeLessThan(500 * 1.1);
  });

  await test('`setInterval()` - Test 2', async () => {
    const intervalStarted = new Date();
    
    let count = -1;
    for await (const i of TimersPromises.setInterval(100)) {
      count = i;
      if (i >= 2) {
        break;
      }
    }
    const intervalFinished = new Date();
    const time = intervalFinished.getTime() - intervalStarted.getTime();
    
    expect(count).toBe(2);
    expect(time).toBeGreaterThan(300 * 0.9);
    expect(time).toBeLessThan(300 * 1.1);
  });

  // -------- テストが終了したことを示すメッセージ --------

  console.info('-------- Test run complete. 😉 --------');

}

/**
 * "テストを開始する" ボタン
 * 
 * @type {HTMLButtonElement}
 */
const startTestsButton = document.querySelector('#start-tests-button');

startTestsButton.addEventListener('click', async () => {
  await startTests();
});
