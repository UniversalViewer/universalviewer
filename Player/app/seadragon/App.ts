/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import bp = module("app/BaseProvider");
import p = module("app/seadragon/Provider");
import shell = module("app/shared/Shell");
import header = module("app/seadragon/Header");
import main = module("app/seadragon/Main");
import footer = module("app/seadragon/Footer");

export class App extends baseApp.BaseApp {

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

    static getMode(): string{
        if (App.mode) return App.mode;
        
        switch (baseApp.BaseApp.provider.type) {
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

    create(): void {
        super.create();

        // events.
        $.subscribe(header.Header.FIRST, (e) => {
            this.viewPage(0);
        });

        $.subscribe(header.Header.LAST, (e) => {
            this.viewPage(baseApp.BaseApp.provider.assetSequence.assets.length - 1);
        });

        $.subscribe(header.Header.PREV, (e) => {
            if (baseApp.BaseApp.currentAssetIndex != 0) {
                this.viewPage(Number(baseApp.BaseApp.currentAssetIndex) - 1);
            }
        });

        $.subscribe(header.Header.NEXT, (e) => {
            if (baseApp.BaseApp.currentAssetIndex != baseApp.BaseApp.provider.assetSequence.assets.length - 1) {
                this.viewPage(Number(baseApp.BaseApp.currentAssetIndex) + 1);
            }
        });

        $.subscribe(header.Header.MODE_CHANGED, (e, mode: string) => {
            App.mode = mode;

            $.publish(App.MODE_CHANGED, [mode]);
        });

        $.subscribe(header.Header.PAGE_SEARCH, (e, value: string) => {
            this.viewLabel(value);
        });
        
        $.subscribe(header.Header.IMAGE_SEARCH, (e, index: number) => {
            this.viewPage(index);
        });

        new header.Header(shell.Shell.$headerPanel);
        new main.Main(shell.Shell.$mainPanel);
        new footer.Footer(shell.Shell.$footerPanel);

        $.publish(baseApp.BaseApp.RESIZE);

        this.getUrlParams();
    }

    getUrlParams(): void {

        var assetIndex;

        if (this.isDeepLinkingEnabled()) {

            var hash = utils.Utils.getHashValues('/', parent.document);

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
            assetIndex = baseApp.BaseApp.provider.config.options.assetIndex;

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

            var asset = baseApp.BaseApp.provider.assetSequence.assets[assetIndex];

            $.publish(App.OPEN_DZI, [asset.dziUri]);

            // update address                       
            if (preserveAddress) {
                this.updateAddress(baseApp.BaseApp.provider.assetSequenceIndex.toString(), assetIndex.toString());
            } else {
                this.setAddress(baseApp.BaseApp.provider.assetSequenceIndex.toString(), assetIndex.toString());
            }
        });
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showDialogue(baseApp.BaseApp.provider.config.content.genericDialogue.enterValue);
            return;
        }
        
        var index = this.getAssetIndexByOrderLabel(label);

        if (index != -1) {
            this.viewPage(index);
        } else {
            this.showDialogue(baseApp.BaseApp.provider.config.content.genericDialogue.pageNotFound);
        }
    }
}
