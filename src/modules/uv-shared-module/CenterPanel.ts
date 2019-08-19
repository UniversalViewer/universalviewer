import {BaseView} from "./BaseView";
import {Position} from "./Position";
import {UVUtils} from "../../Utils";

export class CenterPanel extends BaseView {

    title: string | null;
    subtitle: string | null;
    subtitleExpanded: boolean = false;
    $attribution: JQuery;
    $closeAttributionButton: JQuery;
    $content: JQuery;
    $title: JQuery;
    $subtitle: JQuery;
    $subtitleWrapper: JQuery;
    $subtitleExpand: JQuery;
    $subtitleText: JQuery;
    isAttributionOpen: boolean = false;
    attributionPosition: Position = Position.BOTTOM_LEFT;

    constructor($element: JQuery) {
        super($element, false, true);
    }

    create(): void {
        super.create();

        this.$title = $('<div class="title"></div>');
        this.$element.append(this.$title);

        this.$subtitle = $(`<div class="subtitle">
                                <div class="wrapper">
                                    <button type="button" class="expand-btn" aria-label="Expand">
                                        <span aria-hidden="true">+</span>
                                    </button>
                                    <span class="text"></span>
                                </div>
                            </div>`);
        this.$element.append(this.$subtitle);

        this.$subtitleWrapper = this.$subtitle.find('.wrapper');
        this.$subtitleExpand = this.$subtitle.find('.expand-btn');
        this.$subtitleText = this.$subtitle.find('.text');

        this.$content = $('<div id="content" class="content"></div>');
        this.$element.append(this.$content);

        this.$attribution = $(`
                                <div class="attribution">
                                  <div class="header">
                                    <div class="title"></div>
                                    <button type="button" class="close" aria-label="Close">
                                      <span aria-hidden="true">&#215;</span>
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

        this.$subtitleExpand.on('click', (e) => {
            e.preventDefault();

            this.subtitleExpanded = !this.subtitleExpanded;
            
            if (this.subtitleExpanded) {
                this.$subtitleWrapper.addClass('expanded');
                this.$subtitleExpand.text('-');
            } else {
                this.$subtitleWrapper.removeClass('expanded');
                this.$subtitleExpand.text('+');
            }

            this.resize();
        });

        if (Utils.Bools.getBool(this.options.titleEnabled, true)) {
            this.$title.removeClass('hidden');
        } else {
            this.$title.addClass('hidden');
        }

        if (Utils.Bools.getBool(this.options.subtitleEnabled, false)) {
            this.$subtitle.removeClass('hidden');
        } else {
            this.$subtitle.addClass('hidden');
        }

        this.whenResized(() => {
            this.updateRequiredStatement();
        });
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
        } else {
            $attributionTitle.text(this.content.attribution);
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

        const leftPanelWidth: number = this.extension.shell.$leftPanel.is(':visible') ? Math.floor(this.extension.shell.$leftPanel.width()) : 0;
        const rightPanelWidth: number = this.extension.shell.$rightPanel.is(':visible') ? Math.floor(this.extension.shell.$rightPanel.width()) : 0;
        const width: number = Math.floor(this.$element.parent().width() - leftPanelWidth - rightPanelWidth)

        this.$element.css({
            'left': leftPanelWidth,
            'width': width
        });

        let titleHeight: number;
        let subtitleHeight: number;

        if (this.options && this.options.titleEnabled === false || !this.$title.is(':visible')) {
            titleHeight = 0;
        } else {
            titleHeight = this.$title.height();
        }

        if (this.options && this.options.subtitleEnabled === false || !this.$subtitle.is(':visible')) {
            subtitleHeight = 0;
        } else {
            subtitleHeight = this.$subtitle.height();
        }

        this.$content.height(this.$element.height() - titleHeight - subtitleHeight);
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

        if (this.subtitle && this.options.subtitleEnabled) {

            this.$subtitleText.html(UVUtils.sanitize(this.subtitle.replace(/<br\s*[\/]?>/gi, '; ')));
            this.$subtitleText.removeClass('elided');
            this.$subtitle.removeClass('hidden');
            this.$subtitleWrapper.css('max-height', this.$content.height() + this.$subtitle.outerHeight());
            this.$subtitleWrapper.width(this.$content.width());

            if (!this.subtitleExpanded) {

                this.$subtitleText.width('auto');
                this.$subtitleWrapper.width('auto');
                this.$subtitleExpand.hide();

                // if the subtitle span is wider than the container, set it to display:block 
                // and set its width to that of the container
                // this will make it appear elided.
                // show the expand button
                if (this.$subtitleText.width() > this.$content.width()) {
                    this.$subtitleExpand.show();
                    this.$subtitleText.addClass('elided');
                    this.$subtitleText.width(this.$content.width() - (this.$subtitleExpand.outerWidth() + this.$subtitleText.horizontalMargins()));
                }
            } else {
                // subtitle expanded
                this.$subtitleText.width(this.$content.width() - this.$subtitleText.horizontalMargins() - 2);
            }
        } else {
            this.$subtitle.addClass('hidden');
        }

    }
}
