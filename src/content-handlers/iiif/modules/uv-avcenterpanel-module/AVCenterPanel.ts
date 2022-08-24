const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { sanitize } from "../../../../Utils";
import {
  Canvas,
  IExternalResource,
  LabelValuePair,
  LanguageMap,
  Range,
} from "manifesto.js";
import { MetadataGroup, MetadataOptions } from "@iiif/manifold";
import { AVComponent } from "@iiif/iiif-av-component/dist-esmodule";
import { Bools } from "@edsilv/utils";
import { Events } from "../../../../Events";

export class AVCenterPanel extends CenterPanel {
  $avcomponent: JQuery;
  avcomponent: any;
  private _lastCanvasIndex: number | undefined;
  private _mediaReady: boolean = false;
  private _isThumbsViewOpen: boolean = false;

  constructor($element: JQuery) {
    super($element);
    this.attributionPosition = Position.BOTTOM_RIGHT;
  }

  create(): void {
    this.setConfig("avCenterPanel");

    super.create();

    const that = this;

    this.extensionHost.subscribe(
      IIIFEvents.OPEN_EXTERNAL_RESOURCE,
      (resources: IExternalResource[]) => {
        that.openMedia(resources);
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        if (this._lastCanvasIndex !== canvasIndex) {
          this._viewCanvas(canvasIndex);
        }
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.CURRENT_TIME_CHANGE,
      (currentTime: number) => {
        this._whenMediaReady(() => {
          if (this.avcomponent) {
            this.avcomponent.setCurrentTime(currentTime, true);
          }
        });
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.RANGE_CHANGE,
      (range: Range | null) => {
        if (!this._observeRangeChanges()) {
          return;
        }

        this._whenMediaReady(() => {
          that._viewRange(range);
          that._setTitle();
        });
      }
    );

    this.extensionHost.subscribe(IIIFEvents.METRIC_CHANGE, () => {
      this._whenMediaReady(() => {
        if (this.avcomponent) {
          this.avcomponent.set({
            limitToRange: this._limitToRange(),
            constrainNavigationToRange: this._limitToRange(),
            autoAdvanceRanges: this._autoAdvanceRanges(),
          });
        }
      });
    });

    this.extensionHost.subscribe(Events.CREATED, () => {
      this._setTitle();
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_THUMBS_VIEW, () => {
      this._isThumbsViewOpen = true;

      this._whenMediaReady(() => {
        if (this.avcomponent) {
          this.avcomponent.set({
            virtualCanvasEnabled: false,
          });

          const canvas: Canvas | null = this.extension.helper.getCurrentCanvas();

          if (canvas) {
            this._viewCanvas(this.extension.helper.canvasIndex);
          }
        }
      });
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_TREE_VIEW, () => {
      this._isThumbsViewOpen = false;

      this._whenMediaReady(() => {
        if (this.avcomponent) {
          this.avcomponent.set({
            virtualCanvasEnabled: true,
          });
        }
      });
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_LEFT_PANEL, () => {
      this.resize();
    });

    this.extensionHost.subscribe(IIIFEvents.OPEN_RIGHT_PANEL, () => {
      this.resize();
    });

    this._createAVComponent();
  }

  _mediaReadyQueue: Function[] = [];
  // call all callbacks in the order they were added, and remove them from the queue
  private _flushMediaReadyQueue() {
    for (const cb of this._mediaReadyQueue) {
      cb();
    }
    this._mediaReadyQueue = [];
  }

  private _createAVComponent(): void {
    this.$avcomponent = $('<div class="iiif-av-component"></div>');
    this.$content.prepend(this.$avcomponent);

    // @ts-ignore
    this.avcomponent = new AVComponent({
      target: <HTMLElement>this.$avcomponent[0],
      // @ts-ignore
      data: {
        posterImageExpanded: this.options.posterImageExpanded,
        enableFastForward: true,
        enableFastRewind: true,
      }
    });

    this.avcomponent.on('mediaerror', (err) => {
      if (!this.config.options.hideMediaError) {
        this.extensionHost.publish(IIIFEvents.SHOW_MESSAGE, [err]);
      }
    });

    this.avcomponent.on(
      "mediaready",
      () => {
        this._mediaReady = true;
        this._flushMediaReadyQueue();
      },
      false
    );

    this.avcomponent.on("pause", () => {
      this.extensionHost.publish(
        IIIFEvents.PAUSE,
        this.avcomponent.getCurrentTime()
      );
    });

    this.avcomponent.on(
      "rangechanged",
      (rangeId: string | null) => {
        if (rangeId) {
          const range: Range | null = this.extension.helper.getRangeById(
            rangeId
          );

          if (range) {
            const currentRange: Range | null = this.extension.helper.getCurrentRange();

            if (range !== currentRange) {
              this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, range);
            }
          } else {
            this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, null);
          }
        } else {
          this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, null);
        }

        this._setTitle();
      },
      false
    );
  }

  private _observeRangeChanges(): boolean {
    return !this._isThumbsViewOpen;
  }

  private _setTitle(): void {
    let title: string = "";
    let value: string | null;
    let label: LanguageMap;

    // get the current range or canvas title
    const currentRange: Range | null = this.extension.helper.getCurrentRange();

    if (currentRange) {
      label = currentRange.getLabel();
    } else {
      label = this.extension.helper.getCurrentCanvas().getLabel();
    }

    value = LanguageMap.getValue(label);

    if (value) {
      title = value;
    }

    if (Bools.getBool(this.config.options.includeParentInTitleEnabled, false)) {
      // get the parent range or manifest's title
      if (currentRange) {
        if (currentRange.parentRange) {
          label = currentRange.parentRange.getLabel();
          value = LanguageMap.getValue(label);
        }
      } else {
        value = this.extension.helper.getLabel();
      }

      if (value) {
        title += this.content.delimiter + value;
      }
    }

    this.title = title;

    // set subtitle
    const groups: MetadataGroup[] = this.extension.helper.getMetadata(<
      MetadataOptions
    >{
      range: currentRange
    });

    for (let i = 0; i < groups.length; i++) {
      const group: MetadataGroup = groups[i];

      const item: LabelValuePair | undefined = group.items.find(
        (el: LabelValuePair) => {
          if (el.label) {
            const label: string | null = LanguageMap.getValue(el.label);
            if (
              label &&
              label.toLowerCase() === this.config.options.subtitleMetadataField
            ) {
              return true;
            }
          }

          return false;
        }
      );

      if (item) {
        // @ts-ignore
        this.subtitle = LanguageMap.getValue(item.value);
        break;
      }
    }

    this.$title.text(sanitize(this.title));

    this.resize(false);
  }

  private _isCurrentResourceAccessControlled(): boolean {
    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    return canvas.externalResource.isAccessControlled();
  }

  openMedia(resources: IExternalResource[]) {
    this.extension.getExternalResources(resources).then(() => {
      if (this.avcomponent) {
        let didReset = false;
        // reset if the media has already been loaded (degraded flow has happened)
        if (this.extension.helper.canvasIndex === this._lastCanvasIndex) {
          didReset = true;
          this.avcomponent.reset();
        }

        this._lastCanvasIndex = this.extension.helper.canvasIndex;

        this.avcomponent.set({
          helper: this.extension.helper,
          adaptiveAuthEnabled: this._isCurrentResourceAccessControlled(),
          autoPlay: this.config.options.autoPlay,
          enableFastForward: this.config.options.enableFastForward,
          enableFastRewind: this.config.options.enableFastRewind,
          autoSelectRange: true,
          constrainNavigationToRange: this._limitToRange(),
          autoAdvanceRanges: this._autoAdvanceRanges(),
          content: this.content,
          defaultAspectRatio: 0.56,
          doubleClickMS: 350,
          limitToRange: this._limitToRange(),
          posterImageRatio: this.config.options.posterImageRatio,
        });

        if (didReset) {
          this._viewCanvas(this._lastCanvasIndex);
        }

        // console.log("set up")
        // this.avcomponent.on('waveformready', () => {
        //     this.resize();
        // }, false);

        this.extensionHost.publish(Events.EXTERNAL_RESOURCE_OPENED);
      }
    });
  }

  private _limitToRange(): boolean {
    if (Bools.getBool(this.config.options.limitToRange, false)) {
      return true;
    }

    return !this.extension.isDesktopMetric();
  }

  private _autoAdvanceRanges(): boolean {
    return Bools.getBool(this.config.options.autoAdvanceRanges, true);
  }

  private _whenMediaReady(cb: () => void): void {
    if (this._mediaReady) {
      cb();
    } else {
      this._mediaReadyQueue.push(cb);
    }
  }

  private _viewRange(range: Range | null): void {
    this._whenMediaReady(() => {
      if (range && this.avcomponent) {
        this.avcomponent.viewRange(range.id);
      }

      // don't resize the av component to avoid expensively redrawing waveforms
      this.resize(false);
    });
  }

  private _viewCanvas(canvasIndex: number): void {
    this._whenMediaReady(() => {
      const canvas: Canvas | null = this.extension.helper.getCanvasByIndex(
        canvasIndex
      );

      if (this.avcomponent) {
        this.avcomponent.showCanvas(canvas.id);
      }
    });
  }

  resize(resizeAVComponent: boolean = true) {
    super.resize();

    if (resizeAVComponent && this.avcomponent) {
      this.$avcomponent.height(this.$content.height());
      this.avcomponent.resize();
    }
  }
}
