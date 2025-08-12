const $ = require("jquery");
import { isVisible } from "../../../../Utils";
import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseView } from "./BaseView";
import { GenericDialogue } from "./GenericDialogue";

export class Shell extends BaseView<BaseConfig> {
  public $centerPanel: JQuery;
  public $element: JQuery;
  public $footerPanel: JQuery;
  public $genericDialogue: JQuery;
  public $headerPanel: JQuery;
  public $leftPanel: JQuery;
  public $mainPanel: JQuery;
  public $mobileFooterPanel: JQuery;
  public $overlays: JQuery;
  public $rightPanel: JQuery;

  constructor($element: JQuery) {
    super($element, true, true);
  }

  create(): void {
    super.create();

    this.extensionHost.subscribe(IIIFEvents.SHOW_OVERLAY, () => {
      this.$overlays.show();
    });

    this.extensionHost.subscribe(IIIFEvents.HIDE_OVERLAY, () => {
      this.$overlays.hide();
    });

    // Jump link
    this.$element.append(
      '<a class="sr-only" href="#download-btn">' +
        this.extension.data.config!.content.skipToDownload +
        "</a>"
    );

    this.$headerPanel = $('<div class="headerPanel"></div>');
    this.$element.append(this.$headerPanel);

    this.$mainPanel = $('<div class="mainPanel"></div>');
    this.$element.append(this.$mainPanel);

    this.$centerPanel = $('<div class="centerPanel"></div>');
    this.$centerPanel.append(
      '<h2 class="sr-only">' +
        this.extension.data.config!.content.mediaViewer +
        "</h2>"
    );
    this.$mainPanel.append(this.$centerPanel);

    this.$leftPanel = $('<div class="leftPanel"></div>');
    this.$mainPanel.append(this.$leftPanel);

    this.$rightPanel = $('<div class="rightPanel"></div>');
    this.$mainPanel.append(this.$rightPanel);

    this.$footerPanel = $('<div class="footerPanel"></div>');
    this.$element.append(this.$footerPanel);

    this.$mobileFooterPanel = $('<div class="mobileFooterPanel"></div>');
    this.$element.append(this.$mobileFooterPanel);

    this.$overlays = $('<div class="overlays"></div>');
    this.$element.append(this.$overlays);
    this.$overlays.hide();

    this.$genericDialogue = $(
      '<div class="overlay genericDialogue" aria-hidden="true"></div>'
    );
    this.$overlays.append(this.$genericDialogue);

    this.$overlays.on("click", (e) => {
      if ($(e.target).hasClass("overlays")) {
        e.preventDefault();
        this.extensionHost.publish(IIIFEvents.CLOSE_ACTIVE_DIALOGUE);
      }
    });

    // create shared views.
    new GenericDialogue(this.$genericDialogue);
  }

  resize(): void {
    super.resize();

    setTimeout(() => {
      this.$overlays.width(this.extension.width());
      this.$overlays.height(this.extension.height());
    }, 1);

    const headerVisible: boolean = isVisible(this.$headerPanel) ?? true;
    const footerVisible: boolean = isVisible(this.$footerPanel) ?? true;
    const mobileFooterVisible: boolean =
      isVisible(this.$mobileFooterPanel) ?? true;
    const headerHeight: number = this.$headerPanel.height() ?? 50;
    const footerHeight: number = this.$footerPanel.height() ?? 50;
    const mobileFooterHeight: number = this.$mobileFooterPanel.height() ?? 50;
    const mainHeight: number =
      this.$element.height() ??
      500 -
        parseInt(this.$mainPanel.css("paddingTop")) -
        (headerVisible ? headerHeight : 0) -
        (footerVisible ? footerHeight : 0) -
        (mobileFooterVisible ? mobileFooterHeight : 0);

    this.$mainPanel.height(mainHeight);
  }
}
