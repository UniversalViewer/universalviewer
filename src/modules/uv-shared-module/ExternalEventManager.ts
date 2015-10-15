import BaseCommands = require("./BaseCommands");
import Bootstrapper = require("../../Bootstrapper");

// listens for events and tracks with Google Analytics
class ExternalEventManager {
    bootstrapper: Bootstrapper;

    constructor(bootstrapper: Bootstrapper) {
        this.bootstrapper = bootstrapper;

        // todo: subscribe to all events and trigger socket
        // implementer-specific GA tracking is done in the containing page

        $.subscribe(BaseCommands.CREATED, () => {
            this.triggerSocket(BaseCommands.CREATED);
        });

        $.subscribe(BaseCommands.DROP, (e, args) => {
            this.triggerSocket(BaseCommands.DROP, args);
        });

        // todo: the containing page can access the provider on Load
        //if (!this.provider.isHomeDomain){
        //    this.trackVariable(2, 'Embedded', this.extension.provider.domain, 2);
        //}
    }

    triggerSocket(eventName: string, eventObject?: any): void {
        if (this.bootstrapper.socket) {
            this.bootstrapper.socket.postMessage(JSON.stringify({ eventName: eventName, eventObject: eventObject }));
        }
    }
}

export = ExternalEventManager;