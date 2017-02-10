import BaseCommands = require("../uv-shared-module/BaseCommands");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import IMetadataItem = Manifold.IMetadataItem;
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import RightPanel = require("../uv-shared-module/RightPanel");
import FooterPanel = require("../uv-searchfooterpanel-module/FooterPanel");
import Shell = require("../uv-shared-module/Shell");

class OcrRightPanel extends RightPanel {

    $clear: JQuery;
    isTextSelected: boolean = false;
    defaultPreserveViewport: boolean = false;
    lastCanvasIndex: number;

    constructor($element: JQuery) {
        super($element);
    }
    
    create(): void {
        
        this.setConfig('ocrRightPanel');

        super.create();
        
        var settings: ISettings = this.extension.getSettings();
        
        this.$clear = $('<div class="clearSel" title>'+this.extension.config.modules.searchFooterPanel.content.clearSearch+'</div>');
        this.$clear.prop('title', this.content.clearSelection);
        this.$top.append(this.$clear);        
        
        this.$clear.onPressed(() => {
            this.clearSelection();
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, index) => {
            if (!_.isNull(this.lastCanvasIndex) && this.lastCanvasIndex !== index){
                this.getOCR(parseInt(index));
            }
        });
        
        $.subscribe(Commands.CLEAR_OCR_PANEL, (e, index) => {
            this.clearSelection();            
        });        
        
        $.subscribe(BaseCommands.CLOSE_RIGHT_PANEL, (e, index) => {
            this.clearSelection();
            //settings.preserveViewport = this.defaultPreserveViewport;
        });        
        
        $.subscribe(BaseCommands.OPEN_RIGHT_PANEL, (e, index) => {
            //this.defaultPreserveViewport = settings.preserveViewport;
            //settings.preserveViewport = true;
            //$.publish(Commands.SEARCH, ["hamlet"]);
        });

        this.setTitle(this.content.title);

    }   
    
    clearSelection(): void {
        if (this.isTextSelected) {
            $.publish(Commands.CLEAR_SEARCH);
        }
        
        $('div span.wordHighlight').each(function() {
            $(this).css(
                { 
                    "background-color" : "" 
                });                   
        });
        
        this.isTextSelected = false;          
    }
    
    getOCR(index?: number): any {
        var that = this;
        var main = this.$main;
        
        this.lastCanvasIndex = index;
        var currentCanvasId = this.extension.helper.getCurrentElement().id;

        var searchUri = (<ISeadragonExtension>this.extension).getOcrServiceUri();
        
        $.getJSON(searchUri,
                  { 
                      'q' : currentCanvasId
                  }, 
                  function (response) {
                      main.html(parseResponse(response));
                      addHighlights();
                  });
        
        function parseResponse(response) {
            var output = '';
            var areaId = '';
            var lineId = '';
            var paragraphId = '';
            var style = '';
            var targets;

            var idParts = response.first.id.split("#");
            if (idParts[1] == 'rtl') {
                style = 'style="direction:rtl"';
            }
            
            for (var item of response.first.items) {                
                targets = extractDataTarget(item.target);
                var idParts = item.id.split("#");

                if (lineId != targets.lineId && lineId != '') {
                    output = output.trim() + '<br/>'                            
                } 
                output += '<span class="wordHighlight" id="' + idParts[1] + '" data-xywh="' + targets.xywh + '">'+ item.body.value + '</span> ';
                lineId = targets.lineId;
            }
            return '<div class="wordHighlightDiv" ' + style + '>' + output +'</div>';    
        }
         
        function extractDataTarget(target){
            
            for (var i = 0; i < target.length; i++) {                
                var targetParts = target[i].split("#");
                var parts = targetParts[1].match(/(\w*)=([0-9a-zA-Z,_]*)/);

                switch (parts[1]) {
                    case 'xywh':
                        var xywh = parts[2];
                        break;
                    case 'area':
                        var area = parts[2];
                        break;
                    case 'paragraph':
                        var paragraph = parts[2];
                        break;
                    case 'line':
                        var line = parts[2];
                        break;                    
                }
            }
            
            return {xywh:xywh, areaId:area, paragraphId:paragraph, lineId:line}
        }  
        

        
        function addHighlights() {
            
            $(document).ready(function () {
                $('div.wordHighlightDiv').mouseup(
                    function() {
                        $.publish(Commands.CLEAR_SEARCH_PANEL);
                        var sel = window.getSelection();
                        var selText = sel.toString().trim();
                        var listNode = new Array();
                        if (selText != '') {
                            var range;
                            if (sel.getRangeAt) {
                                if (sel.rangeCount > 0) {
                                    range = sel.getRangeAt(0);
                                }
                            }
                            
                            var documentFragment = range.cloneContents();
                            var len = documentFragment.childNodes.length;                 
                            if (len > 1) {
                                for (var i = 0; i < len; i++) {                                
                                    if (documentFragment.childNodes[i].className == 'wordHighlight') {                                      
                                        if (documentFragment.childNodes[i].innerText != '' && _.includes(selText, documentFragment.childNodes[i].innerText)) {
                                            listNode.push(documentFragment.childNodes[i]);   
                                        }
                                    }
                                  
                                }
                            } else if (range.startContainer.parentNode.className != null && range.startContainer.parentNode.className == 'wordHighlight') {
                                listNode.push(range.startContainer.parentNode);   
                            }
                            that.clearSelection();
                            if (listNode.length > 0) {
                                that.isTextSelected = true;
                                $.publish(Commands.SEARCH_IN_CANVAS, [{terms: listNode, canvasId: currentCanvasId}]);
                                //$.publish(Commands.SEARCH, ["hamlet"]);
                            } else {
                                that.isTextSelected = false;
                                that.extension.showMessage(that.extension.config.modules.genericDialogue.content.wrongSelection);
                            }
                            sel.removeAllRanges();                            
                            for (var i = 0; i < listNode.length; i++) {
                                $('#'+listNode[i].id).css({ "background-color": "#14a4c3" });
                            }
                        } 
                    }
                );                
            });
        }
    }       
    
    toggleFinish(): void {
        super.toggleFinish();
    }    
    
    resize(): void {
        super.resize();
        
        if (this.extension.isRightPanelEnabled()) {
            if (this.isExpanded){
                this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
                this.$element.css({
                    'height': this.$element.height(),
                    'left'  : Math.floor(this.$element.parent().width() - this.$element.outerWidth()),
                    'top'   : "0px"                    
                });
                Shell.$rightPanel.hide();
            } else {
                this.$element.css({
                    'height': Math.floor(this.$element.height() / 2),
                    'left'  : Math.floor(this.$element.parent().width() - this.$element.outerWidth()),
                    'top'   : Math.floor(this.$element.height() / 2)                    
                });
                Shell.$rightPanel.show();
            }
        } else {
            this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
        }  
    }    
        
}

export = OcrRightPanel;