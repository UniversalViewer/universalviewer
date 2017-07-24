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
                loginAction.label = args.param.loginService.getConfirmLabel();

                const resource: Manifesto.IExternalResource = args.param;
                resource.contentProviderInteractionEnabled = false;

                loginAction.action = () => {
                    $.publish(BaseEvents.HIDE_INFORMATION);
                    $.publish(BaseEvents.OPEN_EXTERNAL_RESOURCE, [[resource]]);
                };

                actions.push(loginAction);
                return new Information(args.param.loginService.getServiceLabel(), actions);
        }
    }
}