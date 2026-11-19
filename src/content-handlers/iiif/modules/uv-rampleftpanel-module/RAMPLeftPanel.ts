const $ = require("jquery");
import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseConfig } from "../../BaseConfig";

export class RAMPLeftPanel extends LeftPanel<
  BaseConfig["modules"]["leftPanel"]
> {
  $tabs: JQuery;
  $navTab: JQuery;
  $transcriptTab: JQuery;
  $tabsContent: JQuery;
  $navContent: JQuery;
  $transcriptContent: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("leftPanel");
    super.create();

    // tabs bar
    this.$tabs = $('<div class="tabs"></div>');
    this.$main.append(this.$tabs);

    this.$navTab = $(
      '<a class="index tab first on" tabindex="0">' + this.content.index + "</a>"
    );
    this.$tabs.append(this.$navTab);

    this.$transcriptTab = $(
      '<a class="transcript tab" tabindex="0">' + this.content.transcript + "</a>"
    );
    this.$tabs.append(this.$transcriptTab);

    // content areas
    this.$tabsContent = $('<div class="tabsContent"></div>');
    this.$main.append(this.$tabsContent);

    this.$navContent = $('<div class="navContent"></div>');
    this.$tabsContent.append(this.$navContent);

    this.$transcriptContent = $('<div class="transcriptContent"></div>');
    this.$tabsContent.append(this.$transcriptContent);

    // start with nav visible
    this.$transcriptContent.hide();

    // tab click handlers
    this.onAccessibleClick(
      this.$navTab,
      () => {
        this.openNavTab();
      },
      true,
      true
    );

    this.onAccessibleClick(
      this.$transcriptTab,
      () => {
        this.openTranscriptTab();
      },
      true,
      true
    );

    this.setTitle("Index");
  }

  init(): void {
    super.init();
    this.openNavTab();
  }

  openNavTab(): void {
    this.$navTab.addClass("on");
    this.$transcriptTab.removeClass("on");
    this.$navContent.show();
    this.$transcriptContent.hide();
    this.setTitle("Index");
    this.extensionHost.publish(IIIFEvents.OPEN_TREE_VIEW);
  }

  openTranscriptTab(): void {
    this.$transcriptTab.addClass("on");
    this.$navTab.removeClass("on");
    this.$transcriptContent.show();
    this.$navContent.hide();
    this.setTitle("Transcript");
  }

  resize(): void {
    super.resize();

    this.$tabsContent.height(this.$main.height() - this.$tabs.outerHeight());

    this.$navContent.height(this.$tabsContent.height());
    this.$transcriptContent.height(this.$tabsContent.height());
  }
}
