import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Events } from "../../extensions/uv-ebook-extension/Events";
import { Position } from "../uv-shared-module/Position";

export class EbookCenterPanel extends CenterPanel {

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

    this._ebookReader.addEventListener(
      "changed",
      (e: any) => {
        if (this._ebookReaderReady) {
          this._nextState(Object.assign({}, e.detail, {
            src: this._prevState.src
          }));
        }
      },
      false
    );

    this._ebookReader.addEventListener("loaded", (e: any) => {
      this.component.publish(Events.LOADED, {        
        url: e.detail
      });
    }, false);

    Utils.Async.waitFor(() => {
      return (window.customElements !== undefined);
    }, () => {
      customElements.whenDefined("uv-ebook-reader").then(() => {
        this._ebookReaderReady = true;
        this._ebookReader.load(this._state.src);
      });
    });

    const that = this;

    this.component.subscribe(
      BaseEvents.OPEN_EXTERNAL_RESOURCE,
      (e: any, resources: Manifesto.IExternalResource[]) => {
        that.openMedia(resources);
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
            src: media.id
          });
        }
      }

      this.component.publish(BaseEvents.RESIZE);
    });
  }

  private _nextState(s: any) {

    this._state = Object.assign({}, this._state, s);

    if (this._state.src && this._state.src !== this._prevState.src) {
      Utils.Async.waitFor(() => {
        return this._ebookReaderReady;
      }, () => {
        this._ebookReader.load(this._state.src);
      });
    }

    this.component.publish(Events.READER_CHANGED, this._state);

    this._prevState = Object.assign({}, this._state);
  }

  resize() {

    super.resize();
    
    if (this._ebookReaderReady && this._state.srcLoaded) {
      this._ebookReader.resize();
    }
  }
}
