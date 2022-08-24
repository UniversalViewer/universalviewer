const $ = window.$;
import { IIIFEvents } from "../../IIIFEvents";
import { InformationArgs } from "./InformationArgs";
import { InformationType } from "./InformationType";
import { ILoginDialogueOptions } from "./ILoginDialogueOptions";
import { LoginWarningMessages } from "./LoginWarningMessages";
import {
  IAccessToken,
  IExternalResource,
  StatusCode,
  Utils,
} from "manifesto.js";
import { Storage, StorageType, StorageItem, Urls } from "@edsilv/utils";
import * as HTTPStatusCode from "@edsilv/http-status-codes";
import { Events } from "../../../../Events";

export class Auth09 {
  static publish: (event: string, args?: any) => void;

  static loadExternalResources(
    resourcesToLoad: IExternalResource[],
    storageStrategy: string
  ): Promise<IExternalResource[]> {
    return new Promise<IExternalResource[]>((resolve) => {
      Utils.loadExternalResourcesAuth09(
        resourcesToLoad,
        storageStrategy,
        Auth09.clickThrough,
        Auth09.restricted,
        Auth09.login,
        Auth09.getAccessToken,
        Auth09.storeAccessToken,
        Auth09.getStoredAccessToken,
        Auth09.handleExternalResourceResponse
      )
        .then((r: IExternalResource[]) => {
          resolve(r);
        })
        ["catch"]((error: any) => {
          switch (error.name) {
            case StatusCode.AUTHORIZATION_FAILED.toString():
              Auth09.publish(IIIFEvents.LOGIN_FAILED);
              break;
            case StatusCode.FORBIDDEN.toString():
              Auth09.publish(IIIFEvents.FORBIDDEN);
              break;
            case StatusCode.RESTRICTED.toString():
              // do nothing
              break;
            default:
              Auth09.publish(IIIFEvents.SHOW_MESSAGE, [error.message || error]);
          }
        });
    });
  }

  static clickThrough(resource: IExternalResource): Promise<void> {
    return new Promise<void>((resolve) => {
      Auth09.publish(IIIFEvents.SHOW_CLICKTHROUGH_DIALOGUE, [
        {
          resource: resource,
          acceptCallback: () => {
            if (resource.clickThroughService) {
              const win: Window | null = window.open(
                resource.clickThroughService.id
              );

              const pollTimer: number = window.setInterval(() => {
                if (win && win.closed) {
                  window.clearInterval(pollTimer);
                  Auth09.publish(IIIFEvents.CLICKTHROUGH);
                  resolve();
                }
              }, 500);
            }
          },
        },
      ]);
    });
  }

  static restricted(resource: IExternalResource): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Auth09.publish(IIIFEvents.SHOW_RESTRICTED_DIALOGUE, [
        {
          resource: resource,
          acceptCallback: () => {
            Auth09.publish(Events.LOAD_FAILED);
            reject(resource);
          },
        },
      ]);
    });
  }

  static login(resource: IExternalResource): Promise<void> {
    return new Promise<void>((resolve) => {
      const options: ILoginDialogueOptions = <ILoginDialogueOptions>{};

      if (resource.status === HTTPStatusCode.FORBIDDEN) {
        options.warningMessage = LoginWarningMessages.FORBIDDEN;
        options.showCancelButton = true;
      }

      console.log("login");

      Auth09.publish(IIIFEvents.SHOW_LOGIN_DIALOGUE, [
        {
          resource: resource,
          loginCallback: () => {
            if (resource.loginService) {
              const win: Window | null = window.open(
                resource.loginService.id + "?t=" + new Date().getTime()
              );
              const pollTimer: number = window.setInterval(function() {
                if (win && win.closed) {
                  window.clearInterval(pollTimer);
                  Auth09.publish(IIIFEvents.LOGIN);
                  resolve();
                }
              }, 500);
            }
          },
          logoutCallback: () => {
            if (resource.logoutService) {
              const win: Window | null = window.open(
                resource.logoutService.id + "?t=" + new Date().getTime()
              );
              const pollTimer: number = window.setInterval(function() {
                if (win && win.closed) {
                  window.clearInterval(pollTimer);
                  Auth09.publish(IIIFEvents.LOGOUT);
                  resolve();
                }
              }, 500);
            }
          },
          options: options,
        },
      ]);
    });
  }

  static getAccessToken(
    resource: IExternalResource,
    rejectOnError: boolean
  ): Promise<IAccessToken> {
    return new Promise<IAccessToken>((resolve, reject) => {
      if (resource.tokenService) {
        const serviceUri: string = resource.tokenService.id;

        // pick an identifier for this message. We might want to keep track of sent messages
        const msgId: string = serviceUri + "|" + new Date().getTime();

        const receiveAccessToken: EventListenerOrEventListenerObject = (
          e: any
        ) => {
          window.removeEventListener("message", receiveAccessToken);
          const token: any = e.data;
          if (token.error) {
            if (rejectOnError) {
              reject(token.errorDescription);
            } else {
              reject(undefined);
            }
          } else {
            resolve(token);
          }
        };

        window.addEventListener("message", receiveAccessToken, false);

        const tokenUri: string = serviceUri + "?messageId=" + msgId;
        $("#commsFrame").prop("src", tokenUri);
      } else {
        reject("Token service not found");
      }
    });
  }

  static storeAccessToken(
    resource: IExternalResource,
    token: IAccessToken,
    storageStrategy: StorageType
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (resource.tokenService) {
        Storage.set(
          resource.tokenService.id,
          token,
          token.expiresIn,
          storageStrategy
        );
        resolve();
      } else {
        reject("Token service not found");
      }
    });
  }

  static getStoredAccessToken(
    resource: IExternalResource,
    storageStrategy: StorageType
  ): Promise<IAccessToken> {
    return new Promise<IAccessToken>((resolve, _reject) => {
      let foundItems: StorageItem[] = [];
      let item: StorageItem | null = null;

      // try to match on the tokenService, if the resource has one:
      if (resource.tokenService) {
        item = Storage.get(resource.tokenService.id, storageStrategy);
      }

      if (item) {
        foundItems.push(item);
      } else {
        // find an access token for the domain
        const domain: string = Urls.getUrlParts(<string>resource.dataUri)
          .hostname;
        const items: StorageItem[] = Storage.getItems(storageStrategy);

        for (let i = 0; i < items.length; i++) {
          item = items[i];

          if (item.key.includes(domain)) {
            foundItems.push(item);
          }
        }
      }

      // sort by expiresAt, earliest to most recent.
      foundItems = foundItems.sort((a: StorageItem, b: StorageItem) => {
        return a.expiresAt - b.expiresAt;
      });

      let foundToken: IAccessToken;

      if (foundItems.length) {
        foundToken = foundItems[foundItems.length - 1].value;
        resolve(foundToken);
      }
    });
  }

  static handleExternalResourceResponse(
    resource: IExternalResource
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resource.isResponseHandled = true;

      if (resource.status === HTTPStatusCode.OK) {
        resolve(resource);
      } else if (resource.status === HTTPStatusCode.MOVED_TEMPORARILY) {
        resolve(resource);
        Auth09.publish(IIIFEvents.RESOURCE_DEGRADED, [resource]);
      } else {
        if (
          resource.error.status === HTTPStatusCode.UNAUTHORIZED ||
          resource.error.status === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
          // if the browser doesn't support CORS
          // if (!Modernizr.cors) {
          //     const informationArgs: InformationArgs = new InformationArgs(InformationType.AUTH_CORS_ERROR, null);
          //     Auth09.publish(BaseEvents.SHOW_INFORMATION, [informationArgs]);
          //     resolve(resource);
          // } else {
          // commented above because only supporting IE11 upwards which has CORS
          reject(resource.error.statusText);
          //}
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
    const informationArgs: InformationArgs = new InformationArgs(
      InformationType.DEGRADED_RESOURCE,
      resource
    );
    Auth09.publish(IIIFEvents.SHOW_INFORMATION, [informationArgs]);
  }
}
