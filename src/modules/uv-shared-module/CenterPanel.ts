import {Shell} from "./Shell";
import {BaseView} from "./BaseView";
import {Position} from "./Position";
import {UVUtils} from "./Utils";

export class CenterPanel extends BaseView {

    $attribution: JQuery;
    $closeAttributionButton: JQuery;
    $content: JQuery;
    $title: JQuery;
    isAttributionOpen: boolean = false;
    attributionPosition: Position = Position.BOTTOM_LEFT;

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
        this.closeAttribution();

        this.$closeAttributionButton = this.$attribution.find('.header .close');
        this.$closeAttributionButton.on('click', (e) => {
            e.preventDefault();
            this.closeAttribution();
        });

        if (!Utils.Bools.getBool(this.options.titleEnabled, true)) {
            this.$title.hide();
        }
    }

    openAttribution(): void {
        this.$attribution.show();
        this.isAttributionOpen = true;
    }

    closeAttribution(): void {
        this.$attribution.hide();
        this.isAttributionOpen = false;
    }

    updateRequiredStatement(): void {
        const requiredStatement: Manifold.ILabelValuePair | null = this.extension.helper.getRequiredStatement();
        //var license = this.provider.getLicense();
        //var logo = this.provider.getLogo();

        const enabled: boolean = Utils.Bools.getBool(this.options.requiredStatementEnabled, true);

        if (!requiredStatement || !requiredStatement.value || !enabled) {
            return;
        }

        this.openAttribution();

        const $attributionTitle: JQuery = this.$attribution.find('.title');
        const $attributionText: JQuery = this.$attribution.find('.attribution-text');
        const $license: JQuery = this.$attribution.find('.license');
        const $logo: JQuery = this.$attribution.find('.logo');

        if (requiredStatement.label) {
            const sanitizedTitle: string = UVUtils.sanitize(requiredStatement.label);
            $attributionTitle.html(sanitizedTitle);
        }
        
        if (requiredStatement.value) {
            const sanitizedText: string = UVUtils.sanitize(requiredStatement.value);

            $attributionText.html(sanitizedText);

            $attributionText.find('img').one('load', () => {
                this.resize();
            }).each(function() {
                if (this.complete) $(this).load();
            });

            $attributionText.targetBlank();
        }

        // $attribution.toggleExpandText(this.options.trimAttributionCount, () => {
        //     this.resize();
        // });

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

        this.resize();
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

        if (this.options && this.options.titleEnabled === false || !this.$title.is(':visible')) {
            titleHeight = 0;
        } else {
            titleHeight = this.$title.height();
        }

        this.$content.height(this.$element.height() - titleHeight);
        this.$content.width(this.$element.width());

        if (this.$attribution && this.isAttributionOpen) {

            switch (this.attributionPosition) {
                case Position.BOTTOM_LEFT :
                    this.$attribution.css('top', this.$content.height() - this.$attribution.outerHeight() - this.$attribution.verticalMargins());
                    this.$attribution.css('left', 0);
                    break;
                case Position.BOTTOM_RIGHT :
                    this.$attribution.css('top', this.$content.height() - this.$attribution.outerHeight() - this.$attribution.verticalMargins());
                    this.$attribution.css('left', this.$content.width() - this.$attribution.outerWidth() - this.$attribution.horizontalMargins());
                    break;
            }

            // hide the attribution if there's no room for it
            if (this.$content.width() <= this.$attribution.width()) {
                this.$attribution.hide();
            } else {
                this.$attribution.show();
            }
        }

    }
}
