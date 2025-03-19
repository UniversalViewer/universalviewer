const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "./BaseView";
import {
  ExternalResourceType,
  ViewingDirection,
} from "@iiif/vocabulary/dist-commonjs/";
import { Annotation, AnnotationBody, Canvas, Thumb } from "manifesto.js";
import * as KeyCodes from "@edsilv/key-codes";
import { Dates, Keyboard, Maths, Strings } from "@edsilv/utils";
import { ExtendedLeftPanel } from "../../extensions/config/ExtendedLeftPanel";

export class ThumbsView<T extends ExtendedLeftPanel> extends BaseView<T> {
  private _$thumbsCache: JQuery | null;
  $selectedThumb: JQuery;
  $thumbs: JQuery;
  isCreated: boolean = false;
  isOpen: boolean = false;
  lastThumbClickedIndex: number;

  public thumbs: Thumb[];

  constructor($element: JQuery) {
    super($element, true, true);
  }

  create(): void {
    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (index: any) => {
        this.selectIndex(parseInt(index));
      }
    );

    this.extensionHost.subscribe(IIIFEvents.LOGIN, () => {
      this.loadThumbs();
    });

    this.extensionHost.subscribe(IIIFEvents.CLICKTHROUGH, () => {
      this.loadThumbs();
    });

    this.$thumbs = $('<div class="thumbs"></div>');
    this.$element.append(this.$thumbs);

    const viewingDirection: ViewingDirection =
      this.extension.helper.getViewingDirection() ||
      ViewingDirection.LEFT_TO_RIGHT;

    this.$thumbs.addClass(viewingDirection); // defaults to "left-to-right"

    const that = this;

    $.templates({
      thumbsTemplate:
        '<a id="thumb{{>index}}" class="{{:~className()}}" data-src="{{>uri}}" data-visible="{{>visible}}" data-index="{{>index}}" tabindex="0">\
          <div class="wrap" style="height:{{>height + ~extraHeight()}}px"></div>\
          <div class="info">\
            <span class="index">{{:#index + 1}}</span>\
            <span class="label" title="{{>label}}" style="white-space: normal;">{{>label}}&nbsp;</span>\
            <span class="searchResults" title="{{:~searchResultsTitle()}}">{{>data.searchResults}}</span>\
          </div>\
        </a>\
        {{if ~separator()}} \
          <div class="separator"></div> \
        {{/if}}',
    });

    const extraHeight: number = this.options.thumbsExtraHeight;

    $.views.helpers({
      separator: function () {
        return false;
      },
      extraHeight: function () {
        return extraHeight;
      },
      className: function () {
        let className: string = "thumb";

        if (this.data.index === 0) {
          className += " first";
        }

        if (!this.data.uri) {
          className += " placeholder";
        }

        const viewingDirection: ViewingDirection | null =
          that.extension.helper.getViewingDirection();

        if (
          viewingDirection &&
          (viewingDirection === ViewingDirection.LEFT_TO_RIGHT ||
            viewingDirection === ViewingDirection.RIGHT_TO_LEFT)
        ) {
          className += " twoCol";
        } else if (that.extension.helper.isPaged()) {
          className += " twoCol";
        } else {
          className += " oneCol";
        }

        return className;
      },
      searchResultsTitle: function () {
        const searchResults: number = Number(this.data.data.searchResults);

        if (searchResults) {
          if (searchResults > 1) {
            return Strings.format(
              that.content.searchResults,
              searchResults.toString()
            );
          }

          return Strings.format(
            that.content.searchResult,
            searchResults.toString()
          );
        }

        return "";
      },
    });

    // use unevent to detect scroll stop.
    this.$element.on(
      // @ts-ignore
      "scroll",
      () => {
        this.scrollStop();
      },
      100
    );

    this.resize();
  }

  public databind(): void {
    if (!this.thumbs) return;
    this._$thumbsCache = null; // delete cache
    this.createThumbs();
    // do initial load to show padlocks
    this.loadThumbs(0);
    this.selectIndex(this.extension.helper.canvasIndex);
  }

  createThumbs(): void {
    const that = this;

    if (!this.thumbs) return;

    // get median height
    let heights: number[] = [];

    for (let i = 0; i < this.thumbs.length; i++) {
      const thumb: Thumb = this.thumbs[i];
      heights.push(thumb.height);
    }

    const medianHeight: number = Maths.median(heights);

    for (let i = 0; i < this.thumbs.length; i++) {
      const thumb: Thumb = this.thumbs[i];
      thumb.height = medianHeight;
    }

    this.$thumbs.link($.templates.thumbsTemplate, this.thumbs);

    this.$thumbs.undelegate(".thumb", "click");

    this.$thumbs.delegate(".thumb", "click", function (e) {
      e.preventDefault();
      const data = $.view(this).data;
      that.lastThumbClickedIndex = data.index;
      that.extensionHost.publish(IIIFEvents.THUMB_SELECTED, data);
      return false;
    });

    // Support keyboard navigation (spacebar / enter)
    this.$thumbs.delegate(".thumb", "keydown", function (e: JQueryEventObject) {
      const originalEvent: KeyboardEvent = <KeyboardEvent>e.originalEvent;
      const charCode: number = Keyboard.getCharCode(originalEvent);
      if (
        charCode === KeyCodes.KeyDown.Spacebar ||
        charCode === KeyCodes.KeyDown.Enter
      ) {
        e.preventDefault();
        const data = $.view(this).data;
        that.lastThumbClickedIndex = data.index;
        that.extensionHost.publish(IIIFEvents.THUMB_SELECTED, data);
      }
    });

    this.setLabel();
    this.isCreated = true;
  }

  scrollStop(): void {
    let scrollPos: number =
      1 /
      ((this.$thumbs.height() - this.$element.height()) /
        this.$element.scrollTop());
    if (scrollPos > 1) scrollPos = 1;
    const thumbRangeMid: number = Math.floor(
      (this.thumbs.length - 1) * scrollPos
    );
    this.loadThumbs(thumbRangeMid);
  }

  loadThumbs(index: number = this.extension.helper.canvasIndex): void {
    if (!this.thumbs || !this.thumbs.length) return;

    let thumbType: string | undefined;

    // get the type of the canvas content
    const canvas: Canvas = this.extension.helper.getCanvasByIndex(index);
    const annotations: Annotation[] = canvas.getContent();

    if (annotations.length) {
      const annotation: Annotation = annotations[0];
      const body: AnnotationBody[] = annotation.getBody();

      if (body.length) {
        const type: ExternalResourceType | null = body[0].getType();

        if (type) {
          thumbType = type.toString().toLowerCase();
        }
      }
    }

    const thumbRangeMid: number = index;
    const thumbLoadRange: number = this.options.thumbsLoadRange;

    const thumbRange: any = {
      start:
        thumbRangeMid > thumbLoadRange ? thumbRangeMid - thumbLoadRange : 0,
      end:
        thumbRangeMid < this.thumbs.length - 1 - thumbLoadRange
          ? thumbRangeMid + thumbLoadRange
          : this.thumbs.length - 1,
    };

    const fadeDuration: number = this.options.thumbsImageFadeInDuration;
    const that = this;

    for (let i = thumbRange.start; i <= thumbRange.end; i++) {
      const $thumb: JQuery = this.getThumbByIndex(i);
      const $wrap: JQuery = $thumb.find(".wrap");

      // if no img has been added yet
      if (!$wrap.hasClass("loading") && !$wrap.hasClass("loaded")) {
        const visible: string = $thumb.attr("data-visible");

        if (visible !== "false") {
          $wrap.removeClass("loadingFailed");
          $wrap.addClass("loading");

          if (thumbType) {
            $wrap.addClass(thumbType);
          }

          let src: string = $thumb.attr("data-src");
          if (
            that.config.options.thumbsCacheInvalidation &&
            that.config.options.thumbsCacheInvalidation.enabled
          ) {
            src += `${
              that.config.options.thumbsCacheInvalidation.paramType
            }t=${Dates.getTimeStamp()}`;
          }
          const $img: JQuery = $('<img src="' + src + '" alt=""/>');
          // fade in on load.
          $img.hide();

          $img.on("load", function () {
            $(this).fadeIn(fadeDuration, function () {
              $(this).parent().switchClass("loading", "loaded");
            });
          });

          $img.on("error", function () {
            $(this).parent().switchClass("loading", "loadingFailed");
          });

          $wrap.append($img);
        } else {
          $wrap.hide();
        }
      }
    }
  }

  show(): void {
    this.isOpen = true;
    this.$element.show();

    setTimeout(() => {
      this.selectIndex(this.extension.helper.canvasIndex);
    }, 1);
  }

  hide(): void {
    this.isOpen = false;
    this.$element.hide();
  }

  isPDF(): boolean {
    const canvas: Canvas = this.extension.helper.getCurrentCanvas();
    const type: ExternalResourceType | null = canvas.getType();

    if (type) {
      return type.toString().includes("pdf");
    }

    return false;
  }

  setLabel(): void {
    $(this.$thumbs).find("span.index").hide();
    $(this.$thumbs).find("span.label").show();
  }

  addSelectedClassToThumbs(index: number): void {
    this.getThumbByIndex(index).addClass("selected");
  }

  selectIndex(index: number): void {
    // may be authenticating
    if (index === -1) return;
    if (!this.thumbs || !this.thumbs.length) return;
    this.getAllThumbs().removeClass("selected");
    this.$selectedThumb = this.getThumbByIndex(index);
    this.addSelectedClassToThumbs(index);
    const indices: number[] = this.extension.getPagedIndices(index);

    // scroll to thumb if the index change didn't originate
    // within the thumbs view.
    if (!~indices.indexOf(this.lastThumbClickedIndex)) {
      this.$element.scrollTop(this.$selectedThumb.position().top);
    }

    // make sure visible images are loaded.
    this.loadThumbs(index);
  }

  getAllThumbs(): JQuery {
    if (!this._$thumbsCache) {
      this._$thumbsCache = this.$thumbs.find(".thumb");
    }
    return this._$thumbsCache;
  }

  getThumbByIndex(canvasIndex: number): JQuery {
    return this.$thumbs.find('[data-index="' + canvasIndex + '"]');
  }

  scrollToThumb(canvasIndex: number): void {
    const $thumb: JQuery = this.getThumbByIndex(canvasIndex);
    this.$element.scrollTop($thumb.position().top);
  }

  resize(): void {
    super.resize();
  }
}
