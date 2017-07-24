import {BaseEvents} from "./BaseEvents";
import {UVUtils} from "./Utils";
import {InformationArgs} from "./InformationArgs";
import {InformationType} from "./InformationType";

export class Auth1 {

    static messages: any = {}

    static loadExternalResources(resourcesToLoad: Manifesto.IExternalResource[], storageStrategy: string, options: Manifesto.IManifestoOptions): Promise<Manifesto.IExternalResource[]> {
        
        return new Promise<Manifesto.IExternalResource[]>((resolve) => {

            // set all resources to Auth API V1
            resourcesToLoad = resourcesToLoad.map((resource: Manifesto.IExternalResource) => {
                resource.authAPIVersion = 1;
                resource.options = options;
                return resource;
            });

            manifesto.Utils.loadExternalResourcesAuth1(
                resourcesToLoad,
                Auth1.openContentProviderInteraction,
                Auth1.openTokenService,
                Auth1.userInteractedWithContentProvider,
                Auth1.getContentProviderInteraction,
                Auth1.handleMovedTemporarily,
                Auth1.showOutOfOptionsMessages).then((r: Manifesto.IExternalResource[]) => {
                    resolve(r);
                })['catch']((error: any) => {
                    switch(error.name) {
                        case manifesto.StatusCodes.AUTHORIZATION_FAILED.toString():
                            $.publish(BaseEvents.LOGIN_FAILED);
                            break;
                        case manifesto.StatusCodes.FORBIDDEN.toString():
                            $.publish(BaseEvents.FORBIDDEN);
                            break;
                        case manifesto.StatusCodes.RESTRICTED.toString():
                            // do nothing
                            break;
                        default:
                            $.publish(BaseEvents.SHOW_MESSAGE, [error.message || error]);
                    }
            });
        });
    }
    
    static openContentProviderInteraction(service: Manifesto.IService): Window {
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

    static userInteractedWithContentProvider(contentProviderWindow: Window): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            // What happens here is forever a mystery to a client application.
            // It can but wait.
            const poll: number = window.setInterval(() => {
                if (contentProviderWindow.closed) {
                    window.clearInterval(poll);
                    resolve(true);
                }
            }, 500);
        });
    }

    static handleMovedTemporarily(resource: Manifesto.IExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {   
            const informationArgs: InformationArgs = new InformationArgs(InformationType.DEGRADED_RESOURCE, resource);
            $.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
            resource.isResponseHandled = true;
            resolve();
        });
    }

    static getContentProviderInteraction(resource: Manifesto.IExternalResource, service: Manifesto.IService): Promise<Window | null> {
        return new Promise<Window | null>((resolve) => {

            if (!resource.contentProviderInteractionEnabled) {

                const win: Window = Auth1.openContentProviderInteraction(service);
                resolve(win);

            } else {

                $.publish(BaseEvents.SHOW_AUTH_DIALOGUE, [{
                    service: service,
                    closeCallback: () => {
                        resolve(null);
                    },
                    confirmCallback: () => {
                        const win: Window = Auth1.openContentProviderInteraction(service);
                        resolve(win);
                    },
                    cancelCallback: () => {
                        resolve(null);
                    }
                }]);

            }

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

            window.addEventListener("message", Auth1.receiveMessage, false);

            const tokenUrl: string = tokenService.id + "?messageId=" + messageId + "&origin=" + Auth1.getOrigin();
            $('#commsFrame').prop('src', tokenUrl);

            // reject any unhandled messages after a configurable timeout
            const postMessageTimeout = 5000;

            setTimeout(() => {
                if (Auth1.messages[messageId]) {
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

    static receiveMessage(event: any): void {    
        if (event.data.hasOwnProperty("messageId")) {

            var message = Auth1.messages[event.data.messageId];

            if (message && event.origin == message.serviceOrigin) {
                // Any message with a messageId is a success
                message.resolve(event.data);
                delete Auth1.messages[event.data.messageId];
                return;
            }    
        }
    }
}
