import { BaseEvents } from "../uv-shared-module/BaseEvents";
import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { Position } from "../uv-shared-module/Position";
import { UVUtils } from "../../Utils";

export class AVCenterPanel extends CenterPanel {

    $avcomponent: JQuery;
    avcomponent: IIIFComponents.AVComponent | null;
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

        $.subscribe(BaseEvents.OPEN_EXTERNAL_RESOURCE, (e: any, resources: Manifesto.IExternalResource[]) => {
            that.openMedia(resources);
        });

        $.subscribe(BaseEvents.CANVAS_INDEX_CHANGED, (e: any, canvasIndex: number) => {
            this._viewCanvas(canvasIndex);           
        });

        $.subscribe(BaseEvents.RANGE_CHANGED, (e: any, range: Manifesto.IRange | null) => {

            if (!this._observeRangeChanges()) {
                return;
            }

            this._whenMediaReady(() => {
                that._viewRange(range);
                that._setTitle();
            });

        });

        $.subscribe(BaseEvents.METRIC_CHANGED, () => {
            this._whenMediaReady(() => {
                if (this.avcomponent) {
                    this.avcomponent.set({
                        limitToRange: this._limitToRange(),
                        constrainNavigationToRange: this._limitToRange()
                    });
                }
            });
        });

        $.subscribe(BaseEvents.CREATED, () => {
            this._setTitle();
        });

        $.subscribe(BaseEvents.OPEN_THUMBS_VIEW, () => {

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

        $.subscribe(BaseEvents.OPEN_TREE_VIEW, () => {

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
            target: <HTMLElement>this.$avcomponent[0]
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
                        $.publish(BaseEvents.RANGE_CHANGED, [range]);
                    }
                    
                } else {
                    $.publish(BaseEvents.RANGE_CHANGED, [null]);
                }

            } else {
                $.publish(BaseEvents.RANGE_CHANGED, [null]);
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
        //this.subtitle = "this is a very long subtitle that will be elided as it fills more space that can fit within the current available width of the center panel";
        this.subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id tortor in libero lacinia rutrum. Donec pretium, ipsum a tristique tempus, velit ex consequat tellus, ut malesuada risus enim vitae arcu. Sed lacinia mollis mi, fermentum feugiat mauris accumsan et. Sed vitae felis eu tellus suscipit eleifend ut vel elit. Suspendisse quis turpis id orci volutpat fringilla. Phasellus id tortor eu justo condimentum hendrerit sed sed urna. Morbi sed turpis porta, interdum ligula id, pellentesque nisl. Cras tincidunt nec eros et dapibus. Nulla rutrum, purus eget finibus facilisis, lorem nisi ullamcorper mauris, quis lobortis ipsum neque at purus. Aenean neque mauris, feugiat non risus vel, euismod convallis leo. Sed sit amet ipsum eget libero tempor pellentesque a ut quam. Maecenas consectetur pharetra tincidunt. Cras lacinia quam fermentum nisi dignissim pulvinar. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer lobortis ante commodo magna tincidunt, non porta lacus cursus. Sed pharetra, felis in scelerisque molestie, ipsum velit consectetur neque, sed auctor arcu eros et nunc. Donec tincidunt mollis finibus. Nunc vitae luctus velit. Suspendisse viverra maximus diam vel dignissim. Aenean eros ante, gravida eget viverra ut, dignissim vitae magna. Etiam dictum interdum nulla, id tincidunt lectus. Curabitur vitae justo rhoncus, vulputate ligula non, blandit massa. Quisque pulvinar rutrum nibh, eget accumsan lectus venenatis in. In hac habitasse platea dictumst. Donec tortor libero, pretium vel arcu sit amet, cursus ornare ipsum. Nulla facilisi. Quisque scelerisque dictum turpis ut lobortis. Phasellus congue viverra lacus id sodales.";
        //this.subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id tortor in libero lacinia rutrum. Donec pretium, ipsum a tristique tempus, velit ex consequat tellus, ut malesuada risus enim vitae arcu. Sed lacinia mollis mi, fermentum feugiat mauris accumsan et.";

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