import { IExternalResource, Utils as ManifestoUtils, StatusCode, IAccessToken } from 'manifesto.js';
import {BaseEvents} from "./BaseEvents";
import {InformationArgs} from "./InformationArgs";
import {InformationType} from "./InformationType";
import {ILoginDialogueOptions} from "./ILoginDialogueOptions";
import {LoginWarningMessages} from "./LoginWarningMessages";


export class Auth09 {

    static publish: (event: string, args?: any) => void;

    static loadExternalResources(resourcesToLoad: IExternalResource[], storageStrategy: string): Promise<IExternalResource[]> {
        return new Promise<IExternalResource[]>((resolve) => {
            ManifestoUtils.loadExternalResourcesAuth09(
                resourcesToLoad,
                storageStrategy,
                Auth09.clickThrough,
                Auth09.restricted,
                Auth09.login,
                Auth09.getAccessToken,
                Auth09.storeAccessToken,
                Auth09.getStoredAccessToken,
                Auth09.handleExternalResourceResponse).then((r: IExternalResource[]) => {
                    resolve(r);
                })['catch']((error: any) => {
                    switch(error.name) {
                        case StatusCode.AUTHORIZATION_FAILED.toString():
                            Auth09.publish(BaseEvents.LOGIN_FAILED);
                            break;
                        case StatusCode.FORBIDDEN.toString():
                            Auth09.publish(BaseEvents.FORBIDDEN);
                            break;
                        case StatusCode.RESTRICTED.toString():
                            // do nothing
                            break;
                        default:
                            Auth09.publish(BaseEvents.SHOW_MESSAGE, [error.message || error]);
                    }
            });
        });
    }

    static clickThrough(resource: IExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            Auth09.publish(BaseEvents.SHOW_CLICKTHROUGH_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {

                    if (resource.clickThroughService) {
                        const win: Window | null = window.open(resource.clickThroughService.id);

                        const pollTimer: number = window.setInterval(() => {
                            if (win && win.closed) {
                                window.clearInterval(pollTimer);
                                Auth09.publish(BaseEvents.CLICKTHROUGH);
                                resolve();
                            }
                        }, 500);
                    }

                }
            }]);
        });
    }

    static restricted(resource: IExternalResource): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            Auth09.publish(BaseEvents.SHOW_RESTRICTED_DIALOGUE, [{
                resource: resource,
                acceptCallback: () => {
                    Auth09.publish(BaseEvents.LOAD_FAILED);
                    reject(resource);
                }
            }]);
        });
    }

    static login(resource: IExternalResource): Promise<void> {
        return new Promise<void>((resolve) => {

            const options: ILoginDialogueOptions = <ILoginDialogueOptions>{};

            if (resource.status === HTTPStatusCode.FORBIDDEN) {
                options.warningMessage = LoginWarningMessages.FORBIDDEN;
                options.showCancelButton = true;
            }

            Auth09.publish(BaseEvents.SHOW_LOGIN_DIALOGUE, [{
                resource: resource,
                loginCallback: () => {
                    if (resource.loginService) {
                        const win: Window | null = window.open(resource.loginService.id + "?t=" + new Date().getTime());
                        const pollTimer: number = window.setInterval(function () {
                            if (win && win.closed) {
                                window.clearInterval(pollTimer);
                                Auth09.publish(BaseEvents.LOGIN);
                                resolve();
                            }
                        }, 500);
                    }
                },
                logoutCallback: () => {
                    if (resource.logoutService) {
                        const win: Window | null = window.open(resource.logoutService.id + "?t=" + new Date().getTime());
                        const pollTimer: number = window.setInterval(function () {
                            if (win && win.closed) {
                                window.clearInterval(pollTimer);
                                Auth09.publish(BaseEvents.LOGOUT);
                                resolve();
                            }
                        }, 500);
                    }
                },
                options: options
            }]);
        });
    }

    static getAccessToken(resource: IExternalResource, rejectOnError: boolean): Promise<IAccessToken> {

        return new Promise<IAccessToken>((resolve, reject) => {

            if (resource.tokenService) {
                const serviceUri: string = resource.tokenService.id;

                // pick an identifier for this message. We might want to keep track of sent messages
                const msgId: string = serviceUri + "|" + new Date().getTime();

                const receiveAccessToken: EventListenerOrEventListenerObject = (e: any) => {
                    window.removeEventListener("message", receiveAccessToken);
                    const token: any = e.data;
                    if (token.error) {
                        if (rejectOnError) {
                            reject(token.errorDescription);
                        } else {
                            resolve(undefined);
                        }
                    } else {
                        resolve(token);
                    }
                };

                window.addEventListener("message", receiveAccessToken, false);

                const tokenUri: string = serviceUri + "?messageId=" + msgId;
                $('#commsFrame').prop('src', tokenUri);
            } else {
                reject('Token service not found');
            }
        });
    }

    static storeAccessToken(resource: IExternalResource, token: IAccessToken, storageStrategy: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (resource.tokenService) {
                Utils.Storage.set(resource.tokenService.id, token, token.expiresIn, new Utils.StorageType(storageStrategy));
                resolve();
            } else {
                reject('Token service not found');
            } 
        });
    }

    static getStoredAccessToken(resource: IExternalResource, storageStrategy: string): Promise<IAccessToken> {

        return new Promise<IAccessToken>((resolve, reject) => {

            let foundItems: Utils.StorageItem[] = [];
            let item: Utils.StorageItem | null = null;

            // try to match on the tokenService, if the resource has one:
            if (resource.tokenService) {
                item = Utils.Storage.get(resource.tokenService.id, new Utils.StorageType(storageStrategy));
            }

            if (item) {
                foundItems.push(item);
            } else {
                // find an access token for the domain
                const domain: string = Utils.Urls.getUrlParts(<string>resource.dataUri).hostname;
                const items: Utils.StorageItem[] = Utils.Storage.getItems(new Utils.StorageType(storageStrategy));

                for (let i = 0; i < items.length; i++) {
                    item = items[i];

                    if (item.key.includes(domain)) {
                        foundItems.push(item);
                    }
                }
            }

            // sort by expiresAt, earliest to most recent.
            foundItems = foundItems.sort((a: Utils.StorageItem, b: Utils.StorageItem) => {
                return a.expiresAt - b.expiresAt;
            });

            let foundToken: IAccessToken | undefined;

            if (foundItems.length) {
                foundToken = <IAccessToken>foundItems[foundItems.length - 1].value;
            }

            resolve(foundToken);
        });
    }

    static handleExternalResourceResponse(resource: IExternalResource): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            resource.isResponseHandled = true;

            if (resource.status === HTTPStatusCode.OK) {
                resolve(resource);
            } else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
                resolve(resource);
                Auth09.publish(BaseEvents.RESOURCE_DEGRADED, [resource]);
            } else {

                if (resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
                    resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
                    // if the browser doesn't support CORS
                    if (!Modernizr.cors) {
                        const informationArgs: InformationArgs = new InformationArgs(InformationType.AUTH_CORS_ERROR, null);
                        Auth09.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
                        resolve(resource);
                    } else {
                        reject(resource.error.statusText);
                    }
                } else if (resource.error.status === HTTPStatusCode.FORBIDDEN) {
                    const error: Error = new Error();
                    error.message = "Forbidden";
                    error.name = StatusCode.FORBIDDEN.toString();
                    reject(error);
                } else {
                    reject(resource.error.statusText);
                }
            }
        });
    }

    static handleDegraded(resource: IExternalResource): void {
        const informationArgs: InformationArgs = new InformationArgs(InformationType.DEGRADED_RESOURCE, resource);
        Auth09.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
    }
}
