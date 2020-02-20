import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { UVUtils } from "../../Utils";

export class AVCenterPanel extends CenterPanel {

    $avcomponent: JQuery;
    avcomponent: any;
    private _lastCanvasIndex: number | undefined;
    private _mediaReady: boolean = false;
    private _isThumbsViewOpen: boolean = false;

    constructor($element: JQuery) {
        super($element);
        this.attributionPosition = Position.BOTTOM_RIGHT;
    }

    create(): void {

        this.setConfig('avCenterPanel');

        super.create();

        const that = this;

        this.component.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        this.component.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (canvasIndex: number) => {
            this._viewCanvas(canvasIndex);           
        });

        this.component.subscribe(BaseEvents.RANGE_CHANGED, (range: Manifesto.IRange | null) => {

            if (!this._observeRangeChanges()) {
                return;
            }

            this._whenMediaReady(() => {
                that._viewRange(range);
                that._setTitle();
            });

        });

        this.component.subscribe(BaseEvents.METRIC_CHANGED, () => {
            this._whenMediaReady(() => {
                if (this.avcomponent) {
                    this.avcomponent.set({
                        limitToRange: this._limitToRange(),
                        constrainNavigationToRange: this._limitToRange()
                    });
                }
            });
        });

        this.component.subscribe(BaseEvents.CREATED, () => {
            this._setTitle();
        });

        this.component.subscribe(BaseEvents.OPEN_THUMBS_VIEW, () => {

            this._isThumbsViewOpen = true;

            this._whenMediaReady(() => {

                if (this.avcomponent) {

                    this.avcomponent.set({
                        virtualCanvasEnabled: false
                    });
    
                    const canvas: Manifesto.ICanvas | null = this.extension.helper.getCurrentCanvas();
            
                    if (canvas) {
                        this._viewCanvas(this.extension.helper.canvasIndex)
                    }
                }
            });
        });

        this.component.subscribe(BaseEvents.OPEN_TREE_VIEW, () => {

            this._isThumbsViewOpen = false;

            this._whenMediaReady(() => {

                if (this.avcomponent) {
                    this.avcomponent.set({
                        virtualCanvasEnabled: true
                    });
                }
                
            });
        });

        this._createAVComponent();
    }

    private _createAVComponent(): void {

        this.$avcomponent = $('<div class="iiif-av-component"></div>');
        this.$content.prepend(this.$avcomponent);

        this.avcomponent = new IIIFComponents.AVComponent({
            target: <HTMLElement>this.$avcomponent[0],
            posterImageExpanded: this.options.posterImageExpanded
        });

        this.avcomponent.on('mediaready', () => {
            console.log('mediaready');
            this._mediaReady = true;
        }, false);

        this.avcomponent.on('rangechanged', (rangeId: string | null) => {        
            
            if (rangeId) {

                this._setTitle();

                const range: Manifesto.IRange | null = this.extension.helper.getRangeById(rangeId);

                if (range) {
                    const currentRange: Manifesto.IRange | null = this.extension.helper.getCurrentRange();

                    if (range !== currentRange) {
                        this.component.publish(BaseEvents.RANGE_CHANGED, range);
                    }
                    
                } else {
                    this.component.publish(BaseEvents.RANGE_CHANGED, null);
                }

            } else {
                this.component.publish(BaseEvents.RANGE_CHANGED, null);
            } 
            
        }, false);
    }

    private _observeRangeChanges(): boolean {
        if (!this._isThumbsViewOpen) {
            return true;
        }

        return false;
    }

    private _setTitle(): void {

        let title: string = '';
        let value: string | null;
        let label: Manifesto.LanguageMap;

        // get the current range or canvas title
        const currentRange: Manifesto.IRange | null = this.extension.helper.getCurrentRange();

        if (currentRange) {
            label = currentRange.getLabel();
        } else {
            label = this.extension.helper.getCurrentCanvas().getLabel();
        }

        value = Manifesto.LanguageMap.getValue(label);

        if (value) {
            title = value;
        }

        if (Utils.Bools.getBool(this.config.options.includeParentInTitleEnabled, false)) {

            // get the parent range or manifest's title
            if (currentRange) {
                if (currentRange.parentRange) {
                    label = currentRange.parentRange.getLabel();
                    value = Manifesto.LanguageMap.getValue(label);
                }
            } else {
                value = this.extension.helper.getLabel();
            }

            if (value) {
                title += this.content.delimiter + value;
            }

        }

        this.title = title;

        // set subtitle
        const groups: Manifold.MetadataGroup[] = this.extension.helper.getMetadata(<Manifold.MetadataOptions>{
            range: currentRange
        });

        for (let i = 0; i < groups.length; i++) {
            const group: Manifold.MetadataGroup = groups[i];

            const item: Manifesto.LabelValuePair | undefined = group.items.find((el: Manifesto.LabelValuePair) => {
                if (el.label) {
                    const label: string | null = Manifesto.LanguageMap.getValue(el.label);
                    if (label && label.toLowerCase() === this.config.options.subtitleMetadataField) {
                        return true;
                    }
                }

                return false;
            });

            if (item) {
                this.subtitle = Manifesto.LanguageMap.getValue(item.value);
                break;
            }
        }

        this.$title.text(UVUtils.sanitize(this.title));

        this.resize(false);
    }

    private _isCurrentResourceAccessControlled(): boolean {
        const canvas: Manifesto.ICanvas = this.extension.helper.getCurrentCanvas();
        return canvas.externalResource.isAccessControlled();
    }

    openMedia(resources: Manifesto.IExternalResource[]) {

        this.extension.getExternalResources(resources).then(() => {

            if (this.avcomponent) {

                // reset if the media has already been loaded (degraded flow has happened)
                if (this.extension.helper.canvasIndex === this._lastCanvasIndex) {
                    this.avcomponent.reset();
                }

                this._lastCanvasIndex = this.extension.helper.canvasIndex;

                this.avcomponent.set({
                    helper: this.extension.helper,
                    adaptiveAuthEnabled: this._isCurrentResourceAccessControlled(),
                    autoPlay: this.config.options.autoPlay,
                    autoSelectRange: true,
                    constrainNavigationToRange: this._limitToRange(),
                    content: this.content,
                    defaultAspectRatio: 0.56,
                    doubleClickMS: 350,
                    limitToRange: this._limitToRange(),
                    posterImageRatio: this.config.options.posterImageRatio
                });
    
                this.resize();

            }
            
        });
    }

    private _limitToRange(): boolean {
        return !this.extension.isDesktopMetric();
    }

    private _whenMediaReady(cb: () => void): void {
        Utils.Async.waitFor(() => {
            return this._mediaReady;
        }, cb);
    }

    private _viewRange(range: Manifesto.IRange | null): void {

        this._whenMediaReady(() => {
            if (range && this.avcomponent) {
                this.avcomponent.playRange(range.id);
            }
            
            // don't resize the av component to avoid expensively redrawing waveforms
            this.resize(false);
        });
    }

    private _viewCanvas(canvasIndex: number): void {
        
        this._whenMediaReady(() => {
            const canvas: Manifesto.ICanvas | null = this.extension.helper.getCanvasByIndex(canvasIndex);
            
            if (this.avcomponent) {
                this.avcomponent.showCanvas(canvas.id);
            }
        });
    }

    resize(resizeAVComponent: boolean = true) {

        super.resize();

        if (resizeAVComponent && this.avcomponent) {
            this.$avcomponent.height(this.$content.height());
            this.avcomponent.resize(); 
        }
    
    }
}
