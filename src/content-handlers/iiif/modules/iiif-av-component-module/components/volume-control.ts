/* eslint-disable @typescript-eslint/no-unused-vars */
const $ = require("jquery");
import { IAVVolumeControlState } from "../interfaces/volume-control-state";
import { BaseComponent, IBaseComponentOptions } from "@iiif/base-component";
import { VolumeEvents } from "../events/volume-events";
import { Logger } from "../helpers/logger";

export class AVVolumeControl extends BaseComponent {
  private _$volumeSlider: JQuery;
  private _$volumeMute: JQuery;

  private _lastVolume = 1;
  private _$element: JQuery;

  private _data: IAVVolumeControlState = {
    volume: 1,
  };

  constructor(options: IBaseComponentOptions) {
    super(options);

    this._init();
    this._resize();
  }

  protected _init(): boolean {
    const success: boolean = super._init();
    this._$element = $(this.el);

    if (!success) {
      Logger.error("Component failed to initialise");
    }

    this._$volumeMute = $(`
      <button class="btn volume-mute" title="${this.options.data.content.mute}">
          <i class="av-icon av-icon-mute on" aria-hidden="true"></i>
          <span class="sr-only>${this.options.data.content.mute}</span>
      </button>
    `);

    this._$volumeSlider = $('<div class="volume-slider"></div>');

    this._$element.append(this._$volumeMute, this._$volumeSlider);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    this._$volumeMute.on("touchstart click", (e) => {
      e.preventDefault();

      // start reducer
      if (this._data.volume !== 0) {
        // mute
        this._lastVolume = this._data.volume as number;
        this._data.volume = 0;
      } else {
        // unmute
        this._data.volume = this._lastVolume;
      }
      // end reducer

      this.fire(VolumeEvents.VOLUME_CHANGED, this._data.volume);
    });

    this._$volumeSlider.slider({
      value: that._data.volume,
      step: 0.1,
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 1,
      animate: false,
      create: function () {
        // no-op
      },
      slide: function (evt: any, ui: any) {
        // start reducer
        that._data.volume = ui.value;

        if (that._data.volume === 0) {
          that._lastVolume = 0;
        }
        // end reducer

        that.fire(VolumeEvents.VOLUME_CHANGED, that._data.volume);
      },
      stop: function (evt: any, ui: any) {
        // No-op
      },
    });

    return success;
  }

  public set(data: IAVVolumeControlState): void {
    this._data = Object.assign(this._data, data);

    this._render();
  }

  private _render(): void {
    if (this._data.volume !== undefined) {
      this._$volumeSlider.slider({
        value: this._data.volume,
      });

      if (this._data.volume === 0) {
        const label: string = this.options.data.content.unmute;
        this._$volumeMute.prop("title", label);
        this._$volumeMute.find("i").switchClass("on", "off");
      } else {
        const label: string = this.options.data.content.mute;
        this._$volumeMute.prop("title", label);
        this._$volumeMute.find("i").switchClass("off", "on");
      }
    }
  }

  protected _resize(): void {
    // no-op
  }
}
