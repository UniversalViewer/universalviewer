import { AlephCenterPanel } from "../../modules/uv-alephcenterpanel-module/AlephCenterPanel";
import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAlephExtension } from "./IAlephExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { Shell } from "../../modules/uv-shared-module/Shell";

export class Extension extends BaseExtension implements IAlephExtension {

    $downloadDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: AlephCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: ContentLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;

    create(): void {
        super.create();

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

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

        this.centerPanel = new AlephCenterPanel(Shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(Shell.$rightPanel);
        } else {
            Shell.$rightPanel.hide();
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(Shell.$footerPanel);
            this.mobileFooterPanel = new MobileFooterPanel(Shell.$mobileFooterPanel);
        } else {
            Shell.$footerPanel.hide();
        }

        this.$shareDialogue = $('<div class="uv-overlay share" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$downloadDialogue = $('<div class="uv-overlay download" aria-hidden="true"></div>');
        Shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="uv-overlay settings" aria-hidden="true"></div>');
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

    dependencyLoaded(index: number, dep: any): void {
        // if (index === (<any>this).getDependencyIndex('ami')) {
        //     window.AMI = dep;
        // } else 
        if (index === (<any>this).getDependencyIndex('three.min')) {
            window.THREE = dep; //https://github.com/mrdoob/three.js/issues/9602
        }
    }

    render(): void {
        super.render();
    }

    getEmbedScript(template: string, width: number, height: number): string {
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}&c=${this.helper.collectionIndex}&m=${this.helper.manifestIndex}&s=${this.helper.sequenceIndex}&cv=${this.helper.canvasIndex}&rid=${this.helper.rangeId}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }
}
