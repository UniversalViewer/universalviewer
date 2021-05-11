import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
// import { Events } from "./Events";
import { DownloadDialogue } from "./DownloadDialogue";
import { SlideAtlasCenterPanel } from "../../modules/uv-slideatlascenterpanel-module/SlideAtlasCenterPanel";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
// import { FooterPanel as MobileFooterPanel } from "../../modules/uv-slideatlasmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { ISlideAtlasExtension } from "./ISlideAtlasExtension";
import { MoreInfoDialogue } from "../../modules/uv-dialogues-module/MoreInfoDialogue";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
// import { ISlideAtlasExtensionData } from "./ISlideAtlasExtensionData";
import { Strings } from "@edsilv/utils";
import "./theme/theme.less";

export default class Extension extends BaseExtension
  implements ISlideAtlasExtension {
  $downloadDialogue: JQuery;
  $moreInfoDialogue: JQuery;
  $multiSelectDialogue: JQuery;
  $settingsDialogue: JQuery;
  $shareDialogue: JQuery;
  centerPanel: SlideAtlasCenterPanel;
  downloadDialogue: DownloadDialogue;
  footerPanel: FooterPanel;
  headerPanel: HeaderPanel;
  // mobileFooterPanel: MobileFooterPanel;
  moreInfoDialogue: MoreInfoDialogue;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;

  create(): void {
    super.create();

    this.component.subscribe(
      BaseEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        this.viewCanvas(canvasIndex);
      }
    );
  }

  createModules(): void {
    super.createModules();

    this.shell.$headerPanel.hide();
    this.shell.$leftPanel.hide();
    this.centerPanel = new SlideAtlasCenterPanel(this.shell.$centerPanel);
    this.shell.$rightPanel.hide();
    this.shell.$footerPanel.hide();
  }

  render(): void {
    super.render();
  }

  getEmbedScript(template: string, width: number, height: number): string {
    const appUri: string = this.getAppUri();
    const iframeSrc: string = `${appUri}#?manifest=${this.helper.manifestUri}`;
    const script: string = Strings.format(
      template,
      iframeSrc,
      width.toString(),
      height.toString()
    );
    return script;
  }
}
