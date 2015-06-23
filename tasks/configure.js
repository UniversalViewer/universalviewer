var _ = require('lodash'),
    glob = require('glob'),
    globArray = require('glob-array'),
    jsonSchemaGenerator = require('json-schema-generator'),
    path = require('path');

module.exports = function (grunt) {

    var options, src;

    grunt.registerMultiTask('configure', 'Creates localised config files, generates config editor schemas.', function () {

        options = this.data.options;

        var dirs = glob.sync('./src/extensions/*/l10n');

        _.each(dirs, function(dir) {

            if (!grunt.file.isDir(dir)) return;

            configureExtension(dir);
        });
    });

    function configureExtension(dir) {

        var locales = getLocales(dir);

        // for each extension/l10n/xx-XX.json localisation file, find its counterpart extension/config/xx-XX.json config file.
        // if none is found, fall back to extension/config/en-GB.json
        // extend the config file with the localisation file and locales object.
        // copy it to extension/config/xx-XX.config.js
        // use jsonSchemaGenerator to generate schema for examples editor.
        // copy to extension/config/xx-XX.schema.js

        var l10nFiles = getL10nFiles(dir);

        _.each(l10nFiles, function(file) {
            var regex = (/(.*)\/l10n\/(.*).json/).exec(file);

            var extension = regex[1];
            var build = extension + '/build/';
            var parent = extension + '/config/';
            var locale = regex[2];
            var path = parent + locale;
            var config = path + '.json';
            var configDest = build + locale + '.config.json';
            var schemaDest = build + locale + '.schema.json';

            // check config counterpart exists, if not fall back to en-GB.json
            if (!grunt.file.exists(config)){
                config = parent + options.default;
            }

            var configJSON = grunt.file.readJSON(config);
            var localeJSON = grunt.file.readJSON(file);

            if (configJSON.extends){
                var extJSON = grunt.file.readJSON(configJSON.extends);
                configJSON = _.merge(extJSON, configJSON);
            }

            if (localeJSON.extends){
                var extJSON = grunt.file.readJSON(localeJSON.extends);
                localeJSON = _.merge(localeJSON, extJSON);
            }

            var merged = _.merge(configJSON, localeJSON, locales);

            grunt.file.write(configDest, JSON.stringify(merged));

            var schema = jsonSchemaGenerator(merged);

            grunt.file.write(schemaDest, JSON.stringify(schema));
        });
    }

    function getLocales(dir) {
        // for each extension/l10n dir, get the contained
        // l10n files and add them to a config.locales array

        var config = {
            localisation:{
                locales: []
            }
        };

        var jsonFiles = getL10nFiles(dir);

        _.each(jsonFiles, function(file) {

            var localeJSON = grunt.file.readJSON(file);

            var localisation = localeJSON.localisation;

            if (!localisation) {
                // if it extends another l10n file, get the localisation settings from that.
                if (localeJSON.extends){
                    var extJSON = grunt.file.readJSON(localeJSON.extends);
                    localisation = extJSON.localisation;
                }
            }

            var label = localisation.label;
            //var isDefault = !!settings.default;
            var baseName = path.basename(file);
            var name = baseName.substring(0, baseName.lastIndexOf('.'));

            var locale = {
                name: name,
                label: label
            };

            //if (isDefault){
            //    locale.default = true;
            //}

            config.localisation.locales.push(locale);
        });

        return config;
    }

    function getL10nFiles(dir){
        return globArray.sync([path.join(dir, '*.json'), '!' + path.join(dir, 'xx-XX.json')]);
    }
};