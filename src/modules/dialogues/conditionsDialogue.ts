import baseApp = require("../shared/baseApp");
import app = require("../../extensions/seadragon/app");
import shell = require("../shared/shell");
import utils = require("../../utils");
import dialogue = require("../shared/dialogue");

export class ConditionsDialogue extends dialogue.Dialogue {

    $title: JQuery;
    $scroll: JQuery;
    $message: JQuery;

    static SHOW_CONDITIONS_DIALOGUE: string = 'onShowConditionsDialogue';
    static HIDE_CONDITIONS_DIALOGUE: string = 'onHideConditionsDialogue';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        
        this.setConfig('conditionsDialogue');
        
        super.create();

        $.subscribe(ConditionsDialogue.SHOW_CONDITIONS_DIALOGUE, (e, params) => {
            this.open();
        });

        $.subscribe(ConditionsDialogue.HIDE_CONDITIONS_DIALOGUE, (e) => {
            this.close();
        });

        this.$title = $('<h1>' + this.content.title + '</h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$message = $('<p></p>');
        this.$scroll.append(this.$message);

        // initialise ui.
        this.$title.text(this.content.title);
        
        var licenseCode = this.provider.getRootSection().extensions.mods.dzLicenseCode;
        if (licenseCode == null) licenseCode = "";

        var licenseText;

        switch (licenseCode.toLowerCase()) {
            case "a":
                licenseText = this.content.A;
                break;
            case "b":
                licenseText = this.content.B;
                break;
            case "c":
                licenseText = this.content.C;
                break;
            case "d":
                licenseText = this.content.D;
                break;
            case "e":
                licenseText = this.content.E;
                break;
            case "f":
                licenseText = this.content.F;
                break;
            case "g":
                licenseText = this.content.G;
                break;
            case "j":
                licenseText = this.content.J;
                break;
            case "k":
                licenseText = this.content.K;
                break;
            case "l":
                licenseText = this.content.L;
                break;
            case "m":
                licenseText = this.content.M;
                break;
            case "n":
                licenseText = this.content.N;
                break;
            case "o":
                licenseText = this.content.O;
                break;
            case "p":
                licenseText = this.content.P;
                break;
            case "q":
                licenseText = this.content.Q;
                break;
            default:
                licenseText = this.content.A;
                break;
        }

        this.$message.html(licenseText);

        // ensure anchor tags link to _blank.
        this.$message.find('a').prop('target', '_blank');

        // ensure anchor tags link to _blank.
        this.$message.find('a').prop('target', '_blank');

        this.$element.hide();
    }

    resize(): void {
        super.resize();

    }
}