/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import ip = module("app/IProvider");
import p = module("app/seadragon/Provider");
import shell = module("app/shared/Shell");
import header = module("app/seadragon/Header");
import main = module("app/seadragon/Main");
import footer = module("app/seadragon/Footer");

export class App extends baseApp.BaseApp {

    constructor(provider: ip.IProvider) {
        super(provider);
    }

    create(): void {
        super.create();
        
        new header.Header(shell.Shell.$headerPanel);
        new main.Main(shell.Shell.$mainPanel);
        new footer.Footer(shell.Shell.$footerPanel);

        $.publish(baseApp.BaseApp.RESIZE);
    }
     
    // todo: this can be converted to a getter if willing to only support ECMA Script 5...
    static getDataProvider(): p.Provider {
        return <p.Provider>baseApp.BaseApp.provider;
    }
}
