import AutoComplete = require("../uv-shared-module/AutoComplete");
import BaseCommands = require("../uv-shared-module/BaseCommands");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import HeaderPanel = require("../uv-shared-module/HeaderPanel");
import HelpDialogue = require("../uv-dialogues-module/HelpDialogue");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");

class PagingHeaderPanel extends HeaderPanel {

    $autoCompleteBox: JQuery;
    $firstButton: JQuery;
    $galleryButton: JQuery;
    $imageModeLabel: JQuery;
    $imageModeOption: JQuery;
    $imageSelectionBox: JQuery;
    $lastButton: JQuery;
    $modeOptions: JQuery;
    $nextButton: JQuery;
    $nextOptions: JQuery;
    $oneUpButton: JQuery;
    $pageModeLabel: JQuery;
    $pageModeOption: JQuery;
    $pagingToggleButtons: JQuery;
    $prevButton: JQuery;
    $prevOptions: JQuery;
    $search: JQuery;
    $searchButton: JQuery;
    $searchText: JQuery;
    $selectionBoxOptions: JQuery;
    $total: JQuery;
    $twoUpButton: JQuery;

    firstButtonEnabled: boolean = false;
    lastButtonEnabled: boolean = false;
    nextButtonEnabled: boolean = false;
    prevButtonEnabled: boolean = false;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pagingHeaderPanel');

        super.create();

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.canvasIndexChanged(canvasIndex);
        });

        $.subscribe(BaseCommands.SETTINGS_CHANGED, (e) => {
            this.modeChanged();
            this.updatePagingToggle();
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGE_FAILED, (e) => {
            this.setSearchFieldValue(this.extension.helper.canvasIndex);
        });
        
        $.subscribe(BaseCommands.LEFTPANEL_EXPAND_FULL_START, (e) => {
            this.openGallery();
        });

        $.subscribe(BaseCommands.LEFTPANEL_COLLAPSE_FULL_START, (e) => {
            this.closeGallery();
        });

        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);

        this.$firstButton = $('<a class="imageBtn first" tabindex="0"></a>');
        this.$prevOptions.append(this.$firstButton);

        this.$prevButton = $('<a class="imageBtn prev" tabindex="0"></a>');
        this.$prevOptions.append(this.$prevButton);

        this.$modeOptions = $('<div class="mode"></div>');
        this.$centerOptions.append(this.$modeOptions);

        this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
        this.$modeOptions.append(this.$imageModeLabel);
        this.$imageModeOption = $('<input type="radio" id="image" name="mode" tabindex="0"/>');
        this.$modeOptions.append(this.$imageModeOption);

        this.$pageModeLabel = $('<label for="page"></label>');
        this.$modeOptions.append(this.$pageModeLabel);
        this.$pageModeOption = $('<input type="radio" id="page" name="mode" tabindex="0"/>');
        this.$modeOptions.append(this.$pageModeOption);

        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);

        this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="0"/>');
        this.$search.append(this.$searchText);

        if (Utils.Bools.getBool(this.options.autoCompleteBoxEnabled, true)) {
            this.$searchText.hide();
            this.$autoCompleteBox = $('<input class="autocompleteText" type="text" maxlength="100" />');
            this.$search.append(this.$autoCompleteBox);

            new AutoComplete(this.$autoCompleteBox,
                (term: string, cb: (results: string[]) => void) => {
                    var results: string[] = [];
                    var canvases: Manifesto.ICanvas[] = this.extension.helper.getCanvases();

                    // if in page mode, get canvases by label.
                    if (this.isPageModeEnabled()){
                        for (var i = 0; i < canvases.length; i++){
                            var canvas: Manifesto.ICanvas = canvases[i];
                            var label: string = Manifesto.TranslationCollection.getValue(canvas.getLabel());
                            if (label.startsWith(term)){
                                results.push(label);
                            }
                        }
                    } else {
                        // get canvas by index
                        for (var i = 0; i < canvases.length; i++){
                            var canvas: Manifesto.ICanvas = canvases[i];
                            if (canvas.index.toString().startsWith(term)){
                                results.push(canvas.index.toString());
                            }
                        }
                    }
                    cb(results);
                },
                (results: any) => {
                    return results;
                },
                (terms: string) => {
                    this.search(terms);
                },
                300,
                0
            );
        } else if (Utils.Bools.getBool(this.options.imageSelectionBoxEnabled, true)) {
            this.$selectionBoxOptions = $('<div class="image-selectionbox-options"></div>');
            this.$centerOptions.append(this.$selectionBoxOptions);
            this.$imageSelectionBox = $('<select class="image-selectionbox" name="image-select" tabindex="0" ></select>');
            this.$selectionBoxOptions.append(this.$imageSelectionBox);

            for (var imageIndex = 0; imageIndex < this.extension.helper.getTotalCanvases(); imageIndex++) {
                var canvas: Manifesto.ICanvas = this.extension.helper.getCanvasByIndex(imageIndex);
                var label: string = this.extension.sanitize(Manifesto.TranslationCollection.getValue(canvas.getLabel()));
                this.$imageSelectionBox.append('<option value=' + (imageIndex) + '>' + label + '</option>')
            }

            this.$imageSelectionBox.change(() => {
                var imageIndex = parseInt(this.$imageSelectionBox.val());
                $.publish(Commands.IMAGE_SEARCH, [imageIndex]);
            });
        }

        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);

        this.$searchButton = $('<a class="go btn btn-primary" tabindex="0">' + this.content.go + '</a>');
        this.$search.append(this.$searchButton);

        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);

        this.$nextButton = $('<a class="imageBtn next" tabindex="0"></a>');
        this.$nextOptions.append(this.$nextButton);

        this.$lastButton = $('<a class="imageBtn last" tabindex="0"></a>');
        this.$nextOptions.append(this.$lastButton);

        if (this.isPageModeEnabled()) {
            this.$pageModeOption.attr('checked', 'checked');
            this.$pageModeOption.removeAttr('disabled');
            this.$pageModeLabel.removeClass('disabled');
        } else {
            this.$imageModeOption.attr('checked', 'checked');
            // disable page mode option.
            this.$pageModeOption.attr('disabled', 'disabled');
            this.$pageModeLabel.addClass('disabled');
        }

        if (this.extension.helper.getManifestType().toString() === manifesto.ManifestType.manuscript().toString()){
            this.$pageModeLabel.text(this.content.folio);
        } else {
            this.$pageModeLabel.text(this.content.page);
        }

        this.$galleryButton = $('<a class="imageBtn gallery" title="' + this.content.gallery + '" tabindex="0"></a>');
        this.$rightOptions.prepend(this.$galleryButton);

        this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
        this.$rightOptions.prepend(this.$pagingToggleButtons);

        this.$oneUpButton = $('<a class="imageBtn one-up" title="' + this.content.oneUp + '" tabindex="0"></a>');
        this.$pagingToggleButtons.append(this.$oneUpButton);

        this.$twoUpButton = $('<a class="imageBtn two-up" title="' + this.content.twoUp + '" tabindex="0"></a>');
        this.$pagingToggleButtons.append(this.$twoUpButton);

        this.updatePagingToggle();
        this.updateGalleryButton();

        this.$oneUpButton.onPressed(() => {
            var enabled: boolean = false;
            this.updateSettings({ pagingEnabled: enabled });
            $.publish(Commands.PAGING_TOGGLED, [enabled]);
        });

        this.$twoUpButton.onPressed(() => {
            var enabled: boolean = true;
            this.updateSettings({ pagingEnabled: enabled });
            $.publish(Commands.PAGING_TOGGLED, [enabled]);
        });

        this.$galleryButton.onPressed(() => {
            $.publish(BaseCommands.TOGGLE_EXPAND_LEFT_PANEL);
        });

        this.setTitles();

        this.setTotal();

        var viewingDirection: Manifesto.ViewingDirection = this.extension.helper.getViewingDirection();

        // check if the book has more than one page, otherwise hide prev/next options.
        if (this.extension.helper.getTotalCanvases() === 1) {
            this.$centerOptions.hide();
        }

        // ui event handlers.
        this.$firstButton.onPressed(() => {
            switch (viewingDirection.toString()) {
                case manifesto.ViewingDirection.leftToRight().toString() :
                case manifesto.ViewingDirection.topToBottom().toString() :
                case manifesto.ViewingDirection.bottomToTop().toString() :
                    $.publish(Commands.FIRST);
                    break;
                case manifesto.ViewingDirection.rightToLeft().toString() :
                    $.publish(Commands.LAST);
                    break;
            }
        });

        this.$prevButton.onPressed(() => {
            switch (viewingDirection.toString()) {
                case manifesto.ViewingDirection.leftToRight().toString() :
                case manifesto.ViewingDirection.bottomToTop().toString() :
                case manifesto.ViewingDirection.topToBottom().toString() :
                    $.publish(Commands.PREV);
                    break;
                case manifesto.ViewingDirection.rightToLeft().toString() :
                    $.publish(Commands.NEXT);
                    break;
            }
        });

        this.$nextButton.onPressed(() => {
            switch (viewingDirection.toString()) {
                case manifesto.ViewingDirection.leftToRight().toString() :
                case manifesto.ViewingDirection.bottomToTop().toString() :
                case manifesto.ViewingDirection.topToBottom().toString() :
                    $.publish(Commands.NEXT);
                    break;
                case manifesto.ViewingDirection.rightToLeft().toString() :
                    $.publish(Commands.PREV);
                    break;
            }
        });

        this.$lastButton.onPressed(() => {
            switch (viewingDirection.toString()) {
                case manifesto.ViewingDirection.leftToRight().toString() :
                case manifesto.ViewingDirection.topToBottom().toString() :
                case manifesto.ViewingDirection.bottomToTop().toString() :
                    $.publish(Commands.LAST);
                    break;
                case manifesto.ViewingDirection.rightToLeft().toString() :
                    $.publish(Commands.FIRST);
                    break;
            }
        });

        // If page mode is disabled, we don't need to show radio buttons since
        // there is only one option:
        if (!this.config.options.pageModeEnabled) {
            this.$imageModeOption.hide();
            this.$pageModeLabel.hide();
            this.$pageModeOption.hide();
        } else {
            // Only activate click actions for mode buttons when controls are
            // visible, since otherwise, clicking on the "Image" label can
            // trigger unexpected/undesired side effects.
            this.$imageModeOption.on('click', (e) => {
                $.publish(Commands.MODE_CHANGED, [Mode.image.toString()]);
            });

            this.$pageModeOption.on('click', (e) => {
                $.publish(Commands.MODE_CHANGED, [Mode.page.toString()]);
            });
        }

        this.$searchText.onEnter(() => {
            this.$searchText.blur();
            this.search(this.$searchText.val());
        });

        this.$searchText.click(function() {
            $(this).select();
        });

        this.$searchButton.onPressed(() => {
            if (this.options.autoCompleteBoxEnabled){
                this.search(this.$autoCompleteBox.val());
            } else {
                this.search(this.$searchText.val());
            }
        });

        if (this.options.modeOptionsEnabled === false){
            this.$modeOptions.hide();
            this.$centerOptions.addClass('modeOptionsDisabled');
        }

        // Search is shown as default
        if (this.options.imageSelectionBoxEnabled === true && this.options.autoCompleteBoxEnabled !== true){
            this.$search.hide();
        }

        if (this.options.helpEnabled === false){
            this.$helpButton.hide();
        }

        // todo: discuss on community call
        // Get visible element in centerOptions with greatest tabIndex
        // var $elementWithGreatestTabIndex: JQuery = this.$centerOptions.getVisibleElementWithGreatestTabIndex();

        // // cycle focus back to start.
        // if ($elementWithGreatestTabIndex) {
        //     $elementWithGreatestTabIndex.blur(() => {
        //         if (this.extension.tabbing && !this.extension.shifted) {
        //             this.$nextButton.focus();
        //         }
        //     });
        // }

        // this.$nextButton.blur(() => {
        //     if (this.extension.tabbing && this.extension.shifted) {
        //         setTimeout(() => {
        //             $elementWithGreatestTabIndex.focus();
        //         }, 100);
        //     }
        // });

        if (!Utils.Bools.getBool(this.options.pagingToggleEnabled, true)){
            this.$pagingToggleButtons.hide();
        }
    }

    openGallery(): void {
        this.$oneUpButton.removeClass('on');
        this.$twoUpButton.removeClass('on');
        this.$galleryButton.addClass('on');
    }

    closeGallery(): void {
        this.updatePagingToggle();
        this.$galleryButton.removeClass('on');
    }

    isPageModeEnabled(): boolean {
        return this.config.options.pageModeEnabled && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
    }

    setTitles(): void {

        if (this.isPageModeEnabled()){
            this.$firstButton.prop('title', this.content.firstPage);
            this.$prevButton.prop('title', this.content.previousPage);
            this.$nextButton.prop('title', this.content.nextPage);
            this.$lastButton.prop('title', this.content.lastPage);
        } else {
            this.$firstButton.prop('title', this.content.firstImage);
            this.$prevButton.prop('title', this.content.previousImage);
            this.$nextButton.prop('title', this.content.nextImage);
            this.$lastButton.prop('title', this.content.lastImage);
        }

        this.$searchButton.prop('title', this.content.go);
    }

    updatePagingToggle(): void {
        if (!this.pagingToggleIsVisible()){
            this.$pagingToggleButtons.hide();
            return;
        }

        if ((<ISeadragonExtension>this.extension).isPagingSettingEnabled()){
            this.$oneUpButton.removeClass('on');
            this.$twoUpButton.addClass('on');
        } else {
            this.$twoUpButton.removeClass('on');
            this.$oneUpButton.addClass('on');
        }
    }

    pagingToggleIsVisible(): boolean {
        return Utils.Bools.getBool(this.options.pagingToggleEnabled, true) && this.extension.helper.isPagingAvailable();
    }

    updateGalleryButton(): void {
        if (!this.galleryIsVisible()){
            this.$galleryButton.hide();
        }
    }

    galleryIsVisible(): boolean {
        return Utils.Bools.getBool(this.options.galleryButtonEnabled, true) && this.extension.isLeftPanelEnabled();
    }

    setTotal(): void {

        var of = this.content.of;

        if (this.isPageModeEnabled()) {
            this.$total.html(String.format(of, this.extension.helper.getLastCanvasLabel(true)));
        } else {
            this.$total.html(String.format(of, this.extension.helper.getTotalCanvases()));
        }
    }

    setSearchFieldValue(index): void {

        var canvas: Manifesto.ICanvas = this.extension.helper.getCanvasByIndex(index);
        var value: string;

        if (this.isPageModeEnabled()) {

            var orderLabel: string = Manifesto.TranslationCollection.getValue(canvas.getLabel());

            if (orderLabel === "-") {
                value = "";
            } else {
                value = orderLabel;
            }
        } else {
            index += 1;
            value = index;
        }

        if (this.options.autoCompleteBoxEnabled){
            this.$autoCompleteBox.val(value);
        } else {
            this.$searchText.val(value);
        }
    }

    search(value: string): void {

        if (!value) {

            this.extension.showMessage(this.content.emptyValue);
            $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);

            return;
        }

        if (this.isPageModeEnabled()) {
            $.publish(Commands.PAGE_SEARCH, [value]);
        } else {
            var index: number;

            if (this.options.autoCompleteBoxEnabled){
                index = parseInt(this.$autoCompleteBox.val(), 10);
            } else {
                index = parseInt(this.$searchText.val(), 10);
            }

            index -= 1;

            if (isNaN(index)){
                this.extension.showMessage(this.extension.config.modules.genericDialogue.content.invalidNumber);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }

            var asset = this.extension.helper.getCanvasByIndex(index);

            if (!asset){
                this.extension.showMessage(this.extension.config.modules.genericDialogue.content.pageNotFound);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }

            $.publish(Commands.IMAGE_SEARCH, [index]);
        }
    }

    canvasIndexChanged(index: any): void {
        this.setSearchFieldValue(index);

        if (this.options.imageSelectionBoxEnabled === true && this.options.autoCompleteBoxEnabled !== true) {
            this.$imageSelectionBox.val(index);
        }

        var viewingDirection: Manifesto.ViewingDirection = this.extension.helper.getViewingDirection();

        if (viewingDirection.toString() === manifesto.ViewingDirection.rightToLeft().toString()) {
            if (this.extension.helper.isFirstCanvas()){
                this.disableLastButton();
                this.disableNextButton();
            } else {
                this.enableLastButton();
                this.enableNextButton();
            }

            if (this.extension.helper.isLastCanvas()){
                this.disableFirstButton();
                this.disablePrevButton();
            } else {
                this.enableFirstButton();
                this.enablePrevButton();
            }
        } else {
            if (this.extension.helper.isFirstCanvas()){
                this.disableFirstButton();
                this.disablePrevButton();
            } else {
                this.enableFirstButton();
                this.enablePrevButton();
            }

            if (this.extension.helper.isLastCanvas()){
                this.disableLastButton();
                this.disableNextButton();
            } else {
                this.enableLastButton();
                this.enableNextButton();
            }
        }
    }

    disableFirstButton(): void {
        this.firstButtonEnabled = false;
        this.$firstButton.disable();
    }

    enableFirstButton(): void {
        this.firstButtonEnabled = true;
        this.$firstButton.enable();
    }

    disableLastButton(): void {
        this.lastButtonEnabled = false;
        this.$lastButton.disable();
    }

    enableLastButton(): void {
        this.lastButtonEnabled = true;
        this.$lastButton.enable()
    }

    disablePrevButton(): void {
        this.prevButtonEnabled = false;
        this.$prevButton.disable();
    }

    enablePrevButton(): void {
        this.prevButtonEnabled = true;
        this.$prevButton.enable();
    }

    disableNextButton(): void {
        this.nextButtonEnabled = false;
        this.$nextButton.disable();
    }

    enableNextButton(): void {
        this.nextButtonEnabled = true;
        this.$nextButton.enable();
    }

    modeChanged(): void {
        this.setSearchFieldValue(this.extension.helper.canvasIndex);
        this.setTitles();
        this.setTotal();
    }

    resize(): void {
        super.resize();

        // hide toggle buttons below minimum width
        if (this.extension.width() < this.extension.config.options.minWidthBreakPoint){
            if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.hide();
            if (this.galleryIsVisible()) this.$galleryButton.hide();
        } else {
            if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.show();
            if (this.galleryIsVisible()) this.$galleryButton.show();
        }
    }
}

export = PagingHeaderPanel;