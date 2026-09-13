'use strict';

import { afterEach, beforeEach, expect, test } from './modules/test.js';
import * as RohdomopoTimer from '../../../assets/scripts/modules/rohdomopo-timer.js';
import * as App from '../../../assets/scripts/modules/app.js';
import * as TimersPromises from '../../../common/scripts/timers-promises.js';
import { AudioEngine } from '../../../assets/scripts/modules/audio-engine.js';

/**
 * テストを実行する関数
 * 
 * @async
 */
async function startTests() {

  // -------- テストを開始したことを示すメッセージ --------

  console.info(
    '----------------------------\n' +
    'Test run started... 🫡\n' +
    '----------------------------'
  );

  // -------- html --------

  /**
   * テスト用のHTML要素を子要素として持つ `<div>` 要素
   * 
   * @type {HTMLDivElement}
   */
  const htmlContainer = document.createElement('div');

  /**
   * `AudioEngine` のインスタンス
   * 
   * @type {AudioEngine} audioEngine
   */
  const audioEngine = new AudioEngine(
    './assets/audio/hell_test.mp3',
    './assets/audio/heaven_test.mp3',
    './assets/audio/count_test.mp3'
  );
  audioEngine.gain = 0;

  await audioEngine.load();

  beforeEach(async () => {
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
      '    <button id="start-pause-button" class="button loading">音声を読み込み中...</button>' +
      '  </div>' +
      '</main>';

    audioEngine.gain = 0.0;

  });

  afterEach(() => {

    const body = document.body;
    body.classList.remove('hell');
    body.classList.remove('heaven');

  });

  // -------- /assets/scripts/modules/app.js --------

  // `RohdomopoApp`

  await test('`RohdomopoApp.constructor()` - メンバを初期化する', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');

    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine,
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100
    );

    expect(rohdomopoApp.soundDialogElement).toBe(soundDialogElement);
    expect(rohdomopoApp.stateHeadingElement).toBe(stateHeadingElement);
    expect(rohdomopoApp.stateMessageElement).toBe(stateMessageElement);
    expect(rohdomopoApp.timerDisplayElement).toBe(timerDisplayElement);
    expect(rohdomopoApp.startPauseButtonElement).toBe(startPauseButtonElement);
    expect(rohdomopoApp.audioEngine).toBe(audioEngine);
    expect(rohdomopoApp.rohdomopoTimer.hellTimer.duration_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
    expect(rohdomopoApp.rohdomopoTimer.heavenTimer.duration_cs).toBe(54 * 60 * 100 + 32 * 100 + 10);
  });

  await test('`RohdomopoApp.constructor()` - 一部の引数を省略した時にデフォルト値が適用される', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');

    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    expect(rohdomopoApp.rohdomopoTimer.hellTimer.duration_cs).toBe(5 * 60 * 100);
    expect(rohdomopoApp.rohdomopoTimer.heavenTimer.duration_cs).toBe(25 * 60 * 100);
  });

  await test(
    '`RohdomopoApp.onCountingDown()` - 残り時間が1分以上の時に呼び出しても `timerDisplayElement` に `one-minute-left` クラスを付与しない', 
    () => {
      const body = document.body;
      const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
      const stateHeadingElement = htmlContainer.querySelector('#state-heading');
      const stateMessageElement = htmlContainer.querySelector('#state-message');
      const timerDisplayElement = htmlContainer.querySelector('#timer-display');
      const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
      const rohdomopoApp = new App.RohdomopoApp(
        body,
        soundDialogElement,
        stateHeadingElement,
        stateMessageElement,
        timerDisplayElement,
        startPauseButtonElement,
        audioEngine,
        60 * 1000,
        25 * 60 * 1000
      );

      rohdomopoApp.rohdomopoTimer.switchState('hell');
      rohdomopoApp.onCountingDown();

      expect(timerDisplayElement.classList.contains('one-minute-left')).toBe(false);
    }
  );

  await test(
    '`RohdomopoApp.onCountingDown()` - 残り時間が1分未満の時に呼び出しても `timerDisplayElement` から `one-minute-left` クラスを削除しない', 
    () => {
      const body = document.body;
      const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
      const stateHeadingElement = htmlContainer.querySelector('#state-heading');
      const stateMessageElement = htmlContainer.querySelector('#state-message');
      const timerDisplayElement = htmlContainer.querySelector('#timer-display');
      const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
      const rohdomopoApp = new App.RohdomopoApp(
        body,
        soundDialogElement,
        stateHeadingElement,
        stateMessageElement,
        timerDisplayElement,
        startPauseButtonElement,
        audioEngine,
        45 * 1000,
        25 * 60 * 1000
      );

      timerDisplayElement.classList.add('one-minute-left');
      rohdomopoApp.rohdomopoTimer.switchState('hell');
      rohdomopoApp.onCountingDown();

      expect(timerDisplayElement.classList.contains('one-minute-left')).toBe(true);
    }
  );

  await test(
    '`RohdomopoApp.onCountingDown()` - タイマーが残り時間が1分を下回ると `timerDisplayElement` に `one-minute-left` クラスが付与される', 
    () => {
      const body = document.body;
      const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
      const stateHeadingElement = htmlContainer.querySelector('#state-heading');
      const stateMessageElement = htmlContainer.querySelector('#state-message');
      const timerDisplayElement = htmlContainer.querySelector('#timer-display');
      const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
      const rohdomopoApp = new App.RohdomopoApp(
        body,
        soundDialogElement,
        stateHeadingElement,
        stateMessageElement,
        timerDisplayElement,
        startPauseButtonElement,
        audioEngine,
        59 * 1000 + 990,
        25 * 60 * 1000
      );

      rohdomopoApp.rohdomopoTimer.switchState('hell');
      rohdomopoApp.onCountingDown();

      expect(timerDisplayElement.classList.contains('one-minute-left')).toBe(true);
    }
  );

  await test(
    '`RohdomopoApp.onCountingDown()` - \"二十五分間の徒労\" 状態のタイマーが1分以上に設定されているとき、 \"五分間の徒労\" から \"二十五分間の徒労\" に移行すると `timerDisplayElement` から `one-minute-left` クラスが削除される', 
    async () => {
      const body = document.body;
      const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
      const stateHeadingElement = htmlContainer.querySelector('#state-heading');
      const stateMessageElement = htmlContainer.querySelector('#state-message');
      const timerDisplayElement = htmlContainer.querySelector('#timer-display');
      const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
      const rohdomopoApp = new App.RohdomopoApp(
        body,
        soundDialogElement,
        stateHeadingElement,
        stateMessageElement,
        timerDisplayElement,
        startPauseButtonElement,
        audioEngine,
        50,
        25 * 60 * 1000
      );


      rohdomopoApp.rohdomopoTimer.switchState('hell');
      rohdomopoApp.rohdomopoTimer.start();
      await TimersPromises.setTimeout(100);
      rohdomopoApp.rohdomopoTimer.pause();

      expect(timerDisplayElement.classList.contains('one-minute-left')).toBe(false);
    }
  );

    await test(
    '`RohdomopoApp.onCountingDown()` - \"五分間の徒労\" タイマーが1分以上に設定されているとき、 \"二十五分間の徒労\" から \"五分間の徒労\" に移行すると `timerDisplayElement` から `one-minute-left` クラスが削除される', 
    async () => {
      const body = document.body;
      const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
      const stateHeadingElement = htmlContainer.querySelector('#state-heading');
      const stateMessageElement = htmlContainer.querySelector('#state-message');
      const timerDisplayElement = htmlContainer.querySelector('#timer-display');
      const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
      const rohdomopoApp = new App.RohdomopoApp(
        body,
        soundDialogElement,
        stateHeadingElement,
        stateMessageElement,
        timerDisplayElement,
        startPauseButtonElement,
        audioEngine,
        5 * 60 * 1000,
        50
      );


      rohdomopoApp.rohdomopoTimer.switchState('heaven');
      rohdomopoApp.rohdomopoTimer.start();
      await TimersPromises.setTimeout(100);
      rohdomopoApp.rohdomopoTimer.pause();

      expect(timerDisplayElement.classList.contains('one-minute-left')).toBe(false);
    }
  );

  await test('`RohdomopoApp.onStateChanged()` - \"五分間の徒労\" 状態に変化する時に `<body>` の class が `hell` になる', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onStateChanged('hell');

    expect(body.classList.contains('hell')).toBe(true);
    expect(body.classList.contains('heaven')).toBe(false);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"五分間の徒労\" 状態に変化する時にテキストが変化する', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onStateChanged('hell');

    expect(stateHeadingElement.textContent).toBe('五分間の徒労 〜 人間性の剥奪');
    expect(stateMessageElement.textContent).toBe('問うな。理由を求める時間は終わった。ただキーボードを叩け。');
  });

  await test('`RohdomopoApp.onStateChanged()` - \"二十五分間の解放\" 状態に変化する時に `<body>` の class が `heaven` になる', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onStateChanged('heaven');

    expect(body.classList.contains('hell')).toBe(false);
    expect(body.classList.contains('heaven')).toBe(true);
  });

  await test('`RohdomopoApp.onStateChanged()` - \"二十五分間の解放\" 状態に変化する時にテキストが変化する', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onStateChanged('heaven');

    expect(stateHeadingElement.textContent).toBe('二十五分間の解放 〜 人間性の奪還');
    expect(stateMessageElement.textContent).toBe('見上げよ。世界は彩りに満ちている。思考の翼を広げ、どこへでも飛んでゆけ。');
  });

  await test('`RohdomopoApp.requestUpdatingTimerDisplay()` - 呼び出した時に `requestAnimationId` に number 値が代入される', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    const requestAnimationId1 = rohdomopoApp.requestAnimationId;
    rohdomopoApp.requestUpdatingTimerDisplay();
    const requestAnimationId2 = rohdomopoApp.requestAnimationId;
    rohdomopoApp.cancelUpdatingTimerDisplay();
    
    expect(requestAnimationId1).toBe(null);
    expect(requestAnimationId2).toBeTypeOf('number');
  });

  await test('`RohdomopoApp.cancelUpdatingTimerDisplay()` - 呼び出した時に `requestAnimationId` に `null` が代入される', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.requestUpdatingTimerDisplay();
    rohdomopoApp.cancelUpdatingTimerDisplay();

    expect(rohdomopoApp.requestAnimationId).toBe(null);
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマー停止時にメソッドを呼び出すとタイマーが開始される', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(10);
    const isCountingDown = rohdomopoApp.rohdomopoTimer.isCountingDown;
    rohdomopoApp.rohdomopoTimer.pause();

    expect(isCountingDown).toBe(true);
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマー停止時にメソッドを呼び出すと `startPauseButtonElement` のテキストが \"カウントダウンを一時停止\" になる', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(10);
    const textContent = rohdomopoApp.startPauseButtonElement.textContent;
    rohdomopoApp.rohdomopoTimer.pause();

    expect(textContent).toBe('カウントダウンを一時停止');
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマー稼働中にメソッドを呼び出すとタイマーが一時停止する', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(10);
    rohdomopoApp.onClickStartPauseButton();

    expect(rohdomopoApp.rohdomopoTimer.isCountingDown).toBe(false);
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマー稼働中にメソッドを呼び出すと `startPauseButtonElement` のテキストが \"カウントダウンを再開\" になる', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(10);
    rohdomopoApp.onClickStartPauseButton();

    expect(rohdomopoApp.startPauseButtonElement.textContent).toBe('カウントダウンを再開');
  });

  await test('`RohdomopoApp.onClickStartPauseButton()` - タイマーを一時停止した時に `timerDisplayElement.textContent` と `rohdomopoTimer.textContent` で誤差が生じない', async () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.onClickStartPauseButton();
    await TimersPromises.setTimeout(150);
    rohdomopoApp.onClickStartPauseButton();

    expect(timerDisplayElement.textContent).toBe(rohdomopoApp.rohdomopoTimer.textContent);
  });

  await test('`RohdomopoApp.enableStartPauseButton()` - 呼び出した時に `startPauseButtonElement` の class から `.loading` が削除される', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.enableStartPauseButton();

    expect(rohdomopoApp.startPauseButtonElement.classList.contains('loading')).toBe(false);
  });

  await test('`RohdomopoApp.enableStartPauseButton()` - 呼び出した時に `startPauseButtonElement` のテキストが \"カウントダウンを開始\" になる', () => {
    const body = document.body;
    const soundDialogElement = htmlContainer.querySelector('#sound-dialog');
    const stateHeadingElement = htmlContainer.querySelector('#state-heading');
    const stateMessageElement = htmlContainer.querySelector('#state-message');
    const timerDisplayElement = htmlContainer.querySelector('#timer-display');
    const startPauseButtonElement = htmlContainer.querySelector('#start-pause-button');
    const rohdomopoApp = new App.RohdomopoApp(
      body,
      soundDialogElement,
      stateHeadingElement,
      stateMessageElement,
      timerDisplayElement,
      startPauseButtonElement,
      audioEngine
    );

    rohdomopoApp.enableStartPauseButton();

    expect(rohdomopoApp.startPauseButtonElement.textContent).toBe('カウントダウンを開始');
  });

  // -------- /assets/scripts/modules/rohdomopo-timer.js --------

  // `CountDownTimer`

  await test('`CountDownTimer.constructor() - メンバが初期化される`', () => {
    const onCountingDown1 = () => { 
      console.log('`onCountingDown()` called'); 
    };
    const onCountingDown2 = () => { };
    const onCountingSeconds1 = () => {
      console.log('`onCountingSeconds()` called');
    };
    const onCountingSeconds2 = () => { };
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000, onCountingDown1, onCountingSeconds1);
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560, onCountingDown2, onCountingSeconds2);

    expect(countDownTimer1.duration_cs).toBe(3000);
    expect(countDownTimer1.currentTime_cs).toBe(3000);
    expect(countDownTimer1.onCountingDown).toBe(onCountingDown1);
    expect(countDownTimer1.onCountingSeconds).toBe(onCountingSeconds1)
    expect(countDownTimer2.duration_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
    expect(countDownTimer2.currentTime_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
    expect(countDownTimer2.onCountingDown).toBe(onCountingDown2);
    expect(countDownTimer2.onCountingSeconds).toBe(onCountingSeconds2);
  });

  await test('`CountDownTimer.isFinished` - タイマー稼働前に `false` を返す', () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200, () => { }, () => { });

    const isFinished1 = countDownTimer1.isFinished;
    const isFinished2 = countDownTimer2.isFinished;

    expect(isFinished1).toBe(false);
    expect(isFinished2).toBe(false);
  });

  await test('`CountDownTimer.isFinished` - タイマー稼働中は `false` を返す', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200, () => { }, () => { });

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(10);
    const isFinished1 = countDownTimer1.isFinished;
    const isFinished2 = countDownTimer2.isFinished;
    countDownTimer1.pause();
    countDownTimer2.pause();

    expect(isFinished1).toBe(false);
    expect(isFinished2).toBe(false);
  });

  await test('`CountDownTimer.isFinished` - タイマー一時停止中でも残り時間が 0 でなければ `false` を返す', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200, () => { }, () => { });

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(50);
    countDownTimer1.pause();
    countDownTimer2.pause();
    const isFinished1 = countDownTimer1.isFinished;
    const isFinished2 = countDownTimer2.isFinished;

    expect(countDownTimer1.currentTime_cs).toBeGreaterThan(0);
    expect(countDownTimer2.currentTime_cs).toBeGreaterThan(0);
    expect(isFinished1).toBe(false);
    expect(isFinished2).toBe(false);
  });

  await test('`CountDownTimer.isFinished` - タイマーが終了しているときに `true` を返す', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200, () => { }, () => { });

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(250);
    const isFinished1 = countDownTimer1.isFinished;
    const isFinished2 = countDownTimer2.isFinished;

    expect(countDownTimer1.currentTime_cs).toBe(0);
    expect(countDownTimer2.currentTime_cs).toBe(0);
    expect(isFinished1).toBe(true);
    expect(isFinished2).toBe(true);
  });

  await test('`CountDownTimer.textContent` - UI 表示用にフォーマットされた残り時間を返す', () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560, () => { }, () => { });

    expect(countDownTimer1.textContent).toBe('00:30.00');
    expect(countDownTimer2.textContent).toBe('12:34.56');
  });

  await test('`CountDownTimer.start()` - `CountDownTimer.onCountingDown()` が呼び出される', async () => {
    let isOnCountingDownCalled = false;
    const countDownTimer = new RohdomopoTimer.CountDownTimer(
      30000, 
      () => {
        isOnCountingDownCalled = true;
      },
      () => { }
    );

    countDownTimer.start();
    await TimersPromises.setTimeout(100);
    countDownTimer.pause();

    expect(isOnCountingDownCalled).toBe(true);
  });

  await test('`CountDownTimer.setDuration()` - `duration_cs` が引数の 1/10 の値 (小数点切り捨て) に設定される', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(5 * 60 * 1000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(10000, () => { }, () => { });
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);
    countDownTimer2.pause();

    countDownTimer1.setDuration(25 * 60 * 1000);
    countDownTimer2.setDuration(20001);

    expect(countDownTimer1.duration_cs).toBe(25 * 60 * 100);
    expect(countDownTimer2.duration_cs).toBe(2000);
  });

  await test('`CountDownTimer.setDuration()` - `currentTime_cs` が引数の 1/10 の値 (小数点切り捨て) に設定される', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(5 * 60 * 1000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(10000, () => { }, () => { });
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);
    countDownTimer2.pause();

    countDownTimer1.setDuration(25 * 60 * 1000);
    countDownTimer2.setDuration(20001);

    expect(countDownTimer1.currentTime_cs).toBe(25 * 60 * 100);
    expect(countDownTimer2.currentTime_cs).toBe(2000);
  });

  await test('`CountDownTimer.start()` - `CountDownTimer.currentTime_cs` が減少する', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560, () => { }, () => { });

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
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(100, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(200, () => { }, () => { });

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(250);

    expect(countDownTimer1.currentTime_cs).toBe(0);
    expect(countDownTimer2.currentTime_cs).toBe(0);
  });

  await test('`CountDownTimer.start()` - 秒の位が減少したときに `CountDownTimer.onCountSeconds()` が実行される', async () => {
    let isOnCountingSecondsCalled = false;
    const countDownTimer = new RohdomopoTimer.CountDownTimer(
      1050,
      () => { },
      () => {
        isOnCountingSecondsCalled = true;
      }
    );

    countDownTimer.start();
    await TimersPromises.setTimeout(100);
    countDownTimer.pause();

    expect(isOnCountingSecondsCalled).toBe(true);
  });

  await test('`CountDownTimer.start()` - 秒の位が減少しなかったときに `CountDonwTimer.onCountSeconds()` が実行されない', async () => {
    let isOnCountingSecondsCalled = false;
    const countDownTimer = new RohdomopoTimer.CountDownTimer(
      1999,
      () => { },
      () => {
        isOnCountingSecondsCalled = true;
      }
    );

    countDownTimer.start();
    await TimersPromises.setTimeout(980);
    countDownTimer.pause();

    expect(isOnCountingSecondsCalled).toBe(false);
  });

  await test('`CountDownTimer.start()` - 残り0秒になったときに `CountDonwTimer.onCountSeconds()` が実行されない', async () => {
    let isOnCountingSecondsCalled = false;
    const countDownTimer = new RohdomopoTimer.CountDownTimer(
      50,
      () => { },
      () => {
        isOnCountingSecondsCalled = true;
      }
    );

    countDownTimer.start();
    await TimersPromises.setTimeout(100);
    countDownTimer.pause();

    expect(isOnCountingSecondsCalled).toBe(false);
  });

  await test('`CountDownTimer.pause()` - 呼び出した後にタイマーが停止する', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560, () => { }, () => { });

    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);
    countDownTimer1.pause();
    countDownTimer2.pause();
    await TimersPromises.setTimeout(10);
    const currentTime1_1_cs = countDownTimer1.currentTime_cs;
    const currentTime2_1_cs = countDownTimer2.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const currentTime1_2_cs = countDownTimer1.currentTime_cs;
    const currentTime2_2_cs = countDownTimer2.currentTime_cs;

    expect(currentTime1_1_cs).toBe(currentTime1_2_cs);
    expect(currentTime2_1_cs).toBe(currentTime2_2_cs);
  });

  await test('`CountDownTimer.reset()` - 呼び出した後にタイマーが停止する', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560, () => { }, () => { });
    countDownTimer1.start();
    countDownTimer2.start();
    await TimersPromises.setTimeout(100);

    countDownTimer1.reset();
    countDownTimer2.reset();
    await TimersPromises.setTimeout(10);
    const currentTime1_1_cs = countDownTimer1.currentTime_cs;
    const currentTime2_1_cs = countDownTimer2.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const currentTime1_2_cs = countDownTimer1.currentTime_cs;
    const currentTime2_2_cs = countDownTimer2.currentTime_cs;

    expect(currentTime1_1_cs).toBe(currentTime1_2_cs);
    expect(currentTime2_1_cs).toBe(currentTime2_2_cs);
  });

  await test('`CountDownTimer.reset()` - 呼び出した時に時間がリセットされる', async () => {
    const countDownTimer1 = new RohdomopoTimer.CountDownTimer(30000, () => { }, () => { });
    const countDownTimer2 = new RohdomopoTimer.CountDownTimer(12 * 60 * 1000 + 34 * 1000 + 560, () => { }, () => { });
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

  await test('`RohdomopoTimer.constructor()` - メンバが初期化される', () => {
    const onCountingDown = () => {
      console.log('`onCountingDown()` called');
    };
    const onCountingSeconds = () => {
      console.log('`onCountingSeconds()` called');
    };
    const onStateChanged = (state) => { 
      console.log(`state changed to ${state}`); 
    };
      
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      onCountingDown,
      onCountingSeconds, 
      onStateChanged
    );

    expect(rohdomopoTimer.hellTimer.duration_cs).toBe(5 * 60 * 100);
    expect(rohdomopoTimer.heavenTimer.duration_cs).toBe(25 * 60 * 100);
    expect(rohdomopoTimer.hellTimer.onCountingDown).toBe(onCountingDown);
    expect(rohdomopoTimer.heavenTimer.onCountingDown).toBe(onCountingDown);
    expect(rohdomopoTimer.hellTimer.onCountingSeconds).toBe(onCountingSeconds);
    expect(rohdomopoTimer.heavenTimer.onCountingSeconds).toBe(onCountingSeconds);
    expect(rohdomopoTimer.onStateChanged).toBe(onStateChanged);
  });

  await test('`RohdomopoTimer.isCountingDown` - タイマー開始前に `false` を返す', async () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );

    const isCountingDown = rohdomopoTimer.isCountingDown;

    expect(isCountingDown).toBe(false);
  });

  await test('`RohdomopoTimer.isCountingDown` - タイマー稼働中に `true` を返す', async () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );

    rohdomopoTimer.start();
    const isCountingDown = rohdomopoTimer.isCountingDown;

    expect(isCountingDown).toBe(true);
  });

  await test('`RohdomopoTimer.isCountingDown` - タイマー一時停止中に `false` を返す', async () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );

    rohdomopoTimer.start();
    await TimersPromises.setTimeout(10);
    rohdomopoTimer.pause();
    await TimersPromises.setTimeout(10);
    const isCountingDown = rohdomopoTimer.isCountingDown;

    expect(isCountingDown).toBe(false);
  });

  await test('`RohdomopoTimer.currentTime_cs` - `RohdomopoTimer.state` が `\'hell\'` のときに `RohdomopoTimer.hellTimer.currentTime_cs` の値が返される', () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');

    const currenTime_cs = rohdomopoTimer1.currentTime_cs;

    expect(currenTime_cs).toBe(5 * 60 * 100);
  });

  await test('`RohdomopoTimer.currentTime_cs` - `RohdomopoTimer.state` が `\'heaven\'` のときに `RohdomopoTimer.heavenTimer.currentTime_cs` の値が返される', () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');

    const currenTime_cs = rohdomopoTimer1.currentTime_cs;

    expect(currenTime_cs).toBe(25 * 60 * 100);
  });

  await test('`RohdomopoTimer.textContent` - \"五分間の徒労\" 状態時に `hellTimer` の UI 表示用文字列が返される', () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    const textContent1 = rohdomopoTimer1.textContent;
    const textContent2 = rohdomopoTimer2.textContent;

    expect(textContent1).toBe('05:00.00');
    expect(textContent2).toBe('12:34.56');
  });

  await test('`RohdomopoTimer.textContent` - \"二十五分間の解放\" 状態時に `heavenTimer` の UI 表示用文字列が返される', () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    const textContent1 = rohdomopoTimer1.textContent;
    const textContent2 = rohdomopoTimer2.textContent;

    expect(textContent1).toBe('25:00.00');
    expect(textContent2).toBe('54:32.10');
  })

  await test('`RohdomopoTimer.textContent` - タイマー開始前は `hellTimer` の UI 表示用文字列を返す', () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100,
      () => { },
      () => { },
      () => { }
    );

    const textContent1 = rohdomopoTimer1.textContent;
    const textContent2 = rohdomopoTimer2.textContent;

    expect(textContent1).toBe('05:00.00');
    expect(textContent2).toBe('12:34.56');
  });

  await test('`RohdomopoTimer.switchState()` - 引数に `\'hell\'` を渡した時に `RohdimopoTimer.state` が `\'hell\'` に変更される', () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      25 * 60 * 1000,
      () => { },
      () => { },
      () => { }
    );
    const stateBeforeSwitched = rohdomopoTimer.state;

    rohdomopoTimer.switchState('hell');
    const stateAfterSwitched = rohdomopoTimer.state;

    expect(stateBeforeSwitched).toBe('normal');
    expect(stateAfterSwitched).toBe('hell');
  });

  await test('`RohdomopoTimer.switchState()` - 引数に `\'hell\'` を渡したときにタイマーがリセットされる', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      25 * 60 * 1000,
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.hellTimer.start();
    rohdomopoTimer1.heavenTimer.start();
    rohdomopoTimer2.hellTimer.start();
    rohdomopoTimer2.heavenTimer.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.hellTimer.pause();
    rohdomopoTimer1.heavenTimer.pause();
    rohdomopoTimer2.hellTimer.pause();
    rohdomopoTimer2.heavenTimer.pause();

    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    expect(rohdomopoTimer1.hellTimer.currentTime_cs).toBe(5 * 60 * 100);
    expect(rohdomopoTimer1.heavenTimer.currentTime_cs).toBe(25 * 60 * 100);
    expect(rohdomopoTimer2.hellTimer.currentTime_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
    expect(rohdomopoTimer2.heavenTimer.currentTime_cs).toBe(54 * 60 * 100 + 32 * 100 + 10);
  });

  await test('`RohdomopoTimer.switchState()` - 引数に `\'hell\'` を渡した時に `RohdimopoTimer.onStateChanged` が実行される', () => {
    let isOnStateChangedCalled = false;
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      25 * 60 * 1000,
      () => { },
      () => { },
      () => {
        isOnStateChangedCalled = true;
      }
    );

    rohdomopoTimer.switchState('hell');

    expect(isOnStateChangedCalled).toBe(true);
  });

  await test('`RohdomopoTimer.switchState()` - 引数に `\'heaven\'` を渡した時に `RohdimopoTimer.state` が `\'heaven\'` に変更される', () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      25 * 60 * 1000,
      () => { },
      () => { },
      () => { }
    );
    const stateBeforeSwitched = rohdomopoTimer.state;

    rohdomopoTimer.switchState('heaven');
    const stateAfterSwitched = rohdomopoTimer.state;

    expect(stateBeforeSwitched).toBe('normal');
    expect(stateAfterSwitched).toBe('heaven');
  });

  await test('`RohdomopoTimer.switchState()` - 引数に `\'heaven\'` を渡したときにタイマーがリセットされる', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      25 * 60 * 1000,
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      12 * 60 * 1000 + 34 * 1000 + 560,
      54 * 60 * 1000 + 32 * 1000 + 100,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.hellTimer.start();
    rohdomopoTimer1.heavenTimer.start();
    rohdomopoTimer2.hellTimer.start();
    rohdomopoTimer2.heavenTimer.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.hellTimer.pause();
    rohdomopoTimer1.heavenTimer.pause();
    rohdomopoTimer2.hellTimer.pause();
    rohdomopoTimer2.heavenTimer.pause();

    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    expect(rohdomopoTimer1.hellTimer.currentTime_cs).toBe(5 * 60 * 100);
    expect(rohdomopoTimer1.heavenTimer.currentTime_cs).toBe(25 * 60 * 100);
    expect(rohdomopoTimer2.hellTimer.currentTime_cs).toBe(12 * 60 * 100 + 34 * 100 + 56);
    expect(rohdomopoTimer2.heavenTimer.currentTime_cs).toBe(54 * 60 * 100 + 32 * 100 + 10);
  });

  await test('`RohdomopoTimer.switchState()` - 引数に `\'heaven\'` を渡した時に `RohdimopoTimer.onStateChanged` が実行される', () => {
    let isOnStateChangedCalled = false;
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      25 * 60 * 1000,
      () => { },
      () => { },
      () => {
        isOnStateChangedCalled = true;
      }
    );

    rohdomopoTimer.switchState('heaven');

    expect(isOnStateChangedCalled).toBe(true);
  });

  await test('`RohdomopoTimer.start()` - 初回呼び出し時に `state` に `\'hell\'` が代入される', () => {
    const rohdomopoTimer = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );

    const state1 = rohdomopoTimer.state;
    rohdomopoTimer.start();
    const state2 = rohdomopoTimer.state;
    rohdomopoTimer.pause();

    expect(state1).toBe('normal');
    expect(state2).toBe('hell')
  });

  await test('`RohdomopoTimer.start()` - \"五分間の徒労\" 状態時に `hellTimer` が開始される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 1000, 
      25 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(rohdomopoTimer1.hellTimer.currentTime_cs).toBeLessThan(5 * 60 * 100);
    expect(rohdomopoTimer1.heavenTimer.currentTime_cs).toBe(25 * 60 * 100);
    expect(rohdomopoTimer2.hellTimer.currentTime_cs).toBeLessThan(5 * 100);
    expect(rohdomopoTimer2.heavenTimer.currentTime_cs).toBe(25 * 100);
  });

  await test('`RohdomopoTimer.start()` - \"二十五分間の解放\" 状態時に `heavenTimer` が開始される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 1000, 
      25 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(rohdomopoTimer1.hellTimer.currentTime_cs).toBe(5 * 60 * 100);
    expect(rohdomopoTimer1.heavenTimer.currentTime_cs).toBeLessThan(25 * 60 * 100);
    expect(rohdomopoTimer2.hellTimer.currentTime_cs).toBe(5 * 100);
    expect(rohdomopoTimer2.heavenTimer.currentTime_cs).toBeLessThan(25 * 100);
  });

  await test('`RohdomopoTimer.start()` - `hellTimer` 終了時に自動的に `hellTimer` がリセットされる', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      100, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      200, 
      25 * 1000, 
      () => { }, 
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(50);
    const value1BeforeStateChanged = rohdomopoTimer1.hellTimer.currentTime_cs;
    const value2BeforeStateChanged = rohdomopoTimer2.hellTimer.currentTime_cs;
    await TimersPromises.setTimeout(200);
    const value1AfterStateChanged = rohdomopoTimer1.hellTimer.currentTime_cs;
    const value2AfterStateChanged = rohdomopoTimer2.hellTimer.currentTime_cs;
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(value1BeforeStateChanged).toBeLessThan(10);
    expect(value1AfterStateChanged).toBe(10);
    expect(value2BeforeStateChanged).toBeLessThan(20);
    expect(value2AfterStateChanged).toBe(20);
  });

  await test('`RohdomopoTimer.start()` - `heavenTimer` 終了時に自動的に `heavenTimer` がリセットされる', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      25 * 60 * 1000, 
      100,
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      25 * 1000, 
      200,
      () => { }, 
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(50);
    const value1BeforeStateChanged = rohdomopoTimer1.heavenTimer.currentTime_cs;
    const value2BeforeStateChanged = rohdomopoTimer2.heavenTimer.currentTime_cs;
    await TimersPromises.setTimeout(200);
    const value1AfterStateChanged = rohdomopoTimer1.heavenTimer.currentTime_cs;
    const value2AfterStateChanged = rohdomopoTimer2.heavenTimer.currentTime_cs;
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(value1BeforeStateChanged).toBeLessThan(10);
    expect(value1AfterStateChanged).toBe(10);
    expect(value2BeforeStateChanged).toBeLessThan(20);
    expect(value2AfterStateChanged).toBe(20);
  });

  await test('`RohdomopoTimer.start()` - `hellTimer` 終了時に自動的に `state` が `\'heaven\' に切り替わる`', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      100, 
      25 * 60 * 1000, 
      () => { }, 
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      200, 
      25 * 1000,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(250);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(rohdomopoTimer1.state).toBe('heaven');
    expect(rohdomopoTimer2.state).toBe('heaven');
  });

  await test('`RohdomopoTimer.start()` - `heavenTimer` 終了時に自動的に `state` が `\'hell\' に切り替わる`', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000,
      100,
      () => { }, 
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 1000,
      200,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(250);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(rohdomopoTimer1.state).toBe('hell');
    expect(rohdomopoTimer2.state).toBe('hell');
  });

  await test('`RohdomopoTimer.start()` - `hellTimer` 終了時に自動的に `heavenTimer` が開始される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      100, 
      25 * 60 * 1000, 
      () => { }, 
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      200, 
      25 * 1000,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(250);
    const currentTime1_cs = rohdomopoTimer1.heavenTimer.currentTime_cs;
    const currentTime2_cs = rohdomopoTimer2.heavenTimer.currentTime_cs;
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(currentTime1_cs).toBeLessThan(25 * 60 * 100);
    expect(currentTime2_cs).toBeLessThan(25 * 100);
  });

  await test('`RohdomopoTimer.start()` - `heavenTimer` 終了時に自動的に `hellTimer` が開始される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      100,
      () => { }, 
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 1000,
      200,
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(250);
    const currentTime1_cs = rohdomopoTimer1.hellTimer.currentTime_cs;
    const currentTime2_cs = rohdomopoTimer2.hellTimer.currentTime_cs;
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();

    expect(currentTime1_cs).toBeLessThan(5 * 60 * 100);
    expect(currentTime2_cs).toBeLessThan(5 * 100);
  });

  await test('`RohdomopoTimer.pause()` - \"五分間の徒労\" 状態時に呼び出すと `hellTimer` が一時停止される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 1000, 
      25 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('hell');
    rohdomopoTimer2.switchState('hell');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();
    await TimersPromises.setTimeout(10);
    const currentTime1_1_cs = rohdomopoTimer1.hellTimer.currentTime_cs;
    const currentTime2_1_cs = rohdomopoTimer2.hellTimer.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const currentTime1_2_cs = rohdomopoTimer1.hellTimer.currentTime_cs;
    const currentTime2_2_cs = rohdomopoTimer2.hellTimer.currentTime_cs;

    expect(currentTime1_1_cs).toBe(currentTime1_2_cs);
    expect(currentTime2_1_cs).toBe(currentTime2_2_cs);
  });

  await test('`RohdomopoTimer.pause()` - \"二十五分間の解放\" 状態時に呼び出すと `heavenTimer` が一時停止される', async () => {
    const rohdomopoTimer1 = new RohdomopoTimer.RohdomopoTimer(
      5 * 60 * 1000, 
      25 * 60 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    const rohdomopoTimer2 = new RohdomopoTimer.RohdomopoTimer(
      5 * 1000, 
      25 * 1000, 
      () => { },
      () => { },
      () => { }
    );
    rohdomopoTimer1.switchState('heaven');
    rohdomopoTimer2.switchState('heaven');

    rohdomopoTimer1.start();
    rohdomopoTimer2.start();
    await TimersPromises.setTimeout(100);
    rohdomopoTimer1.pause();
    rohdomopoTimer2.pause();
    await TimersPromises.setTimeout(10);
    const currentTime1_1_cs = rohdomopoTimer1.heavenTimer.currentTime_cs;
    const currentTime2_1_cs = rohdomopoTimer2.heavenTimer.currentTime_cs;
    await TimersPromises.setTimeout(100);
    const currentTime1_2_cs = rohdomopoTimer1.heavenTimer.currentTime_cs;
    const currentTime2_2_cs = rohdomopoTimer2.heavenTimer.currentTime_cs;

    expect(currentTime1_1_cs).toBe(currentTime1_2_cs);
    expect(currentTime2_1_cs).toBe(currentTime2_2_cs);
  });

  // -------- /common/scripts/timers-promises.js --------

  await test('`setTimeout()` - 時間の誤差が 10% 以内に収まる (1)', async () => {
    const timeoutStarted = new Date();

    await TimersPromises.setTimeout(100);
    const timeoutFinished = new Date();
    const time = timeoutFinished.getTime() - timeoutStarted.getTime();
    
    expect(time).toBeGreaterThan(100 * 0.9);
    expect(time).toBeLessThan(100 * 1.1);
  });

  await test('`setTimeout()` - 時間の誤差が 10% 以内に収まる (2)', async () => {
    const timeoutStarted = new Date();

    await TimersPromises.setTimeout(250);
    const timeoutFinished = new Date();
    const time = timeoutFinished.getTime() - timeoutStarted.getTime();
    
    expect(time).toBeGreaterThan(250 * 0.9);
    expect(time).toBeLessThan(250 * 1.1);
  });

  await test('`setInterval()` - 時間の誤差が 10% 以内に収まる (1)', async () => {
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

  await test('`setInterval()` - 時間の誤差が 10% 以内に収まる (2)', async () => {
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

  // -------- `AudioContext` をクローズ --------

  audioEngine.close();

  // -------- テストが終了したことを示すメッセージ --------

  console.info(
    '----------------------------\n'  +
    'Test run complete. 😉\n' +
    '----------------------------'
  );

}

/**
 * "テストを開始する" ボタン
 * 
 * @type {HTMLButtonElement}
 */
const startTestsButton = document.querySelector('#start-tests-button');

document.addEventListener('DOMContentLoaded', () => {
  startTestsButton.addEventListener('click', async () => {
    await startTests();
  });
});
