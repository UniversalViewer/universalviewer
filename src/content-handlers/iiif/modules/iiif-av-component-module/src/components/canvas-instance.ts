import { convertToPercentage } from "../helpers/convert-to-percentage";

const $ = require("jquery");
import {
  Annotation,
  AnnotationBody,
  Canvas,
  Duration,
  Range,
  Utils,
} from "manifesto.js";
import { Behavior, MediaType } from "@iiif/vocabulary/dist-commonjs";
import { BaseComponent, IBaseComponentOptions } from "@iiif/base-component";
import { IAVCanvasInstanceData } from "../interfaces/canvas-instance-data";
import { MediaElement } from "../elements/media-element";
import { TimePlanPlayer } from "../elements/timeplan-player";
import { VolumeEvents } from "../events/volume-events";
import { extractMediaFromAnnotationBodies } from "../helpers/extract-media-from-annotation-bodies";
import { AVVolumeControl } from "./volume-control";
import { CompositeMediaElement } from "../elements/composite-media-element";
import { createTimePlansFromManifest } from "../helpers/create-time-plans-from-manifest";
import { getMediaSourceFromAnnotationBody } from "../helpers/get-media-source-from-annotation-body";
import { CanvasInstanceEvents } from "../events/canvas-instance-events";
import { AVComponent } from "./av-component";
import { VirtualCanvas } from "../elements/virtual-canvas";
import { Events } from "../events/av-component-events";
import { isHLSFormat } from "../helpers/is-hls-format";
import { isMpegDashFormat } from "../helpers/is-mpeg-dash-format";
import { retargetTemporalComponent } from "../helpers/retarget-temporal-component";
import { getSpatialComponent } from "../helpers/get-spatial-component";
import { canPlayHls } from "../helpers/can-play-hls";
import { formatTime } from "../helpers/format-time";
import { isSafari } from "../helpers/is-safari";
import { diffData } from "../helpers/diff-data";
import { isVirtual } from "../helpers/is-virtual";
import {
  addTime,
  fromMs,
  minusTime,
  timelineTime,
  TimelineTime,
  TimelineTimeMs,
  toMs,
} from "../helpers/relative-time";
import { Logger } from "../helpers/logger";
import { getHls } from "../helpers/get-hls";
import "waveform-panel";
import { WaveformPanel } from "waveform-panel";

export class CanvasInstance extends BaseComponent {
  private _$canvasContainer: JQuery;
  private _$canvasDuration: JQuery;
  private _$canvasHoverHighlight: JQuery;
  private _$canvasHoverPreview: JQuery;
  private _$canvasTime: JQuery;
  private _$canvasTimelineContainer: JQuery;
  private _$controlsContainer: JQuery;
  private _$durationHighlight: JQuery;
  private _$hoverPreviewTemplate: JQuery;
  private _$nextButton: JQuery;
  private _$fastForward: JQuery;
  private _$fastRewind: JQuery;
  private _$optionsContainer: JQuery;
  private _$playButton: JQuery;
  private _$prevButton: JQuery;
  private _$rangeHoverHighlight: JQuery;
  private _$rangeHoverPreview: JQuery;
  private _$rangeTimelineContainer: JQuery;
  private _$timeDisplay: JQuery;
  private _$timelineItemContainer: JQuery;
  private _canvasClockFrequency = 25;
  private _canvasClockInterval: number;
  private _canvasClockStartDate: TimelineTimeMs = 0 as TimelineTimeMs;
  private _canvasClockTime: TimelineTime = 0 as TimelineTime;
  private _canvasHeight = 0;
  private _canvasWidth = 0;
  private _waveformPanel?: WaveformPanel;
  private _contentAnnotations: any[]; // todo: type as HTMLMediaElement?
  private _data: IAVCanvasInstanceData = this.data();
  private _highPriorityFrequency = 25;
  private _highPriorityInterval: number;
  private _isPlaying = false;
  private _isStalled = false;
  //private _lastCanvasHeight: number | undefined;
  //private _lastCanvasWidth: number | undefined;
  private _lowPriorityFrequency = 250;
  private _lowPriorityInterval: number;
  private _mediaSyncMarginSecs = 1;
  private _rangeSpanPadding = 0.25;
  private _readyMediaCount = 0;
  private _stallRequestedBy: any[] = []; //todo: type
  private _volume: AVVolumeControl;
  private _wasPlaying = false;
  public ranges: Range[] = [];
  public waveforms: string[] = [];
  public waveformSources: {
    source: string;
    canvas: string;
    start: number;
    end: number;
    itemData: any;
  }[] = [];
  private _buffering = false;
  private _bufferShown = false;
  public $playerElement: JQuery;
  public _$element: JQuery;
  public isOnlyCanvasInstance = false;
  public logMessage: (message: string) => void;
  public timePlanPlayer: TimePlanPlayer;

  constructor(options: IBaseComponentOptions) {
    super(options);
    this._$element = $(this.options.target);
    this._data = this.options.data;
    this.$playerElement = $('<div class="player player--loading"></div>');
    this.$playerElement.hide();
  }

  public loaded(): void {
    setTimeout(() => {
      this.$playerElement.removeClass("player--loading");
    }, 500);
  }

  public isPlaying(): boolean {
    return this._isPlaying;
  }

  public getClockTime(): TimelineTime {
    return this._canvasClockTime;
  }

  public createTimeStops() {
    const helper = this._data.helper;
    const virtualCanvas = this._data.canvas as VirtualCanvas;
    if (!helper || !virtualCanvas) {
      return;
    }

    this.ranges = [];
    this._contentAnnotations = [];

    const canvases = virtualCanvas.canvases;
    const mediaElements: MediaElement[] = [];
    for (const canvas of canvases) {
      const annotations = canvas.getContent();
      for (const annotation of annotations) {
        const annotationBody = extractMediaFromAnnotationBodies(annotation);
        if (!annotationBody) {
          continue;
        }
        const mediaSource = getMediaSourceFromAnnotationBody(
          annotation,
          annotationBody,
          {
            id: canvas.id,
            duration: canvas.getDuration() || 0,
            height: canvas.getHeight(),
            width: canvas.getWidth(),
          }
        );

        const mediaElement = new MediaElement(mediaSource, {
          adaptiveAuthEnabled: this._data.adaptiveAuthEnabled,
          probed: this.options.data?.canvas?.externalResource?.isProbed,
        });

        mediaElement.setSize(
          this._convertToPercentage(mediaSource.x || 0, canvas.getHeight()),
          this._convertToPercentage(mediaSource.y || 0, canvas.getWidth()),
          this._convertToPercentage(
            mediaSource.width || canvas.getWidth(),
            canvas.getWidth()
          ),
          this._convertToPercentage(
            mediaSource.height || canvas.getHeight(),
            canvas.getHeight()
          )
        );

        mediaElements.push(mediaElement);

        const seeAlso: any = annotation.getProperty("seeAlso");
        if (seeAlso && seeAlso.length) {
          const dat: string = seeAlso[0].id;
          this.waveforms.push(dat);

          const temporalOffsets: RegExpExecArray | null = /t=([^&]+)/g.exec(
            annotation.__jsonld.target
          );
          const [start, end] = ((temporalOffsets || [])[1] || "")
            .split(",")
            .map((i) => parseFloat(i));

          this.waveformSources.push({
            source: dat,
            canvas: canvas.id,
            start,
            end,
            itemData: { start, end, source: annotation.id },
          });
        }
      }
    }

    if (mediaElements.length === 0) {
      // Since this is a constructor call.
      setTimeout(() => {
        this.fire(
          Events.MEDIA_ERROR,
          this._data?.content?.noMediaMessage || "No media available to play"
        );
      }, 200);
    }

    const compositeMediaElement = new CompositeMediaElement(mediaElements);

    compositeMediaElement.appendTo(this.$playerElement);

    compositeMediaElement.load().then(() => {
      // this._updateDurationDisplay();
      this.fire(Events.MEDIA_READY);
    });

    // this._renderSyncIndicator(data)

    // @ts-ignore
    const plan = createTimePlansFromManifest(
      helper.manifest as any,
      mediaElements
    );

    // @ts-ignore
    window.timePlanPlayer = this.timePlanPlayer = new TimePlanPlayer(
      compositeMediaElement,
      plan,
      (rangeId) => {
        this.setCurrentRangeId(rangeId, { autoChanged: true });
      },
      (time) => {
        this._canvasClockTime = time;
      },
      (isPlaying) => {
        if (this._buffering) {
          return;
        }
        if (isPlaying) {
          this.play(true);
        } else {
          this.pause(true);
        }
      },
      () => {
        this._buffering = true;
      }
    );
  }

  public init() {
    if (!this._data || !this._data.content || !this._data.canvas) {
      Logger.warn("unable to initialise, missing canvas or content");
      return;
    }

    this._$hoverPreviewTemplate = $(
      '<div class="hover-preview"><div class="label"></div><div class="pointer"><span class="arrow"></span></div></div>'
    );
    this._$canvasContainer = $('<div class="canvas-container"></div>');
    this._$optionsContainer = $('<div class="options-container"></div>');
    this._$rangeTimelineContainer = $(
      '<div class="range-timeline-container"></div>'
    );
    this._$canvasTimelineContainer = $(
      '<div class="canvas-timeline-container"></div>'
    );
    this._$canvasHoverPreview = this._$hoverPreviewTemplate.clone();
    this._$canvasHoverHighlight = $('<div class="hover-highlight"></div>');
    this._$rangeHoverPreview = this._$hoverPreviewTemplate.clone();
    this._$rangeHoverHighlight = $('<div class="hover-highlight"></div>');
    this._$durationHighlight = $('<div class="duration-highlight"></div>');
    this._$timelineItemContainer = $(
      '<div class="timeline-item-container"></div>'
    );
    this._$controlsContainer = $('<div class="controls-container"></div>');
    this._$prevButton = $(`
                                <button class="btn" title="${this._data.content.previous}">
                                    <i class="av-icon av-icon-previous" aria-hidden="true"></i>
                                    <span class="sr-only>${this._data.content.previous}</span>
                                </button>`);
    this._$playButton = $(`
                                <button class="btn" title="${this._data.content.play}">
                                    <i class="av-icon av-icon-play play" aria-hidden="true"></i>
                                    <span class="sr-only>${this._data.content.play}</span>
                                </button>`);
    this._$nextButton = $(`
                                <button class="btn" title="${this._data.content.next}">
                                    <i class="av-icon av-icon-next" aria-hidden="true"></i>
                                    <span class="sr-only>${this._data.content.next}</span>
                                </button>`);
    this._$fastForward = $(`
                                <button class="btn" title="${this._data.content.fastForward}">
                                    <i class="av-icon av-icon-fast-forward" aria-hidden="true"></i>
                                    <span class="sr-only>
                                    ${this._data.content.fastForward || ""}
                                    </span>
                                </button>`);
    this._$fastRewind = $(`
                                <button class="btn" title="${this._data.content.fastRewind}">
                                    <i class="av-icon av-icon-fast-rewind" aria-hidden="true"></i>
                                    <span class="sr-only>
                                    ${this._data.content.fastRewind || ""}
                                    </span>
                                </button>`);

    this._$timeDisplay = $(
      '<div class="time-display"><span class="canvas-time"></span> / <span class="canvas-duration"></span></div>'
    );
    this._$canvasTime = this._$timeDisplay.find(".canvas-time");
    this._$canvasDuration = this._$timeDisplay.find(".canvas-duration");

    if (this.isVirtual()) {
      this.$playerElement.addClass("virtual");
    }

    const $volume: JQuery = $('<div class="volume"></div>');
    this._volume = new AVVolumeControl({
      target: $volume[0] as HTMLElement,
      data: Object.assign({}, this._data),
    });

    this._volume.on(
      VolumeEvents.VOLUME_CHANGED,
      (value: number) => {
        this.fire(VolumeEvents.VOLUME_CHANGED, value);
      },
      false
    );

    // @todo make the buttons for FF and FR configurable.
    this._$controlsContainer.append(
      this._$prevButton,
      this._data.enableFastRewind ? this._$fastRewind : null,
      this._$playButton,
      this._data.enableFastForward ? this._$fastForward : null,
      this._$nextButton,
      this._$timeDisplay,
      $volume
    );
    this._$canvasTimelineContainer.append(
      this._$canvasHoverPreview,
      this._$canvasHoverHighlight,
      this._$durationHighlight
    );
    this._$rangeTimelineContainer.append(
      this._$rangeHoverPreview,
      this._$rangeHoverHighlight
    );
    this._$optionsContainer.append(
      this._$canvasTimelineContainer,
      this._$rangeTimelineContainer,
      this._$controlsContainer
    );
    this.$playerElement.append(this._$canvasContainer, this._$optionsContainer);

    this._$canvasHoverPreview.hide();
    this._$rangeHoverPreview.hide();

    const newRanges = this.isVirtual() && AVComponent.newRanges;

    // Should bootstrap ranges and content.
    if (newRanges) {
      this.createTimeStops();
    }

    if (!newRanges) {
      if (this._data && this._data.helper && this._data.canvas) {
        let ranges: Range[] = [];

        // if the canvas is virtual, get the ranges for all sub canvases
        if (isVirtual(this._data.canvas)) {
          this._data.canvas.canvases.forEach((canvas: Canvas) => {
            if (this._data && this._data.helper) {
              // @ts-ignore
              const r: Range[] = this._data.helper.getCanvasRanges(canvas);

              const clonedRanges: Range[] = [];

              // shift the range targets forward by the duration of their previous canvases
              r.forEach((range: Range) => {
                const clonedRange = jQuery.extend(true, {}, range);
                clonedRanges.push(clonedRange);

                if (clonedRange.canvases && clonedRange.canvases.length) {
                  for (let i = 0; i < clonedRange.canvases.length; i++) {
                    if (isVirtual(this._data.canvas)) {
                      clonedRange.canvases[i] = retargetTemporalComponent(
                        this._data.canvas.canvases,
                        clonedRange.__jsonld.items[i].id
                      );
                    }
                  }
                }
              });

              ranges.push(...clonedRanges);
            }
          });
        } else {
          // @ts-ignore
          ranges = ranges.concat(
            this._data.helper.getCanvasRanges(this._data.canvas as Canvas)
          );
        }

        ranges.forEach((range: Range) => {
          this.ranges.push(range);
        });
      }
    }

    const canvasWidth: number = this._data.canvas.getWidth();
    const canvasHeight: number = this._data.canvas.getHeight();

    if (!canvasWidth) {
      this._canvasWidth = this.$playerElement.parent().width(); // this._data.defaultCanvasWidth;
    } else {
      this._canvasWidth = canvasWidth;
    }

    if (!canvasHeight) {
      this._canvasHeight =
        this._canvasWidth * (this._data.defaultAspectRatio || 1); //this._data.defaultCanvasHeight;
    } else {
      this._canvasHeight = canvasHeight;
    }

    const that = this;

    let prevClicks = 0;
    let prevTimeout = 0;

    this._$prevButton.on("touchstart click", (e) => {
      e.preventDefault();

      prevClicks++;

      if (prevClicks === 1) {
        // single click
        this._previous(false);
        prevTimeout = setTimeout(() => {
          prevClicks = 0;
          prevTimeout = 0;
        }, this._data.doubleClickMS) as any;
      } else {
        // double click
        this._previous(true);
        clearTimeout(prevTimeout);
        prevClicks = 0;
        prevTimeout = 0;
      }
    });

    this._$playButton.on("touchstart click", (e) => {
      e.preventDefault();

      if (this._isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    this._$nextButton.on("touchstart click", (e) => {
      e.preventDefault();

      this._next();
    });

    this._$fastForward.on("touchstart click", (e) => {
      const { end } = this.getRangeTiming();
      const goToTime = addTime(this.getClockTime(), 20 as TimelineTime);
      if (goToTime < end) {
        return this._setCurrentTime(goToTime);
      }
      return this._setCurrentTime(end);
    });

    this._$fastRewind.on("touchstart click", (e) => {
      const { start } = this.getRangeTiming();
      const goToTime = minusTime(this.getClockTime(), 20 as TimelineTime);
      if (goToTime >= start) {
        return this._setCurrentTime(goToTime);
      }
      return this._setCurrentTime(start);
    });

    if (newRanges) {
      this._$canvasTimelineContainer.slider({
        value: 0,
        step: 0.01,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: this.timePlanPlayer.getDuration(),
        animate: false,
        slide: (evt: any, ui: any) => {
          this._setCurrentTime(this.timePlanPlayer.plan.start + ui.value);
        },
      });
    } else {
      this._$canvasTimelineContainer.slider({
        value: 0,
        step: 0.01,
        orientation: "horizontal",
        range: "min",
        max: that._getDuration(),
        animate: false,
        create: function (evt: any, ui: any) {
          // on create
        },
        slide: function (evt: any, ui: any) {
          that._setCurrentTime(ui.value);
        },
        stop: function (evt: any, ui: any) {
          //this._setCurrentTime(ui.value);
        },
      });
    }

    this._$canvasTimelineContainer.mouseout(() => {
      that._$canvasHoverHighlight.width(0);
      that._$canvasHoverPreview.hide();
    });

    this._$rangeTimelineContainer.mouseout(() => {
      that._$rangeHoverHighlight.width(0);
      that._$rangeHoverPreview.hide();
    });

    this._$canvasTimelineContainer.on("mousemove", (e) => {
      if (newRanges) {
        this._updateHoverPreview(
          e,
          this._$canvasTimelineContainer,
          this.timePlanPlayer.getDuration()
        );
      } else {
        this._updateHoverPreview(
          e,
          this._$canvasTimelineContainer,
          this._getDuration()
        );
      }
    });

    this._$rangeTimelineContainer.on("mousemove", (e) => {
      if (newRanges) {
        this._updateHoverPreview(
          e,
          this._$canvasTimelineContainer,
          this.timePlanPlayer.getDuration()
        );
      } else if (this._data.range) {
        const duration: Duration | undefined = this._data.range.getDuration();
        this._updateHoverPreview(
          e,
          this._$rangeTimelineContainer,
          duration ? duration.getLength() : 0
        );
      }
    });

    if (newRanges) {
      return;
    }

    // create annotations

    this._contentAnnotations = [];

    const items: Annotation[] = this._data.canvas.getContent(); // (<any>this._data.canvas).__jsonld.content[0].items;

    // always hide timelineItemContainer for now
    this._$timelineItemContainer.hide();

    for (let i = 0; i < items.length; i++) {
      const item: Annotation = items[i];

      let mediaSource: any;
      const bodies: AnnotationBody[] = item.getBody();

      if (!bodies.length) {
        Logger.warn("item has no body");
        return;
      }

      const body: AnnotationBody | null = this._getBody(bodies);

      if (!body) {
        // if no suitable format was found for the current browser, skip this item.
        Logger.warn("unable to find suitable format for", item.id);
        continue;
      }

      const type: string | null = body.getType();
      const format = body.getFormat();

      if (type && type.toString() === "textualbody") {
        //mediaSource = (<any>body).value;
      } else {
        mediaSource = body.id.split("#")[0];
      }

      const target: string | null = item.getTarget();

      if (!target) {
        Logger.warn("item has no target");
        return;
      }

      let xywh: number[] | null = getSpatialComponent(target);
      let t: number[] | null = Utils.getTemporalComponent(target);

      if (!xywh) {
        xywh = [0, 0, this._canvasWidth, this._canvasHeight];
      }

      if (!t) {
        t = [0, this._getDuration()];
      }

      const positionLeft = parseInt(String(xywh[0])),
        positionTop = parseInt(String(xywh[1])),
        mediaWidth = parseInt(String(xywh[2])),
        mediaHeight = parseInt(String(xywh[3])),
        startTime = parseInt(String(t[0])),
        endTime = parseInt(String(t[1]));

      const percentageTop = this._convertToPercentage(
          positionTop,
          this._canvasHeight
        ),
        percentageLeft = this._convertToPercentage(
          positionLeft,
          this._canvasWidth
        ),
        percentageWidth = this._convertToPercentage(
          mediaWidth,
          this._canvasWidth
        ),
        percentageHeight = this._convertToPercentage(
          mediaHeight,
          this._canvasHeight
        );

      const temporalOffsets: RegExpExecArray | null = /t=([^&]+)/g.exec(
        body.id
      );

      let ot;

      if (temporalOffsets && temporalOffsets[1]) {
        ot = temporalOffsets[1].split(",");
      } else {
        ot = [null, null];
      }

      const offsetStart = ot[0] ? parseInt(ot[0]) : ot[0],
        offsetEnd = ot[1] ? parseInt(ot[1]) : ot[1];

      // todo: type this
      const itemData: any = {
        active: false,
        end: endTime,
        endOffset: offsetEnd,
        format: format,
        height: percentageHeight,
        left: percentageLeft,
        source: mediaSource,
        start: startTime,
        startOffset: offsetStart,
        top: percentageTop,
        type: type,
        width: percentageWidth,
      };

      this._renderMediaElement(itemData);

      // waveform
      // todo: create annotation.getSeeAlso
      const seeAlso: any = item.getProperty("seeAlso");

      if (seeAlso && seeAlso.length) {
        const dat: string = seeAlso[0].id;
        this.waveforms.push(dat);
        this.waveformSources.push({
          canvas: this._data.canvas.id,
          source: dat,
          start: 0,
          end: itemData.end - itemData.start,
          itemData,
        });
      }
    }
  }

  private _getBody(bodies: AnnotationBody[]): AnnotationBody | null {
    // if there's an HLS format and HLS is supported in this browser
    for (let i = 0; i < bodies.length; i++) {
      const body: AnnotationBody = bodies[i];
      const format: MediaType | null = body.getFormat();

      if (format) {
        if (isHLSFormat(format) && canPlayHls()) {
          return body;
        }
      }
    }

    // if there's a Dash format and the browser isn't Safari
    for (let i = 0; i < bodies.length; i++) {
      const body: AnnotationBody = bodies[i];
      const format: MediaType | null = body.getFormat();

      if (format) {
        if (isMpegDashFormat(format) && !isSafari()) {
          return body;
        }
      }
    }

    // otherwise, return the first format that isn't HLS or Dash
    for (let i = 0; i < bodies.length; i++) {
      const body: AnnotationBody = bodies[i];
      const format: MediaType | null = body.getFormat();

      if (format) {
        if (!isHLSFormat(format) && !isMpegDashFormat(format)) {
          return body;
        }
      }
    }

    // couldn't find a suitable format
    return null;
  }

  getDuration() {
    return this._getDuration();
  }

  private _getDuration(): TimelineTime {
    if (this.isVirtual() && AVComponent.newRanges) {
      return this.timePlanPlayer.getDuration();
    }

    if (this._data && this._data.canvas) {
      return Math.floor(
        this._data.canvas.getDuration() as number
      ) as TimelineTime;
    }

    return 0 as TimelineTime;
  }

  public data(): IAVCanvasInstanceData {
    return {
      waveformColor: "#fff",
      waveformBarSpacing: 4,
      waveformBarWidth: 2,
      volume: 1,
    };
  }

  /**
   * @deprecated
   */
  public isVirtual(): boolean {
    return this._data.canvas instanceof VirtualCanvas;
  }

  public isVisible(): boolean {
    return !!this._data.visible;
  }

  public includesVirtualSubCanvas(canvasId: string): boolean {
    if (
      isVirtual(this._data.canvas) &&
      this._data.canvas &&
      this._data.canvas.canvases
    ) {
      for (let i = 0; i < this._data.canvas.canvases.length; i++) {
        const canvas: Canvas = this._data.canvas.canvases[i];
        if (Utils.normaliseUrl(canvas.id) === canvasId) {
          return true;
        }
      }
    }

    return false;
  }

  setVisibility(visibility: boolean) {
    if (this._data.visible === visibility) {
      return;
    }

    this._data.visible = visibility;
    if (visibility) {
      this._rewind();
      this.$playerElement.show();
    } else {
      this.$playerElement.hide();
      this.pause();
    }
    this.resize();
  }

  viewRange(rangeId: string) {
    if (this.currentRange !== rangeId) {
      Logger.log(`Switching range from ${this.currentRange} to ${rangeId}`);
      this.setCurrentRangeId(rangeId, { noRender: false });
      // Entrypoint for changing a range. Only get's called when change came from external source.
      if (AVComponent.newRanges && this.isVirtual()) {
        this._setCurrentTime(this.timePlanPlayer.setRange(rangeId), true);
      } else {
        // this is called when timePlanPlayer isn't available (it's not a virtual canvas)
        const range = this._data!.helper!.getRangeById(rangeId);
        this.set({
          range: jQuery.extend(true, { autoChanged: true }, range),
        });
      }

      this._render();
    }
  }

  limitToRange: boolean;
  autoAdvanceRanges = true;
  currentRange?: string;
  setCurrentRangeId(
    range: null | string,
    {
      autoChanged = false,
      limitToRange = false,
      noRender = false,
    }: {
      autoChanged?: boolean;
      limitToRange?: boolean;
      noRender?: boolean;
    } = {}
  ) {
    if (autoChanged && !this.autoAdvanceRanges) {
      return;
    }

    Logger.log("Setting current range id", range);

    // This is the end of the chain for changing a range.
    if (range && this.currentRange !== range) {
      this.currentRange = range;
      this.fire(Events.RANGE_CHANGED, range);
    } else if (range === null) {
      this.currentRange = undefined;
      this.fire(Events.RANGE_CHANGED, null);
    }

    if (!noRender) {
      this._render();
    }
  }

  setVolume(volume: number) {
    this._volume.set({ volume });
    if (AVComponent.newRanges && this.isVirtual()) {
      this.timePlanPlayer.setVolume(volume);
    }
  }

  setLimitToRange(limitToRange: boolean) {
    Logger.log(this._data.constrainNavigationToRange);
    if (this.limitToRange !== limitToRange) {
      this.limitToRange = limitToRange;
      this._render();
    }
  }

  public set(data: IAVCanvasInstanceData): void {
    // Simplification of setting state.
    if (AVComponent.newRanges && this.isVirtual()) {
      if (typeof data.range !== "undefined") {
        this.setCurrentRangeId(data.range.id, {
          limitToRange: data.limitToRange,
        });
      }
      if (typeof data.rangeId !== "undefined") {
        this.setCurrentRangeId(data.rangeId, {
          limitToRange: data.limitToRange,
        });
      }
      if (typeof data.volume !== "undefined") {
        this.setVolume(data.volume);
      }
      if (typeof data.limitToRange !== "undefined") {
        this.setLimitToRange(data.limitToRange);
      }
      if (typeof data.visible !== "undefined") {
        this.setVisibility(data.visible);
      }

      return;
    }

    const oldData: IAVCanvasInstanceData = Object.assign({}, this._data);
    this._data = Object.assign(this._data, data);
    const diff: string[] = diffData(oldData, this._data);

    if (diff.includes("visible")) {
      if (this._data.canvas) {
        if (this._data.visible) {
          this._rewind();
          this.$playerElement.show();
        } else {
          this.$playerElement.hide();
          this.pause();
        }

        this.resize();
      }
    }

    if (diff.includes("volume")) {
      this._contentAnnotations.forEach(($mediaElement: any) => {
        const volume: number =
          this._data.volume !== undefined ? this._data.volume : 1;

        $($mediaElement.element).prop("volume", volume);

        this._volume.set({
          volume: this._data.volume,
        });
      });
    } else {
      if (this.isVisible()) {
        this._render();
      }
    }

    if (diff.includes("range")) {
      if (this._data.helper) {
        if (!this._data.range) {
          this.fire(Events.RANGE_CHANGED, null);
        } else {
          const duration: Duration | undefined = this._data.range.getDuration();

          if (duration) {
            if (typeof duration !== "undefined") {
              // Only change the current time if the current time is outside of the current time.
              if (
                duration.start >= this._canvasClockTime ||
                duration.end <= this._canvasClockTime
              ) {
                this._setCurrentTime(duration.start as TimelineTime);
              }

              if (this._data.autoPlay) {
                this.play();
              }

              this.fire(
                Events.RANGE_CHANGED,
                this._data.range.id,
                this._data.range
              );
            }
          }
        }
      }

      if (diff.includes("limitToRange")) {
        this._render();
      }
    }
  }

  private _hasRangeChanged(): void {
    if (this.isVirtual() && AVComponent.newRanges) {
      return;
    }

    const range: Range | undefined = this._getRangeForCurrentTime();

    if (
      range &&
      !this._data.limitToRange &&
      (!this._data.range ||
        (this._data.range && range.id !== this._data.range.id))
    ) {
      this.set({
        range: jQuery.extend(true, { autoChanged: true }, range),
      });
    }
  }

  private _getRangeForCurrentTime(parentRange?: Range): Range | undefined {
    let ranges: Range[];

    if (!parentRange) {
      ranges = this.ranges;
    } else {
      ranges = parentRange.getRanges();
    }

    for (let i = 0; i < ranges.length; i++) {
      const range: Range = ranges[i];
      const rangeBehavior = range.getBehavior();
      if (rangeBehavior && rangeBehavior !== "no-nav") {
        continue;
      }

      // if the range spans the current time, and is navigable, return it.
      // otherwise, try to find a navigable child range.
      if (this._rangeSpansCurrentTime(range)) {
        if (this._rangeNavigable(range)) {
          return range;
        }

        const childRanges: Range[] = range.getRanges();

        // if a child range spans the current time, recurse into it
        for (let j = 0; j < childRanges.length; j++) {
          const childRange: Range = childRanges[j];

          if (this._rangeSpansCurrentTime(childRange)) {
            return this._getRangeForCurrentTime(childRange);
          }
        }

        // this range isn't navigable, and couldn't find a navigable child range.
        // therefore return the parent range (if any).
        return range.parentRange;
      }
    }

    return undefined;
  }

  private _rangeSpansCurrentTime(range: Range): boolean {
    if (
      range.spansTime(Math.ceil(this._canvasClockTime) + this._rangeSpanPadding)
    ) {
      return true;
    }

    return false;
  }

  private _rangeNavigable(range: Range): boolean {
    const behavior: Behavior | null = range.getBehavior();

    if (behavior && behavior.toString() === "no-nav") {
      return false;
    }

    return true;
  }

  private _render(): void {
    if (this.isVirtual() && AVComponent.newRanges && this.isVisible()) {
      Logger.groupCollapsed("CanvasInstance._render()");
      Logger.log({
        dataRange: this._data.rangeId,
        range: this.currentRange,
        newLimitToRange: this.limitToRange,
        constraintToRange: this._data.constrainNavigationToRange,
        autoSelectRange: this._data.autoSelectRange,
      });

      // 3 ways to render:
      // Limit to range + no id = show everything
      // Limit to range + id = show everything in context
      // No limit to range = show everything
      // No limit -> Limit (+ range) = show just range

      // - Range id + limitToRange
      // - Range id
      // - nothing

      if (this.limitToRange && this.currentRange) {
        Logger.log("Selecting plan...", this.currentRange);
        this.timePlanPlayer.selectPlan({ rangeId: this.currentRange });
      } else {
        Logger.log("Resetting...");
        this.timePlanPlayer.selectPlan({ reset: true });
      }

      const ratio =
        this._$canvasTimelineContainer.width() /
        this.timePlanPlayer.getDuration();
      this._$durationHighlight.show();

      const { start, duration } = this.timePlanPlayer.getCurrentRange();

      this._$canvasTimelineContainer.slider({
        value: this._canvasClockTime - this.timePlanPlayer.plan.start,
        max: this.timePlanPlayer.getDuration(),
      });

      // set the start position and width
      this._$durationHighlight.css({
        left: start * ratio,
        width: duration * ratio,
      });

      Logger.groupEnd();

      this._updateCurrentTimeDisplay();
      this._updateDurationDisplay();
      this.createWaveformPanel();
    }

    // Hide/show UI elements regardless of visibility.
    if (this._data.limitToRange && this._data.range) {
      this._$canvasTimelineContainer.hide();
      this._$rangeTimelineContainer.show();
    } else {
      this._$canvasTimelineContainer.show();
      this._$rangeTimelineContainer.hide();
    }

    if (!this.currentRange) {
      this._$durationHighlight.hide();
    }

    // Return early if the current CanvasInstance isn't visible
    if (!this.isVisible()) {
      return;
    }
    if (!this.isOnlyCanvasInstance && !this.isVirtual()) {
      return;
    }

    // Render otherwise.
    if (this._data.range && !(this.isVirtual() && AVComponent.newRanges)) {
      const duration: Duration | undefined = this._data.range.getDuration();

      if (duration) {
        // get the total length in seconds.
        const totalDuration: number = this._getDuration();

        // get the length of the timeline container
        const timelineLength: number = this._$canvasTimelineContainer.width();

        // get the ratio of seconds to length
        const ratio: number = timelineLength / totalDuration;
        const totalLength = totalDuration * ratio;
        const start: number = duration.start * ratio;
        let end: number = duration.end * ratio;

        // if the end is on the next canvas
        if (end > totalLength || end < start) {
          end = totalLength;
        }

        const width: number = end - start;

        if (this.isVirtual() || this.isOnlyCanvasInstance) {
          this._$durationHighlight.show();
          // set the start position and width
          this._$durationHighlight.css({
            left: start,
            width: width,
          });
        } else {
          this._$durationHighlight.hide();
        }

        const that = this;

        // try to destroy existing rangeTimelineContainer
        if (this._$rangeTimelineContainer.data("ui-sortable")) {
          this._$rangeTimelineContainer.slider("destroy");
        }

        this._$rangeTimelineContainer.slider({
          value: duration.start,
          step: 0.01,
          orientation: "horizontal",
          range: "min",
          min: duration.start,
          max: duration.end,
          animate: false,
          create: function (evt: any, ui: any) {
            // on create
          },
          slide: function (evt: any, ui: any) {
            that._setCurrentTime(ui.value);
          },
          stop: function (evt: any, ui: any) {
            //this._setCurrentTime(ui.value);
          },
        });
      }
    }

    this._updateCurrentTimeDisplay();
    this._updateDurationDisplay();
    this.createWaveformPanel();
    this.updateWaveformPanel();
  }

  public getCanvasId(): string | undefined {
    if (this._data && this._data.canvas) {
      return this._data.canvas.id;
    }

    return undefined;
  }

  private _updateHoverPreview(
    e: any,
    $container: JQuery,
    duration: number
  ): void {
    const offset = $container.offset() || { left: 0 };

    const x = e.pageX - offset.left;

    const $hoverArrow: JQuery = $container.find(".arrow");
    const $hoverHighlight: JQuery = $container.find(".hover-highlight");
    const $hoverPreview: JQuery = $container.find(".hover-preview");

    $hoverHighlight.width(x);

    const fullWidth: number = $container.width();
    const ratio: number = x / fullWidth;
    const seconds: number = Math.min(duration * ratio);
    $hoverPreview.find(".label").text(formatTime(seconds));
    const hoverPreviewWidth: number = $hoverPreview.outerWidth();
    const hoverPreviewHeight: number = $hoverPreview.outerHeight();

    let left: number = x - hoverPreviewWidth * 0.5;
    let arrowLeft: number = hoverPreviewWidth * 0.5 - 6;

    if (left < 0) {
      left = 0;
      arrowLeft = x - 6;
    }

    if (left + hoverPreviewWidth > fullWidth) {
      left = fullWidth - hoverPreviewWidth;
      arrowLeft = hoverPreviewWidth - (fullWidth - x) - 6;
    }

    $hoverPreview
      .css({
        left: left,
        top: hoverPreviewHeight * -1 + "px",
      })
      .show();

    $hoverArrow.css({
      left: arrowLeft,
    });
  }

  private _previous(isDouble: boolean): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      if (this._data.limitToRange) {
        this._setCurrentTime(this.timePlanPlayer.plan.start, false);
        return;
      }

      Logger.group("CanvasInstance.previous()");
      this._buffering = true;
      const newTime = this.timePlanPlayer.previous();
      this._setCurrentTime(newTime);
      Logger.log("CanvasInstance.previous()", newTime);
      this._buffering = false;
      Logger.groupEnd();
      return;
    }

    if (this._data.limitToRange) {
      // if only showing the range, single click rewinds, double click goes to previous range unless navigation is contrained to range
      if (isDouble) {
        if (this._isNavigationConstrainedToRange()) {
          this._rewind();
        } else {
          this.fire(CanvasInstanceEvents.PREVIOUS_RANGE);
        }
      } else {
        this._rewind();
      }
    } else {
      // not limited to range.
      // if there is a currentDuration, single click goes to previous range, double click clears current duration and rewinds.
      // if there is no currentDuration, single and double click rewinds.
      if (this._data.range) {
        if (isDouble) {
          this.set({
            range: undefined,
          });
          this._rewind();
        } else {
          this.fire(CanvasInstanceEvents.PREVIOUS_RANGE);
        }
      } else {
        this._rewind();
      }
    }
  }

  private async _next(): Promise<void> {
    if (AVComponent.newRanges && this.isVirtual()) {
      if (this._data.limitToRange) {
        await this._setCurrentTime(this.timePlanPlayer.plan.end, false);
        return;
      }

      Logger.groupCollapsed("next");
      this._buffering = true;
      const newTime = await this.timePlanPlayer.next();
      Logger.log("CanvasInstance.next()", newTime);
      await this._setCurrentTime(newTime, false);
      this._buffering = false;
      Logger.groupEnd();
      return;
    }
    if (this._data.limitToRange) {
      if (this._isNavigationConstrainedToRange()) {
        this._fastforward();
      } else {
        this.fire(CanvasInstanceEvents.NEXT_RANGE);
      }
    } else {
      this.fire(CanvasInstanceEvents.NEXT_RANGE);
    }
  }

  public destroy(): void {
    window.clearInterval(this._highPriorityInterval);
    window.clearInterval(this._lowPriorityInterval);
    window.clearInterval(this._canvasClockInterval);
  }

  private _convertToPercentage(pixelValue: number, maxValue: number): number {
    return convertToPercentage(pixelValue, maxValue);
  }

  private _renderMediaElement(data: any): void {
    const isProbed = this.options.data?.canvas?.externalResource?.isProbed;
    let $mediaElement;
    const type: string = data.type.toString().toLowerCase();

    switch (type) {
      case "video":
        $mediaElement = $('<video class="anno" />');
        break;
      case "sound":
      case "audio":
        $mediaElement = $('<audio class="anno" />');
        break;
      // case 'textualbody':
      //     $mediaElement = $('<div class="anno">' + data.source + '</div>');
      //     break;
      // case 'image':
      //     $mediaElement = $('<img class="anno" src="' + data.source + '" />');
      //     break;
      default:
        return;
    }

    const media: HTMLMediaElement = $mediaElement[0] as HTMLMediaElement;

    if (!isProbed) {
      media.setAttribute("crossorigin", "anonymous");
      media.crossOrigin = "anonymous";
    }

    //
    // var audioCtx = new AudioContext();
    // var source = audioCtx.createMediaElementSource(media);
    // var panNode = audioCtx.createStereoPanner();
    // var val = -1;
    // setInterval(() => {
    //     val = val === -1 ? 1 : -1;
    //     panNode.pan.setValueAtTime(val, audioCtx.currentTime);
    //     if (val === 1) {
    //         media.playbackRate = 2;
    //     } else {
    //         // media.playbackRate = 1;
    //     }
    // }, 1000);
    // source.connect(panNode);
    // panNode.connect(audioCtx.destination);

    if (data.format && data.format.toString() === "application/dash+xml") {
      // dash
      $mediaElement.attr("data-dashjs-player", "");
      const player = dashjs.MediaPlayer().create();
      player.getDebug().setLogToBrowserConsole(false);
      // player.getDebug().setLogToBrowserConsole(true);
      // player.getDebug().setLogLevel(4);
      if (this._data.adaptiveAuthEnabled) {
        player.setXHRWithCredentialsForType("MPD", true); // send cookies
      }
      player.initialize(media, data.source, false);
    } else if (
      data.format &&
      data.format.toString() === "application/vnd.apple.mpegurl"
    ) {
      const Hls = getHls();
      // hls
      if (Hls && Hls.isSupported()) {
        let hls = new Hls();

        if (this._data.adaptiveAuthEnabled) {
          hls = new Hls({
            xhrSetup: (xhr: any) => {
              xhr.withCredentials = true; // send cookies
            },
          });
        }

        if (this._data.adaptiveAuthEnabled) {
          // no-op.
        }

        hls.loadSource(data.source);
        hls.attachMedia(media);
        //hls.on(Hls.Events.MANIFEST_PARSED, function () {
        //media.play();
        //});
      } else if (media.canPlayType("application/vnd.apple.mpegurl")) {
        // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
        // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
        // This is using the built-in support of the plain video element, without using hls.js.
        media.src = data.source;
        //media.addEventListener('canplay', function () {
        //media.play();
        //});
      }
    } else {
      $mediaElement.attr("src", data.source);
    }

    $mediaElement
      .css({
        top: data.top + "%",
        left: data.left + "%",
        width: data.width + "%",
        height: data.height + "%",
      })
      .hide();

    data.element = $mediaElement;

    data.timeout = null;

    const that = this;

    data.checkForStall = function () {
      const self = this;

      if (this.active) {
        that._checkMediaSynchronization();
        if (this.element.get(0).readyState > 0 && !this.outOfSync) {
          that._playbackStalled(false, self);
        } else {
          that._playbackStalled(true, self);
          if (this.timeout) {
            window.clearTimeout(this.timeout);
          }
          this.timeout = window.setTimeout(function () {
            self.checkForStall();
          }, 1000);
        }
      } else {
        that._playbackStalled(false, self);
      }
    };

    this._contentAnnotations.push(data);

    if (this.$playerElement) {
      this._$canvasContainer.append($mediaElement);
    }

    $mediaElement.on("loadedmetadata", async () => {
      this._readyMediaCount++;

      if (this._readyMediaCount === this._contentAnnotations.length) {
        if (this._data.autoPlay) {
          await this.play(true);
        } else {
          this.pause(true);
        }

        this._updateDurationDisplay();

        this.fire(Events.MEDIA_READY);
      }
    });

    $mediaElement.attr("preload", "metadata");

    // @todo why?
    ($mediaElement.get(0) as any).load();

    this._renderSyncIndicator(data);
  }

  private waveFormInit = false;

  private updateWaveformPanel() {
    if (AVComponent.newRanges && this.isVirtual() && this._waveformPanel) {
      const sequence: string[] = [];
      for (const stop of this.timePlanPlayer.plan.stops) {
        sequence.push(
          `${stop.canvasId}#t=${stop.canvasTime.start},${stop.canvasTime.end}`
        );
      }
      this._waveformPanel.setAttribute("sequence", sequence.join("|"));
      this._waveformPanel.setAttribute(
        "duration",
        `${this.timePlanPlayer.plan.duration}`
      );
    }
  }

  updateWaveformTime(t: number) {
    if (this._waveformPanel) {
      this._waveformPanel.setAttribute("current-time", `${t}`);
    }
  }

  private createWaveformPanel(forceRender = false) {
    if (this.waveFormInit && !forceRender) {
      return;
    }

    if (!this.waveformSources.length) {
      return;
    }

    // stops this getting called more than once.
    this.waveFormInit = true;

    this._waveformPanel = document.createElement(
      "waveform-panel"
    ) as WaveformPanel;
    this._waveformPanel.classList.add("waveform-panel");
    this._waveformPanel.style.height = "100%";

    this._waveformPanel.addEventListener("click-waveform", (e: any) => {
      if (this.isVirtual()) {
        this._setCurrentTime(this.timePlanPlayer.plan.start + e.detail.time);
      } else {
        this._setCurrentTime(e.detail.time);
      }
    });

    this._waveformPanel.setAttribute(
      "srcset",
      this.waveformSources
        .map(
          (src) =>
            `${src.source} ${src.canvas}${src.itemData ? `#t=${src.itemData.start},${src.itemData.end}` : ""}`
        )
        .join("|")
    );
    this._waveformPanel.setAttribute("duration", `${this._getDuration()}`);
    this._waveformPanel.setAttribute(
      "sequence",
      this.waveformSources
        .map((src) => `${src.canvas}#t=${src.start},${src.end}`)
        .join("|")
    );

    const style = document.createElement("style");
    // language=css
    style.innerHTML = `
      waveform-panel {
          max-height: 260px;
          width: 100%;
          align-self: center;
      }
    `;
    this._$canvasContainer[0].style.display = "flex";
    this._$canvasContainer[0].style.width = "100%";
    this._$canvasContainer.append(this._waveformPanel, style);
  }

  private getRangeTiming(): {
    start: TimelineTime;
    end: TimelineTime;
    duration: TimelineTime;
    percent: number;
  } {
    if (AVComponent.newRanges && this.isVirtual()) {
      return {
        start: this.timePlanPlayer.plan.start,
        end: this.timePlanPlayer.plan.end,
        duration: this.timePlanPlayer.plan.duration,
        percent: Math.min(
          (this.timePlanPlayer.getTime() - this.timePlanPlayer.plan.start) /
            this.timePlanPlayer.plan.duration,
          1
        ),
      };
    }

    let durationObj: Duration | undefined;
    let start = 0 as TimelineTime;
    let end = 0 as TimelineTime;
    let duration = end;

    // This is very similar to
    if (this._data.range) {
      durationObj = this._data.range.getDuration();
    }

    if (!this.isVirtual()) {
      end = this._getDuration() as TimelineTime;
    }

    if (this._data.limitToRange && durationObj) {
      start = durationObj.start as TimelineTime;
      end = durationObj.end as TimelineTime;
      duration = minusTime(end, start);
    }

    if (end === -1 && durationObj) {
      start = durationObj.start as TimelineTime;
      end = durationObj.end as TimelineTime;
      duration = minusTime(end, start);
    }

    if (end === -1) {
      Logger.warn("Duration not found...", {
        start,
        end,
        duration,
        durationObj,
      });
    }

    return {
      start,
      end,
      duration: minusTime(end, start),
      percent: Math.min((this.getClockTime() - start) / duration, 1),
    };
  }

  public isLimitedToRange() {
    return this._data.limitToRange;
  }

  public hasCurrentRange() {
    return !!this._data.range;
  }

  private _updateCurrentTimeDisplay(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      const time = this._canvasClockTime - this.timePlanPlayer.getStartTime();
      this._$canvasTime.text(formatTime(time));
      this.updateWaveformTime(time);

      return;
    }

    let duration: Duration | undefined;

    if (this._data.range) {
      duration = this._data.range.getDuration();
    }

    if (this._data.limitToRange && duration) {
      const rangeClockTime: number = this._canvasClockTime - duration.start;
      this._$canvasTime.text(formatTime(rangeClockTime));
      this.updateWaveformTime(rangeClockTime);
    } else {
      this._$canvasTime.text(formatTime(this._canvasClockTime));
      this.updateWaveformTime(this._canvasClockTime);
    }
  }

  private _updateDurationDisplay(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      this._$canvasDuration.text(formatTime(this.timePlanPlayer.getDuration()));
      return;
    }

    let duration: Duration | undefined;

    if (this._data.range) {
      duration = this._data.range.getDuration();
    }

    if (this._data.limitToRange && duration) {
      this._$canvasDuration.text(formatTime(duration.getLength()));
    } else {
      this._$canvasDuration.text(formatTime(this._getDuration()));
    }
  }

  private _renderSyncIndicator(mediaElementData: any) {
    if (AVComponent.newRanges && this.isVirtual()) {
      Logger.log("_renderSyncIndicator");
      return;
    }

    const leftPercent: number = this._convertToPercentage(
      mediaElementData.start,
      this._getDuration()
    );
    const widthPercent: number = this._convertToPercentage(
      mediaElementData.end - mediaElementData.start,
      this._getDuration()
    );

    const $timelineItem: JQuery = $('<div class="timeline-item"></div>');

    $timelineItem.css({
      left: leftPercent + "%",
      width: widthPercent + "%",
    });

    const $lineWrapper: JQuery = $('<div class="line-wrapper"></div>');

    $timelineItem.appendTo($lineWrapper);

    mediaElementData.timelineElement = $timelineItem;

    if (this.$playerElement) {
      this._$timelineItemContainer.append($lineWrapper);
    }
  }

  public setCurrentTime(
    seconds: TimelineTime,
    external = false
  ): Promise<void> {
    Logger.log("External set current time", { seconds, external });
    return this._setCurrentTime(seconds, false, external);
  }

  public async setCurrentRangeTime(
    seconds: number,
    rangeId: string,
    external = false
  ): Promise<void> {
    Logger.log("External set current range time", {
      seconds,
      rangeId,
      external,
    });
    if (AVComponent.newRanges && this.isVirtual()) {
      await this.timePlanPlayer.setRangeTime(rangeId, seconds, external);
      this._buffering = false;
      this._canvasClockStartDate = toMs(
        minusTime(this.now(), this._canvasClockTime)
      );
      this._canvasClockUpdater();
      this._highPriorityUpdater();
      this._lowPriorityUpdater();
      this._synchronizeMedia();
      return;
    }
    return this._setCurrentTime(timelineTime(seconds), external);
  }

  now(): TimelineTime {
    return fromMs(Date.now() as TimelineTimeMs);
  }

  nowMs(): TimelineTimeMs {
    return Date.now() as TimelineTimeMs;
  }

  private async _setCurrentTime(
    seconds: TimelineTime,
    setRange = true,
    external = false
  ): Promise<void> {
    if (AVComponent.newRanges && this.isVirtual()) {
      this._buffering = true;

      if (external) {
        seconds = this.timePlanPlayer.validateExternalTime(seconds);
      }

      await this.timePlanPlayer.setTime(seconds, setRange);
      this._buffering = false;
      this._canvasClockStartDate = toMs(
        minusTime(this.now(), this._canvasClockTime)
      );
      this._canvasClockUpdater();
      this._highPriorityUpdater();
      this._lowPriorityUpdater();
      this._synchronizeMedia();

      return;
    }
    // seconds was originally a string or a number - didn't seem necessary
    // const secondsAsFloat: number = parseFloat(seconds.toString());

    // if (isNaN(secondsAsFloat)) {
    //     return;
    // }

    const { start, end } = this.getRangeTiming();
    if (seconds < start || start > end) {
      return;
    }
    this._canvasClockTime = seconds; //secondsAsFloat;
    this._canvasClockStartDate = toMs(
      minusTime(this.now(), this._canvasClockTime)
    );

    this.logMessage(
      "SET CURRENT TIME to: " + this._canvasClockTime + " seconds."
    );

    this._canvasClockUpdater();
    this._highPriorityUpdater();
    this._lowPriorityUpdater();
    this._synchronizeMedia();
  }

  private _rewind(withoutUpdate?: boolean): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      Logger.log("Rewind");
      return;
    }

    this.pause();

    let duration: Duration | undefined;

    if (this._data.range) {
      duration = this._data.range.getDuration();
    }

    if (this._data.limitToRange && duration) {
      this._setCurrentTime(duration.start as TimelineTime);
    } else {
      this._setCurrentTime(0 as TimelineTime);
    }

    if (!this._data.limitToRange) {
      if (this._data && this._data.helper) {
        this.set({
          range: undefined,
        });
      }
    }
  }

  private _fastforward(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      Logger.log("Fast forward");
      return;
    }

    let duration: Duration | undefined;

    if (this._data.range) {
      duration = this._data.range.getDuration();
    }

    if (this._data.limitToRange && duration) {
      this._canvasClockTime = timelineTime(duration.end);
    } else {
      this._canvasClockTime = this._getDuration();
    }

    this.pause();
  }

  // todo: can this be part of the _data state?
  // this._data.play = true?
  public async play(withoutUpdate?: boolean): Promise<void> {
    if (this._isPlaying) {
      return;
    }
    Logger.log(`CanvasInstance.play(${withoutUpdate})`);

    if (AVComponent.newRanges && this.isVirtual()) {
      if (this.timePlanPlayer.hasEnded()) {
        this._buffering = true;
        if (this._data.limitToRange) {
          await this._setCurrentTime(this.timePlanPlayer.plan.start, false);
        } else {
          await this.timePlanPlayer.previous();
        }
        this._buffering = false;
      }
      this.timePlanPlayer.play();
    } else {
      let duration: Duration | undefined;

      if (this._data.range) {
        duration = this._data.range.getDuration();
      }

      if (
        this._data.limitToRange &&
        duration &&
        this._canvasClockTime >= duration.end
      ) {
        this._canvasClockTime = duration.start as TimelineTime;
      }

      if (this._canvasClockTime === this._getDuration()) {
        this._canvasClockTime = 0 as TimelineTime;
      }
    }

    this._canvasClockStartDate = toMs(
      minusTime(this.now(), this._canvasClockTime)
    );

    if (this._highPriorityInterval) {
      clearInterval(this._highPriorityInterval);
    }
    this._highPriorityInterval = window.setInterval(() => {
      this._highPriorityUpdater();
    }, this._highPriorityFrequency);

    if (this._lowPriorityInterval) {
      clearInterval(this._lowPriorityInterval);
    }
    this._lowPriorityInterval = window.setInterval(() => {
      this._lowPriorityUpdater();
    }, this._lowPriorityFrequency);

    if (this._canvasClockInterval) {
      clearInterval(this._canvasClockInterval);
    }
    this._canvasClockInterval = window.setInterval(() => {
      this._canvasClockUpdater();
    }, this._canvasClockFrequency);

    this._isPlaying = true;

    if (!withoutUpdate) {
      this._synchronizeMedia();
    }

    const label: string =
      this._data && this._data.content ? this._data.content.pause : "";
    this._$playButton.prop("title", label);
    this._$playButton.find("i").switchClass("play", "pause");

    this.fire(CanvasInstanceEvents.PLAYCANVAS);
    this.logMessage("PLAY canvas");
  }

  // todo: can this be part of the _data state?
  // this._data.play = false?
  public pause(withoutUpdate?: boolean): void {
    Logger.log(`CanvasInstance.pause(${withoutUpdate})`);
    window.clearInterval(this._highPriorityInterval);
    window.clearInterval(this._lowPriorityInterval);
    window.clearInterval(this._canvasClockInterval);

    this._isPlaying = false;

    if (!withoutUpdate) {
      this._highPriorityUpdater();
      this._lowPriorityUpdater();
      this._synchronizeMedia();
    }

    if (AVComponent.newRanges && this.isVirtual()) {
      this.timePlanPlayer.pause();
    }

    const label: string =
      this._data && this._data.content ? this._data.content.play : "";
    this._$playButton.prop("title", label);
    this._$playButton.find("i").switchClass("pause", "play");

    this.fire(CanvasInstanceEvents.PAUSECANVAS);
    this.logMessage("PAUSE canvas");
  }

  private _isNavigationConstrainedToRange(): boolean {
    return this._data.constrainNavigationToRange || false;
  }

  private _canvasClockUpdater(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      if (this._buffering) {
        return;
      }

      const startDate = fromMs(this._canvasClockStartDate);

      Logger.log("CanvasInstance._canvasClockUpdater()", {
        startDate,
        advanceToTime: minusTime(this.now(), startDate),
      });

      const { paused } = this.timePlanPlayer.advanceToTime(
        minusTime(this.now(), startDate)
      );
      if (paused) {
        this.pause();
      }
      return;
    }

    if (this._buffering) {
      return;
    }
    const startDate = fromMs(this._canvasClockStartDate);
    this._canvasClockTime = minusTime(this.now(), startDate);

    let duration: Duration | undefined;

    if (this._data.range) {
      duration = this._data.range.getDuration();
    }

    if (
      this._data.limitToRange &&
      duration &&
      this._canvasClockTime >= duration.end
    ) {
      this.pause();
    }

    if (this._canvasClockTime > this._getDuration()) {
      this._canvasClockTime = this._getDuration();
      this.pause();
    }
  }

  private _highPriorityUpdater(): void {
    if (this._bufferShown && !this._buffering) {
      this.$playerElement.removeClass("player--loading");
      this._bufferShown = false;
    }
    if (this._buffering && !this._bufferShown) {
      this.$playerElement.addClass("player--loading");
      this._bufferShown = true;
    }

    if (AVComponent.newRanges && this.isVirtual()) {
      this._$rangeTimelineContainer.slider({
        value: this._canvasClockTime - this.timePlanPlayer.plan.start,
      });

      this._$canvasTimelineContainer.slider({
        value: this._canvasClockTime - this.timePlanPlayer.plan.start,
      });
    } else {
      this._$rangeTimelineContainer.slider({
        value: this._canvasClockTime,
      });

      this._$canvasTimelineContainer.slider({
        value: this._canvasClockTime,
      });
    }

    this._updateCurrentTimeDisplay();
    this._updateDurationDisplay();
    // this.createWaveformPanel();
  }

  private _lowPriorityUpdater(): void {
    this._updateMediaActiveStates();

    if (
      /*this._isPlaying && */ this._data.autoSelectRange &&
      (this.isVirtual() || this.isOnlyCanvasInstance)
    ) {
      this._hasRangeChanged();
    }
  }

  private _updateMediaActiveStates(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      if (this._isPlaying) {
        if (this.timePlanPlayer.isBuffering()) {
          this._buffering = true;
          return;
        } else if (this._buffering) {
          this._buffering = false;
        }
        this.timePlanPlayer.advanceToTime(this._canvasClockTime);
      }
      return;
    }

    let contentAnnotation;

    for (let i = 0; i < this._contentAnnotations.length; i++) {
      contentAnnotation = this._contentAnnotations[i];

      if (
        contentAnnotation.start <= this._canvasClockTime &&
        contentAnnotation.end >= this._canvasClockTime
      ) {
        this._checkMediaSynchronization();

        if (!contentAnnotation.active) {
          this._synchronizeMedia();
          contentAnnotation.active = true;
          contentAnnotation.element.show();
          contentAnnotation.timelineElement.addClass("active");
        }

        if (
          contentAnnotation.element[0].currentTime >
          contentAnnotation.element[0].duration - contentAnnotation.endOffset
        ) {
          this._pauseMedia(contentAnnotation.element[0]);
        }
      } else {
        if (contentAnnotation.active) {
          contentAnnotation.active = false;
          contentAnnotation.element.hide();
          contentAnnotation.timelineElement.removeClass("active");
          this._pauseMedia(contentAnnotation.element[0]);
        }
      }
    }
  }

  private _pauseMedia(media: HTMLMediaElement): void {
    media.pause();
  }

  private _setMediaCurrentTime(media: HTMLMediaElement, time: number): void {
    if (!isNaN(media.duration)) {
      media.currentTime = time;
    }
  }

  private _synchronizeMedia(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      return;
    }

    let contentAnnotation;

    for (let i = 0; i < this._contentAnnotations.length; i++) {
      contentAnnotation = this._contentAnnotations[i];

      this._setMediaCurrentTime(
        contentAnnotation.element[0],
        this._canvasClockTime -
          contentAnnotation.start +
          contentAnnotation.startOffset
      );

      if (
        contentAnnotation.start <= this._canvasClockTime &&
        contentAnnotation.end >= this._canvasClockTime
      ) {
        if (this._isPlaying) {
          if (contentAnnotation.element[0].paused) {
            const promise = contentAnnotation.element[0].play();
            if (promise) {
              promise.catch(function (err) {
                console.log(err);
                // no-op
              });
            }
          }
        } else {
          this._pauseMedia(contentAnnotation.element[0]);
        }
      } else {
        this._pauseMedia(contentAnnotation.element[0]);
      }

      if (
        contentAnnotation.element[0].currentTime >
        contentAnnotation.element[0].duration - contentAnnotation.endOffset
      ) {
        this._pauseMedia(contentAnnotation.element[0]);
      }
    }

    this.logMessage("SYNC MEDIA at: " + this._canvasClockTime + " seconds.");
  }

  private _checkMediaSynchronization(): void {
    if (AVComponent.newRanges && this.isVirtual()) {
      if (this._isPlaying) {
        if (this.timePlanPlayer.isBuffering()) {
          this._buffering = true;
        } else if (this._buffering) {
          this._buffering = false;
        }
      }

      return;
    }

    let contentAnnotation;

    for (let i = 0, l = this._contentAnnotations.length; i < l; i++) {
      contentAnnotation = this._contentAnnotations[i];

      if (
        contentAnnotation.start <= this._canvasClockTime &&
        contentAnnotation.end >= this._canvasClockTime
      ) {
        if (this._isPlaying) {
          if (contentAnnotation.element[0].readyState < 3) {
            this._buffering = true;
          } else if (this._buffering) {
            this._buffering = false;
          }
        }

        const correctTime: number =
          this._canvasClockTime -
          contentAnnotation.start +
          contentAnnotation.startOffset;
        const factualTime: number = contentAnnotation.element[0].currentTime;

        // off by 0.2 seconds
        if (Math.abs(factualTime - correctTime) > this._mediaSyncMarginSecs) {
          contentAnnotation.outOfSync = true;
          //this.playbackStalled(true, contentAnnotation);

          const lag: number = Math.abs(factualTime - correctTime);
          this.logMessage("DETECTED synchronization lag: " + Math.abs(lag));
          this._setMediaCurrentTime(contentAnnotation.element[0], correctTime);
          //this.synchronizeMedia();
        } else {
          contentAnnotation.outOfSync = false;
          //this.playbackStalled(false, contentAnnotation);
        }
      }
    }
  }

  private _playbackStalled(
    aBoolean: boolean,
    syncMediaRequestingStall: any
  ): void {
    if (aBoolean) {
      if (this._stallRequestedBy.indexOf(syncMediaRequestingStall) < 0) {
        this._stallRequestedBy.push(syncMediaRequestingStall);
      }

      if (!this._isStalled) {
        if (this.$playerElement) {
          //this._showWorkingIndicator(this._$canvasContainer);
        }

        this._wasPlaying = this._isPlaying;
        this.pause(true);
        this._isStalled = aBoolean;
      }
    } else {
      const idx: number = this._stallRequestedBy.indexOf(
        syncMediaRequestingStall
      );

      if (idx >= 0) {
        this._stallRequestedBy.splice(idx, 1);
      }

      if (this._stallRequestedBy.length === 0) {
        //this._hideWorkingIndicator();

        if (this._isStalled && this._wasPlaying) {
          this.play(true);
        }

        this._isStalled = aBoolean;
      }
    }
  }

  resizeTimeout = -1;
  public resize(): void {
    if (this.resizeTimeout !== -1) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = -1;
    }
    this.resizeTimeout = setTimeout(this._resize.bind(this), 25) as any;
  }

  public _resize(): void {
    this.resizeTimeout = -1;
    if (this.$playerElement) {
      const containerWidth: number | undefined = this._$canvasContainer.width();

      if (containerWidth) {
        this._$canvasTimelineContainer.width(containerWidth);

        //const resizeFactorY: number = containerWidth / this.canvasWidth;
        //$canvasContainer.height(this.canvasHeight * resizeFactorY);

        const $options: JQuery = this.$playerElement.find(".options-container");

        // if in the watch metric, make sure the canvasContainer isn't more than half the height to allow
        // room between buttons
        if (
          this._data.halveAtWidth !== undefined &&
          this.$playerElement.parent().width() < this._data.halveAtWidth
        ) {
          this._$canvasContainer.height(
            this.$playerElement.parent().height() / 2
          );
        } else {
          this._$canvasContainer.height(
            this.$playerElement.parent().height() - $options.height()
          );
        }
      }

      this._render();
      this.createWaveformPanel();

      if (this._waveformPanel) {
        const { width, height } = this._waveformPanel.getBoundingClientRect();
        if (width > 1 && height > 1) {
          try {
            this._waveformPanel.resize();
          } catch (e) {
            // ignore.
          }
        }
      }
    }
  }
}
