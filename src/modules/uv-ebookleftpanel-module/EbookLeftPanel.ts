import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { Events } from "../../extensions/uv-ebook-extension/Events";

export class EbookLeftPanel extends LeftPanel {

    private _ebookTOC: any;
    private _$container: JQuery;
    private _$ebookTOC: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        this.setConfig("ebookLeftPanel");
        super.create();

        this._$container = $('<div class="container"></div>');
        this._ebookTOC = document.createElement("uv-ebook-toc");
        this._$ebookTOC = $(this._ebookTOC);
        //this._ebookTOC.setAttribute("src-tab-enabled", this.config.options.srcTabEnabled);
        this.$main.addClass("disabled");
        this.$main.append(this._$container);
        this._$container.append(this._$ebookTOC);

        this.setTitle(this.content.title);

        this.component.subscribe(Events.LOADED_NAVIGATION, (navigation: any) => {
            this.$main.removeClass("disabled");
            this._ebookTOC.toc = navigation.toc;    
        });

        this.component.subscribe(Events.RELOCATED, (location: any) => {
            this._ebookTOC.selected = location.start.href;   
        });

        this._ebookTOC.addEventListener("itemClicked", (e: any) => {
            this.component.publish(Events.ITEM_CLICKED, e.detail);
        }, false);

        Utils.Async.waitFor(() => {
            return (window.customElements !== undefined);
        }, () => {
            customElements.whenDefined("uv-ebook-toc").then(() => {
                this.component.publish(Events.TOC_READY);
            });
        });
    }

    expandFullStart(): void {
        super.expandFullStart();
        this.component.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_START);
    }

    expandFullFinish(): void {
        super.expandFullFinish();
        this.component.publish(BaseEvents.LEFTPANEL_EXPAND_FULL_FINISH);
    }

    collapseFullStart(): void {
        super.collapseFullStart();
        this.component.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START);
    }

    collapseFullFinish(): void {
        super.collapseFullFinish();
        this.component.publish(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH);
    }

    resize(): void {
        super.resize();
        this._$container.height(this.$main.height() - this._$container.verticalPadding());
    }
}