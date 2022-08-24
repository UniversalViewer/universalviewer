const $ = window.$;
import { AutoComplete } from "../uv-shared-module/AutoComplete";
import { IIIFEvents } from "../../IIIFEvents";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { HeaderPanel } from "../uv-shared-module/HeaderPanel";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Mode } from "../../extensions/uv-openseadragon-extension/Mode";
import { sanitize } from "../../../../Utils";
import { ViewingDirection } from "@iiif/vocabulary/dist-commonjs/";
import { Bools, Strings } from "@edsilv/utils";
import { Canvas, LanguageMap, ManifestType } from "manifesto.js";

export class PagingHeaderPanel extends HeaderPanel {
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
    this.setConfig("pagingHeaderPanel");

    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.canvasIndexChanged(canvasIndex);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.SETTINGS_CHANGE, () => {
      this.modeChanged();
      this.updatePagingToggle();
    });

    this.extensionHost.subscribe(IIIFEvents.CANVAS_INDEX_CHANGE_FAILED, () => {
      this.setSearchFieldValue(this.extension.helper.canvasIndex);
    });

    this.extensionHost.subscribe(IIIFEvents.LEFTPANEL_EXPAND_FULL_START, () => {
      this.openGallery();
    });

    this.extensionHost.subscribe(
      IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START,
      () => {
        this.closeGallery();
      }
    );

    this.$prevOptions = $('<div class="prevOptions"></div>');
    this.$centerOptions.append(this.$prevOptions);

    this.$firstButton = $(`
          <button class="btn imageBtn first" tabindex="0" title="${this.content.first}">
            <i class="uv-icon-first" aria-hidden="true"></i>
            <span class="sr-only">${this.content.first}</span>
          </button>
        `);
    this.$prevOptions.append(this.$firstButton);

    this.$prevButton = $(`
          <button class="btn imageBtn prev" tabindex="0" title="${this.content.previous}">
            <i class="uv-icon-prev" aria-hidden="true"></i>
            <span class="sr-only">${this.content.previous}</span>
          </button>
        `);
    this.$prevOptions.append(this.$prevButton);

    this.$modeOptions = $('<div class="mode"></div>');
    this.$centerOptions.append(this.$modeOptions);

    this.$imageModeLabel = $(
      '<label for="image">' + this.content.image + "</label>"
    );
    this.$modeOptions.append(this.$imageModeLabel);
    this.$imageModeOption = $(
      '<input type="radio" id="image" name="mode" tabindex="0"/>'
    );
    this.$modeOptions.append(this.$imageModeOption);

    this.$pageModeLabel = $('<label for="page"></label>');
    this.$modeOptions.append(this.$pageModeLabel);
    this.$pageModeOption = $(
      '<input type="radio" id="page" name="mode" tabindex="0"/>'
    );
    this.$modeOptions.append(this.$pageModeOption);

    this.$search = $('<div class="search"></div>');
    this.$centerOptions.append(this.$search);

    this.$searchText = $(
      '<input class="searchText" maxlength="50" type="text" tabindex="0" aria-label="' +
        this.content.pageSearchLabel +
        '"/>'
    );
    this.$search.append(this.$searchText);

    if (Bools.getBool(this.options.autoCompleteBoxEnabled, true)) {
      this.$searchText.hide();
      this.$autoCompleteBox = $(
        '<input class="autocompleteText" type="text" maxlength="100" aria-label="' +
          this.content.pageSearchLabel +
          '"/>'
      );
      this.$search.append(this.$autoCompleteBox);

      new AutoComplete(
        this.$autoCompleteBox,
        (term: string, cb: (results: string[]) => void) => {
          const results: string[] = [];
          const canvases: Canvas[] = this.extension.helper.getCanvases();

          // if in page mode, get canvases by label.
          if (this.isPageModeEnabled()) {
            for (let i = 0; i < canvases.length; i++) {
              const canvas: Canvas = canvases[i];
              const label: string | null = LanguageMap.getValue(
                canvas.getLabel()
              );
              if (label && label.startsWith(term)) {
                results.push(label);
              }
            }
          } else {
            // get canvas by index
            for (let i = 0; i < canvases.length; i++) {
              const canvas: Canvas = canvases[i];
              if (canvas.index.toString().startsWith(term)) {
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
        0,
        Bools.getBool(this.options.autocompleteAllowWords, false)
      );
    } else if (Bools.getBool(this.options.imageSelectionBoxEnabled, true)) {
      this.$selectionBoxOptions = $(
        '<div class="image-selectionbox-options"></div>'
      );
      this.$centerOptions.append(this.$selectionBoxOptions);
      this.$imageSelectionBox = $(
        '<select class="image-selectionbox" name="image-select" tabindex="0" ></select>'
      );
      this.$selectionBoxOptions.append(this.$imageSelectionBox);

      for (
        let imageIndex = 0;
        imageIndex < this.extension.helper.getTotalCanvases();
        imageIndex++
      ) {
        const canvas: Canvas = this.extension.helper.getCanvasByIndex(
          imageIndex
        );
        const label: string = sanitize(
          <string>(
            LanguageMap.getValue(
              canvas.getLabel(),
              this.extension.helper.options.locale
            )
          )
        );
        this.$imageSelectionBox.append(
          "<option value=" + imageIndex + ">" + label + "</option>"
        );
      }

      this.$imageSelectionBox.change(() => {
        const imageIndex: number = parseInt(this.$imageSelectionBox.val());
        this.extensionHost.publish(
          OpenSeadragonExtensionEvents.IMAGE_SEARCH,
          imageIndex
        );
      });
    }

    this.$total = $('<span class="total"></span>');
    this.$search.append(this.$total);

    this.$searchButton = $(
      `<a class="go btn btn-primary" tabindex="0">${this.content.go}</a>`
    );
    this.$search.append(this.$searchButton);

    this.$nextOptions = $('<div class="nextOptions"></div>');
    this.$centerOptions.append(this.$nextOptions);

    this.$nextButton = $(`
          <button class="btn imageBtn next" tabindex="0" title="${this.content.next}">
            <i class="uv-icon-next" aria-hidden="true"></i>
            <span class="sr-only">${this.content.next}</span>
          </button>
        `);
    this.$nextOptions.append(this.$nextButton);

    this.$lastButton = $(`
          <button class="btn imageBtn last" tabindex="0" title="${this.content.last}">
            <i class="uv-icon-last" aria-hidden="true"></i>
            <span class="sr-only">${this.content.last}</span>
          </button>
        `);
    this.$nextOptions.append(this.$lastButton);

    if (this.isPageModeEnabled()) {
      this.$pageModeOption.attr("checked", "checked");
      this.$pageModeOption.removeAttr("disabled");
      this.$pageModeLabel.removeClass("disabled");
    } else {
      this.$imageModeOption.attr("checked", "checked");
      // disable page mode option.
      this.$pageModeOption.attr("disabled", "disabled");
      this.$pageModeLabel.addClass("disabled");
    }

    if (this.extension.helper.getManifestType() === ManifestType.MANUSCRIPT) {
      this.$pageModeLabel.text(this.content.folio);
    } else {
      this.$pageModeLabel.text(this.content.page);
    }

    this.$galleryButton = $(`
          <button class="btn imageBtn gallery" title="${this.content.gallery}">
            <i class="uv-icon-gallery" aria-hidden="true"></i>
            <span class="sr-only">${this.content.gallery}</span>
          </button>
        `);
    this.$rightOptions.prepend(this.$galleryButton);

    this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
    this.$rightOptions.prepend(this.$pagingToggleButtons);

    this.$oneUpButton = $(`
          <button class="btn imageBtn one-up" title="${this.content.oneUp}">
            <i class="uv-icon-one-up" aria-hidden="true"></i>
            <span class="sr-only">${this.content.oneUp}</span>
          </button>`);
    this.$pagingToggleButtons.append(this.$oneUpButton);

    this.$twoUpButton = $(`
          <button class="btn imageBtn two-up" title="${this.content.twoUp}">
            <i class="uv-icon-two-up" aria-hidden="true"></i>
            <span class="sr-only">${this.content.twoUp}</span>
          </button>
        `);
    this.$pagingToggleButtons.append(this.$twoUpButton);

    this.updatePagingToggle();
    this.updateGalleryButton();

    this.$oneUpButton.onPressed(() => {
      const enabled: boolean = false;
      this.updateSettings({ pagingEnabled: enabled });
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        enabled
      );
    });

    this.$twoUpButton.onPressed(() => {
      const enabled: boolean = true;
      this.updateSettings({ pagingEnabled: enabled });
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        enabled
      );
    });

    this.$galleryButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL);
    });

    this.setNavigationTitles();
    this.setTotal();

    let viewingDirection: ViewingDirection =
      this.extension.helper.getViewingDirection() ||
      ViewingDirection.LEFT_TO_RIGHT;

    // check if the book has more than one page, otherwise hide prev/next options.
    if (this.extension.helper.getTotalCanvases() === 1) {
      this.$centerOptions.hide();
    }

    // ui event handlers.
    this.$firstButton.onPressed(() => {
      switch (viewingDirection.toString()) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.TOP_TO_BOTTOM:
        case ViewingDirection.BOTTOM_TO_TOP:
          this.extensionHost.publish(IIIFEvents.FIRST);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.extensionHost.publish(IIIFEvents.LAST);
          break;
      }
    });

    this.$prevButton.onPressed(() => {
      switch (viewingDirection.toString()) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.BOTTOM_TO_TOP:
        case ViewingDirection.TOP_TO_BOTTOM:
          this.extensionHost.publish(IIIFEvents.PREV);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.extensionHost.publish(IIIFEvents.NEXT);
          break;
      }
    });

    this.$nextButton.onPressed(() => {
      switch (viewingDirection.toString()) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.BOTTOM_TO_TOP:
        case ViewingDirection.TOP_TO_BOTTOM:
          this.extensionHost.publish(IIIFEvents.NEXT);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.extensionHost.publish(IIIFEvents.PREV);
          break;
      }
    });

    this.$lastButton.onPressed(() => {
      switch (viewingDirection.toString()) {
        case ViewingDirection.LEFT_TO_RIGHT:
        case ViewingDirection.TOP_TO_BOTTOM:
        case ViewingDirection.BOTTOM_TO_TOP:
          this.extensionHost.publish(IIIFEvents.LAST);
          break;
        case ViewingDirection.RIGHT_TO_LEFT:
          this.extensionHost.publish(IIIFEvents.FIRST);
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
      this.$imageModeOption.on("click", () => {
        this.extensionHost.publish(
          OpenSeadragonExtensionEvents.MODE_CHANGE,
          Mode.image.toString()
        );
      });

      this.$pageModeOption.on("click", () => {
        this.extensionHost.publish(
          OpenSeadragonExtensionEvents.MODE_CHANGE,
          Mode.page.toString()
        );
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
      if (this.options.autoCompleteBoxEnabled) {
        this.search(this.$autoCompleteBox.val());
      } else {
        this.search(this.$searchText.val());
      }
    });

    if (this.options.modeOptionsEnabled === false) {
      this.$modeOptions.hide();
      this.$centerOptions.addClass("modeOptionsDisabled");
    }

    // Search is shown as default
    if (
      this.options.imageSelectionBoxEnabled === true &&
      this.options.autoCompleteBoxEnabled !== true
    ) {
      this.$search.hide();
    }

    if (this.options.helpEnabled === false) {
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

    if (!Bools.getBool(this.options.pagingToggleEnabled, true)) {
      this.$pagingToggleButtons.hide();
    }
  }

  openGallery(): void {
    this.$oneUpButton.removeClass("on");
    this.$twoUpButton.removeClass("on");
    this.$galleryButton.addClass("on");
  }

  closeGallery(): void {
    this.updatePagingToggle();
    this.$galleryButton.removeClass("on");
  }

  isPageModeEnabled(): boolean {
    return (
      this.config.options.pageModeEnabled &&
      (<OpenSeadragonExtension>this.extension).getMode().toString() ===
        Mode.page.toString()
    );
  }

  setNavigationTitles(): void {
    if (this.isPageModeEnabled()) {
      if (this.extension.helper.isRightToLeft()) {
        this.$firstButton.prop("title", this.content.lastPage);
        this.$firstButton.find("span").text(this.content.lastPage);
        this.$prevButton.prop("title", this.content.nextPage);
        this.$prevButton.find("span").text(this.content.nextPage);
        this.$nextButton.prop("title", this.content.previousPage);
        this.$nextButton.find("span").text(this.content.previousPage);
        this.$lastButton.prop("title", this.content.firstPage);
        this.$lastButton.find("span").text(this.content.firstPage);
      } else {
        this.$firstButton.prop("title", this.content.firstPage);
        this.$firstButton.find("span").text(this.content.firstPage);
        this.$prevButton.prop("title", this.content.previousPage);
        this.$prevButton.find("span").text(this.content.previousPage);
        this.$nextButton.prop("title", this.content.nextPage);
        this.$nextButton.find("span").text(this.content.nextPage);
        this.$lastButton.prop("title", this.content.lastPage);
        this.$lastButton.find("span").text(this.content.lastPage);
      }
    } else {
      if (this.extension.helper.isRightToLeft()) {
        this.$firstButton.prop("title", this.content.lastImage);
        this.$firstButton.find("span").text(this.content.lastPage);
        this.$prevButton.prop("title", this.content.nextImage);
        this.$prevButton.find("span").text(this.content.nextImage);
        this.$nextButton.prop("title", this.content.previousImage);
        this.$nextButton.find("span").text(this.content.previousImage);
        this.$lastButton.prop("title", this.content.firstImage);
        this.$lastButton.find("span").text(this.content.firstImage);
      } else {
        this.$firstButton.prop("title", this.content.firstImage);
        this.$firstButton.find("span").text(this.content.firstImage);
        this.$prevButton.prop("title", this.content.previousImage);
        this.$prevButton.find("span").text(this.content.previousImage);
        this.$nextButton.prop("title", this.content.nextImage);
        this.$nextButton.find("span").text(this.content.nextImage);
        this.$lastButton.prop("title", this.content.lastImage);
        this.$lastButton.find("span").text(this.content.lastImage);
      }
    }
  }

  updatePagingToggle(): void {
    if (!this.pagingToggleIsVisible()) {
      this.$pagingToggleButtons.hide();
      return;
    }

    if ((<OpenSeadragonExtension>this.extension).isPagingSettingEnabled()) {
      this.$oneUpButton.removeClass("on");
      this.$twoUpButton.addClass("on");
    } else {
      this.$twoUpButton.removeClass("on");
      this.$oneUpButton.addClass("on");
    }
  }

  pagingToggleIsVisible(): boolean {
    return (
      Bools.getBool(this.options.pagingToggleEnabled, true) &&
      this.extension.helper.isPagingAvailable()
    );
  }

  updateGalleryButton(): void {
    if (!this.galleryIsVisible()) {
      this.$galleryButton.hide();
    }
  }

  galleryIsVisible(): boolean {
    return (
      Bools.getBool(this.options.galleryButtonEnabled, true) &&
      this.extension.isLeftPanelEnabled()
    );
  }

  setTotal(): void {
    const of: string = this.content.of;

    if (this.isPageModeEnabled()) {
      this.$total.html(
        Strings.format(of, this.extension.helper.getLastCanvasLabel(true))
      );
    } else {
      this.$total.html(
        Strings.format(of, this.extension.helper.getTotalCanvases().toString())
      );
    }
  }

  setSearchFieldValue(index: number): void {
    const canvas: Canvas = this.extension.helper.getCanvasByIndex(index);
    let value: string | null = null;

    if (this.isPageModeEnabled()) {
      const orderLabel: string = <string>(
        LanguageMap.getValue(canvas.getLabel())
      );

      if (orderLabel === "-") {
        value = "";
      } else {
        value = orderLabel;
      }
    } else {
      index += 1;
      value = index.toString();
    }

    if (this.options.autoCompleteBoxEnabled) {
      this.$autoCompleteBox.val(value);
    } else {
      this.$searchText.val(value);
    }
  }

  search(value: string): void {
    if (!value) {
      this.extension.showMessage(this.content.emptyValue);
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);

      return;
    }

    if (this.isPageModeEnabled()) {
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGE_SEARCH,
        value
      );
    } else {
      let index: number;

      if (this.options.autoCompleteBoxEnabled) {
        index = parseInt(this.$autoCompleteBox.val(), 10);
      } else {
        index = parseInt(this.$searchText.val(), 10);
      }

      index -= 1;

      if (isNaN(index)) {
        this.extension.showMessage(
          this.extension.data.config.modules.genericDialogue.content
            .invalidNumber
        );
        this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
        return;
      }

      const asset: Canvas = this.extension.helper.getCanvasByIndex(index);

      if (!asset) {
        this.extension.showMessage(
          this.extension.data.config.modules.genericDialogue.content
            .pageNotFound
        );
        this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE_FAILED);
        return;
      }

      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.IMAGE_SEARCH,
        index
      );
    }
  }

  canvasIndexChanged(index: any): void {
    this.setSearchFieldValue(index);

    if (
      this.options.imageSelectionBoxEnabled === true &&
      this.options.autoCompleteBoxEnabled !== true
    ) {
      this.$imageSelectionBox.val(index);
    }

    const viewingDirection: ViewingDirection =
      this.extension.helper.getViewingDirection() ||
      ViewingDirection.LEFT_TO_RIGHT;

    if (viewingDirection === ViewingDirection.RIGHT_TO_LEFT) {
      if (this.extension.helper.isFirstCanvas()) {
        this.disableLastButton();
        this.disableNextButton();
      } else {
        this.enableLastButton();
        this.enableNextButton();
      }

      if (this.extension.helper.isLastCanvas()) {
        this.disableFirstButton();
        this.disablePrevButton();
      } else {
        this.enableFirstButton();
        this.enablePrevButton();
      }
    } else {
      if (this.extension.helper.isFirstCanvas()) {
        this.disableFirstButton();
        this.disablePrevButton();
      } else {
        this.enableFirstButton();
        this.enablePrevButton();
      }

      if (this.extension.helper.isLastCanvas()) {
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
    this.$lastButton.enable();
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
    this.setNavigationTitles();
    this.setTotal();
  }

  resize(): void {
    super.resize();

    // hide toggle buttons below minimum width
    if (
      this.extension.width() <
      this.extension.data.config.options.minWidthBreakPoint
    ) {
      if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.hide();
      if (this.galleryIsVisible()) this.$galleryButton.hide();
    } else {
      if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.show();
      if (this.galleryIsVisible()) this.$galleryButton.show();
    }
  }
}
