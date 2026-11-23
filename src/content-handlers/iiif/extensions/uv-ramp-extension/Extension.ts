import { RAMPCenterPanel } from "../../modules/uv-rampcenterpanel-module/RAMPCenterPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAVExtension } from "./IAVExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { IIIFResourceType } from "@iiif/vocabulary/dist-commonjs/";
import { Bools } from "../../Utils";
import { TreeNode, Range } from "manifesto.js";
import { createRoot, Root } from "react-dom/client";
import { createElement } from "react";
import { RAMPBridge } from "./RAMPBridge";
import "./theme/theme.less";
// import "@samvera/ramp/dist/ramp.css";
import defaultConfig from "./config/config.json";
import { Config } from "./config/Config";
import { RAMPLeftPanel } from "../../modules/uv-rampleftpanel-module/RAMPLeftPanel";

export default class Extension
  extends BaseExtension<Config>
  implements IAVExtension
{
  $shareDialogue: JQuery;
  $settingsDialogue: JQuery;
  centerPanel: RAMPCenterPanel;
  footerPanel: FooterPanel<Config["modules"]["footerPanel"]>;
  headerPanel: HeaderPanel<Config["modules"]["headerPanel"]>;
  leftPanel: RAMPLeftPanel;
  mobileFooterPanel: MobileFooterPanel;
  rightPanel: MoreInfoRightPanel;
  settingsDialogue: SettingsDialogue;
  shareDialogue: ShareDialogue;
  defaultConfig: Config = defaultConfig;
  lastAvCanvasIndex?: number;

  // The single React root for all RAMP components
  private _reactRoot: Root | null = null;

  create(): void {
    super.create();

    // breaking without these two event subscriptions but may not be necessary

    this.extensionHost.subscribe(
      IIIFEvents.CANVAS_INDEX_CHANGE,
      (canvasIndex: number) => {
        if (canvasIndex !== this.lastAvCanvasIndex) {
          this.viewCanvas(canvasIndex);
        }
        this.lastAvCanvasIndex = canvasIndex;
      }
    );

    // this.extensionHost.subscribe(
    //   IIIFEvents.TREE_NODE_SELECTED,
    //   (node: TreeNode) => {
    //     this.fire(IIIFEvents.TREE_NODE_SELECTED, node.data.path);
    //     this.treeNodeSelected(node);
    //   }
    // );

    // this.extensionHost.subscribe(IIIFEvents.THUMB_SELECTED, (thumb: Thumb) => {
    //   this.extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, thumb.index);
    // });

    // Mount RAMP once media is ready to load
    this.extensionHost.subscribe(IIIFEvents.OPEN_EXTERNAL_RESOURCE, () => {
      this._mountRAMP();
    });
  }

  private _mountedManifestUrl: string | null = null;

  private _mountRAMP(): void {
    console.log(
      "canvases",
      this.helper.getTotalCanvases(),
      "index",
      this.helper.canvasIndex
    );
    const manifestUrl = this.helper.manifestUri;
    if (!manifestUrl) return;
    if (this._reactRoot && manifestUrl === this._mountedManifestUrl) return;
    this._mountedManifestUrl = manifestUrl;
    const startCanvasId = this.helper.getCanvasByIndex(
      this.helper.canvasIndex
    )?.id;

    const $centerContent = this.shell.$centerPanel.find(".content");
    const centerPanelEl = (
      $centerContent.length ? $centerContent : this.shell.$centerPanel
    )[0];

    if (!this._reactRoot) {
      const mountPoint = document.createElement("div");
      mountPoint.className = "ramp-root";
      mountPoint.style.display = "none"; // invisible, just holds the tree
      this.shell.$element[0].appendChild(mountPoint);
      this._reactRoot = createRoot(mountPoint);
    }

    this._reactRoot.render(
      createElement(RAMPBridge, {
        manifestUrl,
        rampConfig: this.data.config?.modules?.rampModule ?? {
          options: {},
          content: {},
        },
        startCanvasId,
        centerPanelEl,
        navEl: this.leftPanel.$navContent[0],
        transcriptEl: this.leftPanel.$transcriptContent[0],
        extensionHost: this.extensionHost,
      })
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
      this.leftPanel = new RAMPLeftPanel(this.shell.$leftPanel);
    }

    this.centerPanel = new RAMPCenterPanel(this.shell.$centerPanel);

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
        break;
      case IIIFResourceType.COLLECTION:
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
  }

  dispose(): void {
    this._reactRoot?.unmount();
    this._reactRoot = null;
    this._mountedManifestUrl = null;
    super.dispose();
  }
}
