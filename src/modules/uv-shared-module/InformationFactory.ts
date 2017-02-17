import {BaseCommands} from "./BaseCommands";
import {Information} from "./Information";
import {InformationAction} from "./InformationAction";
import {InformationArgs} from "./InformationArgs";
import {InformationType} from "./InformationType";
import {IExtension} from "./IExtension";

export class InformationFactory{

    extension: IExtension;

    constructor(extension: IExtension){
        this.extension = extension;
    }

    public Get(args: InformationArgs): Information {
        switch(args.informationType){
            case (InformationType.AUTH_CORS_ERROR):
                return new Information(this.extension.config.content.authCORSError, []);
            case (InformationType.DEGRADED_RESOURCE):
                var actions: InformationAction[] = [];

                var loginAction: InformationAction = new InformationAction();

                loginAction.label = this.extension.config.content.degradedResourceLogin;

                loginAction.action = () => {
                    $.publish(BaseCommands.HIDE_INFORMATION);
                    $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE, [[args.param]]);
                };

                actions.push(loginAction);

                return new Information(this.extension.config.content.degradedResourceMessage, actions);
        }
    }
}