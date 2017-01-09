import BaseCommands = require("./BaseCommands");
import Information = require("./Information");
import InformationAction = require("./InformationAction");
import InformationArgs = require("./InformationArgs");
import InformationType = require("./InformationType");
import IExtension = require("./IExtension");

class InformationFactory{

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

export = InformationFactory;