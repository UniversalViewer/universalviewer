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
        var success: boolean = super._init();

        if (!success){
            console.error("Component failed to initialise");
        }
        
        this._$element.append("I am the UV");

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