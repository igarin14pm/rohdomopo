import { expect, test } from './modules/test.js';
import { RohdomopoApp } from '../../../assets/scripts/modules/app.js';

// -------- `RohdomopoApp` --------

test('`RohdomopoApp.constructor()`', () => {
  const htmlContainer = document.createElement('div');
  htmlContainer.innerHTML = 
    '<dialog closedby="any" id="sound-dialog">' +
    '  <h1>🔊</h1>' +
    '  <h1>このWebアプリでは音声が流れます</h1>' +
    '  <p>歓喜と絶望を音でお知らせします</p>' +
    '  <button class="button" commandfor="sound-dialog" command="close">閉じる</button>' +
    '</dialog>';
  const soundDialogElement = htmlContainer.querySelector('#sound-dialog');

  const rohdomopoApp = new RohdomopoApp(
    soundDialogElement
  );

  expect(rohdomopoApp.soundDialogElement).toBe(soundDialogElement);
});
