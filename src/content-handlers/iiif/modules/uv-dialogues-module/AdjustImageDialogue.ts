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
    $resetButton: JQuery;
    contrastPercent: number = 100;
    brightnessPercent: number = 100;
    saturationPercent: number = 100;
    shell: Shell;

    constructor($element: JQuery, shell: Shell) {
        super($element);
        this.shell = shell;
    }

    create(): void {
        this.setConfig("adjustImageDialogue");

        super.create();

        this.openCommand = IIIFEvents.SHOW_ADJUSTIMAGE_DIALOGUE;
        this.closeCommand = IIIFEvents.HIDE_ADJUSTIMAGE_DIALOGUE;

        this.extensionHost.subscribe(this.openCommand, () => {
            this.open();
        });

        this.extensionHost.subscribe(this.closeCommand, () => {
            this.close();
        });

        this.$title = $(`<div role="heading" class="heading"></div>`);
        this.$content.append(this.$title);

        this.$contrastLabel = $('<label for="contrastInput">' + this.content.contrast + '</label>');
        this.$contrastInput = $('<input id="#contrastInput" type="range" min="1" max="200" step="1"></input>');
        this.$content.append(this.$contrastLabel);
        this.$content.append(this.$contrastInput);

        this.$brightnessLabel = $('<label for="brightnessInput">' + this.content.brightness + '</label>');
        this.$brightnessInput = $('<input id="#brightnessInput" type="range" min="1" max="200" step="1"></input>');
        this.$content.append(this.$brightnessLabel);
        this.$content.append(this.$brightnessInput);

        this.$saturationLabel = $('<label for="saturationInput">' + this.content.saturation + '</label>');
        this.$saturationInput = $('<input id="#saturationInput" type="range" min="1" max="200" step="1"></input>');
        this.$content.append(this.$saturationLabel);
        this.$content.append(this.$saturationInput);
        this.$title.text(this.content.title);

        this.$contrastInput.on('input', (e) => {
            this.contrastPercent = $(e.target).val();
            this.filter();
        });

        this.$brightnessInput.on('input', (e) => {
            this.brightnessPercent = $(e.target).val();
            this.filter();
        });

        this.$saturationInput.on('input', (e) => {
            this.saturationPercent = $(e.target).val();
            this.filter();
        });

        this.$resetButton = this.$buttons.find('.close').clone();
        this.$resetButton.prop('title', this.content.reset);
        this.$resetButton.text(this.content.reset);
        this.$resetButton.onPressed(() => {
            this.$contrastInput.val('100');
            this.$brightnessInput.val('100');
            this.$saturationInput.val('100');
            this.$contrastInput.trigger('input');
            this.$brightnessInput.trigger('input');
            this.$saturationInput.trigger('input');
        });
        this.$resetButton.insertBefore(this.$buttons.find('.close'));

        this.$element.hide();
    }

    filter(): void {
        let canvas = (<OpenSeadragonExtension>(this.extension)).centerPanel.$viewer.find('.openseadragon-canvas canvas')[0];
        canvas.style.filter = `contrast(${this.contrastPercent}%) brightness(${this.brightnessPercent}%) saturate(${this.saturationPercent}%)`;
    }

    open(): void {
        this.shell.$overlays.css('background', 'none');
        super.open();
    }

    close(): void {
        this.shell.$overlays.css('background', '');
        super.close();
    }

    resize(): void {
        super.resize();
    }
}
