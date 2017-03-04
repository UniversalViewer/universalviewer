import {BaseEvents} from "./modules/uv-shared-module/BaseEvents";
import {Bootstrapper} from "./Bootstrapper";
import {Extension as MediaElementExtension} from "./extensions/uv-mediaelement-extension/Extension";
import {Extension as OpenSeadragonExtension} from "./extensions/uv-seadragon-extension/Extension";
import {Extension as PDFExtension} from "./extensions/uv-pdf-extension/Extension";
import {Extension as VirtexExtension} from "./extensions/uv-virtex-extension/Extension";
import {IUVComponent} from "./IUVComponent";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";

export default class UVComponent extends _Components.BaseComponent implements IUVComponent {

    private _extensions: any;
    public URLDataProvider: IUVDataProvider;

    constructor(options: _Components.IBaseComponentOptions) {
        super(options);

        this._init();
        this._resize();
    }

    protected _init(): boolean {
        const success: boolean = super._init();

        if (!success) {
            console.error("UV failed to initialise");
        }
        
        $.subscribe(BaseEvents.RELOAD, (e: any, data?: IUVData) => {
            this.fire(BaseEvents.RELOAD, data);
        });

        this._extensions = {};

        this._extensions[manifesto.ElementType.canvas().toString()] = {
            type: OpenSeadragonExtension,
            name: 'uv-seadragon-extension'
        };

        this._extensions[manifesto.ElementType.movingimage().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        this._extensions[manifesto.ElementType.physicalobject().toString()] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        this._extensions[manifesto.ElementType.sound().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        this._extensions[manifesto.RenderingFormat.pdf().toString()] = {
            type: PDFExtension,
            name: 'uv-pdf-extension'
        };

        this.set(this.options.data);

        return success;
    }
    
    public data(): IUVData {
        return <IUVData>{

        };
    }

    public set(data: IUVData): void {
        const bootstrapper: Bootstrapper = new Bootstrapper(this._dataProvider, this._extensions);
        bootstrapper.bootstrap();
    }
    
    protected _resize(): void {
        
    }
}