const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { HeaderPanel } from "../uv-shared-module/HeaderPanel";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Mode } from "../../extensions/uv-openseadragon-extension/Mode";
import { Bools } from "@edsilv/utils";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";
import GoTo from "./GoTo";
import Search from "./Search";
import { createElement } from "react";

export class PagingHeaderPanel extends HeaderPanel<
  Config["modules"]["pagingHeaderPanel"]
> {
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

    this.extensionHost.subscribe(IIIFEvents.LEFTPANEL_EXPAND_FULL_START, () => {
      this.openGallery();
    });

    this.extensionHost.subscribe(
      IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START,
      () => {
        this.closeGallery();
      }
    );

      this.$galleryButton = $(`
          <button class="btn imageBtn gallery" title="${this.content.gallery}">
            <i class="uv-icon-gallery" aria-hidden="true"></i>
            <span class="sr-only">${this.content.gallery}</span>
          </button>
        `);
    this.$rightOptions.prepend(this.$galleryButton);

    this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
    this.$rightOptions.prepend(this.$pagingToggleButtons);

    this.leftOptionsRoot.render(
      createElement(
        "div",
        {
          className: "pagingHeaderPanelLeftOptions",
        },

        [
          ...(this.extension.helper.getTotalCanvases() > 1
            ? [
                createElement(GoTo, {
                  key: "goto",
                  helper: this.extension.helper,
                  extensionHost: this.extensionHost,
                  content: this.content,
                  options: this.options,
                }),
              ]
            : []),
          ...(this.isSearchEnabled()
            ? [
                createElement(Search, {
                  key: "search",
                  extension: this.extension as OpenSeadragonExtension,
                  extensionHost: this.extensionHost,
                  content: this.content,
                  options: this.options,
                }),
              ]
            : []),
        ]
      )
    );

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

  resize(): void {
    super.resize();

    // hide toggle buttons below minimum width
    if (this.extension.isMobileMetric()) {
      if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.hide();
      if (this.galleryIsVisible()) this.$galleryButton.hide();
    } else {
      if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.show();
      if (this.galleryIsVisible()) this.$galleryButton.show();
    }
  }

  isSearchEnabled(): boolean {
    return (<OpenSeadragonExtension>this.extension).isSearchEnabled();
  }
}
