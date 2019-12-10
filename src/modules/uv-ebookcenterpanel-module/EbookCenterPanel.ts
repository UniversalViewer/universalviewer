import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Events } from "../../extensions/uv-ebook-extension/Events";
import { Position } from "../uv-shared-module/Position";

export class EbookCenterPanel extends CenterPanel {

  private _cfi: string;
  private _ebookReader: any;
  private _ebookReaderReady: boolean = false;
  private _state: any = {};
  private _prevState: any = {};

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  create(): void {
    this.setConfig("ebookCenterPanel");

    super.create();

    this._ebookReader = document.createElement("uv-ebook-reader");
    this.$content.prepend(this._ebookReader);
    this._ebookReader.setAttribute("width", "100%");
    this._ebookReader.setAttribute("height", "100%");

    this._ebookReader.addEventListener("loadedNavigation", (e: any) => {
      this.component.publish(Events.LOADED_NAVIGATION, e.detail);
    }, false);

    this._ebookReader.addEventListener("relocated", (e: any) => {
      this.component.publish(Events.RELOCATED, e.detail);
      this._cfi = e.detail.start.cfi;
      this.component.publish(Events.CFI_FRAGMENT_CHANGED, this._cfi);
    }, false);

    Utils.Async.waitFor(() => {
      return (window.customElements !== undefined);
    }, () => {
      customElements.whenDefined("uv-ebook-reader").then(() => {
        this._ebookReaderReady = true;
      });
    });

    const that = this;

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: Manifesto.IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.component.subscribe(
      Events.ITEM_CLICKED,
      (href: string) => {
        this._nextState({
          cfi: href
        });
      }
    );

    this.component.subscribe(
      Events.CFI_FRAGMENT_CHANGED,
      (cfi: string) => {
        Utils.Async.waitFor(() => {
          return this._ebookReaderReady;
        }, () => {
          if (cfi !== this._cfi) {
            this._nextState({
              cfi: cfi
            });
          }
        });
      }
    );
  }

  openMedia(resources: Manifesto.IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      let canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

      const annotations: Manifesto.IAnnotation[] = canvas.getContent();

      if (annotations.length) {
        const annotation: Manifesto.IAnnotation = annotations[0];
        const body: Manifesto.IAnnotationBody[] = annotation.getBody();

        if (body.length) {
          const media: Manifesto.IAnnotationBody = body[0];
          //const format: Manifesto.MediaType | null = media.getFormat();

          this._nextState({
            bookPath: media.id
          });
        }
      }

      this.component.publish(BaseEvents.RESIZE);
    });
  }

  private _nextState(s: any) {

    this._state = Object.assign({}, this._state, s);

    Utils.Async.waitFor(() => {
      return this._ebookReaderReady;
    }, () => {
      if (this._state.bookPath && this._state.bookPath !== this._prevState.bookPath) {
        this._ebookReader.load(this._state.bookPath);
      }
      if (this._state.cfi && this._state.cfi !== this._prevState.cfi) {
        this._ebookReader.display(this._state.cfi);
      }
      this._prevState = Object.assign({}, this._state);
    });
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
