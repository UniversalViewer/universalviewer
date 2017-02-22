import {Bootstrapper} from "./Bootstrapper";
import {Extension as OpenSeadragonExtension} from "./extensions/uv-seadragon-extension/Extension";
import {Extension as MediaElementExtension} from "./extensions/uv-mediaelement-extension/Extension";
import {Extension as PDFExtension} from "./extensions/uv-pdf-extension/Extension";
import {Extension as VirtexExtension} from "./extensions/uv-virtex-extension/Extension";

export default class UV extends _Components.BaseComponent {

    constructor(options: _Components.IBaseComponentOptions) {
        super(options);

        this._init();
        this._resize();
    }

    public message(): void {
        //this.fire(UV.Events.MESSAGE, this.options.data.message);
    }

    protected _init(): boolean {
        const success: boolean = super._init();

        if (!success){
            console.error("UV failed to initialise");
        }
        
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

        const bootstrapper = new Bootstrapper(extensions);
        bootstrapper.bootstrap();

        return success;
    }
    
    public data(): Object {
        return {};
    }
    
    protected _resize(): void {
        
    }
}


// namespace UV {
//     export class Events {
//         static MESSAGE: string = 'message';
//     }
// }