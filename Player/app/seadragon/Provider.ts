/// <reference path="../../js/jquery.d.ts" />
import baseProvider = module("app/BaseProvider");

export class Provider extends baseProvider.BaseProvider {

    constructor(config: any, pkg: any) {
        super(config, pkg);

        this.config.options = $.extend(true, this.options, {
            // override BaseProvider options.
        }, config.options);
    }


}