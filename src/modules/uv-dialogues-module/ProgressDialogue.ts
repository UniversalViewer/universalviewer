import { Dialogue } from "../uv-shared-module/Dialogue";

export class ProgressDialogue extends Dialogue {

    $label: JQuery;
    $percentLabel: JQuery;
    $progressBar: JQuery;
    value: number = 0;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('progressDialogue');
        super.create();

        //setting default options
        this.options = $.extend(true, this.options, {
            label: "Please wait...",
            maxValue: 100,
            showPercentage: false
        });

        this.disableClose();
        this.$buttons.remove();
        
        this.$label = $(`<label>${ this.options.label }</label>`);
        this.$content.append(this.$label);

        this.$percentLabel = $('<span class="progress-percent"></span>');
        this.$content.append(this.$percentLabel);

        this.$progressBar = $(`<progress class="progress-bar" max="${this.options.maxValue}" value="0"></progress>`);
        this.$content.append(this.$progressBar);

        this.$percentLabel.hide();
        this.$element.hide();
    }

    setOptions(options:any): void{
        this.options = $.extend(true, this.options, options);

        //reset value
        this.value = 0;

        //reset content
        this.$label.html(this.options.label);
        this.$progressBar.attr('max', this.options.maxValue);
        this.$progressBar.attr('value', this.value);

        if (this.options.showPercentage) {
            this.$percentLabel.show();
        }
    }

    setValue(value:number): void {
        this.value = value;
        this.$progressBar.val(this.value);

        if (this.options.showPercentage) {
            this.$percentLabel.text(Math.floor(this.value / this.options.maxValue * 100) + '%');
        }
    }

    open(): void {
        super.open();
    }

    resize(): void {
        super.resize();
    }
}
