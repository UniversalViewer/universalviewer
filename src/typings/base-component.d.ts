// base-component v1.0.1 https://github.com/edsilv/base-component#readme

interface EventEmitter2Configuration {
    delimiter?: string;
    maxListeners?: number;
    wildcard?: string;
    newListener?: Function;
}

interface IEventEmitter2 {
    constructor(conf?: EventEmitter2Configuration);
    addListener(event: string, listener: Function): IEventEmitter2;
    on(event: string, listener: Function): IEventEmitter2;
    onAny(listener: Function): IEventEmitter2;
    offAny(listener: Function): IEventEmitter2;
    once(event: string, listener: Function): IEventEmitter2;
    many(event: string, timesToListen: number, listener: Function): IEventEmitter2;
    removeListener(event: string, listener: Function): IEventEmitter2;
    off(event: string, listener: Function): IEventEmitter2;
    removeAllListeners(event?: string): IEventEmitter2;
    setMaxListeners(n: number): void;
    listeners(event: string): Function[];
    listenersAny(): Function[];
    emit(event: string, ...args: any[]);
}

declare var EventEmitter2: IEventEmitter2;
declare namespace Components {
    class BaseComponent implements IBaseComponent {
        options: IBaseComponentOptions;
        protected _$element: JQuery;
        constructor(options: IBaseComponentOptions);
        protected _init(): boolean;
        protected _getDefaultOptions(): IBaseComponentOptions;
        protected _emit(event: string, ...args: any[]): void;
        protected _resize(): void;
        databind(data: any): void;
    }
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
}

declare namespace Components {
    interface IBaseComponent {
        options: IBaseComponentOptions;
        databind(data: any): void;
    }
}

declare namespace Components {
    interface IBaseComponentOptions {
        element?: string;
    }
}
