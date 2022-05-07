import { Keyboard } from './components/keyboard/keyboard.js';
import { keyLayout } from './modules/const';

document.body.innerHTML = `<div class="textarea-box"><textarea class="use-keyboard-input" placeholder="нет войне"></textarea></div>
<ul class="text-list">
  <li>Клавиатура создана в операционной системе Windows</li>
  <li>Для переключения языка комбинация: ctrl + alt</li>
</ul>
`;

const keyboard = new Keyboard(keyLayout);
window.addEventListener('DOMContentLoaded', () => {
  keyboard.init();
});
