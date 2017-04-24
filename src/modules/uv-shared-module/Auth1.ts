import {BaseEvents} from "./BaseEvents";
import {UVUtils} from "./Utils";

export class Auth1 {

    static messages: any = {}

    static loadExternalResources(resourcesToLoad: Manifesto.IExternalResource[], storageStrategy: string): Promise<Manifesto.IExternalResource[]> {
        return new Promise<Manifesto.IExternalResource[]>((resolve) => {
            resolve(resourcesToLoad);
        });
    }
    
    static openContentProviderWindow(service: Manifesto.IService): Window {
        let cookieServiceUrl: string = service.id + "?origin=" + Auth1.getOrigin();
        return window.open(cookieServiceUrl);
    }

    // determine the postMessage-style origin for a URL
    static getOrigin(url?: string): string {
        let urlHolder: Location | HTMLAnchorElement = window.location;
        if (url) {
            urlHolder = document.createElement('a');
            urlHolder.href = url;
        }
        return urlHolder.protocol + "//" + urlHolder.hostname + (urlHolder.port ? ':' + urlHolder.port: '');
    }

    static userInteractionWithContentProvider(contentProviderWindow: Window): Promise<void> {
        return new Promise<void>((resolve) => {
            // What happens here is forever a mystery to a client application.
            // It can but wait.
            const poll: number = window.setInterval(() => {
                if (contentProviderWindow.closed) {
                    window.clearInterval(poll);
                    resolve();
                }
            }, 500);
        });
    }

    static getContentProviderWindow(service: Manifesto.IService): Promise<Window | null> {
        return new Promise<Window | null>(resolve => {
            $.publish(BaseEvents.SHOW_AUTH_DIALOGUE, [{
                service: service,
                closeCallback: () => {
                    resolve(null);
                },
                confirmCallback: () => {
                    const win: Window = Auth1.openContentProviderWindow(service);
                    resolve(win);
                },
                cancelCallback: () => {
                    resolve(null);
                }
            }]);
        });
    }

    static openTokenService(tokenService: Manifesto.IService): Promise<void> {
        // use a Promise across a postMessage call. Discuss...
        return new Promise<void>((resolve, reject) => {
            // if necessary, the client can decide not to trust this origin
            const serviceOrigin: string = Auth1.getOrigin(tokenService.id);
            const messageId: number = new Date().getTime();
            Auth1.messages[messageId] = { 
                "resolve": resolve,
                "reject": reject,
                "serviceOrigin": serviceOrigin
            };
            const tokenUrl: string = tokenService.id + "?messageId=" + messageId + "&origin=" + Auth1.getOrigin();
            $('#commsFrame').prop('src', tokenUrl);

            // reject any unhandled messages after a configurable timeout
            const postMessageTimeout = 5000;

            setTimeout(() => {
                if(Auth1.messages[messageId]){
                    Auth1.messages[messageId].reject(
                        "Message unhandled after " + postMessageTimeout + "ms, rejecting");
                    delete Auth1.messages[messageId];
                }
            }, postMessageTimeout);
        });
    }

    static showOutOfOptionsMessages(service: Manifesto.IService): void {

        let errorMessage: string = "";

        if (service.getFailureHeader()) {
            errorMessage += service.getFailureHeader() + '\n';
        }

        if (service.getFailureDescription()) {
           errorMessage += service.getFailureDescription();
        }

        $.publish(BaseEvents.SHOW_MESSAGE, [UVUtils.sanitize(errorMessage)]);
    }
}
