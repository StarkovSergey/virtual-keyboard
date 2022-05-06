/* eslint no-case-declarations: "off" */

import './keyboard.scss';
import { getLetterCorrectCase } from '../../modules/utils';

export class Keyboard {
  keyLayout;

  elements = {
    main: null,
    keysContainer: null,
    keys: [],
  };

  textarea;
  selectionEnd = 0;
  setTextareaSelectionEnd() {
    this.selectionEnd = this.textarea.selectionEnd;
  }

  properties = {
    value: '',
    capsLock: false,
    shift: false,
    status: 1, // 1 - english, 2 - english + shift, 3 - ru, 4 - ru + shift
    lang: 'en',
  };

  #setStatus() {
    const { shift, lang } = this.properties;
    if (!shift && lang === 'en') {
      this.properties.status = 1;
    } else if (shift && lang === 'en') {
      this.properties.status = 2;
    } else if (!shift && lang === 'ru') {
      this.properties.status = 3;
    } else if (shift && lang === 'ru') {
      this.properties.status = 4;
    }
  }

  constructor(keyLayout) {
    this.keyLayout = keyLayout;
    this.toggleShift = this.toggleShift.bind(this);
    this.changeLang = this.changeLang.bind(this);
  }

  init() {
    // create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // setup main elements
    this.elements.main.classList.add('keyboard', '1keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.append(...this.#createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // add to DOM
    this.elements.main.append(this.elements.keysContainer);
    document.body.append(this.elements.main);
    this.#renderKeysText();

    // automatically use keyboard for elements with .use-keyboard-input
    this.textarea = document.querySelector('.use-keyboard-input');

    this.textarea.addEventListener('click', () => {
      this.setTextareaSelectionEnd();
    });

    // set handlers
    this.#setChangeLangHandler();
  }

  #createKeys() {
    const keys = [];

    // creates HTML for an icon
    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    this.keyLayout.forEach((key) => {
      const keyElement = document.createElement('div');
      const isInsertLineBreak = ['Backspace', 'Delete', 'Enter', 'ShiftRight'].indexOf(key[0]) !== -1;

      // Add attributes/classes
      keyElement.type = 'button';
      keyElement.classList.add('keyboard__key');
      keyElement.setAttribute('data-keyCode', key[0]);

      switch (key[0]) {
        case 'MetaLeft': // TODO: implement
          keyElement.innerHTML = createIconHTML('grid_view');

          const windowKeyHandler = () => {
            console.log('window');
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', windowKeyHandler);
          this.#setKeydownHandler(windowKeyHandler, 'Meta');
          break;
        case 'ControlRight':
        case 'ControlLeft': // TODO: implement
          keyElement.classList.add('keyboard__key--fill');
          keyElement.textContent = 'Ctrl';

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            console.log('key-up');
            this.#returnTextFocus();
          });
          break;
        case 'AltLeft':
        case 'AltRight':
          keyElement.innerHTML = createIconHTML('keyboard_option_key');
          break;
        case 'ArrowUp': // TODO: implement
          keyElement.innerHTML = createIconHTML('keyboard_arrow_up');

          const arrowUpHandler = () => {
            this.#toggleActiveClass(keyElement);
            console.log('key-down');
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', arrowUpHandler);
          this.#setKeydownHandler(arrowUpHandler, 'ArrowUp');

          break;
        case 'ArrowLeft':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');

          const arrowLeftHandler = () => {
            this.#toggleActiveClass(keyElement);
            if (this.selectionEnd > 0) {
              this.selectionEnd -= 1;
            }
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', arrowLeftHandler);
          this.#setKeydownHandler(arrowLeftHandler, 'ArrowLeft');
          break;
        case 'ArrowDown': // TODO: implement
          keyElement.innerHTML = createIconHTML('keyboard_arrow_down');

          const arrowDownHandler = () => {
            this.#toggleActiveClass(keyElement);
            console.log('key-down');
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', arrowDownHandler);
          this.#setKeydownHandler(arrowDownHandler, 'ArrowDown');

          break;
        case 'ArrowRight':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');

          const arrowRightHandler = () => {
            this.#toggleActiveClass(keyElement);
            if (this.selectionEnd < this.textarea.value.length) {
              this.selectionEnd += 1;
            }
            this.textarea.selectionStart = this.selectionEnd;
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', arrowRightHandler);
          this.#setKeydownHandler(arrowRightHandler, 'ArrowRight');
          break;
        case 'ShiftLeft': // TODO: add shift right and left interaction
          keyElement.textContent = 'Shift';
          keyElement.classList.add('keyboard__key--activatable', 'keyboard__key--fil');
          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            keyElement.classList.toggle('keyboard__key--shift-active');
            this.toggleShift();
          });
          this.#setKeydownOneStartHandler(this.toggleShift, 'ShiftLeft');
          break;

        case 'ShiftRight':
          keyElement.textContent = 'Shift';
          keyElement.classList.add('keyboard__key--shift-right', 'keyboard__key--activatable');
          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            keyElement.classList.toggle('keyboard__key--shift-active');
            this.toggleShift();
          });
          this.#setKeydownOneStartHandler(this.toggleShift, 'ShiftRight');
          break;
        case 'Tab':
          keyElement.innerHTML = createIconHTML('keyboard_tab');
          const tabHandler = () => {
            this.textarea.value = `${this.textarea.value.slice(0, this.selectionEnd)}  ${this.textarea.value.slice(this.selectionEnd)}`;
            this.selectionEnd += 2;
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            tabHandler();
          });
          this.#setKeydownHandler(tabHandler, 'Tab');
          break;
        case 'Delete':
          keyElement.innerHTML = createIconHTML('delete');
          const delHandler = () => {
            this.textarea.value = `${this.textarea.value.slice(0, this.selectionEnd)}${this.textarea.value.slice(this.selectionEnd + 1)}`;
            this.#returnTextFocus();
          };
          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            delHandler();
          });
          this.#setKeydownHandler(delHandler, 'Delete');

          break;
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          const backspaceHandler = () => {
            const backspacePosition = this.selectionEnd === 0 ? 0 : this.selectionEnd - 1;
            this.textarea.value = `${this.textarea.value.slice(0, backspacePosition)}${this.textarea.value.slice(this.selectionEnd)}`;
            if (this.selectionEnd > 0) {
              this.selectionEnd -= 1;
            }
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            backspaceHandler();
          });

          this.#setKeydownHandler(backspaceHandler, 'Backspace');
          break;
        case 'CapsLock':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          const capsHandler = () => {
            this.#toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--caps-active', this.properties.capsLock);
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            capsHandler();
          });
          this.#setKeydownHandler(capsHandler, 'CapsLock');
          break;
        case 'Enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          const enterHandler = () => {
            this.textarea.value = `${this.textarea.value.slice(0, this.selectionEnd)}\n${this.textarea.value.slice(this.selectionEnd)}`;
            this.selectionEnd += 1;
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            enterHandler();
          });
          this.#setKeydownHandler(enterHandler, 'Enter');

          break;
        case 'Space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          const spaceHandler = () => {
            this.textarea.value = `${this.textarea.value.slice(0, this.selectionEnd)} ${this.textarea.value.slice(this.selectionEnd)}`;
            this.selectionEnd += 1;
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            spaceHandler();
          });

          this.#setKeydownHandler(spaceHandler, 'Space');

          break;
        default:
          keyElement.setAttribute('data-type', 'textKey');

          const keyHandler = () => {
            const letter = getLetterCorrectCase(key[this.properties.status], this.properties.shift, this.properties.capsLock);
            this.textarea.value = `${this.textarea.value.slice(0, this.selectionEnd)}${letter}${this.textarea.value.slice(this.selectionEnd)}`;
            this.selectionEnd += 1;
            this.#returnTextFocus();
          };

          keyElement.addEventListener('click', () => {
            this.#toggleActiveClass(keyElement);
            keyHandler();
          });

          this.#setKeydownHandler(keyHandler, key[0]);
      }

      keys.push(keyElement);

      if (isInsertLineBreak) {
        keys.push(document.createElement('br'));
      }
    });

    return keys;
  }

  #renderKeysText() {
    this.elements.keys.forEach((key) => {
      const keyCode = key.dataset.keycode;
      const keyType = key.dataset.type;

      if (keyType === 'textKey') {
        key.innerText = this.keyLayout.find((item) => item[0] === keyCode)[this.properties.status];
      }
    });
  }

  #setKeydownHandler(handler, evtKey) {
    document.addEventListener('keydown', (evt) => {
      if (evt.code === evtKey) {
        evt.preventDefault();
        const button = document.querySelector(`[data-keycode="${evtKey}"]`);
        button.classList.add('keyboard__key--active');
        document.addEventListener('keyup', (evt) => {
          button.classList.remove('keyboard__key--active');
        });
        handler();
      }
    });
  }

  #setKeydownOneStartHandler(handler, evtKey) {
    document.addEventListener('keydown', (evt) => {
      if (evt.code === evtKey) {
        evt.preventDefault();
        const button = document.querySelector(`[data-keycode="${evtKey}"]`);
        button.classList.add('keyboard__key--active');

        const keyupHandler = (e) => {
          if (e.code === evtKey) {
            button.classList.remove('keyboard__key--active');
            handler();
            document.removeEventListener('keyup', keyupHandler);
          }
        };

        if (!evt.repeat) {
          handler();
          document.addEventListener('keyup', keyupHandler);
        }
      }
    });
  }

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    this.#setStatus();
    this.#renderKeysText();
  }

  #toggleActiveClass(keyElement) {
    keyElement.classList.add('keyboard__key--active');
    setTimeout(() => {
      keyElement.classList.remove('keyboard__key--active');
    }, 150);
  }

  #returnTextFocus() {
    this.textarea.focus();
    this.textarea.selectionEnd = this.selectionEnd;
  }

  #toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.dataset.type === 'textKey') {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  }

  #setChangeLangHandler() {
    const pressed = new Set();

    document.addEventListener('keydown', (evt) => {
      pressed.add(evt.key);

      if (pressed.has('Control') && pressed.has('Alt')) {
        this.changeLang();
        pressed.clear();
      }
    });

    document.addEventListener('keyup', (evt) => {
      pressed.delete(evt.key);
    });
  }

  changeLang() {
    this.properties.lang = this.properties.lang === 'ru' ? 'en' : 'ru';
    this.#setStatus();
    this.#renderKeysText();
  }
}
