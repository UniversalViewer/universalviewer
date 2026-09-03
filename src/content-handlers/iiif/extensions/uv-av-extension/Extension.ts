import { AVCenterPanel } from "../../modules/uv-avcenterpanel-module/AVCenterPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAVExtension } from "./IAVExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { IIIFResourceType } from "@iiif/vocabulary/dist-commonjs/";
import { Bools } from "../../Utils";
import { Thumb, TreeNode, Range } from "manifesto.js";
import "./theme/theme.less";
import defaultConfig from "./config/config.json";
import { Config } from "./config/Config";

export default class Extension
  extends BaseExtension<Config>
  implements IAVExtension
{
  $downloadDialogue: JQuery;
  $multiSelectDialogue: JQuery;
  $settingsDialogue: JQuery;
  $shareDialogue: JQuery;
  centerPanel: AVCenterPanel;
  downloadDialogue: DownloadDialogue;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  headerPanel: HeaderPanel<Config["modules"]["headerPanel"]>;
  leftPanel: ContentLeftPanel;
  mobileFooterPanel: MobileFooterPanel;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;
  defaultConfig: Config = defaultConfig;
  lastAvCanvasIndex?: number;

  create(): void {
    super.create();

    //requirejs.config({shim: {'uv/lib/hls.min': { deps: ['require'], exports: "Hls"}}});

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        if (canvasIndex !== this.lastAvCanvasIndex) {
          this.viewCanvas(canvasIndex);
        }
        this.lastAvCanvasIndex = canvasIndex;
      }
    );

    this.extensionHost.subscribe(
      IIIFEvents.TREE_NODE_SELECTED,
      (node: TreeNode) => {
        this.fire(IIIFEvents.TREE_NODE_SELECTED, node.data.path);
        this.treeNodeSelected(node);
      }
    );

    this.extensionHost.subscribe(IIIFEvents.THUMB_SELECTED, (thumb: Thumb) => {
      this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
    });
  }

  dependencyLoaded(index: number, dep: any): void {
    if (index === (<any>this).getDependencyIndex("waveform-data")) {
      window.WaveformData = dep;
    } else if (index === (<any>this).getDependencyIndex("hls")) {
      window.Hls = dep; // https://github.com/mrdoob/three.js/issues/9602
    }
  }

  createModules(): void {
    super.createModules();

    if (this.isHeaderPanelEnabled()) {
      this.headerPanel = new HeaderPanel(this.shell.$headerPanel);
    } else {
      this.shell.$headerPanel.hide();
    }

    if (this.isLeftPanelEnabled()) {
      this.leftPanel = new ContentLeftPanel(this.shell.$leftPanel);
    } else {
      this.shell.$leftPanel.hide();
    }

    this.centerPanel = new AVCenterPanel(this.shell.$centerPanel);

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

  isLeftPanelEnabled(): boolean {
    return Bools.getBool(this.data.config!.options.leftPanelEnabled, true);
  }

  render(): void {
    super.render();
  }

  getEmbedScript(template: string, width: number, height: number): string {
    const hashParams = new URLSearchParams({
      manifest: this.helper.manifestUri,
      c: this.helper.collectionIndex.toString(),
      m: this.helper.manifestIndex.toString(),
      cv: this.helper.canvasIndex.toString(),
      rid: this.helper.rangeId?.toString() ?? "",
    });

    return super.buildEmbedScript(template, width, height, hashParams);
  }

  treeNodeSelected(node: TreeNode): void {
    const data: any = node.data;

    if (!data.type) return;

    switch (data.type) {
      case IIIFResourceType.MANIFEST:
        // do nothing
        break;
      case IIIFResourceType.COLLECTION:
        // do nothing
        break;
      default:
        this.viewRange(data.path);
        break;
    }
  }

  viewRange(path: string): void {
    const range: Range | null = this.helper.getRangeByPath(path);
    if (!range) return;
    this.extensionHost.publish(IIIFEvents.RANGE_CHANGE, range);

    // don't update the canvas index, only when thumbs are clicked
    // if (range.canvases && range.canvases.length) {
    //     const canvasId: string = range.canvases[0];
    //     const canvas: manifesto.Canvas | null = this.helper.getCanvasById(canvasId);

    //     if (canvas) {
    //         const canvasIndex: number = canvas.index;

    //         if (canvasIndex !== this.helper.canvasIndex) {
    //             this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE, [canvasIndex]);
    //         }
    //     }
    // }
  }
}
