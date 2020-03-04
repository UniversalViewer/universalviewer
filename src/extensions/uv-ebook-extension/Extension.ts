import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { EbookLeftPanel } from "../../modules/uv-ebookleftpanel-module/EbookLeftPanel";
import { Events } from "./Events";
import { DownloadDialogue } from "./DownloadDialogue";
import { EbookCenterPanel } from "../../modules/uv-ebookcenterpanel-module/EbookCenterPanel";
import { FooterPanel } from "../../modules/uv-ebookfooterpanel-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-ebookmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IEbookExtension } from "./IEbookExtension";
import { MoreInfoDialogue } from "../../modules/uv-dialogues-module/MoreInfoDialogue";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { IEbookExtensionData } from "./IEbookExtensionData";

export class Extension extends BaseExtension implements IEbookExtension {

    $downloadDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: EbookCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: EbookLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    moreInfoDialogue: MoreInfoDialogue;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;
    cfiFragement: string;

    private _toc:any;
    //private _activePrint:boolean;
    private _spinner:JQuery;
    //private _currentTocItemIndex:number = -1;
    private _ebookPath:string;

    create(): void {
        super.create();

        this.component.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

        this.component.subscribe(Events.CFI_FRAGMENT_CHANGED, (cfi: string) => {
            this.cfiFragement = cfi;
            this.fire(Events.CFI_FRAGMENT_CHANGED, this.cfiFragement);
        });

        this.component.subscribe(Events.EBOOK_PATH_READY, (ebookPath) => {
            alert(ebookPath);
            this._ebookPath = ebookPath;
        });

        this.component.subscribe(Events.PRINT, () => {

            if(this._ebookPath){
            this.print();
            }
        });

        this.component.subscribe(Events.LOADED_NAVIGATION, (navigation: any) => {
            alert('toc loaded');
            this._toc = navigation.toc;
            alert(this._toc);
        });
    }

    dependencyLoaded(_index: number, _dep: any): void {

    }

    createModules(): void {
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new HeaderPanel(this.shell.$headerPanel);
        } else {
            this.shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new EbookLeftPanel(this.shell.$leftPanel);
        } else {
            this.shell.$leftPanel.hide();
        }

        this.centerPanel = new EbookCenterPanel(this.shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
        } else {
            this.shell.$rightPanel.hide();
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(this.shell.$footerPanel);
            this.mobileFooterPanel = new MobileFooterPanel(this.shell.$mobileFooterPanel);
        } else {
            this.shell.$footerPanel.hide();
        }

        this.$moreInfoDialogue = $('<div class="overlay moreInfo" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$moreInfoDialogue);
        this.moreInfoDialogue = new MoreInfoDialogue(this.$moreInfoDialogue);

        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
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

        this._spinner = $("div.spinner");
        this._spinner.hide();
    }

    print(){
        // TODO Printing Implementation
        alert('Printing Done');

        // if(this._activePrint)
        //     return;
        
        // this._activePrint = true;
        // this._spinner.show();

        // let rederedPages = this.renderBookContents();
        // rederedPages.then(() => {
        //     this._spinner.hide();
        //     window.print();
        //     this._activePrint = false;
        // });

        // rederedPages.catch((r)=> {
        //     this._spinner.hide();
        //     this._activePrint = false;
        // });
    }

    renderBookContents() {
        // if(!this._toc){
        //     return new Promise(() => {
        //         throw new Error();
        //     });
        // }

        // const tocLength = this._toc.legth;
        // const renderNextItem = (resolve, reject) => {
          
        //   if (++this._currentTocItemIndex >= tocLength) {
        //     resolve();
        //     return;
        //   }

        //   const index = this._currentTocItemIndex;
        //   this.renderContent(index + 1)
        //     .then(this.useRenderedContent.bind(this))
        //     .then(function() {
        //         renderNextItem(resolve, reject);
        //     }, reject);
        // };

        // return new Promise(renderNextItem);
     }

     useRenderedContent() {
        // const img = document.createElement("img");
    
        // const scratchCanvas = this._scratchCanvas;
        // if ("toBlob" in scratchCanvas) {
        //   scratchCanvas.toBlob(function(blob) {
        //     img.src = URL.createObjectURL(blob);
        //   });
        // } else {
        //   img.src = scratchCanvas.toDataURL();
        // }
    
        // const wrapper = document.createElement("div");
        // wrapper.appendChild(img);
        // this._printContainer.appendChild(wrapper);
    
        // return new Promise(function(resolve, reject) {
        //   img.onload = resolve;
        //   img.onerror = reject;
        // });
      }

     renderContent(tocItemIndex) {
        // const PRINT_UNITS = 0.72 * 2;

        // return this._pdfDoc
        // .getPage(pageNumber)
        // .then((pdfPage) => {
        //     //get pdf viewport
        //     let viewport = pdfPage.getViewport(1);
            
        //     let ctx = this.getCanvasContext(viewport,  PRINT_UNITS);

        //     const renderContext = {
        //       canvasContext: ctx,
        //       transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
        //       viewport: viewport
        //     };

        //     return pdfPage.render(renderContext);
        // });
    }

    isLeftPanelEnabled(): boolean {
        return true;
    }

    render(): void {
        super.render();
        this.checkForCFIParam();
    }

    getEmbedScript(template: string, width: number, height: number): string {
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}&cfi=${this.cfiFragement}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }

    checkForCFIParam(): void {
        const cfi: string | null = (<IEbookExtensionData>this.data).cfi;

        if (cfi) {
            this.component.publish(Events.CFI_FRAGMENT_CHANGED, cfi);
        }
    }
}
