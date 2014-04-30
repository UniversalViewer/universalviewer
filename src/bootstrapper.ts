/// <reference path="js/jquery.d.ts" />
import utils = require("utils");

class BootStrapper{

    manifest: any;
    extensions: any;
    dataBaseUri: string;
    manifestUri: string;
    sequenceIndex: number;
    sequences: any;
    sequence: any;
    IIIF: boolean = false;
    configExtensionUri: string;
    configExtension: any;

    // this loads the manifest, determines what kind of extension and provider to use, and instantiates them.
    constructor(extensions: any) {

        this.extensions = extensions;

        var that = this;

        that.dataBaseUri = utils.Utils.getQuerystringParameter('dbu');
        that.manifestUri = utils.Utils.getQuerystringParameter('du');
        that.configExtensionUri = utils.Utils.getQuerystringParameter('c');

        if (that.dataBaseUri){
            that.manifestUri = that.dataBaseUri + that.manifestUri;
        }

        jQuery.support.cors = true;

        // if data-config has been set on embedding div, load the js
        if (that.configExtensionUri){

            $.getJSON(that.configExtensionUri, (configExtension) => {
                that.configExtension = configExtension;
                that.loadManifest();
            });

        } else {
            that.loadManifest();
        }
    }

    loadManifest(): void{
        var that = this;

        $.getJSON(that.manifestUri, (manifest) => {

            that.manifest = manifest;

            // if on home domain, check hash params. otherwise, use
            // embed data attributes or default to 0.
            var isHomeDomain = utils.Utils.getQuerystringParameter('hd') == "true";
            var isReload = utils.Utils.getQuerystringParameter('rl') == "true";
            var sequenceParam = 'si';

            if (that.configExtension && that.configExtension.options && that.configExtension.options.IIIF){
                that.IIIF = true;
            }

            if (!that.IIIF) sequenceParam = 'asi';

            if (isHomeDomain && !isReload){
                that.sequenceIndex = parseInt(utils.Utils.getHashParameter(sequenceParam, parent.document));
            }

            if (!that.sequenceIndex){
                that.sequenceIndex = parseInt(utils.Utils.getQuerystringParameter(sequenceParam)) || 0;
            }

            if (!that.IIIF){
                that.sequences = that.manifest.assetSequences;
            } else {
                that.sequences = that.manifest.sequences;
            }

            if (!that.sequences){
                that.notFound();
            }

            that.loadSequence();

        });
    }

    loadSequence(): void{

        var that = this;

        if (!that.IIIF){
            // if it's not a reference, load dependencies
            if (!that.sequences[that.sequenceIndex].$ref) {
                that.sequence = that.sequences[that.sequenceIndex];
                that.loadDependencies();
            } else {
                // load referenced sequence.
                var baseManifestUri = that.manifestUri.substr(0, that.manifestUri.lastIndexOf('/') + 1);
                var sequenceUri = baseManifestUri + that.sequences[that.sequenceIndex].$ref;

                $.getJSON(sequenceUri, (sequenceData) => {
                    that.sequence = that.sequences[that.sequenceIndex] = sequenceData;
                    that.loadDependencies();
                });
            }
        } else {
            // if it's not a reference, load dependencies
            if (that.sequences[that.sequenceIndex].canvases) {
                that.sequence = that.sequences[that.sequenceIndex];
                that.loadDependencies();
            } else {
                // load referenced sequence.
                var baseManifestUri = that.manifestUri.substr(0, that.manifestUri.lastIndexOf('/') + 1);
                var sequenceUri = String(that.sequences[that.sequenceIndex]['@id']);

                $.getJSON(sequenceUri, (sequenceData) => {
                    that.sequence = that.sequences[that.sequenceIndex] = sequenceData;
                    that.loadDependencies();
                });
            }
        }
    }

    notFound(): void{
        try{
            parent.$(parent.document).trigger("onNotFound");
            return;
        } catch (e) {}
    }

    loadDependencies(): void {

        var that = this;
        var extension;

        if (!that.IIIF){
            extension = that.extensions[that.sequence.assetType];
        } else {
            // only seadragon extension is compatible with IIIF
            extension = that.extensions['seadragon/iiif'];
        }

        yepnope.injectCss(extension.css, function () {

            $.getJSON(extension.config, (config) => {

                // if data-config has been set on embedding div, extend the existing config object.
                if (that.configExtension){

                        // save a reference to the config extension uri.
                        config.uri = that.configExtensionUri;

                        $.extend(true, config, that.configExtension);

                        that.createExtension(extension, config);

                } else {
                    that.createExtension(extension, config);
                }
            });
        });
    }

    createExtension(extension: any, config: any): void{
        // create provider.
        var provider = new extension.provider(config, this.manifest);

        // create extension.
        new extension.type(provider);
    }
}

export = BootStrapper;