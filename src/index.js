import { Keyboard } from './components/keyboard/keyboard.js';
import { keyLayout } from './modules/const';

document.body.innerHTML = '<div class="textarea-box"><textarea class="use-keyboard-input"></textarea></div>';

const keyboard = new Keyboard(keyLayout);
window.addEventListener('DOMContentLoaded', () => {
  keyboard.init();
});
