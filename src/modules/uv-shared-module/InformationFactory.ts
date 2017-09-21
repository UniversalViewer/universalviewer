import {BaseEvents} from "./BaseEvents";
import {Information} from "./Information";
import {InformationAction} from "./InformationAction";
import {InformationArgs} from "./InformationArgs";
import {InformationType} from "./InformationType";
import {IExtension} from "./IExtension";

export class InformationFactory {

    extension: IExtension;

    constructor(extension: IExtension) {
        this.extension = extension;
    }

    public Get(args: InformationArgs): Information {
        switch(args.informationType){
            case (InformationType.AUTH_CORS_ERROR):
                return new Information(this.extension.data.config.content.authCORSError, []);
            case (InformationType.DEGRADED_RESOURCE):
                const actions: InformationAction[] = [];
                const loginAction: InformationAction = new InformationAction();

                let label: string | null = args.param.loginService.getConfirmLabel();

                if (!label) {
                    label = this.extension.data.config.content.fallbackDegradedLabel;
                }

                loginAction.label = label;

                const resource: Manifesto.IExternalResource = args.param;

                loginAction.action = () => {
                    resource.authHoldingPage = window.open("", "_blank");
                    $.publish(BaseEvents.HIDE_INFORMATION);
                    $.publish(BaseEvents.OPEN_EXTERNAL_RESOURCE, [[resource]]);
                };

                actions.push(loginAction);

                let message: string | null = args.param.loginService.getServiceLabel();

                if (!message) {
                    message = this.extension.data.config.content.fallbackDegradedMessage;
                }

                return new Information(<string>message, actions);
        }
    }
}