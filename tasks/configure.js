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

    function extendConfigurationFile(filename, json) {
        var baseDir = path.dirname(filename);
        while (json.extends) {
            var extFile = path.join(baseDir, json.extends + '.json');
            var extJSON = grunt.file.readJSON(extFile);
            delete json.extends;
            json = _.merge(extJSON, json);
            // If we're extending multiple files in a chain, we always want
            // the current "extends" path to be relative to the base path of
            // the most recently loaded file....
            if (json.extends) {
                baseDir = path.dirname(extFile);
            }
        }
        return json;
    }

    function configureExtension(dir) {

        var locales = getLocales(dir);

        // for each extension/l10n/xx-XX.json localisation file, find its counterpart extension/config/xx-XX.json config file.
        // if none is found, fall back to extension/config/en-GB.json
        // extend the config file with the localisation file and locales object.
        // copy it to extension/config/xx-XX.config.js
        // use jsonSchemaGenerator to generate schema for examples editor.
        // copy to extension/config/xx-XX.schema.js

        var l10nFiles = getL10nFiles(dir);

        _.each(l10nFiles, function(localeFile) {
            var regex = (/(.*)\/l10n\/(.*).json/).exec(localeFile);

            var extensionDir = regex[1];
            var buildDir = path.join(extensionDir, '/build/');
            var configDir = path.join(extensionDir, '/config/');
            var locale = regex[2];
            var configFile = path.join(configDir, locale + '.json');
            var configDest = path.join(buildDir, locale + '.config.json');
            var schemaDest = path.join(buildDir, locale + '.schema.json');

            // check config counterpart exists, if not fall back to en-GB
            if (!grunt.file.exists(configFile)){
                configFile = path.join(configDir, options.default + '.json');
            }

            var configJSON = extendConfigurationFile(configFile, grunt.file.readJSON(configFile));
            var localeJSON = extendConfigurationFile(localeFile, grunt.file.readJSON(localeFile));

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

            var localeJSON = extendConfigurationFile(file, grunt.file.readJSON(file));

            var localisation = localeJSON.localisation;

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