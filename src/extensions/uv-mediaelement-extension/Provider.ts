import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import IMediaElementProvider = require("./IMediaElementProvider");

class Provider extends BaseProvider implements IMediaElementProvider{

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
        }, bootstrapper.config.options);
    }

    getEmbedScript(width: number, height: number, embedTemplate: string): string{

        var esu = this.options.embedScriptUri || this.embedScriptUri;

        var template = this.options.embedTemplate || embedTemplate;

        var configUri = this.config.uri || '';

        var script = String.format(template, this.manifestUri, this.sequenceIndex, configUri, width, height, esu);

        return script;
    }

    getPosterImageUri(): string{
        return this.getCurrentCanvas().thumbnail;
    }
}

export = Provider;
