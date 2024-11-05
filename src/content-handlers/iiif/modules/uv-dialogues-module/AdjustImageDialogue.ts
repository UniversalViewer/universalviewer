const $ = require("jquery");
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Dialogue } from "../uv-shared-module/Dialogue";
import { Shell } from "../uv-shared-module/Shell";

export class AdjustImageDialogue extends Dialogue<
  BaseConfig["modules"]["adjustImageDialogue"]
> {
  $message: JQuery;
  $scroll: JQuery;
  $title: JQuery;
  $brightnessLabel: JQuery;
  $brightnessInput: JQuery;
  $contrastLabel: JQuery;
  $contrastInput: JQuery;
  $saturationLabel: JQuery;
  $saturationInput: JQuery;
  $rememberContainer: JQuery;
  $rememberCheckbox: JQuery;
  $rememberLabel: JQuery;
  $resetButton: JQuery;
  contrastPercent: number = 100;
  brightnessPercent: number = 100;
  saturationPercent: number = 100;
  rememberSettings: boolean = false;
  shell: Shell;

  constructor($element: JQuery, shell: Shell) {
    super($element);
    this.shell = shell;
  }

  create(): void {
    this.setConfig("adjustImageDialogue");

    super.create();

    this.extensionHost.subscribe(IIIFEvents.SHOW_ADJUSTIMAGE_DIALOGUE, () => {
      this.open();
    });

    this.$title = $(`<div role="heading" class="heading"></div>`);
    this.$content.append(this.$title);

    this.$contrastLabel = $(
      '<label for="contrastInput">' + this.content.contrast + "</label>"
    );
    this.$contrastInput = $(
      '<input id="contrastInput" type="range" min="1" max="200" step="1"></input>'
    );
    this.$content.append(this.$contrastLabel);
    this.$content.append(this.$contrastInput);

    this.$brightnessLabel = $(
      '<label for="brightnessInput">' + this.content.brightness + "</label>"
    );
    this.$brightnessInput = $(
      '<input id="brightnessInput" type="range" min="1" max="200" step="1"></input>'
    );
    this.$content.append(this.$brightnessLabel);
    this.$content.append(this.$brightnessInput);

    this.$saturationLabel = $(
      '<label for="saturationInput">' + this.content.saturation + "</label>"
    );
    this.$saturationInput = $(
      '<input id="saturationInput" type="range" min="1" max="200" step="1"></input>'
    );
    this.$content.append(this.$saturationLabel);
    this.$content.append(this.$saturationInput);
    this.$title.text(this.content.title);

    if (this.extension.data.config?.options.saveUserSettings) {
      this.$rememberContainer = $('<div class="rememberContainer"></div>');
      this.$rememberCheckbox = $(
        '<input type="checkbox" id="rememberSettings" />'
      );
      this.$rememberLabel = $(
        '<label for="rememberSettings">' + this.content.remember + "</label>"
      );
      this.$rememberContainer.append(this.$rememberCheckbox);
      this.$rememberContainer.append(this.$rememberLabel);
      this.$content.append(this.$rememberContainer);

      this.$rememberCheckbox.on("input", (e) => {
        this.rememberSettings = this.$rememberCheckbox.prop("checked");
      });
    }

    this.$contrastInput.on("input", (e) => {
      this.contrastPercent = Number($(e.target).val());
      this.filter();
    });

    this.$brightnessInput.on("input", (e) => {
      this.brightnessPercent = Number($(e.target).val());
      this.filter();
    });

    this.$saturationInput.on("input", (e) => {
      this.saturationPercent = Number($(e.target).val());
      this.filter();
    });

    this.$resetButton = this.$buttons.find(".close").clone();
    this.$resetButton.prop("title", this.content.reset);
    this.$resetButton.text(this.content.reset);
    this.$resetButton.onPressed(() => {
      this.contrastPercent = 100;
      this.brightnessPercent = 100;
      this.saturationPercent = 100;
      this.$contrastInput.val(this.contrastPercent);
      this.$brightnessInput.val(this.brightnessPercent);
      this.$saturationInput.val(this.saturationPercent);
      let canvas = <HTMLCanvasElement>(
        (<OpenSeadragonExtension>this.extension).centerPanel.$canvas[0]
          .children[0]
      );
      canvas.style.filter = "none";
    });
    this.$resetButton.insertBefore(this.$buttons.find(".close"));

    this.$element.hide();
  }

  filter(): void {
    let canvas = <HTMLCanvasElement>(
      (<OpenSeadragonExtension>this.extension).centerPanel.$canvas[0]
        .children[0]
    );
    canvas.style.filter = `contrast(${this.contrastPercent}%) brightness(${this.brightnessPercent}%) saturate(${this.saturationPercent}%)`;
  }

  open(): void {
    // Check if we have saved setings
    let settings = this.extension.getSettings();
    if (settings.rememberSettings) {
      this.contrastPercent = Number(settings.contrastPercent);
      this.brightnessPercent = Number(settings.brightnessPercent);
      this.saturationPercent = Number(settings.saturationPercent);

      this.$contrastInput.val(this.contrastPercent);
      this.$brightnessInput.val(this.brightnessPercent);
      this.$saturationInput.val(this.saturationPercent);

      if (this.extension.data.config?.options.saveUserSettings) {
        this.$rememberCheckbox.prop("checked", settings.rememberSettings);
        this.rememberSettings = settings.rememberSettings;
      }
    }
    this.shell.$overlays.css("background", "none");
    super.open();
  }

  close(): void {
    // Check if we should save settings
    if (this.rememberSettings) {
      this.extension.updateSettings({
        rememberSettings: this.rememberSettings,
      });
      this.extension.updateSettings({ contrastPercent: this.contrastPercent });
      this.extension.updateSettings({
        brightnessPercent: this.brightnessPercent,
      });
      this.extension.updateSettings({
        saturationPercent: this.saturationPercent,
      });
    } else {
      this.extension.updateSettings({ rememberSettings: false });
      this.extension.updateSettings({ contrastPercent: 100 });
      this.extension.updateSettings({ brightnessPercent: 100 });
      this.extension.updateSettings({ saturationPercent: 100 });
    }
    this.shell.$overlays.css("background", "");
    super.close();

    // put focus back on the button when the dialogue is closed
    (<OpenSeadragonExtension>(
      this.extension
    )).centerPanel.$adjustImageButton.focus();
  }

  resize(): void {
    super.resize();
  }
}
