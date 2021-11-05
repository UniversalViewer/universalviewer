export type EventHandler = (e: any) => void;

export class PubSub {
  events: { [key: string]: EventHandler[] } = {};

  constructor() {}

  public publish(name: string, args?: any) {
    const handlers: EventHandler[] = this.events[name];
    if (handlers === undefined) return;
    handlers.forEach((handler) => {
      handler.call(this, args);
    });
  }

  public subscribe(name: string, handler: EventHandler) {
    let handlers: EventHandler[] = this.events[name];
    if (handlers === undefined) {
      handlers = this.events[name] = [];
    }
    handlers.push(handler);
  }

  public subscribeAll(handler: EventHandler, exceptions: string[] = []) {
    Object.keys(this.events).forEach((name) => {
      if (!exceptions.includes(name)) {
        this.subscribe(name, handler);
      }
    });
  }

  public unsubscribe(name: string, handler: EventHandler) {
    const handlers: EventHandler[] = this.events[name];
    if (handlers === undefined) return;

    const handlerIdx: number = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  }

  public unsubscribeAll(handler: EventHandler, exceptions: string[] = []) {
    Object.keys(this.events).forEach((name) => {
      if (!exceptions.includes(name)) {
        this.unsubscribe(name, handler);
      }
    });
  }

  public dispose() {
    this.events = {};
  }
}
