type Handler = (e: any) => void;

export class PubSub {   

    events: {[key: string]: Handler[]} = {};

    constructor() {

    }    

    public publish(name: string, args?: any) {
        const handlers: Handler[] = this.events[name];
        if (handlers === undefined) return;
        handlers.forEach((handler) => {
            handler.call(this, args);
        });
    }

    public subscribe(name: string, handler: Handler) {
        let handlers: Handler[] = this.events[name];
        if (handlers === undefined) {
            handlers = this.events[name] = [];
        }
        handlers.push(handler);
    }

    public unsubscribe(name: string, handler: Handler) {
        const handlers: Handler[] = this.events[name];
        if (handlers === undefined) return;
  
        const handlerIdx: number = handlers.indexOf(handler);
        handlers.splice(handlerIdx);
    }
    
    public dispose() {
        this.events = {};
    }
}