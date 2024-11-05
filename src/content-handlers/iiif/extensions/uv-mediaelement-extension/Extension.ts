import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { Bookmark } from "../../modules/uv-shared-module/Bookmark";
import { DownloadDialogue } from "./DownloadDialogue";
import { MediaElementExtensionEvents } from "./Events";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { IMediaElementExtension } from "./IMediaElementExtension";
import { MediaElementCenterPanel } from "../../modules/uv-mediaelementcenterpanel-module/MediaElementCenterPanel";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { ResourcesLeftPanel } from "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { Bools, Strings } from "@edsilv/utils";
import {
  ExternalResourceType,
  MediaType,
} from "@iiif/vocabulary/dist-commonjs/";
import {
  LanguageMap,
  Thumb,
  Canvas,
  Annotation,
  AnnotationBody,
} from "manifesto.js";
import { TFragment } from "../../modules/uv-shared-module/TFragment";
import "./theme/theme.less";
import defaultConfig from "./config/config.json";
import { Events } from "../../../../Events";
import { Config } from "./config/Config";

export default class Extension extends BaseExtension<Config>
  implements IMediaElementExtension {
  $downloadDialogue: JQuery;
  $shareDialogue: JQuery;
  $helpDialogue: JQuery;
  $settingsDialogue: JQuery;
  centerPanel: MediaElementCenterPanel;
  downloadDialogue: DownloadDialogue;
  shareDialogue: ShareDialogue;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
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
    const appUri: string = this.getAppUri();
    const iframeSrc: string = `${appUri}#?manifest=${this.helper.manifestUri}&c=${this.helper.collectionIndex}&m=${this.helper.manifestIndex}&cv=${this.helper.canvasIndex}`;
    const script: string = Strings.format(
      template,
      iframeSrc,
      width.toString(),
      height.toString()
    );
    return script;
  }

  // todo: use canvas.getThumbnail()
  getPosterImageUri(): string {
    const canvas: Canvas = this.helper.getCurrentCanvas();
    const annotations: Annotation[] = canvas.getContent();

    if (annotations && annotations.length) {
      return annotations[0].getProperty("thumbnail");
    } else {
      return canvas.getProperty("thumbnail");
    }
  }

  isVideoFormat(type: string): boolean {
    const videoFormats: string[] = [MediaType.VIDEO_MP4, MediaType.WEBM];
    return videoFormats.indexOf(type) != -1;
  }

  isVideo(): boolean {
    const canvas: Canvas = this.helper.getCurrentCanvas();
    const annotations: Annotation[] = canvas.getContent();

    if (annotations && annotations.length) {
      const formats: AnnotationBody[] | null = this.getMediaFormats(canvas);

      for (let i = 0; i < formats.length; i++) {
        const format: AnnotationBody = formats[i];
        const type: MediaType | null = format.getFormat();

        if (type) {
          if (this.isVideoFormat(type.toString())) {
            return true;
          }
        }
      }

      return false;
    } else {
      const type: ExternalResourceType | null = canvas.getType();

      if (type) {
        return type.toString() === ExternalResourceType.MOVING_IMAGE;
      }
    }

    throw new Error("Unable to determine media type");
  }
}
