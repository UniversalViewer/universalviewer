import BaseCommands = require("./BaseCommands");
import Information = require("./Information");
import InformationAction = require("./InformationAction");
import InformationArgs = require("./InformationArgs");
import InformationType = require("./InformationType");
import IProvider = require("./IProvider");

class InformationFactory{

    provider: IProvider;

    constructor(provider: IProvider){
        this.provider = provider;
    }

    public Get(args: InformationArgs): Information {
        switch(args.informationType){
            case (InformationType.AUTH_CORS_ERROR):
                return new Information(this.provider.config.content.authCORSError, []);
                break;
            case (InformationType.DEGRADED_RESOURCE):
                var actions: InformationAction[] = [];

                var loginAction: InformationAction = new InformationAction();

                loginAction.label = this.provider.config.content.degradedResourceLogin;

                loginAction.action = () => {
                    $.publish(BaseCommands.HIDE_INFORMATION);
                    $.publish(BaseCommands.OPEN_EXTERNAL_RESOURCE, [[args.param]]);
                };

                actions.push(loginAction);

                return new Information(this.provider.config.content.degradedResourceMessage, actions);

                break;
        }
    }
}

export = InformationFactory;