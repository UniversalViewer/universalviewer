export declare type EventHandler = (args: any, extra?: any) => void;
export declare type EventHandlerWithName = (event: string, args: any) => void;
export declare class PubSub {
    events: {
        [key: string]: EventHandler[];
    };
    onPublishHandler: EventHandlerWithName;
    constructor();
    publish(name: string, args?: any, extra?: any): void;
    subscribe(name: string, handler: EventHandler): void;
    subscribeAll(handler: EventHandlerWithName): void;
    unsubscribe(name: string, handler: EventHandler): void;
    unsubscribeAll(): void;
    dispose(): void;
}
