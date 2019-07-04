import { AnnotationResults } from "../../modules/uv-shared-module/AnnotationResults";
import { BaseEvents } from "../../modules/uv-shared-module/BaseEvents";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { Bookmark } from "../../modules/uv-shared-module/Bookmark";
import { Bounds } from "./Bounds";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { CroppedImageDimensions } from "./CroppedImageDimensions";
import { DownloadDialogue } from "./DownloadDialogue";
import { Events } from "./Events";
import { ExternalContentDialogue } from "../../modules/uv-dialogues-module/ExternalContentDialogue";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-osdmobilefooterpanel-module/MobileFooter";
import { FooterPanel } from "../../modules/uv-searchfooterpanel-module/FooterPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { ISeadragonExtension } from "./ISeadragonExtension";
import { ISeadragonExtensionData } from "./ISeadragonExtensionData";
import { Mode } from "./Mode";
import { MoreInfoDialogue } from "../../modules/uv-dialogues-module/MoreInfoDialogue";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { MultiSelectDialogue } from "../../modules/uv-multiselectdialogue-module/MultiSelectDialogue";
import { MultiSelectionArgs } from "./MultiSelectionArgs";
import { PagingHeaderPanel } from "../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel";
import { Point } from "../../modules/uv-shared-module/Point";
import { SeadragonCenterPanel } from "../../modules/uv-seadragoncenterpanel-module/SeadragonCenterPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import IThumb = Manifold.IThumb;
import ITreeNode = Manifold.ITreeNode;
import AnnotationGroup = Manifold.AnnotationGroup;
import AnnotationRect = Manifold.AnnotationRect;
import Size = Manifesto.Size;

export class Extension extends BaseExtension implements ISeadragonExtension {

    $downloadDialogue: JQuery;
    $externalContentDialogue: JQuery;
    $helpDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    annotations: AnnotationGroup[] | null = [];
    centerPanel: SeadragonCenterPanel;
    currentAnnotationRect: AnnotationRect | null;
    currentRotation: number = 0;
    downloadDialogue: DownloadDialogue;
    externalContentDialogue: ExternalContentDialogue;
    footerPanel: FooterPanel;
    headerPanel: PagingHeaderPanel;
    helpDialogue: HelpDialogue;
    isAnnotating: boolean = false;
    leftPanel: ContentLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    mode: Mode;
    moreInfoDialogue: MoreInfoDialogue;
    multiSelectDialogue: MultiSelectDialogue;
    previousAnnotationRect: AnnotationRect | null;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;

    create(): void {
        super.create();

        this.component.subscribe(BaseEvents.METRIC_CHANGED, () => {         
            if (!this.isDesktopMetric()) {
                const settings: ISettings = {};
                settings.pagingEnabled = false;
                this.updateSettings(settings);
                this.component.publish(BaseEvents.UPDATE_SETTINGS);
                this.shell.$rightPanel.hide();
            } else {
                this.shell.$rightPanel.show();
            }
        });

        this.component.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (canvasIndex: number) => {
            this.previousAnnotationRect = null;
            this.currentAnnotationRect = null;
            this.viewPage(canvasIndex);
        });

        this.component.subscribe(BaseEvents.CLEAR_ANNOTATIONS, () => {
            this.clearAnnotations();
            this.component.publish(BaseEvents.ANNOTATIONS_CLEARED);
            this.fire(BaseEvents.CLEAR_ANNOTATIONS);
        });

        this.component.subscribe(BaseEvents.DOWN_ARROW, () => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
        });

        this.component.subscribe(BaseEvents.END, () => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.helper.getLastPageIndex());
        });

        this.component.subscribe(BaseEvents.FIRST, () => {
            this.fire(BaseEvents.FIRST);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.helper.getFirstPageIndex());
        });

        this.component.subscribe(BaseEvents.GALLERY_DECREASE_SIZE, () => {
            this.fire(BaseEvents.GALLERY_DECREASE_SIZE);
        });

        this.component.subscribe(BaseEvents.GALLERY_INCREASE_SIZE, () => {
            this.fire(BaseEvents.GALLERY_INCREASE_SIZE);
        });

        this.component.subscribe(BaseEvents.GALLERY_THUMB_SELECTED, () => {
            this.fire(BaseEvents.GALLERY_THUMB_SELECTED);
        });

        this.component.subscribe(BaseEvents.HOME, () => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.helper.getFirstPageIndex());
        });

        this.component.subscribe(Events.IMAGE_SEARCH, (index: number) => {
            this.fire(Events.IMAGE_SEARCH, index);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, index);
        });

        this.component.subscribe(BaseEvents.LAST, () => {
            this.fire(BaseEvents.LAST);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.helper.getLastPageIndex());
        });

        this.component.subscribe(BaseEvents.LEFT_ARROW, () => {
            if (this.useArrowKeysToNavigate()) {
                this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.getPrevPageIndex());
            } else {
                this.centerPanel.setFocus();
            }
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_START, () => {
            if (this.isDesktopMetric()) {
                this.shell.$rightPanel.show();
            }
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_COLLAPSE_FULL_FINISH, () => {
            this.shell.$centerPanel.show();
            this.resize();
        });

        this.component.subscribe(BaseEvents.LEFTPANEL_EXPAND_FULL_START, () => {
            this.shell.$centerPanel.hide();
            this.shell.$rightPanel.hide();
        });

        this.component.subscribe(BaseEvents.MINUS, () => {
            this.centerPanel.setFocus();
        });

        this.component.subscribe(Events.MODE_CHANGED, (mode: string) => {
            this.fire(Events.MODE_CHANGED, mode);
            this.mode = new Mode(mode);
            const settings: ISettings = this.getSettings();
            this.component.publish(BaseEvents.SETTINGS_CHANGED, settings);
        });

        this.component.subscribe(BaseEvents.MULTISELECTION_MADE, (ids: string[]) => {
            const args: MultiSelectionArgs = new MultiSelectionArgs();
            args.manifestUri = this.helper.iiifResourceUri;
            args.allCanvases = ids.length === this.helper.getCanvases().length;
            args.canvases = ids;
            args.format = this.data.config.options.multiSelectionMimeType;
            args.sequence = this.helper.getCurrentSequence().id;
            this.fire(BaseEvents.MULTISELECTION_MADE, args);
        });

        this.component.subscribe(BaseEvents.NEXT, () => {
            this.fire(BaseEvents.NEXT);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.getNextPageIndex());
        });

        this.component.subscribe(Events.NEXT_SEARCH_RESULT, () => {
            this.fire(Events.NEXT_SEARCH_RESULT);
        });

        this.component.subscribe(Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE, () => {
            this.fire(Events.NEXT_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            this.nextSearchResult();
        });

        this.component.subscribe(Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE, () => {
            this.fire(Events.PREV_IMAGES_SEARCH_RESULT_UNAVAILABLE);
            this.prevSearchResult();
        });

        this.component.subscribe(BaseEvents.OPEN_THUMBS_VIEW, () => {
            this.fire(BaseEvents.OPEN_THUMBS_VIEW);
        });

        this.component.subscribe(BaseEvents.OPEN_TREE_VIEW, () => {
            this.fire(BaseEvents.OPEN_TREE_VIEW);
        });

        this.component.subscribe(BaseEvents.PAGE_DOWN, () => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.getNextPageIndex());
        });

        this.component.subscribe(Events.PAGE_SEARCH, (value: string) => {
            this.fire(Events.PAGE_SEARCH, value);
            this.viewLabel(value);
        });

        this.component.subscribe(BaseEvents.PAGE_UP, () => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.getPrevPageIndex());
        });

        this.component.subscribe(Events.PAGING_TOGGLED, (obj: any) => {
            this.fire(Events.PAGING_TOGGLED, obj);
        });

        this.component.subscribe(BaseEvents.PLUS, () => {
            this.centerPanel.setFocus();
        });

        this.component.subscribe(BaseEvents.PREV, () => {
            this.fire(BaseEvents.PREV);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.getPrevPageIndex());
        });

        this.component.subscribe(Events.PREV_SEARCH_RESULT, () => {
            this.fire(Events.PREV_SEARCH_RESULT);
        });

        this.component.subscribe(Events.PRINT, () => {
            this.print();
        });

        this.component.subscribe(BaseEvents.RELOAD, () => {
            this.component.publish(BaseEvents.CLEAR_ANNOTATIONS);
        });

        this.component.subscribe(BaseEvents.RIGHT_ARROW, () => {
            if (this.useArrowKeysToNavigate()) {
                this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.getNextPageIndex());
            } else {
                this.centerPanel.setFocus();
            }
        });

        this.component.subscribe(Events.SEADRAGON_ANIMATION, () => {
            this.fire(Events.SEADRAGON_ANIMATION);
        });

        this.component.subscribe(Events.SEADRAGON_ANIMATION_FINISH, (viewer: any) => {

            const bounds: Bounds | null = this.centerPanel.getViewportBounds();

            if (this.centerPanel && bounds) {
                this.component.publish(Events.XYWH_CHANGED, bounds.toString());
                (<ISeadragonExtensionData>this.data).xywh = bounds.toString();
                this.fire(Events.XYWH_CHANGED, (<ISeadragonExtensionData>this.data).xywh);
            }

            const canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();

            this.fire(Events.CURRENT_VIEW_URI,
                {
                    cropUri: this.getCroppedImageUri(canvas, this.getViewer()),
                    fullUri: this.getConfinedImageUri(canvas, canvas.getWidth())
                });
        });

        this.component.subscribe(Events.SEADRAGON_ANIMATION_START, () => {
            this.fire(Events.SEADRAGON_ANIMATION_START);
        });

        this.component.subscribe(Events.SEADRAGON_OPEN, () => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
            this.fire(Events.SEADRAGON_OPEN);
        });

        this.component.subscribe(Events.SEADRAGON_RESIZE, () => {
            this.fire(Events.SEADRAGON_RESIZE);
        });

        this.component.subscribe(Events.SEADRAGON_ROTATION, (rotation: number) => {
            (<ISeadragonExtensionData>this.data).rotation = rotation;
            this.fire(Events.SEADRAGON_ROTATION, (<ISeadragonExtensionData>this.data).rotation);
            this.currentRotation = rotation;
        });

        this.component.subscribe(Events.SEARCH, (terms: string) => {
            this.fire(Events.SEARCH, terms);
            this.search(terms);
        });

        this.component.subscribe(Events.SEARCH_PREVIEW_FINISH, () => {
            this.fire(Events.SEARCH_PREVIEW_FINISH);
        });

        this.component.subscribe(Events.SEARCH_PREVIEW_START, () => {
            this.fire(Events.SEARCH_PREVIEW_START);
        });

        this.component.subscribe(BaseEvents.ANNOTATIONS, (obj: any) => {
            this.fire(BaseEvents.ANNOTATIONS, obj);
        });

        this.component.subscribe(BaseEvents.ANNOTATION_CANVAS_CHANGED, (rect: AnnotationRect) => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, rect.canvasIndex);
        });

        this.component.subscribe(BaseEvents.ANNOTATIONS_EMPTY, () => {
            this.fire(BaseEvents.ANNOTATIONS_EMPTY);
        });

        this.component.subscribe(BaseEvents.THUMB_SELECTED, (thumb: IThumb) => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, thumb.index);
        });

        this.component.subscribe(BaseEvents.TREE_NODE_SELECTED, (node: ITreeNode) => {
            this.fire(BaseEvents.TREE_NODE_SELECTED, node.data.path);
            this.treeNodeSelected(node);
        });

        this.component.subscribe(BaseEvents.UP_ARROW, () => {
            if (!this.useArrowKeysToNavigate()) {
                this.centerPanel.setFocus();
            }
        });

        this.component.subscribe(BaseEvents.UPDATE_SETTINGS, () => {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.helper.canvasIndex);
            const settings: ISettings = this.getSettings();
            this.component.publish(BaseEvents.SETTINGS_CHANGED, settings);
        });

        // this.component.subscribe(Events.VIEW_PAGE, (e: any, index: number) => {
        //     this.fire(Events.VIEW_PAGE, index);
        //     this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, [index]);
        // });
    }

    createModules(): void {
        super.createModules();

        if (this.isHeaderPanelEnabled()) {
            this.headerPanel = new PagingHeaderPanel(this.shell.$headerPanel);
        } else {
            this.shell.$headerPanel.hide();
        }

        if (this.isLeftPanelEnabled()) {
            this.leftPanel = new ContentLeftPanel(this.shell.$leftPanel);
        } else {
            this.shell.$leftPanel.hide();
        }

        this.centerPanel = new SeadragonCenterPanel(this.shell.$centerPanel);

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

        this.$helpDialogue = $('<div class="overlay help" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$helpDialogue);
        this.helpDialogue = new HelpDialogue(this.$helpDialogue);

        this.$moreInfoDialogue = $('<div class="overlay moreInfo" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$moreInfoDialogue);
        this.moreInfoDialogue = new MoreInfoDialogue(this.$moreInfoDialogue);

        this.$multiSelectDialogue = $('<div class="overlay multiSelect" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$multiSelectDialogue);
        this.multiSelectDialogue = new MultiSelectDialogue(this.$multiSelectDialogue);

        this.$shareDialogue = $('<div class="overlay share" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$shareDialogue);
        this.shareDialogue = new ShareDialogue(this.$shareDialogue);

        this.$downloadDialogue = $('<div class="overlay download" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$downloadDialogue);
        this.downloadDialogue = new DownloadDialogue(this.$downloadDialogue);

        this.$settingsDialogue = $('<div class="overlay settings" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$settingsDialogue);
        this.settingsDialogue = new SettingsDialogue(this.$settingsDialogue);

        this.$externalContentDialogue = $('<div class="overlay externalContent" aria-hidden="true"></div>');
        this.shell.$overlays.append(this.$externalContentDialogue);
        this.externalContentDialogue = new ExternalContentDialogue(this.$externalContentDialogue);

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

    render(): void {
        super.render();

        //Utils.Async.waitFor(() => {
        //    return this.centerPanel && this.centerPanel.isCreated;
        //}, () => {

        this.checkForAnnotations();
        this.checkForSearchParam();
        this.checkForRotationParam();

        //});
    }

    checkForAnnotations(): void {
        if (this.data.annotations) {
            const annotations: AnnotationGroup[] = this.parseAnnotationList(this.data.annotations);
            this.component.publish(BaseEvents.CLEAR_ANNOTATIONS);
            this.annotate(annotations);
        }
    }

    annotate(annotations: AnnotationGroup[], terms?: string): void {
        this.annotations = annotations;

        // sort the annotations by canvasIndex
        this.annotations = annotations.sort((a: AnnotationGroup, b: AnnotationGroup) => {
            return a.canvasIndex - b.canvasIndex;
        });

        const annotationResults: AnnotationResults = new AnnotationResults();
        annotationResults.terms = terms;
        annotationResults.annotations = <AnnotationGroup[]>this.annotations;

        this.component.publish(BaseEvents.ANNOTATIONS, annotationResults);

        // reload current index as it may contain annotations.
        //this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, [this.helper.canvasIndex]);
    }

    checkForSearchParam(): void {
        // if a highlight param is set, use it to search.
        const highlight: string | null = (<ISeadragonExtensionData>this.data).highlight;

        if (highlight) {
            highlight.replace(/\+/g, " ").replace(/"/g, "");
            this.component.publish(Events.SEARCH, highlight);
        }
    }

    checkForRotationParam(): void {
        // if a rotation value is passed, set rotation
        const rotation: number | null = (<ISeadragonExtensionData>this.data).rotation;

        if (rotation) {
            this.component.publish(Events.SEADRAGON_ROTATION, rotation);
        }
    }

    viewPage(canvasIndex: number): void {

        // if it's an invalid canvas index.
        if (canvasIndex === -1) return;

        let isReload: boolean = false;

        if (canvasIndex === this.helper.canvasIndex) {
            isReload = true;
        }

        if (this.helper.isCanvasIndexOutOfRange(canvasIndex)) {
            this.showMessage(this.data.config.content.canvasIndexOutOfRange);
            canvasIndex = 0;
        }

        if (this.isPagingSettingEnabled() && !isReload) {
            const indices: number[] = this.getPagedIndices(canvasIndex);

            // if the page is already displayed, only advance canvasIndex.
            if (indices.includes(this.helper.canvasIndex)) {
                this.viewCanvas(canvasIndex);
                return;
            }
        }

        this.viewCanvas(canvasIndex);
    }

    getViewer() {
        return this.centerPanel.viewer;
    }

    getMode(): Mode {
        if (this.mode) return this.mode;

        switch (this.helper.getManifestType().toString()) {
            case manifesto.ManifestType.monograph().toString():
                return Mode.page;
            case manifesto.ManifestType.manuscript().toString():
                return Mode.page;
            default:
                return Mode.image;
        }
    }

    getViewportBounds(): string | null {
        if (!this.centerPanel) return null;
        const bounds = this.centerPanel.getViewportBounds();
        if (bounds) {
            return bounds.toString();
        }
        return null;
    }

    getViewerRotation(): number | null {
        if (!this.centerPanel) return null;
        return this.currentRotation;
    }

    viewRange(path: string): void {
        //this.currentRangePath = path;
        const range: Manifesto.IRange | null = this.helper.getRangeByPath(path);
        if (!range) return;
        const canvasId: string = range.getCanvasIds()[0];
        const index: number | null = this.helper.getCanvasIndexById(canvasId);
        this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, index);
    }

    viewLabel(label: string): void {

        if (!label) {
            this.showMessage(this.data.config.modules.genericDialogue.content.emptyValue);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
            return;
        }

        const index: number = this.helper.getCanvasIndexByLabel(label);

        if (index != -1) {
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, index);
        } else {
            this.showMessage(this.data.config.modules.genericDialogue.content.pageNotFound);
            this.component.publish(BaseEvents.CANVAS_INDEX_CHANGE_FAILED);
        }
    }

    treeNodeSelected(node: ITreeNode): void {
        const data: any = node.data;

        if (!data.type) return;

        switch (data.type) {
            case manifesto.IIIFResourceType.manifest().toString():
                this.viewManifest(data);
                break;
            case manifesto.IIIFResourceType.collection().toString():
                // note: this won't get called as the tree component now has branchNodesSelectable = false
                // useful to keep around for reference
                this.viewCollection(data);
                break;
            default:
                this.viewRange(data.path);
                break;
        }
    }

    clearAnnotations(): void {
        this.annotations = null;

        // reload current index as it may contain results.
        this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, this.helper.canvasIndex);
    }

    prevSearchResult(): void {
        let foundResult: AnnotationGroup;
        if (!this.annotations) return;

        // get the first result with a canvasIndex less than the current index.
        for (let i = this.annotations.length - 1; i >= 0; i--) {
            const result: AnnotationGroup = this.annotations[i];

            if (result.canvasIndex <= this.getPrevPageIndex()) {
                foundResult = result;
                this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, foundResult.canvasIndex);
                break;
            }
        }
    }

    nextSearchResult(): void {
        if (!this.annotations) return;

        // get the first result with an index greater than the current index.
        for (let i = 0; i < this.annotations.length; i++) {
            const result: AnnotationGroup = this.annotations[i];

            if (result && result.canvasIndex >= this.getNextPageIndex()) {
                this.component.publish(BaseEvents.CANVAS_INDEX_CHANGED, result.canvasIndex);
                break;
            }
        }
    }

    bookmark(): void {
        super.bookmark();

        const canvas: Manifesto.ICanvas = this.helper.getCurrentCanvas();
        const bookmark: Bookmark = new Bookmark();

        bookmark.index = this.helper.canvasIndex;
        bookmark.label = <string>Manifesto.LanguageMap.getValue(canvas.getLabel());
        bookmark.path = <string>this.getCroppedImageUri(canvas, this.getViewer());
        bookmark.thumb = canvas.getCanonicalImageUri(this.data.config.options.bookmarkThumbWidth);
        bookmark.title = this.helper.getLabel();
        bookmark.trackingLabel = window.trackingLabel;
        bookmark.type = manifesto.ResourceType.image().toString();

        this.fire(BaseEvents.BOOKMARK, bookmark);
    }

    print(): void {
        // var args: MultiSelectionArgs = new MultiSelectionArgs();
        // args.manifestUri = this.helper.iiifResourceUri;
        // args.allCanvases = true;
        // args.format = this.data.config.options.printMimeType;
        // args.sequence = this.helper.getCurrentSequence().id;
        window.print();
        this.fire(Events.PRINT);
    }

    getCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions | null {
        if (!viewer) return null;
        if (!viewer.viewport) return null;

        if (!canvas.getHeight() || !canvas.getWidth()) {
            return null;
        }

        const bounds: any = viewer.viewport.getBounds(true);

        const dimensions: CroppedImageDimensions = new CroppedImageDimensions();

        let width: number = Math.floor(bounds.width);
        let height: number = Math.floor(bounds.height);
        let x: number = Math.floor(bounds.x);
        let y: number = Math.floor(bounds.y);

        // constrain to image bounds
        if (x + width > canvas.getWidth()) {
            width = canvas.getWidth() - x;
        } else if (x < 0) {
            width = width + x;
        }

        if (x < 0) {
            x = 0;
        }

        if (y + height > canvas.getHeight()) {
            height = canvas.getHeight() - y;
        } else if (y < 0) {
            height = height + y;
        }

        if (y < 0) {
            y = 0;
        }

        width = Math.min(width, canvas.getWidth());
        height = Math.min(height, canvas.getHeight());
        let regionWidth: number = width;
        let regionHeight: number = height;

        const maxDimensions: Size | null = canvas.getMaxDimensions();

        if (maxDimensions) {

            if (width > maxDimensions.width) {
                let newWidth: number = maxDimensions.width;
                height = Math.round(newWidth * (height / width));
                width = newWidth;
            }

            if (height > maxDimensions.height) {
                let newHeight: number = maxDimensions.height;
                width = Math.round((width / height) * newHeight);
                height = newHeight;
            }
        }

        dimensions.region = new manifesto.Size(regionWidth, regionHeight);
        dimensions.regionPos = new Point(x, y);
        dimensions.size = new manifesto.Size(width, height);

        return dimensions;
    }

    // keep this around for reference

    // getOnScreenCroppedImageDimensions(canvas: Manifesto.ICanvas, viewer: any): CroppedImageDimensions {

    //     if (!viewer) return null;
    //     if (!viewer.viewport) return null;

    //     if (!canvas.getHeight() || !canvas.getWidth()){
    //         return null;
    //     }

    //     var bounds = viewer.viewport.getBounds(true);
    //     var containerSize = viewer.viewport.getContainerSize();
    //     var zoom = viewer.viewport.getZoom(true);

    //     var top = Math.max(0, bounds.y);
    //     var left = Math.max(0, bounds.x);

    //     // change top to be normalised value proportional to height of image, not width (as per OSD).
    //     top = 1 / (canvas.getHeight() / parseInt(String(canvas.getWidth() * top)));

    //     // get on-screen pixel sizes.

    //     var viewportWidthPx = containerSize.x;
    //     var viewportHeightPx = containerSize.y;

    //     var imageWidthPx = parseInt(String(viewportWidthPx * zoom));
    //     var ratio = canvas.getWidth() / imageWidthPx;
    //     var imageHeightPx = parseInt(String(canvas.getHeight() / ratio));

    //     var viewportLeftPx = parseInt(String(left * imageWidthPx));
    //     var viewportTopPx = parseInt(String(top * imageHeightPx));

    //     var rect1Left = 0;
    //     var rect1Right = imageWidthPx;
    //     var rect1Top = 0;
    //     var rect1Bottom = imageHeightPx;

    //     var rect2Left = viewportLeftPx;
    //     var rect2Right = viewportLeftPx + viewportWidthPx;
    //     var rect2Top = viewportTopPx;
    //     var rect2Bottom = viewportTopPx + viewportHeightPx;

    //     var sizeWidth = Math.max(0, Math.min(rect1Right, rect2Right) - Math.max(rect1Left, rect2Left));
    //     var sizeHeight = Math.max(0, Math.min(rect1Bottom, rect2Bottom) - Math.max(rect1Top, rect2Top));

    //     // get original image pixel sizes.

    //     var ratio2 = canvas.getWidth() / imageWidthPx;

    //     var regionWidth = parseInt(String(sizeWidth * ratio2));
    //     var regionHeight = parseInt(String(sizeHeight * ratio2));

    //     var regionTop = parseInt(String(canvas.getHeight() * top));
    //     var regionLeft = parseInt(String(canvas.getWidth() * left));

    //     if (regionTop < 0) regionTop = 0;
    //     if (regionLeft < 0) regionLeft = 0;

    //     var dimensions: CroppedImageDimensions = new CroppedImageDimensions();

    //     dimensions.region = new manifesto.Size(regionWidth, regionHeight);
    //     dimensions.regionPos = new Point(regionLeft, regionTop);
    //     dimensions.size = new manifesto.Size(sizeWidth, sizeHeight);

    //     return dimensions;
    // }

    getCroppedImageUri(canvas: Manifesto.ICanvas, viewer: any): string | null {

        if (!viewer) return null;
        if (!viewer.viewport) return null;

        const dimensions: CroppedImageDimensions | null = this.getCroppedImageDimensions(canvas, viewer);

        if (!dimensions) {
            return null;
        }

        // construct uri
        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg

        const baseUri: string = this.getImageBaseUri(canvas);
        const id: string | null = this.getImageId(canvas);

        if (!id) {
            return null;
        }

        const region: string = dimensions.regionPos.x + "," + dimensions.regionPos.y + "," + dimensions.region.width + "," + dimensions.region.height;
        const size: string = dimensions.size.width + ',' + dimensions.size.height;
        const rotation: number = <number>this.getViewerRotation();
        const quality: string = 'default';
        return `${baseUri}/${id}/${region}/${size}/${rotation}/${quality}.jpg`;
    }

    getConfinedImageDimensions(canvas: Manifesto.ICanvas, width: number): Size {
        const dimensions: Size = new manifesto.Size(0, 0);
        dimensions.width = width;
        const normWidth = Utils.Maths.normalise(width, 0, canvas.getWidth());
        dimensions.height = Math.floor(canvas.getHeight() * normWidth);
        return dimensions;
    }

    getConfinedImageUri(canvas: Manifesto.ICanvas, width: number): string | null {
        const baseUri = this.getImageBaseUri(canvas);

        // {baseuri}/{id}/{region}/{size}/{rotation}/{quality}.jpg
        const id: string | null = this.getImageId(canvas);

        if (!id) {
            return null;
        }

        const region: string = 'full';
        const dimensions: Size = this.getConfinedImageDimensions(canvas, width);
        const size: string = dimensions.width + ',' + dimensions.height;
        const rotation: number = <number>this.getViewerRotation();
        const quality: string = 'default';
        return `${baseUri}/${id}/${region}/${size}/${rotation}/${quality}.jpg`;
    }

    getImageId(canvas: Manifesto.ICanvas): string | null {

        if (canvas.externalResource) {
            const id: string | undefined = canvas.externalResource.data['@id'];

            if (id) {
                return id.substr(id.lastIndexOf("/") + 1);
            }
        }

        return null;
    }

    getImageBaseUri(canvas: Manifesto.ICanvas): string {
        let uri = this.getInfoUri(canvas);
        // First trim off info.json, then trim off ID....
        uri = uri.substr(0, uri.lastIndexOf("/"));
        return uri.substr(0, uri.lastIndexOf("/"));
    }

    getInfoUri(canvas: Manifesto.ICanvas): string {
        let infoUri: string | null = null;

        const images: Manifesto.IAnnotation[] = canvas.getImages();

        if (images && images.length) {
            let firstImage: Manifesto.IAnnotation = images[0];
            let resource: Manifesto.IResource = firstImage.getResource();
            let services: Manifesto.IService[] = resource.getServices();

            for (let i = 0; i < services.length; i++) {
                let service: Manifesto.IService = services[i];
                let id = service.id;

                if (!id.endsWith('/')) {
                    id += '/';
                }

                if (manifesto.Utils.isImageProfile(service.getProfile())) {
                    infoUri = id + 'info.json';
                }
            }
        }

        if (!infoUri) {
            // todo: use compiler flag (when available)
            infoUri = 'lib/imageunavailable.json';
        }

        return infoUri;
    }

    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string {
        const config: string = this.data.config.uri || '';
        const locales: string | null = this.getSerializedLocales();
        const appUri: string = this.getAppUri();
        const iframeSrc: string = `${appUri}#?manifest=${this.helper.iiifResourceUri}&c=${this.helper.collectionIndex}&m=${this.helper.manifestIndex}&s=${this.helper.sequenceIndex}&cv=${this.helper.canvasIndex}&config=${config}&locales=${locales}&xywh=${zoom}&r=${rotation}`;
        const script: string = Utils.Strings.format(template, iframeSrc, width.toString(), height.toString());
        return script;
    }

    getPrevPageIndex(canvasIndex: number = this.helper.canvasIndex): number {
        let index: number;

        if (this.isPagingSettingEnabled()) {
            let indices: number[] = this.getPagedIndices(canvasIndex);

            if (this.helper.isRightToLeft()) {
                index = indices[indices.length - 1] - 1;
            } else {
                index = indices[0] - 1;
            }

        } else {
            index = canvasIndex - 1;
        }

        return index;
    }

    isSearchEnabled(): boolean {
        if (!Utils.Bools.getBool(this.data.config.options.searchWithinEnabled, false)) {
            return false;
        }

        if (!this.helper.getSearchService()) {
            return false;
        }

        return true;
    }

    isPagingSettingEnabled(): boolean {
        if (this.helper.isPagingAvailable()) {
            return <boolean>this.getSettings().pagingEnabled;
        }

        return false;
    }

    getNextPageIndex(canvasIndex: number = this.helper.canvasIndex): number {

        let index: number;

        if (this.isPagingSettingEnabled()) {
            let indices: number[] = this.getPagedIndices(canvasIndex);

            if (this.helper.isRightToLeft()) {
                index = indices[0] + 1;
            } else {
                index = indices[indices.length - 1] + 1;
            }

        } else {
            index = canvasIndex + 1;
        }

        if (index > this.helper.getTotalCanvases() - 1) {
            return -1;
        }

        return index;
    }

    getAutoCompleteService(): Manifesto.IService | null {
        const service: Manifesto.IService | null = this.helper.getSearchService();
        if (!service) return null;
        return service.getService(manifesto.ServiceProfile.autoComplete());
    }

    getAutoCompleteUri(): string | null {
        const service: Manifesto.IService | null = this.getAutoCompleteService();
        if (!service) return null;
        return service.id + '?q={0}';
    }

    getSearchServiceUri(): string | null {
        const service: Manifesto.IService | null = this.helper.getSearchService();
        if (!service) return null;

        let uri: string = service.id;
        uri = uri + "?q={0}";
        return uri;
    }

    search(terms: string): void {

        if (this.isAnnotating) return;

        this.isAnnotating = true;

        // clear search results
        this.annotations = [];

        const that = this;

        // searching

        let searchUri: string | null = this.getSearchServiceUri();

        if (!searchUri) return;

        searchUri = Utils.Strings.format(searchUri, encodeURIComponent(terms));

        this.getSearchResults(searchUri, terms, this.annotations, (annotations: AnnotationGroup[]) => {

            that.isAnnotating = false;

            if (annotations.length) {
                that.annotate(annotations, terms);
            } else {
                that.showMessage(that.data.config.modules.genericDialogue.content.noMatches, () => {
                    this.component.publish(BaseEvents.ANNOTATIONS_EMPTY);
                });
            }
        });
    }

    getSearchResults(searchUri: string,
        terms: string,
        searchResults: AnnotationGroup[],
        cb: (results: AnnotationGroup[]) => void): void {

        $.getJSON(searchUri, (results: any) => {

            if (results.resources && results.resources.length) {
                searchResults = searchResults.concat(this.parseAnnotationList(results));
            }

            if (results.next) {
                this.getSearchResults(results.next, terms, searchResults, cb);
            } else {
                cb(searchResults);
            }
        });
    }

    parseAnnotationList(annotations: any): AnnotationGroup[] {

        const parsed: AnnotationGroup[] = [];

        for (let i = 0; i < annotations.resources.length; i++) {
            const resource: any = annotations.resources[i];
            const canvasIndex: number | null = this.helper.getCanvasIndexById(resource.on.match(/(.*)#/)[1]);
            const annotationGroup: AnnotationGroup = new AnnotationGroup(resource, <number>canvasIndex);
            const match: AnnotationGroup = parsed.en().where(x => x.canvasIndex === annotationGroup.canvasIndex).first();

            // if there's already an annotation for the canvas index, add a rect to it, otherwise create a new AnnotationGroup
            if (match) {
                match.addRect(resource);
            } else {
                parsed.push(annotationGroup);
            }
        }

        // sort by canvasIndex
        parsed.sort((a, b) => {
            return a.canvasIndex - b.canvasIndex;
        });

        return parsed;
    }

    getAnnotationRects(): AnnotationRect[] {
        if (this.annotations) {
            return this.annotations.en().selectMany(x => x.rects).toArray();
        }
        return [];
    }

    getCurrentAnnotationRectIndex(): number {
        const annotationRects: AnnotationRect[] = this.getAnnotationRects();

        if (this.currentAnnotationRect) {
            return annotationRects.indexOf(this.currentAnnotationRect);
        }

        return -1;
    }

    getTotalAnnotationRects(): number {
        const annotationRects: AnnotationRect[] = this.getAnnotationRects();
        return annotationRects.length;
    }

    isFirstAnnotationRect(): boolean {
        return this.getCurrentAnnotationRectIndex() === 0;
    }

    getLastAnnotationRectIndex(): number {
        return this.getTotalAnnotationRects() - 1;
    }

    getPagedIndices(canvasIndex: number = this.helper.canvasIndex): number[] {

        let indices: number[] | undefined = [];

        // if it's a continuous manifest, get all resources.
        if (this.helper.isContinuous()) {
            indices = $.map(this.helper.getCanvases(), (c: Manifesto.ICanvas, index: number) => {
                return index;
            });
        } else {
            if (!this.isPagingSettingEnabled()) {
                indices.push(this.helper.canvasIndex);
            } else {
                if (this.helper.isFirstCanvas(canvasIndex) || (this.helper.isLastCanvas(canvasIndex) && this.helper.isTotalCanvasesEven())) {
                    indices = <number[]>[canvasIndex];
                } else if (canvasIndex % 2) {
                    indices = <number[]>[canvasIndex, canvasIndex + 1];
                } else {
                    indices = <number[]>[canvasIndex - 1, canvasIndex];
                }

                if (this.helper.isRightToLeft()) {
                    indices = indices.reverse();
                }
            }
        }

        return indices;
    }
}
