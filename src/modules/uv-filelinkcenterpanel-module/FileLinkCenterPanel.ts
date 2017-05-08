import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";
import {UVUtils} from "../uv-shared-module/Utils";

export class FileLinkCenterPanel extends CenterPanel {

    $scroll: JQuery;
    $downloadLinks: JQuery;
    $downloadLinkTemplate: JQuery;

    title: string | null;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('fileLinkCenterPanel');

        super.create();

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            this.openMedia(resources);
        });

        this.$scroll = $('<div class="scroll"><div>');
        this.$content.append(this.$scroll);

        this.$downloadLinks = $('<ul></ul>');
        this.$scroll.append(this.$downloadLinks);

        this.$downloadLinkTemplate = $('<li><img><a target="_blank" download></a></li>');

        this.title = this.extension.helper.getLabel();
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
            const annotations: Manifesto.IAnnotation[] = canvas.getContent();

            let $link: JQuery;

            for (let i = 0; i < annotations.length; i++) {
                const annotation: Manifesto.IAnnotation = annotations[i];

                if (!annotation.getBody().length) {
                    continue;
                }

                $link = this.$downloadLinkTemplate.clone();
                const $a: JQuery = $link.find('a');
                const $img: JQuery = $link.find('img');
                const annotationBody: Manifesto.IAnnotationBody = annotation.getBody()[0];
                $a.prop('href', annotationBody.getProperty('id'));
                let label: string | null = Manifesto.TranslationCollection.getValue(annotationBody.getLabel());

                if (label) {
                    $a.text(String.format(this.content.downloadLink, UVUtils.sanitize(label)));
                }

                const thumbnail: string = annotation.getProperty('thumbnail');

                if (thumbnail) {
                    $img.prop('src', thumbnail);
                } else {
                    $img.hide();
                }

                this.$downloadLinks.append($link);
            }

        });
    }

    resize() {
        super.resize();

        if (this.title) {
            this.$title.ellipsisFill(this.title);
        }

        this.$scroll.height(this.$content.height() - this.$scroll.verticalMargins());
    }
}