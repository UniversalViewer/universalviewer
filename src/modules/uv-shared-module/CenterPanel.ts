import {Shell} from "./Shell";
import {BaseView} from "./BaseView";
import {UVUtils} from "./Utils";

export class CenterPanel extends BaseView {

    $attribution: JQuery;
    $closeAttributionButton: JQuery;
    $content: JQuery;
    $title: JQuery;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        super.create();

        this.$title = $('<div class="title"></div>');
        this.$element.append(this.$title);

        this.$content = $('<div id="content" class="content"></div>');
        this.$element.append(this.$content);

        this.$attribution = $(`
                                <div class="attribution">
                                  <div class="header">
                                    <div class="title"></div>
                                    <button type="button" class="close" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div class="main">
                                    <div class="attribution-text"></div>
                                    <div class="license"></div>
                                    <div class="logo"></div>
                                  </div>
                                </div>
        `);

        this.$attribution.find('.header .title').text(this.content.attribution);
        this.$content.append(this.$attribution);
        this.$attribution.hide();

        this.$closeAttributionButton = this.$attribution.find('.header .close');
        this.$closeAttributionButton.on('click', (e) => {
            e.preventDefault();
            this.$attribution.hide();
        });

        if (!Utils.Bools.getBool(this.options.titleEnabled, true)) {
            this.$title.hide();
        }
    }

    updateAttribution(): void {
        const attribution: string | null = this.extension.helper.getAttribution();
        //var license = this.provider.getLicense();
        //var logo = this.provider.getLogo();

        const enabled: boolean = Utils.Bools.getBool(this.options.attributionEnabled, true);

        if (!attribution || !enabled) {
            return;
        }

        this.$attribution.show();

        const $attribution = this.$attribution.find('.attribution-text');
        const $license = this.$attribution.find('.license');
        const $logo = this.$attribution.find('.logo');

        $attribution.html(UVUtils.sanitize(attribution));

        $attribution.find('img').one("load", () => {
            this.resize();
        }).each(function() {
            if(this.complete) $(this).load();
        });

        $attribution.targetBlank();

        $attribution.toggleExpandText(this.options.trimAttributionCount, () => {
            this.resize();
        });

        //if (license){
        //    $license.append('<a href="' + license + '">' + license + '</a>');
        //} else {
        $license.hide();
        //}
        //
        //if (logo){
        //    $logo.append('<img src="' + logo + '"/>');
        //} else {
        $logo.hide();
        //}
    }

    resize(): void {
        super.resize();

        const leftPanelWidth: number = Shell.$leftPanel.is(':visible') ? Math.floor(Shell.$leftPanel.width()) : 0;
        const rightPanelWidth: number = Shell.$rightPanel.is(':visible') ? Math.floor(Shell.$rightPanel.width()) : 0;
        const width: number = Math.floor(this.$element.parent().width() - leftPanelWidth - rightPanelWidth)

        this.$element.css({
            'left': leftPanelWidth,
            'width': width
        });

        let titleHeight: number;

        if (this.options && this.options.titleEnabled === false) {
            titleHeight = 0;
        } else {
            titleHeight = this.$title.height();
        }

        this.$content.height(this.$element.height() - titleHeight);
        this.$content.width(this.$element.width());

        if (this.$attribution && this.$attribution.is(':visible')) {
            this.$attribution.css('top', this.$content.height() - this.$attribution.outerHeight() - this.$attribution.verticalMargins());
        }
    }
}
