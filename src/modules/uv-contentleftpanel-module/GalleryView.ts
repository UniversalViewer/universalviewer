import BaseCommands = require("../uv-shared-module/BaseCommands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IProvider = require("../uv-shared-module/IProvider");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");
import IThumb = require("../uv-shared-module/IThumb");
import IRange = require("../uv-shared-module/IRange");
import MultiSelectState = require("../uv-shared-module/MultiSelectState");
import ICanvas = require("../uv-shared-module/ICanvas");
import Thumb = Manifesto.Thumb;

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
    multiSelectState: MultiSelectState;
    range: number;

    public thumbs: IThumb[];

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {

        this.setConfig('contentLeftPanel');

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

        $.subscribe(Commands.ENTER_MULTISELECT_MODE, () => {
            this.dataBind();
            this.resize();
        });

        $.subscribe(Commands.EXIT_MULTISELECT_MODE, () => {
            this.dataBind();
        });

        $.subscribe(Commands.MULTISELECT_CHANGE, (s, state: MultiSelectState) => {
            this._multiSelectStateChange(state);
        });

        this.$header = $('<div class="header"></div>');
        this.$element.append(this.$header);

        this.$sizeDownButton = $('<input class="btn btn-default size-down" type="button" value="-" />');
        this.$header.append(this.$sizeDownButton);

        this.$sizeRange = $('<input type="range" name="size" min="1" max="10" value="6" />');
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
            var val = Number(this.$sizeRange.val()) + 1;

            if (val <= Number(this.$sizeRange.attr('max'))){
                this.$sizeRange.val(val.toString());
                this.$sizeRange.trigger('change');
            }
        });

        this.$sizeRange.on('change', () => {
            this.updateThumbs();
            this.scrollToThumb(this.getSelectedThumbIndex());
        });

        this._setRange();

        $.templates({
            galleryThumbsTemplate: '\
                <div class="{{:~className()}}" data-src="{{>uri}}" data-index="{{>index}}" data-visible="{{>visible}}" data-width="{{>width}}" data-height="{{>height}}">\
                    <div class="wrap" style="width:{{>initialWidth}}px; height:{{>initialHeight}}px" data-link="class{merge:multiSelected toggle=\'multiSelected\'}">\
                    {^{if multiSelectionEnabled}}\
                        <input id="thumb-checkbox-{{>id}}" type="checkbox" data-link="checked{:multiSelected ? \'checked\' : \'\'}" class="multiSelect" />\
                    {{/if}}\
                    </div>\
                    <span class="index">{{:#index + 1}}</span>\
                    <span class="label" style="width:{{>initialWidth}}px" title="{{>label}}">{{>label}}&nbsp;</span>\
                </div>'
        });

        $.views.helpers({
            className: function(){
                var className = "thumb preLoad";

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
        }, 100);

        if (!Modernizr.inputtypes.range){
            this.$sizeRange.hide();
        }

        this.resize();
    }

    public dataBind(): void{
        if (!this.thumbs) return;
        this._reset();
        this.createThumbs();
    }

    createThumbs(): void{
        var that = this;

        if (!this.thumbs) return;

        //this.thumbs = [this.thumbs[0]];

        // set initial thumb sizes
        var heights = [];

        for(var i = 0; i < this.thumbs.length; i++) {
            var thumb: IThumb = this.thumbs[i];
            var initialWidth = Math.floor(thumb.width * this.range);
            var initialHeight = Math.floor(thumb.height * this.range);
            thumb.initialWidth = initialWidth;
            //thumb.initialHeight = initialHeight;
            heights.push(initialHeight);
        }

        var medianHeight = Math.median(heights);

        for(var j = 0; j < this.thumbs.length; j++){
            var thumb: IThumb = this.thumbs[j];
            thumb.initialHeight = medianHeight;
        }

        this.$thumbs.link($.templates.galleryThumbsTemplate, this.thumbs);

        if (!that.multiSelectState.enabled){
            // add a selection click event to all thumbs
            this.$thumbs.delegate('.thumb', 'click', function (e) {
                e.preventDefault();
                var data = $.view(this).data;
                that.lastThumbClickedIndex = data.index;
                $.publish(BaseCommands.THUMB_SELECTED, [data.index]);
            });
        } else {
            // make each thumb a checkboxButton
            $.each(this.$thumbs.find('.thumb'), (index: number, thumb: any) => {
                var $thumb = $(thumb);

                $thumb.checkboxButton(function(checked: boolean) {
                    var data = $.view(this).data;
                    that._setThumbMultiSelected(data, !data.multiSelected);
                    $.publish(Commands.THUMB_MULTISELECTED, [data]);
                });
            })
        }

        this.selectIndex(this.provider.canvasIndex);

        this.setLabel();

        this.updateThumbs();
    }

    private _getThumbsByRange(range: IRange): IThumb[] {
        var thumbs: IThumb[] = [];

        for (var i = 0; i < this.thumbs.length; i++) {
            var thumb: IThumb = this.thumbs[i];
            var canvas: ICanvas = thumb.data;

            var r: IRange = <IRange>this.provider.getCanvasRange(canvas);

            if (r && r.id === range.id){
                thumbs.push(thumb);
            }
        }

        return thumbs;
    }

    private _multiSelectStateChange(state: MultiSelectState): void {

        this.multiSelectState = state;

        if (state.enabled){
            this.$thumbs.addClass("multiSelect");
        } else {
            this.$thumbs.removeClass("multiSelect");
        }

        for (var j = 0; j < state.canvases.length; j++){
            var canvas: ICanvas = state.canvases[j];
            var thumb: IThumb = this._getThumbByCanvas(canvas);
            this._setThumbMultiSelected(thumb, canvas.multiSelected);
        }

        // range selections override canvas selections
        for (var i = 0; i < state.ranges.length; i++){
            var range: IRange = state.ranges[i];
            var thumbs: IThumb[] = this._getThumbsByRange(range);

            for (var k = 0; k < thumbs.length; k++){
                var thumb: IThumb = thumbs[k];
                this._setThumbMultiSelected(thumb, range.multiSelected);
            }
        }
    }

    private _getThumbByCanvas(canvas: ICanvas): IThumb {
        return this.thumbs.en().where(c => c.data.id === canvas.id).first();
    }

    private _setThumbMultiSelected(thumb: IThumb, selected: boolean): void {
        $.observable(thumb).setProperty("multiSelected", selected);
    }

    private _setRange(): void {
        var norm = Math.normalise(Number(this.$sizeRange.val()), 0, 10);
        this.range = Math.clamp(norm, 0.05, 1);
    }

    updateThumbs(): void {

        if (!this.thumbs || !this.thumbs.length) return;

        var debug: boolean = false;

        // cache range size
        this._setRange();

        var scrollTop = this.$main.scrollTop();
        var scrollHeight = this.$main.height();
        var scrollBottom = scrollTop + scrollHeight;

        if (debug){
            console.log('scrollTop %s, scrollBottom %s', scrollTop, scrollBottom);
        }

        var thumbsToEqualise: any[] = [];

        // test which thumbs are scrolled into view
        var thumbs = this.getAllThumbs();

        // if chunked resizing isn't enabled, equalise all thumbs
        if (!this.isChunkedResizingEnabled()) {
            thumbsToEqualise = thumbs.toArray();
        }

        for (var i = 0; i < thumbs.length; i++) {

            var $thumb = $(thumbs[i]);

            var thumbTop = $thumb.position().top;
            var thumbHeight = $thumb.outerHeight();
            var thumbBottom = thumbTop + thumbHeight;

            if (debug) {
                var $label = $thumb.find('span:visible');
                $label.empty().append('t: ' + thumbTop + ', b: ' + thumbBottom);
            }

            // if chunked resizing isn't enabled, resize all thumbs
            if (!this.isChunkedResizingEnabled()) {
                this.sizeThumb($thumb);
            }

            // check all thumbs to see if they are within the scroll area plus padding
            if (thumbTop <= scrollBottom + thumbHeight * this.options.galleryThumbLoadPadding && thumbBottom >= scrollTop - thumbHeight * this.options.galleryThumbLoadPadding){

                // if chunked resizing is enabled, only resize, equalise, and show thumbs in the scroll area
                if (this.isChunkedResizingEnabled()) {
                    this.sizeThumb($thumb);
                    thumbsToEqualise.push(thumbs[i]);
                    $thumb.removeClass('outsideScrollArea');
                }

                if (debug) {
                    $label.append(', i: true');
                }

                this.loadThumb($thumb);
            } else {

                // if chunked resizing is enabled, hide this thumb so you can't see thumbs of the wrong scale when scrolling
                if (this.isChunkedResizingEnabled()) {
                    $thumb.addClass('outsideScrollArea');
                }

                if (debug) {
                    $label.append(', i: false');
                }
            }
        }

        this.equaliseHeights(thumbsToEqualise);
    }

    isChunkedResizingEnabled(): boolean {
        if (this.options.galleryThumbChunkedResizingEnabled && this.thumbs.length > this.options.galleryThumbChunkedResizingThreshold){
            return true;
        }
        return false;
    }

    equaliseHeights(thumbs): void {

        $(thumbs).find('.wrap').equaliseHeight(false, true);

        //console.log('equalise', thumbs);
        //
        //var unEqualised = [];
        //
        //for (var i = 0; i < thumbs.length; i++){
        //
        //    var thumb = thumbs[i];
        //
        //    if (!$(thumb).data('eq') === true){
        //        //$(thumb).data('eq', true);
        //        unEqualised.push(thumb);
        //        console.log('equalise', i);
        //    }
        //}

        //$(unEqualised).find('.wrap').equaliseHeight(false, true);
    }

    sizeThumb($thumb: JQuery) : void {

        var $wrap = $thumb.find('.wrap');

        var width: number = Number($thumb.data('width'));
        var height: number = Number($thumb.data('height'));

        var $label = $thumb.find('.label');

        var newWidth = Math.floor(width * this.range);
        var newHeight = Math.floor(height * this.range);

        $wrap.outerWidth(newWidth);
        $wrap.outerHeight(newHeight);
        $label.outerWidth(newWidth);
    }

    loadThumb($thumb: JQuery, cb?: (img: JQuery) => void): void {
        var $wrap = $thumb.find('.wrap');

        if ($wrap.hasClass('loading') || $wrap.hasClass('loaded')) return;

        $thumb.removeClass('preLoad');

        // if no img has been added yet

        var visible = $thumb.attr('data-visible');

        var fadeDuration = this.options.thumbsImageFadeInDuration;

        if (visible !== "false") {
            $wrap.addClass('loading');
            var src = $thumb.attr('data-src');
            var img = $('<img class="thumbImage" src="' + src + '" />');
            // fade in on load.
            $(img).hide().load(function () {
                $(this).fadeIn(fadeDuration, function () {
                    $(this).parent().swapClass('loading', 'loaded');
                });
            });

            $wrap.prepend(img);
            if (cb) cb(img);
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
        }, 10);
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
        if (index === -1) return;

        if (!this.thumbs || !this.thumbs.length) return;

        index = parseInt(index);

        this.getAllThumbs().removeClass('selected');

        this.$selectedThumb = this.getThumbByIndex(index);

        this.$selectedThumb.addClass('selected');

        // make sure visible images are loaded.
        this.updateThumbs();
    }

    private _setMultiSelectionEnabled(enabled: boolean): void {
        for (var i = 0; i < this.thumbs.length; i++){
            var thumb: IThumb = this.thumbs[i];
            thumb.multiSelectionEnabled = enabled;
        }
    }

    private _reset(): void {
        this.$thumbs.undelegate('.thumb', 'click');
        this._setMultiSelectionEnabled(this.multiSelectState.enabled);
    }

    getSelectedThumbIndex(): number {
        return Number(this.$selectedThumb.data('index'));
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

        //this.updateThumbs();
    }
}

export = GalleryView;