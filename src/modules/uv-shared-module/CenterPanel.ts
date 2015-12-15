import Shell = require("./Shell");
import BaseView = require("./BaseView");

class CenterPanel extends BaseView {

    $acknowledgements: JQuery;
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

        this.$acknowledgements = $('<div class="acknowledgements">\
                                   <div class="header">\
                                       <div class="title"></div>\
                                       <div class="close"></div>\
                                   </div>\
                                   <div class="main">\
                                       <div class="attribution"></div>\
                                       <div class="license"></div>\
                                       <div class="logo"></div>\
                                   </div>\
                              </div>');

        this.$acknowledgements.find('.header .title').text(this.content.acknowledgements);
        this.$content.append(this.$acknowledgements);
        this.$acknowledgements.hide();

        this.$closeAttributionButton = this.$acknowledgements.find('.header .close');
        this.$closeAttributionButton.on('click', (e) => {
            e.preventDefault();
            this.$acknowledgements.hide();
        });

        if (this.options.titleEnabled === false){
            this.$title.hide();
        }
    }

    showAttribution(): void {
        var acknowledgements = this.provider.getAttribution();
        //var license = this.provider.getLicense();
        //var logo = this.provider.getLogo();

        if (!acknowledgements){
            return;
        }

        this.$acknowledgements.show();

        var $attribution = this.$acknowledgements.find('.attribution');
        var $license = this.$acknowledgements.find('.license');
        var $logo = this.$acknowledgements.find('.logo');

        $attribution.html(this.provider.sanitize(acknowledgements));

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

        this.$element.css({
            'left': Math.floor(Shell.$leftPanel.width()),
            'width': Math.floor(this.$element.parent().width() - Shell.$leftPanel.width() - Shell.$rightPanel.width())
        });

        var titleHeight;

        if (this.options && this.options.titleEnabled === false){
            titleHeight = 0;
        } else {
            titleHeight = this.$title.height();
        }

        this.$content.height(this.$element.height() - titleHeight);
        this.$content.width(this.$element.width());

        if (this.$acknowledgements && this.$acknowledgements.is(':visible')){
            this.$acknowledgements.css('top', this.$content.height() - this.$acknowledgements.outerHeight() - this.$acknowledgements.verticalMargins());
        }
    }
}

export = CenterPanel;