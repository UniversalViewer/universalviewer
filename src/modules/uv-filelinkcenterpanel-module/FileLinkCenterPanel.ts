import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {CenterPanel} from "../uv-shared-module/CenterPanel";
import {UVUtils} from "../uv-shared-module/Utils";

export class FileLinkCenterPanel extends CenterPanel {

    $scroll: JQuery;
    $downloadItems: JQuery;
    $downloadItemTemplate: JQuery;

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

        this.$downloadItems = $('<ol></ol>');
        this.$scroll.append(this.$downloadItems);

        this.$downloadItemTemplate = $('<li><img><div class="col2"><a class="filename" target="_blank" download></a><span class="label"></span><a class="description" target="_blank" download></a></div></li>');

        this.title = this.extension.helper.getLabel();
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {
            
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
            const annotations: Manifesto.IAnnotation[] = canvas.getContent();

            let $item: JQuery;

            for (let i = 0; i < annotations.length; i++) {
                const annotation: Manifesto.IAnnotation = annotations[i];

                if (!annotation.getBody().length) {
                    continue;
                }

                $item = this.$downloadItemTemplate.clone();
                const $fileName: JQuery = $item.find('.filename');
                const $label: JQuery = $item.find('.label');
                const $thumb: JQuery = $item.find('img');
                const $description: JQuery = $item.find('.description');

                const annotationBody: Manifesto.IAnnotationBody = annotation.getBody()[0];

                const id: string | null = annotationBody.getProperty('id');

                if (id) {
                    $fileName.prop('href', id);
                    $fileName.text(id.substr(id.lastIndexOf('/') + 1));
                }

                let label: string | null = Manifesto.TranslationCollection.getValue(annotationBody.getLabel());

                if (label) {
                    $label.text(UVUtils.sanitize(label));
                }

                const thumbnail: string = annotation.getProperty('thumbnail');

                if (thumbnail) {
                    $thumb.prop('src', thumbnail);
                } else {
                    $thumb.hide();
                }

                let description: string | null = annotationBody.getProperty('description');

                if (description) {
                    $description.text(UVUtils.sanitize(description));

                    if (id) {
                        $description.prop('href', id);
                    }
                }

                this.$downloadItems.append($item);
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