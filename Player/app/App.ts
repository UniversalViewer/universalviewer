/// <reference path="../js/jquery.d.ts" />
/// <reference path="../js/extensions.d.ts" />
import baseApp = module("app/BaseApp");
import utils = module("app/Utils");
import dp = module("app/IDataProvider");

export class App extends baseApp.BaseApp {

    constructor(configUri: string, dataProvider: dp.IDataProvider) {
        super(configUri, dataProvider);
    }

    create(): void {
        super.create();
        
        // app-specific stuff goes here...
    }
}
