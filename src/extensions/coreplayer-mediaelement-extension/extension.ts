/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../../modules/coreplayer-shared-module/baseExtension");
import utils = require("../../utils");
import baseProvider = require("../../modules/coreplayer-shared-module/baseProvider");
import provider = require("./provider");
import shell = require("../../modules/coreplayer-shared-module/shell");
import header = require("../../modules/coreplayer-shared-module/headerPanel");
import center = require("../../modules/coreplayer-mediaelementcenterpanel-module/mediaelementCenterPanel");
import right = require("../../modules/coreplayer-moreinforightpanel-module/moreInfoRightPanel");
import footer = require("../../modules/coreplayer-shared-module/footerPanel");
import help = require("../../modules/coreplayer-dialogues-module/helpDialogue");
import embed = require("./embedDialogue");
import IProvider = require("../../modules/coreplayer-shared-module/iProvider");

export class Extension extends baseExtension.BaseExtension{

    headerPanel: header.HeaderPanel;
    centerPanel: center.MediaElementCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.FooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    constructor(provider: IProvider) {
        super(provider);
    }

    create(): void {
        super.create();

        // listen for mediaelement enter/exit fullscreen events.
        $(window).bind('enterfullscreen', () => {
            $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
        });

        $(window).bind('exitfullscreen', () => {
            $.publish(baseExtension.BaseExtension.TOGGLE_FULLSCREEN);
        });

        $.subscribe(footer.FooterPanel.EMBED, (e) => {
            $.publish(embed.EmbedDialogue.SHOW_EMBED_DIALOGUE);
        });

        this.createModules();        

        this.setParams();

        // initial sizing
        $.publish(baseExtension.BaseExtension.RESIZE);

        this.viewMedia();      
    }

    createModules(): void{
        this.headerPanel = new header.HeaderPanel(shell.Shell.$headerPanel);

        this.centerPanel = new center.MediaElementCenterPanel(shell.Shell.$centerPanel);
        this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
        this.footerPanel = new footer.FooterPanel(shell.Shell.$footerPanel);

        this.$helpDialogue = utils.Utils.createDiv('overlay help');
        shell.Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

        this.$embedDialogue = utils.Utils.createDiv('overlay embed');
        shell.Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);
    }

    setParams(): void{
        if (!this.provider.isHomeDomain) return;  

        // set assetSequenceIndex hash param.
        this.setParam(baseProvider.params.assetSequenceIndex, this.provider.assetSequenceIndex);
    }

    viewMedia(): void {
        var asset = this.getAssetByIndex(0);

        this.viewAsset(0, () => {

            $.publish(Extension.OPEN_MEDIA, [asset.fileUri]);

            this.setParam(baseProvider.params.assetIndex, 0);
        });
    }
}
