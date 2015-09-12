import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IProvider = require("../uv-shared-module/IProvider");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");

class GalleryView extends BaseView {

    $header: JQuery;
    $main: JQuery;
    $selectedThumb: JQuery;
    $sizeDownButton: JQuery;
    $sizeRange: JQuery;
    $sizeUpButton: JQuery;
    $thumbs: JQuery;
    isOpen: boolean = false;
    lastThumbClickedIndex: number;
    range: number;

    public thumbs: Manifesto.Thumb[];

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, index) => {
            this.selectIndex(parseInt(index));
        });

        $.subscribe(BaseCommands.SETTINGS_CHANGED, () => {
            this.setLabel();
        });

        $.subscribe(Commands.SEARCH_PREVIEW_START, (e, canvasIndex) => {
            this.searchPreviewStart(canvasIndex);
        });

        $.subscribe(Commands.SEARCH_PREVIEW_FINISH, () => {
            this.searchPreviewFinish();
        });

        this.$header = $('<div class="header"></div>');
        this.$element.append(this.$header);

        this.$sizeDownButton = $('<input class="btn btn-default size-down" type="button" value="-" />');
        this.$header.append(this.$sizeDownButton);

        this.$sizeRange = $('<input type="range" name="size" min="0" max="10" value="5" />');
        this.$header.append(this.$sizeRange);

        this.$sizeUpButton = $('<input class="btn btn-default size-up" type="button" value="+" />');
        this.$header.append(this.$sizeUpButton);

        this.$main = $('<div class="main"></div>');
        this.$element.append(this.$main);

        this.$thumbs = $('<div class="thumbs"></div>');
        this.$main.append(this.$thumbs);

        this.$thumbs.addClass(this.provider.getViewingDirection().toString()); // defaults to "left-to-right"

        this.$sizeDownButton.on('click', () => {
            var val = Number(this.$sizeRange.val()) - 1;

            if (val >= Number(this.$sizeRange.attr('min'))){
                this.$sizeRange.val(val.toString());
                this.$sizeRange.trigger('change');
            }
        });

        this.$sizeUpButton.on('click', () => {
            var val = Number(this.$sizeRange.val()) + 1

            if (val <= Number(this.$sizeRange.attr('max'))){
                this.$sizeRange.val(val.toString());
                this.$sizeRange.trigger('change');
            }
        });

        this.$sizeRange.on('change', () => {
            this.updateThumbs();
            this.scrollToThumb(this.getSelectedThumbIndex());
        });

        $.templates({
            galleryThumbsTemplate: '<div class="{{:~className()}}" data-src="{{>uri}}" data-index="{{>index}}" data-visible="{{>visible}}" data-width="{{>width}}" data-height="{{>height}}">\
                                        <div class="wrap"></div>\
                                        <span class="index">{{:#index + 1}}</span>\
                                        <span class="label" title="{{>label}}">{{>label}}&nbsp;</span>\
                                     </div>'
        });

        $.views.helpers({
            className: function(){
                var className = "thumb";

                if (this.data.index === 0){
                    className += " first";
                }

                if (!this.data.uri){
                    className += " placeholder";
                }

                return className;
            }
        });

        // use unevent to detect scroll stop.
        this.$main.on('scroll', () => {
            this.updateThumbs();
        }, 1000);

        if (!Modernizr.inputtypes.range){
            this.$sizeRange.hide();
        }

        this.resize();
    }

    public dataBind(): void{
        if (!this.thumbs) return;
        this.createThumbs();
    }

    createThumbs(): void{
        var that = this;

        if (!this.thumbs) return;

        this.$thumbs.link($.templates.galleryThumbsTemplate, this.thumbs);

        this.$thumbs.delegate(".thumb", "click", function (e) {
            e.preventDefault();

            var data = $.view(this).data;

            that.lastThumbClickedIndex = data.index;

            $.publish(BaseCommands.THUMB_SELECTED, [data.index]);
        });

        this.selectIndex(this.provider.canvasIndex);

        this.setLabel();

        this.updateThumbs();
    }

    updateThumbs(): void {

        if (!this.thumbs || !this.thumbs.length) return;

        // cache range size
        var norm = Math.normalise(Number(this.$sizeRange.val()), 0, 10);
        this.range = Math.clamp(norm, 0.05, 1);

        // test which thumbs are scrolled into view
        var thumbs = this.getAllThumbs();

        for (var i = 0; i < thumbs.length; i++) {
            var $thumb = $(thumbs[i]);
            this.sizeThumb($thumb);
            //this.sizeThumbImage($thumb);
        }

        this.equaliseHeights();

        var scrollTop = this.$main.scrollTop();
        var scrollHeight = this.$main.height();

        for (var i = 0; i < thumbs.length; i++) {

            var $thumb = $(thumbs[i]);
            var thumbTop = $thumb.position().top;
            var thumbBottom = thumbTop + $thumb.height();

            if (thumbBottom >= scrollTop && thumbTop <= scrollTop + scrollHeight){
                this.loadThumb($thumb, () => {
                    //this.sizeThumbImage($thumb);
                });
            //    $thumb.find('.wrap').css('background', 'red');
            //} else {
            //    $thumb.find('.wrap').css('background', 'none');
            }
        }
    }

    equaliseHeights(): void {
        this.$thumbs.find('.thumb .wrap').equaliseHeight(false, true);
    }

    sizeThumb($thumb: JQuery) : void {
        var width = $thumb.data('width');
        var height = $thumb.data('height');

        var $wrap = $thumb.find('.wrap');
        var $label = $thumb.find('.label');

        $wrap.width(width * this.range);
        $wrap.height(height * this.range);

        $label.width(width * this.range);
    }

    //sizeThumbImage($thumb: JQuery) : void {
    //    var width = $thumb.data('width');
    //    var height = $thumb.data('height');
    //
    //    var $img = $thumb.find('img');
    //}

    loadThumb($thumb: JQuery, callback?: (img: JQuery) => void): void {
        var $wrap = $thumb.find('.wrap');

        if ($wrap.hasClass('loading') || $wrap.hasClass('loaded')) return;

        // if no img has been added yet

        var visible = $thumb.attr('data-visible');

        var fadeDuration = this.options.thumbsImageFadeInDuration;

        if (visible !== "false") {
            $wrap.addClass('loading');
            var src = $thumb.attr('data-src');
            var img = $('<img src="' + src + '" />');
            // fade in on load.
            $(img).hide().load(function () {
                $(this).fadeIn(fadeDuration, function () {
                    $(this).parent().swapClass('loading', 'loaded');
                });
            });
            $wrap.append(img);
            if (callback) callback(img);
        } else {
            $wrap.addClass('hidden');
        }
    }

    show(): void {
        this.isOpen = true;
        this.$element.show();

        setTimeout(() => {
            this.selectIndex(this.provider.canvasIndex);
            this.scrollToThumb(this.getSelectedThumbIndex());
        }, 1);
    }

    hide(): void {
        this.isOpen = false;
        this.$element.hide();
    }

    setLabel(): void {

        if (this.isPageModeEnabled()) {
            $(this.$thumbs).find('span.index').hide();
            $(this.$thumbs).find('span.label').show();
        } else {
            $(this.$thumbs).find('span.index').show();
            $(this.$thumbs).find('span.label').hide();
        }
    }

    isPageModeEnabled(): boolean {
        if (typeof (<ISeadragonExtension>this.extension).getMode === "function") { // todo: why is this needed?
            return this.config.options.pageModeEnabled && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
        }
        return this.config.options.pageModeEnabled;
    }

    selectIndex(index): void {

        // may be authenticating
        if (index == -1) return;

        if (!this.thumbs || !this.thumbs.length) return;

        index = parseInt(index);

        this.getAllThumbs().removeClass('selected');

        this.$selectedThumb = this.getThumbByIndex(index);

        this.$selectedThumb.addClass('selected');

        // make sure visible images are loaded.
        this.updateThumbs();
    }

    getSelectedThumbIndex(): number {
        return this.$selectedThumb.data('index');
    }

    getAllThumbs(): JQuery {
        return this.$thumbs.find('.thumb');
    }

    getThumbByIndex(canvasIndex): JQuery {
        return $(this.getAllThumbs()[canvasIndex])
    }

    scrollToThumb(canvasIndex: number): void {
        var $thumb = this.getThumbByIndex(canvasIndex)
        this.$main.scrollTop($thumb.position().top);
    }

    searchPreviewStart(canvasIndex: number): void {
        this.scrollToThumb(canvasIndex);
        var $thumb = this.getThumbByIndex(canvasIndex);
        $thumb.addClass('searchpreview');
    }

    searchPreviewFinish(): void {
        this.scrollToThumb(this.provider.canvasIndex);
        this.getAllThumbs().removeClass('searchpreview');
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$header.height());

        this.updateThumbs();
    }
}

export = GalleryView;