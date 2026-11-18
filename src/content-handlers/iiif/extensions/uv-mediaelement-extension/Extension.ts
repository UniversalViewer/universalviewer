import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { Bookmark } from "../../modules/uv-shared-module/Bookmark";
import { DownloadDialogue } from "./DownloadDialogue";
import { MediaElementExtensionEvents } from "./Events";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-mediaelementmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { IMediaElementExtension } from "./IMediaElementExtension";
import { MediaElementCenterPanel } from "../../modules/uv-mediaelementcenterpanel-module/MediaElementCenterPanel";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { ResourcesLeftPanel } from "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { Bools } from "../../Utils";
import { ExternalResourceType } from "@iiif/vocabulary/dist-commonjs/";
import { LanguageMap, Thumb, Canvas } from "manifesto.js";
import { TFragment } from "../../modules/uv-shared-module/TFragment";
import "./theme/theme.less";
import defaultConfig from "./config/config.json";
import { Events } from "../../../../Events";
import { Config } from "./config/Config";
import {
  choosePosterImages,
  PosterImages,
} from "../../modules/uv-shared-module/PosterImages";
import { isVideoCanvas } from "../../modules/uv-shared-module/MediaKind";

export default class Extension
  extends BaseExtension<Config>
  implements IMediaElementExtension
{
  $downloadDialogue: JQuery;
  $shareDialogue: JQuery;
  $helpDialogue: JQuery;
  $settingsDialogue: JQuery;
  centerPanel: MediaElementCenterPanel;
  downloadDialogue: DownloadDialogue;
  shareDialogue: ShareDialogue;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  mobileFooterPanel: MobileFooterPanel;
  headerPanel: HeaderPanel<Config["modules"]["headerPanel"]>;
  helpDialogue: HelpDialogue;
  leftPanel: ResourcesLeftPanel;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  defaultConfig: Config = defaultConfig;

  create(): void {
    super.create();

    // listen for mediaelement enter/exit fullscreen events.
    $(window).bind("enterfullscreen", () => {
      this.extensionHost.publish(Events.TOGGLE_FULLSCREEN);
    });

    $(window).bind("exitfullscreen", () => {
      this.extensionHost.publish(Events.TOGGLE_FULLSCREEN);
    });

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

    this.extensionHost.subscribe(
      MediaElementExtensionEvents.MEDIA_ENDED,
      () => {
        this.fire(MediaElementExtensionEvents.MEDIA_ENDED);
      }
    );

    this.extensionHost.subscribe(
      MediaElementExtensionEvents.MEDIA_PAUSED,
      () => {
        this.fire(MediaElementExtensionEvents.MEDIA_PAUSED);
      }
    );

    this.extensionHost.subscribe(
      MediaElementExtensionEvents.MEDIA_PLAYED,
      () => {
        this.fire(MediaElementExtensionEvents.MEDIA_PLAYED);
      }
    );

    this.extensionHost.subscribe(
      MediaElementExtensionEvents.MEDIA_TIME_UPDATE,
      (t: number) => {
        const canvas: Canvas = this.helper.getCurrentCanvas();
        if (canvas) {
          this.data.target = canvas.id + "#" + `t=${t}`;
          this.fire(IIIFEvents.TARGET_CHANGE, this.data.target);
        }
      }
    );
  }

  createModules(): void {
    super.createModules();

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel = new HeaderPanel(this.shell.$headerPanel);
    } else {
      this.shell.$headerPanel.hide();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel = new ResourcesLeftPanel(this.shell.$leftPanel);
    }

    this.centerPanel = new MediaElementCenterPanel(this.shell.$centerPanel);

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

    this.$helpDialogue = $(
      '<div class="overlay help" aria-hidden="true"></div>'
    );
    this.shell.$overlays.append(this.$helpDialogue);
    this.helpDialogue = new HelpDialogue(this.$helpDialogue);

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

  render(): void {
    super.render();

    this.checkForTarget();
    this.checkForMuted();
  }

  checkForTarget(): void {
    if (this.data.target) {
      // Split target into canvas id and selector
      const components: string[] = this.data.target.split("#");
      const canvasId: string = components[0];

      // get canvas index of canvas id and trigger CANVAS_INDEX_CHANGE (if different)
      const index: number | null = this.helper.getCanvasIndexById(canvasId);

      if (index !== null && this.helper.canvasIndex !== index) {
        this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index);
      }

      // trigger SET_TARGET which calls fitToBounds(xywh) in OpenSeadragonCenterPanel
      const selector: string = components[1];
      this.extensionHost.publish(
        IIIFEvents.SET_TARGET,
        TFragment.fromString(selector)
      );
    }
  }

  checkForMuted(): void {
    this.extensionHost.publish(IIIFEvents.SET_MUTED, this.data.muted || false);
  }

  isLeftPanelEnabled(): boolean {
    return (
      Bools.getBool(this.data.config!.options.leftPanelEnabled, true) &&
      (this.helper.isMultiCanvas() ||
        this.helper.isMultiSequence() ||
        this.helper.hasResources())
    );
  }

  bookmark(): void {
    super.bookmark();

    const canvas: Canvas = this.extensions.helper.getCurrentCanvas();
    const bookmark: Bookmark = new Bookmark();

    bookmark.index = this.helper.canvasIndex;
    bookmark.label = LanguageMap.getValue(canvas.getLabel());
    bookmark.thumb = canvas.getProperty("thumbnail");
    bookmark.title = this.helper.getLabel();
    bookmark.trackingLabel = window.trackingLabel;

    if (this.isVideo()) {
      bookmark.type = ExternalResourceType.MOVING_IMAGE;
    } else {
      bookmark.type = ExternalResourceType.SOUND;
    }

    this.fire(IIIFEvents.BOOKMARK, bookmark);
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

  // The images shown with the current canvas' media, before and while it
  // plays.
  getPosterImages(): PosterImages {
    const canvas: Canvas = this.helper.getCurrentCanvas();
    return choosePosterImages({
      manifest: this.helper.manifest!.__jsonld,
      canvas: canvas.__jsonld,
      isVideo: this.isVideo(),
    });
  }

  // Whether the current canvas' media is video (see isVideoCanvas).
  isVideo(): boolean {
    return isVideoCanvas(this.helper.getCurrentCanvas().__jsonld);
  }
}
