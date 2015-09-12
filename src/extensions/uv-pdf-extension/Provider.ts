import BaseProvider = require("../../modules/uv-shared-module/BaseProvider");
import BootStrapper = require("../../Bootstrapper");
import IPDFProvider = require("./IPDFProvider");

class Provider extends BaseProvider implements IPDFProvider{

    constructor(bootstrapper: BootStrapper) {
        super(bootstrapper);

        this.config.options = $.extend(true, this.options, {
            // override or extend BaseProvider options.
            // these are in turn overridden by the root options object in this extension's config.js.
        }, bootstrapper.config.options);
    }

    getEmbedScript(template: string, width: number, height: number): string{

        var configUri = this.config.uri || '';

        var script = String.format(template, this.getSerializedLocales(), configUri, this.manifestUri, this.collectionIndex, this.manifestIndex, this.sequenceIndex, this.canvasIndex, width, height, this.embedScriptUri);

        return script;
    }
}

export = Provider;
