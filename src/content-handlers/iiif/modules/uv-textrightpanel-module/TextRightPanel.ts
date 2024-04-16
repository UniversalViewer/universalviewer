const $ = require("jquery");
import { RightPanel } from "../uv-shared-module/RightPanel";
import { TextRightPanel as TextRightPanelConfig } from "../../BaseConfig";
import { Events } from "../../../../Events";

export class TextRightPanel extends RightPanel<TextRightPanelConfig> {
  $transcribedText: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("textRightPanel");

    super.create();

    this.extensionHost.on(Events.LOAD, async () => {
      this.$main.html('');
      let canvases = this.extension.getCurrentCanvases();
      canvases.sort((a, b) => (a.index as number - b.index as number));
      for (let i = 0; i < canvases.length; i++) {
        const c = canvases[i];
        let seeAlso = c.getProperty("seeAlso");
        let header;
        if (i === 0 && canvases.length > 1) {
          header = this.content.leftPage;
        } else if (i === 1 && canvases.length > 1) {
          header = this.content.rightPage;
        }
        // We need to see if seeAlso contains an ALTO file and maybe allow for other HTR/OCR formats in the future
        // and make sure which version of IIIF Presentation API is used
        if (seeAlso.length === undefined) { // This is IIIF Presentation API < 3
          if (seeAlso.profile.includes('alto')) {
            await this.processAltoFile(seeAlso['@id'], header);
          }
        } else { // This is IIIF Presentation API 3
          if (seeAlso[0].profile.includes('alto')) {
            await this.processAltoFile(seeAlso[0]['id'], header);
          }
        }
      };
    });

    this.setTitle(this.config.content.title);
  }

  toggleFinish(): void {
    super.toggleFinish();
  }


  resize(): void {
    super.resize();

    this.$main.height(
      this.$element.height() - this.$top.height() - this.$main.verticalMargins()
    );

    /*     this.$element.css({
          left: Math.floor(
            this.$element.parent().width() - this.$element.outerWidth() - this.options.panelCollapsedWidth
          ),
        }); */
  }

  // Let's load the ALTO file and do some parsing
  processAltoFile = async (altoUrl, header?): Promise<void> => {
    try {
      const response = await fetch(altoUrl);
      const data = await response.text();
      const altoDoc = new DOMParser().parseFromString(data, 'application/xml');
      const textLines = altoDoc.querySelectorAll('TextLine');
      let lines = Array.from(textLines).map((e, i) => {
        const strings = e.querySelectorAll('String');
        var t = Array.from(strings).map((e, i) => {
          return e.getAttribute("CONTENT")
        });
        let line = $('<p>' + t.join(' ') + '</p>');
        return line;
      });
      this.$transcribedText = $('<div class="transcribed-text"></div>');
      if (header) {
        this.$transcribedText.append($('<div class="label">' + header + '</div>'));
      }
      if (lines.length > 0) {
        this.$transcribedText.append(lines);
      } else {
        this.$transcribedText.append($('<div>' + this.content.textNotFound + '</div>'));
      }
      this.$main.append(this.$transcribedText);
    } catch (error) {
      throw new Error('Unable to fetch Alto file: ' + error.message);
    }
  }

}
