/// <reference path="../../js/jquery.d.ts" />

import utils = require("../../utils");
import baseExtension = require("../coreplayer-shared-module/baseExtension");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import shell = require("../coreplayer-shared-module/shell");
import baseView = require("../coreplayer-shared-module/baseView");
import IProvider = require("../coreplayer-shared-module/iProvider");
import ISeadragonProvider = require("../../extensions/coreplayer-seadragon-extension/iSeadragonProvider");
import Thumb = require("../coreplayer-shared-module/thumb");

export class GalleryView extends baseView.BaseView {

    $thumbs: JQuery;
    $selectedThumb: JQuery;

    lastThumbClickedIndex: number;

    static THUMB_SELECTED: string = 'galleryView.onThumbSelected';

    public thumbs: Array<Thumb>;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        $.subscribe(baseExtension.BaseExtension.CANVAS_INDEX_CHANGED, (e, index) => {
            this.selectIndex(parseInt(index));
        });

        $.subscribe(extension.Extension.SETTINGS_CHANGED, (e, mode) => {
            this.setLabel();
        });

        this.$thumbs = utils.Utils.createDiv('thumbs');
        this.$element.append(this.$thumbs);

        $.templates({
            galleryThumbsTemplate: '<div class="{{:~className()}}" data-src="{{>url}}" data-visible="{{>visible}}">\
                                <div class="wrap" style="height:{{>height + ~extraHeight()}}px"></div>\
                                <span class="index">{{:#index + 1}}</span>\
                                <span class="label">{{>label}}&nbsp;</span>\
                             </div>'
        });

        var extraHeight = this.options.thumbsExtraHeight;

        $.views.helpers({
            isOdd: function(num){
                return (num % 2 == 0) ? false : true;
            },
            extraHeight: function(){
                return extraHeight;
            },
            className: function(){
                if (this.data.url){
                    return "thumb";
                }

                return "thumb placeholder";
            }
        });

        // use unevent to detect scroll stop.
        this.$element.on('scroll', () => {
            this.loadThumbs();
        }, 1000);

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

            $.publish(GalleryView.THUMB_SELECTED, [data.index]);
        });

        this.selectIndex(this.provider.canvasIndex);

        this.setLabel();

        // do initial load to show padlocks
        this.loadThumbs();
    }

    loadThumbs(): void {

        if (!this.thumbs || !this.thumbs.length) return;

        // test which thumbs are scrolled into view
        var thumbs = this.$thumbs.find('.thumb');
        var scrollTop = this.$element.scrollTop();
        var scrollHeight = this.$element.height();

        for (var i = 0; i < thumbs.length; i++) {

            var $thumb = $(thumbs[i]);
            var thumbTop = $thumb.position().top;
            var thumbBottom = thumbTop + $thumb.height();

            if (thumbBottom >= scrollTop && thumbTop <= scrollTop + scrollHeight){
                this.loadThumb($thumb);
            }
        }
    }

    loadThumb($thumb): void {
        var fadeDuration = this.options.thumbsImageFadeInDuration;

        var $wrap = $thumb.find('.wrap');

        // if no img has been added yet

        var visible = $thumb.attr('data-visible');

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
        } else {
            $wrap.addClass('hidden');
        }
    }

    show(): void {
        this.$element.show();

        setTimeout(() => {
            this.selectIndex(this.provider.canvasIndex);
        }, 1);
    }

    hide(): void {
        this.$element.hide();
    }

    setLabel(): void {

        if((<extension.Extension>this.extension).getMode() == extension.Extension.PAGE_MODE) {
            $(this.$thumbs).find('span.index').hide();
            $(this.$thumbs).find('span.label').show();
        } else {
            $(this.$thumbs).find('span.index').show();
            $(this.$thumbs).find('span.label').hide();
        }
    }

    selectIndex(index): void {

        // may be authenticating
        if (index == -1) return;

        if (!this.thumbs || !this.thumbs.length) return;

        index = parseInt(index);

        this.$thumbs.find('.thumb').removeClass('selected');

        this.$selectedThumb = $(this.$thumbs.find('.thumb')[index]);

        this.$selectedThumb.addClass('selected');

        // scroll to thumb if the index change didn't originate
        // within the thumbs view.
        if (this.lastThumbClickedIndex != index) {
            var scrollTop = this.$element.scrollTop() + this.$selectedThumb.position().top - (this.$selectedThumb.height() / 2);
            this.$element.scrollTop(scrollTop);
        }

        // make sure visible images are loaded.
        this.loadThumbs();
    }

    resize(): void {
        super.resize();

        this.loadThumbs();
    }
}