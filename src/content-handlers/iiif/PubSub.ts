export type EventHandler = (args: any, extra?: any) => void;
export type EventHandlerWithName = (event: string, args: any) => void;

export class PubSub {
  events: { [key: string]: EventHandler[] } = {};
  onPublishHandler: EventHandlerWithName = () => {};

  constructor() {}

  public publish(name: string, args?: any, extra?: any) {
    const handlers: EventHandler[] = this.events[name];
    if (handlers) {
      handlers.forEach((handler) => {
        handler.call(this, args, extra);
      });
    }
    this.onPublishHandler.call(this, name, args);
  }

  public subscribe(name: string, handler: EventHandler) {
    let handlers: EventHandler[] = this.events[name];
    if (handlers === undefined) {
      handlers = this.events[name] = [];
    }
    handlers.push(handler);
  }

  public subscribeAll(handler: EventHandlerWithName) {
    this.onPublishHandler = handler;
  }

  public unsubscribe(name: string, handler: EventHandler) {
    const handlers: EventHandler[] = this.events[name];
    if (handlers === undefined) return;

    const handlerIdx: number = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  }

  public unsubscribeAll() {
    this.onPublishHandler = () => {};
  }

  public dispose() {
    this.events = {};
  }
}
