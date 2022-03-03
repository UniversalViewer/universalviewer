import {UniversalViewer} from "./UniversalViewer";
import {IIIFEvents} from "@/content-handlers/iiif/IIIFEvents";

export class DevTools {
  element: HTMLElement;
  uv: UniversalViewer;
  log: HTMLTextAreaElement;
  buttonContainer: HTMLDivElement;
  buttons: Record<string, HTMLButtonElement>;
  logging = false;
  originalLogger: any;

  constructor(element: HTMLElement, uv: UniversalViewer) {
    this.element = element;
    this.uv = uv;


    const title = document.createElement('h2');
    title.innerText = 'dev tools';
    this.element.append(title);
    this.log = document.createElement('textarea');
    this.log.rows = 20;
    this.log.disabled = true;
    this.log.wrap = 'soft';
    this.element.style.display = 'block';
    this.element.style.clear = 'both';
    this.log.style.whiteSpace = 'no-wrap';
    this.log.style.overflowX = 'scroll';
    this.log.style.whiteSpace = 'pre';
    this.log.style.width = '100%';
    this.element.append(this.log);

    this.buttons = {};
    this.buttonContainer = document.createElement('div');
    this.element.append(this.buttonContainer);

    this.createButton('Clear log', () => {
      this.log.value = '';
    })

    const jsonStringify = (j: any) => {
      try {
        return JSON.stringify(j);
      } catch (e) {
        return `${j}`;
      }
    }

    this.originalLogger = console.log.bind(console);
    console.log = (...input: any[]) => {
      this.log.value = this.log.value += input ? `\nconsole.log(${input.map(v => jsonStringify(v)).join(', ')})` : ``;
      this.log.scrollTop = this.log.scrollHeight;
      this.originalLogger(...input)
    }

    for (const ev of Object.keys(IIIFEvents)) {
      const event = IIIFEvents[ev];
      this.uv.on(event, (e, ...rest) => {
        this.log.value = this.log.value += e ? `\n${ev}(${jsonStringify(e)})` : `\n${ev}`;
        this.log.scrollTop = this.log.scrollHeight;
        if (this.logging) {
          this.originalLogger(ev, e, ...rest);
        }
      }, {})
    }
    this.uv.on(IIIFEvents.CANVAS_INDEX_CHANGE, (ev) => {
      console.log(ev);
    }, {})

  }

  createButton(name: string, onClick: (e: MouseEvent) => void) {
    this.buttons[name] = document.createElement('button');
    this.buttons[name].innerText = name;
    this.buttons[name].addEventListener('click', onClick);
    this.buttonContainer.append(this.buttons[name]);
  }
}
