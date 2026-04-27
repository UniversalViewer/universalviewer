import { Async } from "../../Utils";
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { EbookExtensionEvents } from "../../extensions/uv-ebook-extension/Events";
import { Position } from "../uv-shared-module/Position";
import {
  IExternalResource,
  Canvas,
  Annotation,
  AnnotationBody,
} from "manifesto.js";

import {
  applyPolyfills,
  defineCustomElements,
} from "@universalviewer/uv-ebook-components/loader";
import { Events } from "../../../../Events";
import { Config } from "../../extensions/uv-ebook-extension/config/Config";

export class EbookCenterPanel extends CenterPanel<
  Config["modules"]["ebookCenterPanel"]
> {
  private _cfi: string;
  private _ebookReader: any;
  private _ebookReaderReady: boolean = false;
  private _state: any = {};
  private _prevState: any = {};

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  async create(): Promise<void> {
    this.setConfig("ebookCenterPanel");

    super.create();

    await applyPolyfills();
    defineCustomElements(window);

    this._ebookReader = document.createElement("uv-ebook-reader");
    this.$content.prepend(this._ebookReader);
    this._ebookReader.setAttribute("width", "100%");
    this._ebookReader.setAttribute("height", "100%");

    this._ebookReader.addEventListener(
      "loadedNavigation",
      (e: any) => {
        this.extensionHost.publish(
          EbookExtensionEvents.LOADED_NAVIGATION,
          e.detail
        );
      },
      false
    );

    this._ebookReader.addEventListener(
      "relocated",
      (e: any) => {
        this.extensionHost.publish(EbookExtensionEvents.RELOCATED, e.detail);
        this._cfi = e.detail.start.cfi;
        this.extensionHost.publish(
          EbookExtensionEvents.CFI_FRAGMENT_CHANGE,
          this._cfi
        );
      },
      false
    );

    Async.waitFor(
      () => {
        return window.customElements !== undefined;
      },
      () => {
        customElements.whenDefined("uv-ebook-reader").then(() => {
          this._ebookReaderReady = true;
        });
      }
    );

    const that = this;

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.extensionHost.subscribe(
      EbookExtensionEvents.ITEM_CLICKED,
      (href: string) => {
        this._nextState({
          cfi: href,
        });
      }
    );

    this.extensionHost.subscribe(
      EbookExtensionEvents.CFI_FRAGMENT_CHANGE,
      (cfi: string) => {
        Async.waitFor(
          () => {
            return this._ebookReaderReady;
          },
          () => {
            if (cfi !== this._cfi) {
              this._nextState({
                cfi: cfi,
              });
            }
          }
        );
      }
    );
  }

  openMedia(resources: IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      const canvas: Canvas = this.extension.helper.getCurrentCanvas();

      const annotations: Annotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Annotation = annotations[0];
        const body: AnnotationBody[] = annotation.getBody();

        if (body.length) {
          const media: AnnotationBody = body[0];
          //const format: MediaType | null = media.getFormat();

          this._nextState({
            bookPath: media.id,
          });
        }
      }

      this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
      this.extensionHost.publish(Events.LOAD);
    });
  }

  private _nextState(s: any) {
    this._state = Object.assign({}, this._state, s);

    Async.waitFor(
      () => {
        return this._ebookReaderReady;
      },
      () => {
        if (
          this._state.bookPath &&
          this._state.bookPath !== this._prevState.bookPath
        ) {
          this._ebookReader.load(this._state.bookPath);
        }
        if (this._state.cfi && this._state.cfi !== this._prevState.cfi) {
          this._ebookReader.display(this._state.cfi);
        }
        this._prevState = Object.assign({}, this._state);
      }
    );
  }

  resize() {
    super.resize();

    if (this._ebookReaderReady) {
      setTimeout(() => {
        this._ebookReader.resize();
      }, 10);
    }
  }
}
