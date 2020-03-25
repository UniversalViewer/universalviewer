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
import {ProgressDialogue} from "../../modules/uv-dialogues-module/ProgressDialogue";

const PRINT_IFRAME = "ifrmPrintEbookContent";

export class Extension extends BaseExtension implements IEbookExtension {

    $downloadDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $progressDialogue: JQuery;
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
    progressDialogue: ProgressDialogue;
    shareDialogue: ShareDialogue;
    cfiFragement: string;

    private _spinner:JQuery;
    private _ebook:any;
    private _printDocument:any;
    private _activePrint:boolean = false;

    create(): void {
        super.create();

        this.component.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

        this.component.subscribe(Events.CFI_FRAGMENT_CHANGED, (cfi: string) => {
            this.cfiFragement = cfi;
            this.fire(Events.CFI_FRAGMENT_CHANGED, this.cfiFragement);
        });

        this.component.subscribe(Events.EBOOK_READY, (ebook) => {
            this._ebook = ebook;
        });

        this.component.subscribe(Events.PRINT, () => {
            this.printEbook();
        });

        //Remove the print doc iframe if already exists
        let printDocIframe = document.getElementById(PRINT_IFRAME);
        if(printDocIframe)
            printDocIframe.remove();
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

        this.$progressDialogue = $('<div class="overlay progress" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$progressDialogue);
        this.progressDialogue = new ProgressDialogue(this.$progressDialogue);
        setTimeout(this.showDocLoadProgress.bind(this), 3000);
        
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

        this._spinner = $("div#spinner");
        this._spinner.hide();
    }

    showDocLoadProgress():void {
        if(this._ebook)
            return;

        if(this.progressDialogue.content.docLoadingText)
            this.progressDialogue.setOptions({label:this.progressDialogue.content.docLoadingText});

        this.progressDialogue.open();

        let num = 1;
        let interval = setInterval(() => {
            if(this._ebook)
            {
                this.progressDialogue.setValue(100);
                setTimeout(()=>{
                    this.progressDialogue.close();
                }, 200); 
                clearInterval(interval);
                return;
            }
            
            if(num + 2 == 100)
                return; //hack - stop the progress bar till doc ready
            
            this.progressDialogue.setValue(++num);
        }, 200)
    }

    getPrintContentwindow(iframe){
        return iframe.contentWindow;
    }

    finalizePrint(contentWindow){
        contentWindow.print();
        this._activePrint = false;
        this._spinner.hide();
    }

    printEbook(){
        if(!this._ebook){
            alert('Ebook is not loaded yet');
            return;
        }

        //return if printing is already in progress
        if(this._activePrint)
            return;
    
        this._activePrint = true;
        this._spinner.show();
        
        let printDocIframe = document.getElementById(PRINT_IFRAME) as HTMLIFrameElement;
        if(printDocIframe){
            this.finalizePrint(this.getPrintContentwindow(printDocIframe));
            return;
        }
        
        this.renderContents()
            .then(()=>{
                //remove document content meta tags
                this._printDocument.querySelectorAll("[name^='dc.']")
                    .forEach(meta => {
                        meta.remove();
                    });

                let docHead = this._printDocument.head || this._printDocument.getElementsByTagName('head')[0];    
                //add viewport meta tag to print document
                let meta = document.createElement('meta');
                meta.setAttribute('name', 'viewport');
                meta.content = "width=device-width, initial-scale=1";
                docHead.appendChild(meta);
                
                //Add style to doc for page break after each chapter
                let style = document.createElement('style');
                style.type = 'text/css';
                style.appendChild(document.createTextNode("body{margin: 0; padding: 0;} body > *{display: block; page-break-after: always; page-break-before: avoid;}"));
                docHead.appendChild(style);

                //set document title
                docHead.getElementsByTagName("title")[0].innerText = this._ebook.packaging.metadata.title;

                //create an iframe to load the doc contents 
                let ifrm = document.createElement('iframe');
                ifrm.setAttribute("id", "ifrmPrintEbookContent");
                ifrm.setAttribute("style", "display:none;");

                //add iframe to body
                document.body.appendChild(ifrm);

                // check if srcdoc supported for iframe for the browser
                if(!!("srcdoc" in ifrm)){
                    //add onload event to iframe
                    ifrm.onload = () => {
                        this.finalizePrint(this.getPrintContentwindow(ifrm));
                    };

                    //add doc html to iframe srcdoc
                    ifrm.setAttribute("srcdoc", this._printDocument.documentElement.innerHTML);
                    return;
                }
                
                //if scrdoc not supported for the browser
                let contentWindow = this.getPrintContentwindow(ifrm);
                contentWindow.document.write(this._printDocument.documentElement.innerHTML);

                setTimeout(() => {
                    this.finalizePrint(contentWindow);
                }, 1000);
            });
    }

    renderContents() {
        let tocCount = 144;
        let currentTocIndex = -1;

        const renderNextSectionContent = (resolve, reject) => {
          if (++currentTocIndex >= tocCount) {
            resolve();
            return;
          }

          this.renderSectionContent(currentTocIndex)
            .then(() => {
                renderNextSectionContent(resolve, reject);
            }, reject);
        };

        return new Promise(renderNextSectionContent);
     }

     renderSectionContent(index) {
        var section = this._ebook.spine.get(index);
        if(!section) 
            return Promise.resolve();

        return section.render(this._ebook.load.bind(this._ebook))
        .then(htmlDoc => {
            let domparser = new DOMParser()
            let doc = domparser.parseFromString(htmlDoc, "text/html");
            if(doc) {
                if(index == 0) {
                    this._printDocument = doc;
                    return;
                }
            
                //get cssclass and style if any for the section content 
                let docClass = doc.body.getAttribute("class") || "";
                let docStyle = doc.body.getAttribute("style") || "";

                //attach the cssClass and style to section wrapper
                var sectionWrapper= document.createElement('div');
                sectionWrapper.setAttribute("class", (docClass ? docClass + " " : "") + "section-" + index );
                sectionWrapper.setAttribute("style", docStyle);

                sectionWrapper.innerHTML= doc.body.innerHTML;
                this._printDocument.body.appendChild(sectionWrapper);
            }
        });
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
