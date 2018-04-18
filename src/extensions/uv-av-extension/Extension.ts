import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAVExtension } from "./IAVExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { AVCenterPanel } from "../../modules/uv-avcenterpanel-module/AVCenterPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { Shell } from "../../modules/uv-shared-module/Shell";
import ITreeNode = Manifold.ITreeNode;
import IThumb = Manifold.IThumb;

export class Extension extends BaseExtension implements IAVExtension {

    $downloadDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: AVCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: ContentLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;

    create(): void {
        super.create();

        //requirejs.config({shim: {'uv/lib/hls.min': { deps: ['require'], exports: "Hls"}}});

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

        $.subscribe(BaseEvents.TREE_NODE_SELECTED, (e: any, node: ITreeNode) => {
            this.fire(BaseEvents.TREE_NODE_SELECTED, node.data.path);
            this.treeNodeSelected(node);
        });

        $.subscribe(BaseEvents.THUMB_SELECTED, (e: any, thumb: IThumb) => {
            $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [thumb.index]);
        });
    }

    dependencyLoaded(index: number, dep: any): void {
        if (index === 0) {
            window.Hls = dep; //https://github.com/mrdoob/three.js/issues/9602
        }
    }

    createModules(): void {
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new HeaderPanel(Shell.$headerPanel);
        } else {
            Shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ContentLeftPanel(Shell.$leftPanel);
        } else {
            Shell.$leftPanel.hide();
        }

        this.centerPanel = new AVCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        } else {
            Shell.$rightPanel.hide();
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(Shell.$footerPanel);
        } else {
            Shell.$footerPanel.hide();
        }

        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$settingsDialogue);
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
        let isEnabled: boolean = super.isLeftPanelEnabled();
        const tree: Manifesto.ITreeNode | null = this.helper.getTree();

        if (tree && tree.nodes.length) {
            isEnabled = true;
        }

        return isEnabled;
    }

    update(): void {
        super.update();
    }

    getEmbedScript(template: string, width: number, height: number): string {
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}&c=${this.helper.collectionIndex}&m=${this.helper.manifestIndex}&s=${this.helper.sequenceIndex}&cv=${this.helper.canvasIndex}&rid=${this.helper.rangeId}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }

    treeNodeSelected(node: ITreeNode): void {
        const data: any = node.data;

        if (!data.type) return;

        switch (data.type) {
            case manifesto.IIIFResourceType.manifest().toString():
                // do nothing
                break;
            case manifesto.IIIFResourceType.collection().toString():
                // do nothing
                break;
            default:
                this.viewRange(data.path);
                break;
        }
    }

    viewRange(path: string): void {
        const range: Manifesto.IRange | null = this.helper.getRangeByPath(path);
        if (!range) return;
        $.publish(BaseEvents.RANGE_CHANGED, [range]);

        if (range.canvases && range.canvases.length) {
            const canvasId: string = range.canvases[0];
            const canvas: Manifesto.ICanvas | null = this.helper.getCanvasById(canvasId);

            if (canvas) {
                const canvasIndex: number = canvas.index;
                
                if (canvasIndex !== this.helper.canvasIndex) {
                    $.publish(BaseEvents.CANVAS_INDEX_CHANGED, [canvasIndex]);
                }
            }
        }
    }

}
