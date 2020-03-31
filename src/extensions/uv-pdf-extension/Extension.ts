import {BaseEvents} from "../../modules/uv-shared-module/BaseEvents";
import {BaseExtension} from "../../modules/uv-shared-module/BaseExtension";
import {Bookmark} from "../../modules/uv-shared-module/Bookmark";
import {DownloadDialogue} from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-pdffooterpanel-module/FooterPanel";
import {IPDFExtension} from "./IPDFExtension";
import {MoreInfoRightPanel} from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import {PDFCenterPanel} from "../../modules/uv-pdfcenterpanel-module/PDFCenterPanel";
import {PDFHeaderPanel} from "../../modules/uv-pdfheaderpanel-module/PDFHeaderPanel";
import {ResourcesLeftPanel} from "../../modules/uv-resourcesleftpanel-module/ResourcesLeftPanel";
import {SettingsDialogue} from "./SettingsDialogue";
import {ShareDialogue} from "./ShareDialogue";
import {ProgressDialogue} from "../../modules/uv-dialogues-module/ProgressDialogue";

import IThumb = Manifold.IThumb;
import { Events } from "../uv-pdf-extension/Events";

export class Extension extends BaseExtension implements IPDFExtension {

    $downloadDialogue: JQuery;
    $shareDialogue: JQuery;
    $helpDialogue: JQuery;
    $settingsDialogue: JQuery;
    $progressDialogue: JQuery;
    centerPanel: PDFCenterPanel;
    downloadDialogue: DownloadDialogue;
    shareDialogue: ShareDialogue;
    footerPanel: FooterPanel;
    headerPanel: PDFHeaderPanel;
    leftPanel: ResourcesLeftPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    progressDialogue: ProgressDialogue;

    private _pdfDoc:any;
    private _currentPage:number = -1;
    private _printContainer: any;
    private _scratchCanvas:any;
    private _activePrint:boolean;

    create(): void {

        requirejs.config({paths: {'pdfjs-dist/build/pdf.combined': this.data.root + '/lib/' + 'pdf.combined'}});

        super.create();

        this.component.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (canvasIndex: number) => {
            this.viewCanvas(canvasIndex);
        });

        this.component.subscribe(BaseEvents.THUMB_SELECTED, (thumb: IThumb) => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, thumb.index);
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_EXPAND_FULL_START, () => {
            this.shell.$centerPanel.hide();
            this.shell.$rightPanel.hide();
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.shell.$centerPanel.show();
            this.shell.$rightPanel.show();
            this.resize();
        });

        this.component.subscribe(BaseEvents.SHOW_OVERLAY, () => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.hide();
            }
        });

        this.component.subscribe(Events.PDF_LOADED, (pdfDoc: any) => {
            this._pdfDoc = pdfDoc;
        });

        this.component.subscribe(Events.PRINT, () => {
            this.print();
        });

        this.component.subscribe(BaseEvents.HIDE_OVERLAY, () => {
            if (this.IsOldIE()) {
                this.centerPanel.$element.show();
            }
        });

        this.component.subscribe(BaseEvents.EXIT_FULLSCREEN, () => {
            setTimeout(() => {
                this.resize();
            }, 10); // allow time to exit full screen, then resize
        });

        
    }

    getCanvasContext(viewport, printUnits){
        let width = Math.floor(viewport.width * printUnits);
        let height = Math.floor(viewport.height * printUnits);
        
        this._scratchCanvas.width = width;
        this._scratchCanvas.height = height;

        const ctx = this._scratchCanvas.getContext("2d");
        if (ctx == null)
            return null;

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, width, height);

        return ctx;
    }

    renderPage(pageNumber) {
        const PRINT_UNITS = 1;

        return this._pdfDoc
        .getPage(pageNumber)
        .then((pdfPage) => {
            //get pdf viewport
            let viewport = pdfPage.getViewport(1);
            
            let ctx = this.getCanvasContext(viewport,  PRINT_UNITS);

            const renderContext = {
              canvasContext: ctx,
              transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
              viewport: viewport
            };

            return pdfPage.render(renderContext);
        });
    }

    useRenderedPage() {
        const img = document.createElement("img");
    
        const scratchCanvas = this._scratchCanvas;
        if ("toBlob" in scratchCanvas) {
          scratchCanvas.toBlob(function(blob) {
            img.src = URL.createObjectURL(blob);
          });
        } else {
          img.src = scratchCanvas.toDataURL();
        }
    
        const wrapper = document.createElement("div");
        wrapper.appendChild(img);
        this._printContainer.appendChild(wrapper);
    
        return new Promise(function(resolve, reject) {
          img.onload = resolve;
          img.onerror = reject;
        });
      }

    renderPages() {
        if(!this._pdfDoc){
            return Promise.reject("PDF document not ready");
        }

        const pageCount = this._pdfDoc.numPages;
        const renderNextPage = (resolve, reject) => {
          if (++this._currentPage >= pageCount) {
            this.progressDialogue.setValue(this._currentPage);
            resolve();
            return;
          }

          this.progressDialogue.setValue(this._currentPage);

          const index = this._currentPage;
          this.renderPage(index + 1)
            .then(this.useRenderedPage.bind(this))
            .then(function() {
              renderNextPage(resolve, reject);
            }, reject);
        };

        return new Promise(renderNextPage);
     }

    print(){
        if(this._activePrint)
            return;
        
        this._activePrint = true;
        this.initPrintProgress();

        let rederedPages = this.renderPages();
        rederedPages.then(() => {
            this._activePrint = false;
            setTimeout(()=>{
                this.progressDialogue.close();
                window.print();
            }, 200);
        });

        rederedPages.catch((r)=> {
            this.progressDialogue.close();
            this._activePrint = false;
        });
    }

    render(): void {
        super.render();
    }

    IsOldIE(): boolean {
        const browser: string = window.browserDetect.browser;
        const version: number = window.browserDetect.version;

        if (browser === 'Explorer' && version <= 9) return true;
        return false;
    }

    isHeaderPanelEnabled(): boolean {
        return super.isHeaderPanelEnabled() && Utils.Bools.getBool(this.data.config.options.usePdfJs, true);
    }

    createModules(): void{
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new PDFHeaderPanel(this.shell.$headerPanel);
        } else {
            this.shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ResourcesLeftPanel(this.shell.$leftPanel);
        }

        this.centerPanel = new PDFCenterPanel(this.shell.$centerPanel);

        if (this.isRightPanelEnabled()) {
            this.rightPanel = new MoreInfoRightPanel(this.shell.$rightPanel);
        }

        if (this.isFooterPanelEnabled()) {
            this.footerPanel = new FooterPanel(this.shell.$footerPanel);
        } else {
            this.shell.$footerPanel.hide();
        }

        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        this.$progressDialogue = $('<div class="overlay progress" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$progressDialogue);
        this.progressDialogue = new ProgressDialogue(this.$progressDialogue);
        setTimeout(this.showDocLoadProgress.bind(this), 3000);

        //init print container and scratch canvas to hold the rendered page
        //if we're using PDF.js
        if (Utils.Bools.getBool(this.centerPanel.extension.data.config.options.usePdfJs, false)) {
            this._printContainer = document.createElement("div");
            this._printContainer.setAttribute("id","printContainer");
            document.body.appendChild(this._printContainer);

            this._scratchCanvas = document.createElement("canvas");
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel.init();
        }

        if (this.isRightPanelEnabled()) {
            this.rightPanel.init();
        }
    }

    showDocLoadProgress():void {
        if(this._pdfDoc)
            return;

        if(this.progressDialogue.content.docLoadingText)
            this.progressDialogue.setOptions({label:this.progressDialogue.content.docLoadingText});

        this.progressDialogue.open();

        let num = 1;
        let interval = setInterval(() => {
            if(this._pdfDoc)
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

    initPrintProgress():void{
        var options={
            maxValue: this._pdfDoc.numPages,
            showPercentage: true
        };
        if(this.progressDialogue.content.docPrintProgressText)
            options["label"] = this.progressDialogue.content.docPrintProgressText;

        this.progressDialogue.setOptions(options);
        this.progressDialogue.open();
    }

    bookmark() : void {
        super.bookmark();

        const canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();
        const bookmark: Bookmark = new Bookmark();

        bookmark.index = this.helper.canvasIndex;
        bookmark.label = <string>Manifesto.LanguageMap.getValue(canvas.getLabel());
        bookmark.thumb = canvas.getProperty('thumbnail');
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = manifesto.ResourceType.document().toString();

        this.fire(BaseEvents.BOOKMARK, bookmark);
    }

    dependencyLoaded(index: number, dep: any): void {
        if (index === 0) {
            window.PDFObject = dep;
        }
    }

    getEmbedScript(template: string, width: number, height: number): string{
        //const configUri = this.data.config.uri || '';
        //const script = String.format(template, this.getSerializedLocales(), configUri, this.helper.iiifResourceUri, this.helper.collectionIndex, this.helper.manifestIndex, this.helper.sequenceIndex, this.helper.canvasIndex, width, height, this.data.embedScriptUri);
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}&c=${this.helper.collectionIndex}&m=${this.helper.manifestIndex}&s=${this.helper.sequenceIndex}&cv=${this.helper.canvasIndex}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }
}
