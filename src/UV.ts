import {BaseCommands} from "./modules/uv-shared-module/BaseCommands";
import {Bootstrapper} from "./Bootstrapper";
import {Extension as MediaElementExtension} from "./extensions/uv-mediaelement-extension/Extension";
import {Extension as OpenSeadragonExtension} from "./extensions/uv-seadragon-extension/Extension";
import {Extension as PDFExtension} from "./extensions/uv-pdf-extension/Extension";
import {Extension as VirtexExtension} from "./extensions/uv-virtex-extension/Extension";
import {IUVComponent} from "./IUVComponent";
import {IUVData} from "./IUVData";
import {IUVDataProvider} from "./IUVDataProvider";
import {URLDataProvider} from "./URLDataProvider";

export default class UV extends _Components.BaseComponent implements IUVComponent {

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
        
        $.subscribe(BaseCommands.RELOAD, (e: any, data?: IUVData) => {
            this.fire(BaseCommands.RELOAD, data);
        });

        const extensions: Object = {};

        extensions[manifesto.ElementType.canvas().toString()] = {
            type: OpenSeadragonExtension,
            name: 'uv-seadragon-extension'
        };

        extensions[manifesto.ElementType.movingimage().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        extensions[manifesto.ElementType.physicalobject().toString()] = {
            type: VirtexExtension,
            name: 'uv-virtex-extension'
        };

        extensions[manifesto.ElementType.sound().toString()] = {
            type: MediaElementExtension,
            name: 'uv-mediaelement-extension'
        };

        extensions[manifesto.RenderingFormat.pdf().toString()] = {
            type: PDFExtension,
            name: 'uv-pdf-extension'
        };

        const bootstrapper: Bootstrapper = new Bootstrapper(extensions);
        bootstrapper.bootstrap(this.data);

        return success;
    }
    
    public data(): IUVData {
        return <IUVData>{

        };
    }
    
    protected _resize(): void {
        
    }
}