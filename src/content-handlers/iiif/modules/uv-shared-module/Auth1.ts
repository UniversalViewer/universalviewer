const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { sanitize } from "../../../../Utils";
import { InformationArgs } from "./InformationArgs";
import { InformationType } from "./InformationType";
import {
  IExternalResource,
  IAccessToken,
  IManifestoOptions,
  Service,
  StatusCode,
  Utils,
} from "manifesto.js";
import { Storage, StorageType, StorageItem, Urls } from "@edsilv/utils";
// import { Urls } from "@edsilv/utils";
// import { Storage, StorageType, StorageItem } from "../../../../Utils";
import * as HTTPStatusCode from "@edsilv/http-status-codes";

export class Auth1 {
  static messages: any = {};
  static storageStrategy: StorageType;
  static publish: (event: string, args?: any) => void;

  static loadExternalResources(
    resourcesToLoad: IExternalResource[],
    storageStrategy: StorageType,
    options: IManifestoOptions
  ): Promise<IExternalResource[]> {
    return new Promise<IExternalResource[]>((resolve) => {
      Auth1.storageStrategy = storageStrategy;

      // set all resources to Auth API V1
      resourcesToLoad = resourcesToLoad.map((resource: IExternalResource) => {
        resource.authAPIVersion = 1;
        resource.options = options;
        return resource;
      });

      Utils.loadExternalResourcesAuth1(
        resourcesToLoad,
        Auth1.openContentProviderInteraction,
        Auth1.openTokenService,
        Auth1.getStoredAccessToken,
        Auth1.userInteractedWithContentProvider,
        Auth1.getContentProviderInteraction,
        Auth1.handleMovedTemporarily,
        Auth1.showOutOfOptionsMessages
      )
        .then((r: IExternalResource[]) => {
          resolve(r);
        })
        ["catch"]((error: any) => {
          switch (error.name) {
            case StatusCode.AUTHORIZATION_FAILED.toString():
              Auth1.publish(IIIFEvents.LOGIN_FAILED);
              break;
            case StatusCode.FORBIDDEN.toString():
              Auth1.publish(IIIFEvents.FORBIDDEN);
              break;
            case StatusCode.RESTRICTED.toString():
              // do nothing
              break;
            default:
              Auth1.publish(IIIFEvents.SHOW_MESSAGE, [error.message || error]);
          }
        });
    });
  }

  static getCookieServiceUrl(service: Service): string {
    let cookieServiceUrl: string = service.id + "?origin=" + Auth1.getOrigin();
    return cookieServiceUrl;
  }

  static openContentProviderInteraction(service: Service): Window | null {
    const cookieServiceUrl: string = Auth1.getCookieServiceUrl(service);
    return window.open(cookieServiceUrl);
  }

  // determine the postMessage-style origin for a URL
  static getOrigin(url?: string): string {
    let urlHolder: Location | HTMLAnchorElement = window.location;
    if (url) {
      urlHolder = document.createElement("a");
      urlHolder.href = url;
    }
    return (
      urlHolder.protocol +
      "//" +
      urlHolder.hostname +
      (urlHolder.port ? ":" + urlHolder.port : "")
    );
  }

  static userInteractedWithContentProvider(
    contentProviderWindow: Window
  ): Promise<boolean> {
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

  static handleMovedTemporarily(resource: IExternalResource): Promise<void> {
    return new Promise<void>((resolve) => {
      Auth1.showDegradedMessage(resource);
      resource.isResponseHandled = true;
      resolve();
    });
  }

  static showDegradedMessage(resource: IExternalResource): void {
    if (resource.kioskService) {
      // if it's a kiosk service, open the window immediately.
      Auth1.publish(IIIFEvents.OPEN_EXTERNAL_RESOURCE, [[resource]]);
    } else {
      const informationArgs: InformationArgs = new InformationArgs(
        InformationType.DEGRADED_RESOURCE,
        resource
      );
      Auth1.publish(IIIFEvents.SHOW_INFORMATION, [informationArgs]);
    }
  }

  static storeAccessToken(
    resource: IExternalResource,
    token: IAccessToken
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (resource.tokenService) {
        Storage.set(
          resource.tokenService.id,
          token,
          token.expiresIn || 3600, // default to 1 hour
          Auth1.storageStrategy
        );
        resolve();
      } else {
        reject("Token service not found");
      }
    });
  }

  static getStoredAccessToken(
    resource: IExternalResource
  ): Promise<IAccessToken | null> {
    return new Promise<IAccessToken | null>((resolve, reject) => {
      let foundItems: StorageItem[] = [];
      let item: StorageItem | null = null;

      // try to match on the tokenService, if the resource has one:
      if (resource.tokenService) {
        item = Storage.get(resource.tokenService.id, Auth1.storageStrategy);
      }

      if (item) {
        foundItems.push(item);
      } else {
        // find an access token for the domain
        const domain: string = Urls.getUrlParts(
          <string>resource.dataUri
        ).hostname;
        const items: StorageItem[] = Storage.getItems(Auth1.storageStrategy);

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

      let foundToken: IAccessToken | null = null;

      if (foundItems.length) {
        foundToken = <IAccessToken>foundItems[foundItems.length - 1].value;
      }

      resolve(foundToken);
    });
  }

  static getContentProviderInteraction(
    resource: IExternalResource,
    service: Service
  ): Promise<Window | null> {
    return new Promise<Window | null>((resolve) => {
      // if the info bar has already been shown for degraded logins
      if (resource.isResponseHandled && !resource.authHoldingPage) {
        Auth1.showDegradedMessage(resource);
        resolve(null);
      } else if (resource.authHoldingPage) {
        // redirect holding page
        resource.authHoldingPage.location.href =
          Auth1.getCookieServiceUrl(service);
        resolve(resource.authHoldingPage);
      } else {
        Auth1.publish(IIIFEvents.SHOW_AUTH_DIALOGUE, [
          {
            service: service,
            closeCallback: () => {
              resolve(null);
            },
            confirmCallback: () => {
              const win: Window | null =
                Auth1.openContentProviderInteraction(service);
              resolve(win);
            },
            cancelCallback: () => {
              resolve(null);
            },
          },
        ]);
      }
    });
  }

  static openTokenService(
    resource: IExternalResource,
    tokenService: Service
  ): Promise<any> {
    // use a Promise across a postMessage call. Discuss...
    return new Promise<any>((resolve, reject) => {
      // if necessary, the client can decide not to trust this origin
      const serviceOrigin: string = Auth1.getOrigin(tokenService.id);
      const messageId: number = new Date().getTime();

      // console.log("openTokenService", messageId);

      Auth1.messages[messageId] = {
        resolve: resolve,
        reject: reject,
        serviceOrigin: serviceOrigin,
        resource: resource,
      };

      window.addEventListener("message", Auth1.receiveToken, false);

      const tokenUrl: string =
        tokenService.id +
        "?messageId=" +
        messageId +
        "&origin=" +
        Auth1.getOrigin();

      // load the access token service url in the #commsFrame iframe.
      // when the message event listener (Auth1.receiveToken) receives a message from the iframe
      // it looks in Auth1.messages to find a corresponding message id with the same origin.
      // if found, it stores the returned access token, resolves and deletes the message.
      // resolving the message resolves the openTokenService promise.
      // console.log("tokenUrl", tokenUrl);
      $("#commsFrame").prop("src", tokenUrl);

      // reject any unhandled messages after a configurable timeout
      const postMessageTimeout: number = 5000;

      setTimeout(() => {
        if (Auth1.messages[messageId]) {
          Auth1.messages[messageId].reject(
            "Message unhandled after " + postMessageTimeout + "ms, rejecting"
          );
          delete Auth1.messages[messageId];
        }
      }, postMessageTimeout);
    });
  }

  static receiveToken(event: any): void {
    // debug
    // if (event.origin.startsWith("https://test.auth")) {
    //   console.log("receiveToken", event);
    // }

    if (event.data.hasOwnProperty("messageId")) {
      const message: any = Auth1.messages[event.data.messageId];

      if (message && event.origin == message.serviceOrigin) {
        // Any message with a messageId is a success
        Auth1.storeAccessToken(message.resource, event.data).then(() => {
          message.resolve(event.data); // resolves openTokenService with the token
          delete Auth1.messages[event.data.messageId];
          return;
        });
      }
    }
  }

  static showOutOfOptionsMessages(
    resource: IExternalResource,
    service: Service
  ): void {
    // if the UV is already showing the info bar, no need to show an error message.
    if (resource.status == HTTPStatusCode.MOVED_TEMPORARILY) {
      return;
    }

    let errorMessage: string = "";

    if (service.getFailureHeader()) {
      errorMessage += "<p>" + service.getFailureHeader() + "</p>";
    }

    if (service.getFailureDescription()) {
      errorMessage += service.getFailureDescription();
    }

    Auth1.publish(IIIFEvents.SHOW_MESSAGE, [sanitize(errorMessage)]);
  }
}
