import { AlephCenterPanel } from "../../modules/uv-alephcenterpanel-module/AlephCenterPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAlephExtension } from "./IAlephExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { AlephLeftPanel } from "../../modules/uv-alephleftpanel-module/AlephLeftPanel";
import { Bools } from "../../Utils";
import "./theme/theme.less";
import defaultConfig from "./config/config.json";
import { Config } from "./config/Config";

export default class Extension
  extends BaseExtension<Config>
  implements IAlephExtension
{
  $downloadDialogue: JQuery;
  $multiSelectDialogue: JQuery;
  $settingsDialogue: JQuery;
  $shareDialogue: JQuery;
  centerPanel: AlephCenterPanel;
  downloadDialogue: DownloadDialogue;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  headerPanel: HeaderPanel<Config["modules"]["headerPanel"]>;
  leftPanel: AlephLeftPanel;
  mobileFooterPanel: MobileFooterPanel;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;
  defaultConfig: Config = defaultConfig;

  create(): void {
    super.create();

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.viewCanvas(canvasIndex);
      }
    );
  }

  async createModules(): Promise<void> {
    super.createModules();

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel = new HeaderPanel(this.shell.$headerPanel);
    } else {
      this.shell.$headerPanel.hide();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel = new AlephLeftPanel(this.shell.$leftPanel);
    } else {
      this.shell.$leftPanel.hide();
    }

    this.centerPanel = new AlephCenterPanel(this.shell.$centerPanel);

    if (this.isRightPanelEnabled()) {
      this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
    } else {
      this.shell.$rightPanel.hide();
    }

    if (this.isFooterPanelEnabled()) {
      this.footerPanel = new FooterPanel(this.shell.$footerPanel);
      this.mobileFooterPanel = new MobileFooterPanel(
        this.shell.$mobileFooterPanel
      );
    } else {
      this.shell.$footerPanel.hide();
    }

    this.$shareDialogue = $(
      '<div class="overlay share" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$shareDialogue);
    this.shareDialogue = new ShareDialogue(this.$shareDialogue);

    this.$downloadDialogue = $(
      '<div class="overlay download" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$downloadDialogue);
    this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

    this.$settingsDialogue = $(
      '<div class="overlay settings" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$settingsDialogue);
    this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel.init();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel.init();
    }

    if (this.isRightPanelEnabled()) {
      this.rightPanel.init();
    }

    if (this.isFooterPanelEnabled()) {
      this.footerPanel.init();
    }
  }

  render(): void {
    super.render();
  }

  isLeftPanelEnabled(): boolean {
    return Bools.getBool(this.data.config!.options.leftPanelEnabled, true);
  }

  getEmbedScript(template: string, width: number, height: number): string {
    const hashParams = new URLSearchParams({
      manifest: this.helper.manifestUri,
    });

    return super.buildEmbedScript(template, width, height, hashParams);
  }
}
