import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { Bookmark } from "../../modules/uv-shared-module/Bookmark";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { IPDFExtension } from "./IPDFExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { PDFCenterPanel } from "../../modules/uv-pdfcenterpanel-module/PDFCenterPanel";
import { PDFHeaderPanel } from "../../modules/uv-pdfheaderpanel-module/PDFHeaderPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-pdfmobilefooterpanel-module/MobileFooter";
import { ResourcesLeftPanel } from "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { ExternalResourceType } from "@iiif/vocabulary/dist-commonjs/";
import { Bools } from "../../Utils";
import { Canvas, LanguageMap, Thumb } from "manifesto.js";
import "./theme/theme.less";
import defaultConfig from "./config/config.json";
import { Events } from "../../../../Events";
import { Config } from "./config/Config";

export default class Extension
  extends BaseExtension<Config>
  implements IPDFExtension
{
  $downloadDialogue: JQuery;
  $shareDialogue: JQuery;
  $helpDialogue: JQuery;
  $settingsDialogue: JQuery;
  centerPanel: PDFCenterPanel;
  downloadDialogue: DownloadDialogue;
  shareDialogue: ShareDialogue;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  mobileFooterPanel: MobileFooterPanel;
  headerPanel: PDFHeaderPanel;
  leftPanel: ResourcesLeftPanel;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  defaultConfig: Config = defaultConfig;

  create(): void {
    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.viewCanvas(canvasIndex);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.THUMB_SELECTED, (thumb: Thumb) => {
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
    });

    this.extensionHost.subscribe(IIIFEvents.LEFTPANEL_EXPAND_FULL_START, () => {
      this.shell.$centerPanel.hide();
      this.shell.$rightPanel.hide();
    });

    this.extensionHost.subscribe(
      IIIFEvents.LEFTPANEL_COLLAPSE_FULL_FINISH,
      () => {
        this.shell.$centerPanel.show();
        this.shell.$rightPanel.show();
        this.resize();
      }
    );

    this.extensionHost.subscribe(Events.EXIT_FULLSCREEN, () => {
      setTimeout(() => {
        this.resize();
      }, 10); // allow time to exit full screen, then resize
    });
  }

  render(): void {
    super.render();
  }

  isHeaderPanelEnabled(): boolean {
    return (
      super.isHeaderPanelEnabled() &&
      Bools.getBool(
        this.data.config!.modules.pdfCenterPanel.options.usePdfJs,
        true
      )
    );
  }

  createModules(): void {
    super.createModules();

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel = new PDFHeaderPanel(this.shell.$headerPanel);
    } else {
      this.shell.$headerPanel.hide();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel = new ResourcesLeftPanel(this.shell.$leftPanel);
    }

    this.centerPanel = new PDFCenterPanel(this.shell.$centerPanel);

    if (this.isRightPanelEnabled()) {
      this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
    }

    if (this.isFooterPanelEnabled()) {
      this.footerPanel = new FooterPanel(this.shell.$footerPanel);
      this.mobileFooterPanel = new MobileFooterPanel(
        this.shell.$mobileFooterPanel
      );
    } else {
      this.shell.$footerPanel.hide();
    }

    this.$downloadDialogue = $(
      '<div class="overlay download" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$downloadDialogue);
    this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

    this.$shareDialogue = $(
      '<div class="overlay share" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$shareDialogue);
    this.shareDialogue = new ShareDialogue(this.$shareDialogue);

    this.$settingsDialogue = $(
      '<div class="overlay settings" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$settingsDialogue);
    this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

    if (this.isLeftPanelEnabled()) {
      this.leftPanel.init();
    }

    if (this.isRightPanelEnabled()) {
      this.rightPanel.init();
    }
  }

  bookmark(): void {
    super.bookmark();

    const canvas: Canvas = this.helper.getCurrentCanvas();
    const bookmark: Bookmark = new Bookmark();

    bookmark.index = this.helper.canvasIndex;
    bookmark.label = <string>LanguageMap.getValue(canvas.getLabel());
    bookmark.thumb = canvas.getProperty("thumbnail");
    bookmark.title = this.helper.getLabel();
    bookmark.trackingLabel = window.trackingLabel;
    bookmark.type = ExternalResourceType.DOCUMENT;

    this.fire(IIIFEvents.BOOKMARK, bookmark);
  }

  dependencyLoaded(index: number, dep: any): void {
    if (index === 0) {
      window.PDFObject = dep;
    }
  }

  getEmbedScript(template: string, width: number, height: number): string {
    const hashParams = new URLSearchParams({
      manifest: this.helper.manifestUri,
      c: this.helper.collectionIndex.toString(),
      m: this.helper.manifestIndex.toString(),
      cv: this.helper.canvasIndex.toString(),
    });

    return super.buildEmbedScript(template, width, height, hashParams);
  }

  isPdfJsEnabled(): boolean {
    return Bools.getBool(
      this.data.config!.modules.pdfCenterPanel.options.usePdfJs,
      true
    );
  }
}
