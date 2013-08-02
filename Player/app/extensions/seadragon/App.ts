/// <reference path="../../../js/jquery.d.ts" />
/// <reference path="../../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import bp = module("app/BaseProvider");
import p = module("app/extensions/seadragon/Provider");
import shell = module("app/shared/Shell");
import header = module("app/modules/PagingHeaderPanel/PagingHeaderPanel");
import left = module("app/modules/TreeViewLeftPanel/TreeViewLeftPanel");
import thumbsView = module("app/modules/TreeViewLeftPanel/ThumbsView");
import treeView = module("app/modules/TreeViewLeftPanel/TreeView");
import center = module("app/modules/SeadragonCenterPanel/SeadragonCenterPanel");
import right = module("app/modules/MoreInfoRightPanel/MoreInfoRightPanel");
import footer = module("app/modules/ExtendedFooterPanel/ExtendedFooterPanel");
import help = module("app/modules/Dialogues/HelpDialogue");
import embed = module("app/extensions/seadragon/EmbedDialogue");

export class App extends baseApp.BaseApp {

    headerPanel: header.PagingHeaderPanel;
    leftPanel: left.TreeViewLeftPanel;
    centerPanel: center.SeadragonCenterPanel;
    rightPanel: right.MoreInfoRightPanel;
    footerPanel: footer.ExtendedFooterPanel;
    $helpDialogue: JQuery;
    helpDialogue: help.HelpDialogue;
    $embedDialogue: JQuery;
    embedDialogue: embed.EmbedDialogue;

    static mode: string;

    // events
    static MODE_CHANGED: string = 'onModeChanged';
    static OPEN_DZI: string = 'openDzi';

    // modes
    static PAGE_MODE = "pageMode";
    static IMAGE_MODE = "imageMode";

    constructor(provider: p.Provider) {
        super(provider, 'seadragon');
    }

    create(): void {
        super.create();

        // load css.
        utils.Utils.loadCss('app/modules/Dialogues/css/styles.css');

        // events.
        $.subscribe(header.PagingHeaderPanel.FIRST, (e) => {
            this.viewPage(0);
        });

        $.subscribe(header.PagingHeaderPanel.LAST, (e) => {
            this.viewPage(this.provider.assetSequence.assets.length - 1);
        });

        $.subscribe(header.PagingHeaderPanel.PREV, (e) => {
            if (this.currentAssetIndex != 0) {
                this.viewPage(Number(this.currentAssetIndex) - 1);
            }
        });
        
        $.subscribe(header.PagingHeaderPanel.NEXT, (e) => {
            if (this.currentAssetIndex != this.provider.assetSequence.assets.length - 1) {
                this.viewPage(Number(this.currentAssetIndex) + 1);
            }
        });

        $.subscribe(header.PagingHeaderPanel.MODE_CHANGED, (e, mode: string) => {
            App.mode = mode;

            $.publish(App.MODE_CHANGED, [mode]);
        });

        $.subscribe(header.PagingHeaderPanel.PAGE_SEARCH, (e, value: string) => {
            this.viewLabel(value);
        });
        
        $.subscribe(header.PagingHeaderPanel.IMAGE_SEARCH, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(treeView.TreeView.VIEW_SECTION_PATH, (e, path: string) => {
            this.viewSection(path);
        });

        $.subscribe(thumbsView.ThumbsView.THUMB_SELECTED, (e, index: number) => {
            this.viewPage(index);
        });

        $.subscribe(center.SeadragonCenterPanel.SEADRAGON_ANIMATION_FINISH, (e, viewer) => {
            this.updateAddress(this.provider.assetSequenceIndex, this.currentAssetIndex, this.centerPanel.serialiseBounds(this.centerPanel.currentBounds));
        });

        this.headerPanel = new header.PagingHeaderPanel(shell.Shell.$headerPanel);
        this.leftPanel = new left.TreeViewLeftPanel(shell.Shell.$leftPanel);
        this.centerPanel = new center.SeadragonCenterPanel(shell.Shell.$centerPanel);
        this.rightPanel = new right.MoreInfoRightPanel(shell.Shell.$rightPanel);
        this.footerPanel = new footer.ExtendedFooterPanel(shell.Shell.$footerPanel);

        this.$helpDialogue = utils.Utils.createDiv('overlay help');
        shell.Shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new help.HelpDialogue(this.$helpDialogue);

        this.$embedDialogue = utils.Utils.createDiv('overlay embed');
        shell.Shell.$overlays.append(this.$embedDialogue);
        this.embedDialogue = new embed.EmbedDialogue(this.$embedDialogue);

        this.getUrlParams();

        $.publish(baseApp.BaseApp.RESIZE);
    }

    getUrlParams(): void {

        var assetIndex;

        if (this.isDeepLinkingEnabled()) {

            var hash = this.getHashValues();

            // has index been specified?
            if (hash.length > 1) {
                assetIndex = hash[1];
                this.viewPage(assetIndex, true);
            } else {
                // default to the first page.
                this.viewPage(0);
            }
        } else {
            // the initial params are on the query string.
            assetIndex = this.provider.config.options.assetIndex;

            if (assetIndex) {
                this.viewPage(assetIndex);
            } else {
                // default to the first page.
                this.viewPage(0);
            }
        }
    }

    viewPage(assetIndex: number, preserveAddress?: bool): void {
        this.viewAsset(assetIndex, () => {

            var asset = this.provider.assetSequence.assets[assetIndex];

            $.publish(App.OPEN_DZI, [asset.dziUri]);

            // update address                       
            if (preserveAddress) {
                this.updateAddress(this.provider.assetSequenceIndex.toString(), assetIndex.toString());
            } else {
                this.setAddress(this.provider.assetSequenceIndex.toString(), assetIndex.toString());
            }
        });
    }

    viewSection(path: string): void {

        var index = this.getSectionIndex(path);

        var section = this.getSectionByAssetIndex(index);

        this.viewPage(index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showDialogue(this.provider.config.content.genericDialogue.enterValue);
            return;
        }
        
        var index = this.getAssetIndexByOrderLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showDialogue(this.provider.config.content.genericDialogue.pageNotFound);
        }
    }

    getMode(): string {
        if (App.mode) return App.mode;

        switch (this.provider.type) {
            case 'monograph':
                return App.PAGE_MODE;
                break;
            case 'archive':
            case 'boundmanuscript':
                return App.IMAGE_MODE;
                break;
            default:
                return App.IMAGE_MODE;
        }
    }

    getViewerBounds(): string{
        var bounds = this.centerPanel.getBounds();

        if (bounds) return this.centerPanel.serialiseBounds(bounds);

        return "";
    }
}
