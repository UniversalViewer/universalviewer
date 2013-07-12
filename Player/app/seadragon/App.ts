/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import p = module("app/seadragon/Provider");
import shell = module("app/shared/Shell");
import header = module("app/seadragon/Header");
import main = module("app/seadragon/Main");
import footer = module("app/seadragon/Footer");

export class App extends baseApp.BaseApp {

    static provider: p.Provider;

    constructor(provider: p.Provider) {
        super(provider);
    }

    create(): void {
        super.create();

        App.provider = <p.Provider>baseApp.BaseApp.provider;

        new header.Header(shell.Shell.$headerPanel);
        new main.Main(shell.Shell.$mainPanel);
        new footer.Footer(shell.Shell.$footerPanel);

        $.publish(baseApp.BaseApp.RESIZE);
    }

}
