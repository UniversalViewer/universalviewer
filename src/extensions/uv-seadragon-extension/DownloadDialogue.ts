import {BaseEvents} from "../../modules/uv-shared-module/BaseEvents";
import {CroppedImageDimensions} from "./CroppedImageDimensions";
import {DownloadDialogue as BaseDownloadDialogue} from "../../modules/uv-dialogues-module/DownloadDialogue";
import {DownloadOption} from "../../modules/uv-shared-module/DownloadOption";
import {ISeadragonExtension} from "./ISeadragonExtension";
import Size = Manifesto.Size;
import { IRenderingOption } from "../../modules/uv-shared-module/IRenderingOption";

export class DownloadDialogue extends BaseDownloadDialogue {

    $canvasOptions: JQuery;
    $canvasOptionsContainer: JQuery;
    $currentViewAsJpgButton: JQuery;
    $downloadButton: JQuery;
    $explanatoryTextTemplate: JQuery;
    $imageOptions: JQuery;
    $imageOptionsContainer: JQuery;
    $manifestOptions: JQuery;
    $manifestOptionsContainer: JQuery;
    $pagingNote: JQuery;
    $selectionButton: JQuery;
    $settingsButton: JQuery;
    $wholeImageHighResButton: JQuery;
    $wholeImageLowResAsJpgButton: JQuery;
    $wholeImagesHighResButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('downloadDialogue');

        super.create();

        // create ui.
        this.$settingsButton = $('<a class="settings" href="#">' + this.content.editSettings + '</a>');
        this.$pagingNote = $('<div class="pagingNote">' + this.content.pagingNote + ' </div>');
        this.$pagingNote.append(this.$settingsButton);
        this.$content.append(this.$pagingNote);

        this.$imageOptionsContainer = $('<li class="group image"></li>');
        this.$downloadOptions.append(this.$imageOptionsContainer);
        this.$imageOptions = $('<ul></ul>');
        this.$imageOptionsContainer.append(this.$imageOptions);

        this.$currentViewAsJpgButton = $('<li class="option single"><input id="' + DownloadOption.CURRENT_VIEW + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption.CURRENT_VIEW + '"></label></li>');
        this.$imageOptions.append(this.$currentViewAsJpgButton);
        this.$currentViewAsJpgButton.hide();

        this.$wholeImageHighResButton = $('<li class="option single"><input id="' + DownloadOption.WHOLE_IMAGE_HIGH_RES + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.WHOLE_IMAGE_HIGH_RES + 'label" for="' + DownloadOption.WHOLE_IMAGE_HIGH_RES + '"></label></li>');
        this.$imageOptions.append(this.$wholeImageHighResButton);
        this.$wholeImageHighResButton.hide();

        this.$wholeImagesHighResButton = $('<li class="option multiple"><input id="' + DownloadOption.WHOLE_IMAGES_HIGH_RES + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.WHOLE_IMAGES_HIGH_RES + 'label" for="' + DownloadOption.WHOLE_IMAGES_HIGH_RES + '"></label></li>');
        this.$imageOptions.append(this.$wholeImagesHighResButton);
        this.$wholeImageHighResButton.hide();

        this.$wholeImageLowResAsJpgButton = $('<li class="option single"><input id="' + DownloadOption.WHOLE_IMAGE_LOW_RES + '" type="radio" name="downloadOptions" tabindex="0" /><label for="' + DownloadOption.WHOLE_IMAGE_LOW_RES + '">' + this.content.wholeImageLowResAsJpg + '</label></li>');
        this.$imageOptions.append(this.$wholeImageLowResAsJpgButton);
        this.$wholeImageLowResAsJpgButton.hide();

        this.$canvasOptionsContainer = $('<li class="group canvas"></li>');
        this.$downloadOptions.append(this.$canvasOptionsContainer);
        this.$canvasOptions = $('<ul></ul>');
        this.$canvasOptionsContainer.append(this.$canvasOptions);

        this.$manifestOptionsContainer = $('<li class="group manifest"></li>');
        this.$downloadOptions.append(this.$manifestOptionsContainer);
        this.$manifestOptions = $('<ul></ul>');
        this.$manifestOptionsContainer.append(this.$manifestOptions);

        this.$selectionButton = $('<li class="option"><input id="' + DownloadOption.SELECTION + '" type="radio" name="downloadOptions" tabindex="0" /><label id="' + DownloadOption.SELECTION + 'label" for="' + DownloadOption.SELECTION + '"></label></li>');
        this.$manifestOptions.append(this.$selectionButton);
        this.$selectionButton.hide();

        this.$downloadButton = $('<a class="btn btn-primary" href="#" tabindex="0">' + this.content.download + '</a>');
        this.$buttons.prepend(this.$downloadButton);

        this.$explanatoryTextTemplate = $('<span class="explanatory"></span>');

        const that = this;
        
        // what happens on download is specific to the extension (except for renderings which need to be moved to the base download dialogue)
        // todo: we need to make everything a list of radio button options in the base class, then we can unify everything into a single render method
        this.$downloadButton.on('click', (e) => {
            e.preventDefault();

            const $selectedOption: JQuery = that.getSelectedOption();

            const id: string = $selectedOption.attr('id');
            const label: string = $selectedOption.attr('title');
            const mime: any = $selectedOption.data('mime');
            let type: string = DownloadOption.UNKNOWN;
            const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

            if (this.renderingUrls[<any>id]) {
                if (mime) {
                    if (mime.toLowerCase().indexOf('pdf') !== -1) {
                        type = DownloadOption.ENTIRE_DOCUMENT_AS_PDF;
                    } else if (mime.toLowerCase().indexOf('txt') !== -1) {
                        type = DownloadOption.ENTIRE_DOCUMENT_AS_TEXT;
                    }
                }

                if (type = DownloadOption.ENTIRE_DOCUMENT_AS_PDF) {
                    //var printService: Manifesto.IService = this.extension.helper.manifest.getService(manifesto.ServiceProfile.printExtensions());
                    
                    // if downloading a pdf - if there's a print service, generate an event instead of opening a new window.
                    // if (printService && this.extension.isOnHomeDomain()){
                    //     this.component.publish(Events.PRINT);
                    // } else {
                        window.open(this.renderingUrls[<any>id]);
                    //}
                }
            } else {
                type = id;
                switch (type) {
                    case DownloadOption.CURRENT_VIEW:
                        const viewer: any = (<ISeadragonExtension>that.extension).getViewer();
                        window.open(<string>(<ISeadragonExtension>that.extension).getCroppedImageUri(canvas, viewer));
                        break;
                    case DownloadOption.SELECTION:
                        Utils.Async.waitFor(() => {
                            return !this.isActive;
                        }, () => {
                            this.component.publish(BaseEvents.SHOW_MULTISELECT_DIALOGUE);
                        });
                        break;
                    case DownloadOption.WHOLE_IMAGE_HIGH_RES:
                        window.open(this.getCanvasHighResImageUri(this.extension.helper.getCurrentCanvas()));
                        break;
                    case DownloadOption.WHOLE_IMAGES_HIGH_RES:
                        const indices: number[] = this.extension.getPagedIndices();

                        for (let i = 0; i < indices.length; i++) {
                            window.open(this.getCanvasHighResImageUri(this.extension.helper.getCanvasByIndex(indices[i])));
                        }

                        break;
                    case DownloadOption.WHOLE_IMAGE_LOW_RES:
                        const imageUri: string | null = (<ISeadragonExtension>that.extension).getConfinedImageUri(canvas, that.options.confinedImageSize);

                        if (imageUri) {
                            window.open(imageUri);
                        }
                        break;
                }
            }

            this.component.publish(BaseEvents.DOWNLOAD, {
                "type": type,
                "label": label
            });

            this.close();
        });

        this.$settingsButton.onPressed(() => {
            this.component.publish(BaseEvents.HIDE_DOWNLOAD_DIALOGUE);
            this.component.publish(BaseEvents.SHOW_SETTINGS_DIALOGUE);
        });
    }

    open(triggerButton?: HTMLElement) {
        super.open(triggerButton);

        const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

        const rotation: number = <number>(<ISeadragonExtension>this.extension).getViewerRotation();
        const hasNormalDimensions: boolean = rotation % 180 == 0;

        if (this.isDownloadOptionAvailable(DownloadOption.CURRENT_VIEW)) {
            const $input: JQuery = this.$currentViewAsJpgButton.find('input');
            const $label: JQuery = this.$currentViewAsJpgButton.find('label');

            let label: string = this.content.currentViewAsJpg;
            const viewer = (<ISeadragonExtension>this.extension).getViewer();
            const dimensions: CroppedImageDimensions | null = (<ISeadragonExtension>this.extension).getCroppedImageDimensions(canvas, viewer);

            // dimensions
            if (dimensions) {
                label = hasNormalDimensions ?
                  Utils.Strings.format(label, dimensions.size.width.toString(), dimensions.size.height.toString()) :
                  Utils.Strings.format(label, dimensions.size.height.toString(), dimensions.size.width.toString());
                $label.text(label);
                $input.prop('title', label);
                this.$currentViewAsJpgButton.data('width', dimensions.size.width);
                this.$currentViewAsJpgButton.data('height', dimensions.size.height);
                this.$currentViewAsJpgButton.show();
            } else {
                this.$currentViewAsJpgButton.hide();
            }

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                const text: string = this.content.currentViewAsJpgExplanation;
                if (text) {
                    const $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$currentViewAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.WHOLE_IMAGE_HIGH_RES)) {
            const $input: JQuery = this.$wholeImageHighResButton.find('input');
            const $label: JQuery = this.$wholeImageHighResButton.find('label');
            let mime: string | null = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());

            if (mime) {
                mime = Utils.Files.simplifyMimeType(mime);
            } else {
                mime = '?';
            }

            // dimensions
            const size: Size | null = this.getCanvasComputedDimensions(this.extension.helper.getCurrentCanvas());

            if (!size) {
                // if there is no image service, allow the image to be downloaded directly.
                if (canvas.externalResource && !canvas.externalResource.hasServiceDescriptor()) {
                    const label: string = Utils.Strings.format(this.content.wholeImageHighRes, '?', '?', mime);
                    $label.text(label);
                    $input.prop('title', label);
                    this.$wholeImageHighResButton.show();
                } else {
                    this.$wholeImageHighResButton.hide();
                }
            } else {
                const label: string = hasNormalDimensions ?
                  Utils.Strings.format(this.content.wholeImageHighRes, size.width.toString(), size.height.toString(), mime) :
                  Utils.Strings.format(this.content.wholeImageHighRes, size.height.toString(), size.width.toString(), mime);
                $label.text(label);
                $input.prop('title', label);

                this.$wholeImageHighResButton.data('width', size.width);
                this.$wholeImageHighResButton.data('height', size.height);
                
                this.$wholeImageHighResButton.show();
            }

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                const text: string = this.content.wholeImageHighResExplanation;
                if (text) {
                    const $span: JQuery = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$wholeImageHighResButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.WHOLE_IMAGES_HIGH_RES)) {
            const $input: JQuery = this.$wholeImagesHighResButton.find('input');
            const $label: JQuery = this.$wholeImagesHighResButton.find('label');
            let mime: string | null = this.getCanvasMimeType(this.extension.helper.getCurrentCanvas());

            if (mime) {
                mime = Utils.Files.simplifyMimeType(mime);
            } else {
                mime = '?';
            }
            
            const label: string = Utils.Strings.format(this.content.wholeImagesHighRes, mime);
            $label.text(label);
            $input.prop('title', label);

            this.$wholeImagesHighResButton.show();

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                const text: string = this.content.wholeImagesHighResExplanation;
                if (text) {
                    const $span: JQuery = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$wholeImagesHighResButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.WHOLE_IMAGE_LOW_RES)) {
            const $input: JQuery = this.$wholeImageLowResAsJpgButton.find('input');
            const $label: JQuery = this.$wholeImageLowResAsJpgButton.find('label');
            const size: Size | null = (<ISeadragonExtension>this.extension).getConfinedImageDimensions(canvas, this.options.confinedImageSize);
            const label = hasNormalDimensions ?
              Utils.Strings.format(this.content.wholeImageLowResAsJpg, size.width.toString(), size.height.toString()) :
              Utils.Strings.format(this.content.wholeImageLowResAsJpg, size.height.toString(), size.width.toString());
            $label.text(label);
            $input.prop('title', label);
            this.$wholeImageLowResAsJpgButton.data('width', size.width);
            this.$wholeImageLowResAsJpgButton.data('height', size.height);
            this.$wholeImageLowResAsJpgButton.show();

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                const text: string = this.content.wholeImageLowResAsJpgExplanation;
                if (text) {
                    const $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$wholeImageLowResAsJpgButton.hide();
        }

        if (this.isDownloadOptionAvailable(DownloadOption.SELECTION)) {
            const $input: JQuery = this.$selectionButton.find('input');
            const $label: JQuery = this.$selectionButton.find('label');
            $label.text(this.content.downloadSelection);
            $input.prop('title', this.content.downloadSelection);
            this.$selectionButton.show();

            // explanatory text
            if (Utils.Bools.getBool(this.options.optionsExplanatoryTextEnabled, false)) {                
                const text: string = this.content.selectionExplanation;
                if (text) {
                    const $span = this.$explanatoryTextTemplate.clone();
                    $span.text(text);
                    $label.append($span);
                }                
            }
        } else {
            this.$selectionButton.hide();
        }

        this.resetDynamicDownloadOptions();

        if (this.isDownloadOptionAvailable(DownloadOption.RANGE_RENDERINGS)) {
            
            if (canvas.ranges && canvas.ranges.length) {
                for (let i = 0; i < canvas.ranges.length; i++) {
                    const range: Manifesto.IRange = canvas.ranges[i];
                    const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(range, this.content.entireFileAsOriginal, DownloadOption.CANVAS_RENDERINGS);
                    this.addDownloadOptionsForRenderings(renderingOptions);
                }
            }
        }

        if (this.isDownloadOptionAvailable(DownloadOption.IMAGE_RENDERINGS)) {
            const images: Manifesto.IAnnotation[] = canvas.getImages();
            for (let i = 0; i < images.length; i++) {
                const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(images[i].getResource(), this.content.entireFileAsOriginal, DownloadOption.IMAGE_RENDERINGS);
                this.addDownloadOptionsForRenderings(renderingOptions);
            }
        }

        if (this.isDownloadOptionAvailable(DownloadOption.CANVAS_RENDERINGS)) {
            const renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(canvas, this.content.entireFileAsOriginal, DownloadOption.CANVAS_RENDERINGS);
            this.addDownloadOptionsForRenderings(renderingOptions);
        }

        if (this.isDownloadOptionAvailable(DownloadOption.MANIFEST_RENDERINGS)) {
            let renderingOptions: IRenderingOption[] = this.getDownloadOptionsForRenderings(this.extension.helper.getCurrentSequence(), this.content.entireDocument, DownloadOption.MANIFEST_RENDERINGS);
            
            if (!renderingOptions.length) {
                renderingOptions = this.getDownloadOptionsForRenderings(this.extension.helper.manifest, this.content.entireDocument, DownloadOption.MANIFEST_RENDERINGS);
            }
            
            this.addDownloadOptionsForRenderings(renderingOptions);
        }

        // hide the current view option if it's equivalent to whole image.
        if (this.isDownloadOptionAvailable(DownloadOption.CURRENT_VIEW)) {
            const currentWidth: number = parseInt(this.$currentViewAsJpgButton.data('width').toString());
            const currentHeight: number = parseInt(this.$currentViewAsJpgButton.data('height').toString());
            const wholeWidth: number = parseInt(this.$wholeImageHighResButton.data('width').toString());
            const wholeHeight: number = parseInt(this.$wholeImageHighResButton.data('height').toString());

            const percentageWidth: number = (currentWidth / wholeWidth) * 100;
            const percentageHeight: number = (currentHeight / wholeHeight) * 100;

            const disabledPercentage: number = this.options.currentViewDisabledPercentage;

            // if over disabledPercentage of the size of whole image
            if (percentageWidth >= disabledPercentage && percentageHeight >= disabledPercentage) {
                this.$currentViewAsJpgButton.hide();
            } else {
                this.$currentViewAsJpgButton.show();
            }
        }

        // order by image area
        let $options: any = this.$imageOptions.find('li.single');

        $options = $options.sort((a: any, b: any) => {
            let aWidth: any = $(a).data('width');
            aWidth ? aWidth = parseInt(aWidth.toString()) : 0;

            let aHeight: any = $(a).data('height');
            aHeight ? aHeight = parseInt(aHeight.toString()) : 0;

            let bWidth: any = $(b).data('width');
            bWidth ? bWidth = parseInt(bWidth.toString()) : 0;

            let bHeight: any = $(b).data('height');
            bHeight ? bHeight = parseInt(bHeight.toString()) : 0;
            
            const aArea: number = aWidth * aHeight;
            const bArea: number = bWidth * bHeight;

            if (aArea < bArea) {
                return -1;
            }

            if (aArea > bArea) {
                return 1;
            }

            return 0; 
        });

        $options.detach().appendTo(this.$imageOptions);

        // hide empty groups
        const $groups: JQuery = this.$downloadOptions.find('li.group');

        $groups.each((index: number, group: Element) => {
            const $group: JQuery = $(group);

            $group.show();

            if ($group.find('li.option:hidden').length === $group.find('li.option').length) {
                // all options are hidden, hide group.
                $group.hide();
            }
        });

        this.$downloadOptions.find('li.group:visible').last().addClass('lastVisible');

        if ((<ISeadragonExtension>this.extension).isPagingSettingEnabled() && (this.config.options.downloadPagingNoteEnabled)) {
            this.$pagingNote.show();
        } else {
            this.$pagingNote.hide();
        }

        if (!this.$downloadOptions.find('li.option:visible').length) {
            this.$noneAvailable.show();
            this.$downloadButton.hide();
        } else {
            // select first option.
            this.$downloadOptions.find('li.option input:visible:first').prop("checked", true);
            this.$noneAvailable.hide();
            this.$downloadButton.show();
        }

        this.resize();
    }

    addDownloadOptionsForRenderings(renderingOptions: IRenderingOption[]): void {

        renderingOptions.forEach((option: IRenderingOption) => {
            switch (option.type) {
                case DownloadOption.IMAGE_RENDERINGS:
                    this.$imageOptions.append(option.button);
                    break;
                case DownloadOption.CANVAS_RENDERINGS:
                    this.$canvasOptions.append(option.button);
                    break;
                case DownloadOption.MANIFEST_RENDERINGS:
                    this.$manifestOptions.append(option.button);
                    break;
            }
        });

    }

    getCanvasImageResource(canvas: Manifesto.ICanvas): Manifesto.IResource | null {
        const images: Manifesto.IAnnotation[] = canvas.getImages();
        if (images[0]) {
            return images[0].getResource();
        }
        return null;
    }

    getCanvasHighResImageUri(canvas: Manifesto.ICanvas): string {
        const size: Size | null = this.getCanvasComputedDimensions(canvas);
        
        if (size) {
            const width: number = size.width;
            let uri: string = canvas.getCanonicalImageUri(width);

            if (canvas.externalResource && canvas.externalResource.hasServiceDescriptor()) {
                const uri_parts: string [] = uri.split('/');
                const rotation: number = <number>(<ISeadragonExtension>this.extension).getViewerRotation();
                uri_parts[uri_parts.length - 2] = String(rotation);
                uri = uri_parts.join('/');
            }
            
            return uri;
        } else if (canvas.externalResource && !canvas.externalResource.hasServiceDescriptor()) {
            // if there is no image service, return the dataUri.
            return <string>canvas.externalResource.dataUri;
        }
        return '';
    }

    getCanvasMimeType(canvas: Manifesto.ICanvas): string | null {
        const resource: Manifesto.IResource | null = this.getCanvasImageResource(canvas);

        if (resource) {
            const format: Manifesto.MediaType | null = resource.getFormat();

            if (format) {
                return format.toString();
            }
        }

        return null;
    }

    getCanvasDimensions(canvas: Manifesto.ICanvas): Size | null {

        // externalResource may not have loaded yet
        if (canvas.externalResource.data) {
            const width: number | undefined = (<Manifesto.IExternalImageResourceData>canvas.externalResource.data).width;
            const height: number | undefined = (<Manifesto.IExternalImageResourceData>canvas.externalResource.data).height;
            if (width && height) {
                return new Size(width, height);
            }
        }
        
        return null;
    }

    getCanvasComputedDimensions(canvas: Manifesto.ICanvas): Size | null {
        const imageSize: Size | null = this.getCanvasDimensions(canvas);
        const requiredSize: Size | null =  canvas.getMaxDimensions();

        if (!imageSize) {
            return null;
        }

        if (!requiredSize) {
            return imageSize;
        }

        if (imageSize.width <= requiredSize.width && imageSize.height <= requiredSize.height) {
            return imageSize;
        }

        const scaleW: number = requiredSize.width / imageSize.width;
        const scaleH: number = requiredSize.height / imageSize.height;
        const scale: number = Math.min(scaleW, scaleH);

        return new Size(Math.floor(imageSize.width * scale), Math.floor(imageSize.height * scale));
    }

    private _isLevel0(profile: any): boolean {
        if (!profile || !profile.length) return false;

        return manifesto.Utils.isLevel0ImageProfile(profile[0]);
    }

    isDownloadOptionAvailable(option: DownloadOption): boolean {

        if (!this.extension.resources) {
            return false;
        }

        const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();

        // if the external resource doesn't have a service descriptor or is level 0
        // only allow wholeImageHighRes
        if (!canvas.externalResource.hasServiceDescriptor() || this._isLevel0(canvas.externalResource.data.profile)) {
            if (option === DownloadOption.WHOLE_IMAGE_HIGH_RES) {
                // if in one-up mode, or in two-up mode with a single page being shown
                if (!(<ISeadragonExtension>this.extension).isPagingSettingEnabled() || 
                    (<ISeadragonExtension>this.extension).isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length === 1) {

                    return true;
                }
            }
            return false;
        }

        switch (option) {
            case DownloadOption.CURRENT_VIEW:
            case DownloadOption.CANVAS_RENDERINGS:
            case DownloadOption.IMAGE_RENDERINGS:
            case DownloadOption.WHOLE_IMAGE_HIGH_RES:
                // if in one-up mode, or in two-up mode with a single page being shown
                if (!(<ISeadragonExtension>this.extension).isPagingSettingEnabled() || 
                    (<ISeadragonExtension>this.extension).isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length === 1) {
                    const maxDimensions: Size | null = canvas.getMaxDimensions();
                    
                    if (maxDimensions) {
                        if (maxDimensions.width <= this.options.maxImageWidth) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            case DownloadOption.WHOLE_IMAGES_HIGH_RES:
                if ((<ISeadragonExtension>this.extension).isPagingSettingEnabled() && this.extension.resources && this.extension.resources.length > 1) {
                    return true;
                }
                return false;
            case DownloadOption.WHOLE_IMAGE_LOW_RES:
                // hide low-res option if hi-res width is smaller than constraint
                const size: Size | null = this.getCanvasComputedDimensions(canvas);
                if (!size) {
                    return false;
                }
                return (!(<ISeadragonExtension>this.extension).isPagingSettingEnabled() && (size.width > this.options.confinedImageSize));
            case DownloadOption.SELECTION:
                return this.options.selectionEnabled;
            case DownloadOption.RANGE_RENDERINGS:                
                if (canvas.ranges && canvas.ranges.length) {
                    const range: Manifesto.IRange = canvas.ranges[0];
                    return range.getRenderings().length > 0;
                }
                return false;
            default:
                return super.isDownloadOptionAvailable(option);
        }
    }
}
