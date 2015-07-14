import BaseCommands = require("../uv-shared-module/Commands");
import BaseView = require("../uv-shared-module/BaseView");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IProvider = require("../uv-shared-module/IProvider");
import ISeadragonProvider = require("../../extensions/uv-seadragon-extension/ISeadragonProvider");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");
import Shell = require("../uv-shared-module/Shell");
import Thumb = require("../uv-shared-module/Thumb");

class ThumbsView extends BaseView {

    $selectedThumb: JQuery;
    $thumbs: JQuery;
    isCreated: boolean = false;
    isOpen: boolean = false;
    lastThumbClickedIndex: number;

    public thumbs: Thumb[];

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, index) => {
            this.selectIndex(parseInt(index));
        });

        // todo: this should be a setting
        $.subscribe(Commands.MODE_CHANGED, (e, mode) => {
            this.setLabel();
        });

        $.subscribe(BaseCommands.AUTHORIZATION_OCCURRED, () => {
            this.loadThumbs();
        });

        this.$thumbs = $('<div class="thumbs"></div>');
        this.$element.append(this.$thumbs);

        this.$thumbs.addClass(this.provider.getViewingDirection()); // defaults to "left-to-right"

        var that = this;

        $.templates({
            thumbsTemplate: '<div class="{{:~className()}}" data-src="{{>url}}" data-visible="{{>visible}}">\
                                <div class="wrap" style="height:{{>height + ~extraHeight()}}px"></div>\
                                <span class="index">{{:#index + 1}}</span>\
                                <span class="label">{{>label}}&nbsp;</span>\
                             </div>\
                             {{if ~separator()}} \
                                 <div class="separator"></div> \
                             {{/if}}'
        });

        var extraHeight = this.options.thumbsExtraHeight;

        $.views.helpers({
            separator: function(){
                var viewingDirection = that.provider.getViewingDirection();
                if (viewingDirection === "top-to-bottom" || viewingDirection === "bottom-to-top"){
                    return true; // one thumb per line
                }
                // two thumbs per line
                return ((this.data.index -1) % 2 == 0) ? false : true;
            },
            extraHeight: function(){
                return extraHeight;
            },
            className: function(){
                var className = "thumb";

                if (this.data.index === 0){
                    className += " first";
                }

                if (!this.data.url){
                    className += " placeholder";
                }

                var viewingDirection = that.provider.getViewingDirection();
                if (viewingDirection === "top-to-bottom" || viewingDirection === "bottom-to-top"){
                    className += " oneCol";
                } else {
                    className += " twoCol";
                }

                return className;
            }
        });

        // use unevent to detect scroll stop.
        this.$element.on('scroll', () => {
            this.scrollStop();
        }, 1000);

        this.resize();
    }

    public dataBind(): void{
        if (!this.thumbs) return;
        this.createThumbs();
    }

    createThumbs(): void{
        var that = this;

        if (this.isCreated) return;
        if (!this.thumbs) return;

        this.$thumbs.link($.templates.thumbsTemplate, this.thumbs);

        this.$thumbs.delegate(".thumb", "click", function (e) {
            e.preventDefault();

            var data = $.view(this).data;

            that.lastThumbClickedIndex = data.index;

            $.publish(BaseCommands.THUMB_SELECTED, [data.index]);
        });

        this.selectIndex(this.provider.canvasIndex);

        this.setLabel();

        // do initial load to show padlocks
        this.loadThumbs(0);

        this.isCreated = true;
    }

    scrollStop(): void {

        var scrollPos = 1 / ((this.$thumbs.height() - this.$element.height()) / this.$element.scrollTop());

        if (scrollPos > 1) scrollPos = 1;

        var thumbRangeMid = Math.floor((this.thumbs.length - 1) * scrollPos);

        this.loadThumbs(thumbRangeMid);
    }

    loadThumbs(index?: number): void {

        if (!this.thumbs || !this.thumbs.length) return;

        if (_.isUndefined(index)){
            index = this.provider.canvasIndex;
        }

        var thumbRangeMid = index;
        var thumbLoadRange = this.options.thumbsLoadRange;

        var thumbRange = {
            start: (thumbRangeMid > thumbLoadRange) ? thumbRangeMid - thumbLoadRange : 0,
            end: (thumbRangeMid < (this.thumbs.length - 1) - thumbLoadRange) ? thumbRangeMid + thumbLoadRange : this.thumbs.length - 1
        };

        //console.log('start: ' + thumbRange.start + ' end: ' + thumbRange.end);

        var fadeDuration = this.options.thumbsImageFadeInDuration;

        for (var i = thumbRange.start; i <= thumbRange.end; i++) {

            var $thumb = $(this.$thumbs.find('.thumb')[i]);
            var $wrap = $thumb.find('.wrap');

            // if no img has been added yet
            if (!$wrap.hasClass('loading') && !$wrap.hasClass('loaded')) {
                var visible = $thumb.attr('data-visible');

                if (visible !== "false") {
                    $wrap.removeClass('loadingFailed');
                    $wrap.addClass('loading');
                    var src = $thumb.attr('data-src');
                    //console.log(i, src);
                    var img = $('<img src="' + src + '" />');
                    // fade in on load.
                    $(img).hide().load(function () {
                        $(this).fadeIn(fadeDuration, function () {
                            $(this).parent().swapClass('loading', 'loaded');
                        });
                    }).error(function() {
                        $(this).parent().swapClass('loading', 'loadingFailed');
                    });
                    $wrap.append(img);
                } else {
                    $wrap.addClass('hidden');
                }
            }
        }
    }

    show(): void {
        this.isOpen = true;
        this.$element.show();

        setTimeout(() => {
            this.selectIndex(this.provider.canvasIndex);
        }, 1);
    }

    hide(): void {
        this.isOpen = false;
        this.$element.hide();
    }

    isPDF(): boolean{
        return (this.provider.getCanvasType().contains("pdf"));
    }

    setLabel(): void {

        if (this.isPDF()){
            $(this.$thumbs).find('span.index').hide();
            $(this.$thumbs).find('span.label').hide();
        } else {
            if (this.isPageModeEnabled()) {
                $(this.$thumbs).find('span.index').hide();
                $(this.$thumbs).find('span.label').show();
            } else {
                $(this.$thumbs).find('span.index').show();
                $(this.$thumbs).find('span.label').hide();
            }
        }
    }

    isPageModeEnabled(): boolean {
        if (typeof this.extension.getMode === "function") {
            return this.config.options.pageModeEnabled && this.extension.getMode().toString() === Mode.page.toString();
        }
        return this.config.options.pageModeEnabled;
    }

    selectIndex(index: number): void {

        // may be authenticating
        if (index == -1) return;

        if (!this.thumbs || !this.thumbs.length) return;

        this.$thumbs.find('.thumb').removeClass('selected');

        this.$selectedThumb = $(this.$thumbs.find('.thumb')[index]);

        if (this.provider.isPagingSettingEnabled()){
            var indices = this.provider.getPagedIndices(index);

            _.each(indices, (index: number) => {
                $(this.$thumbs.find('.thumb')[index]).addClass('selected');
            });
        } else {
            this.$selectedThumb.addClass('selected');
        }

        // scroll to thumb if the index change didn't originate
        // within the thumbs view.
        if (this.lastThumbClickedIndex != index) {
            this.$element.scrollTop(this.$selectedThumb.position().top);
        }

        // make sure visible images are loaded.
        this.loadThumbs(index);
    }

    resize(): void {
        super.resize();

    }
}

export = ThumbsView;