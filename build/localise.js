var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var globArray = require('glob-array');

module.exports = function (grunt) {

    var options, src;

    grunt.registerMultiTask('localise', 'Creates localised config files.', function () {

        options = this.data.options;

        var dirs = glob.sync('./src/extensions/*/l10n');

        _.each(dirs, function(dir) {

            if (!grunt.file.isDir(dir)) return;

            localiseExtension(dir);
        });
    });

    function localiseExtension(dir) {

        var locales = getLocales(dir);

        // for each extension/l10n/xx-XX.json localisation file, find its counterpart extension/config/xx-XX.json config file.
        // if none is found, fall back to en-GB.json
        // extend the config file with the localisation file and locales object.
        // copy it to the extension root naming it xx-XX.config.js

        var l10nFiles = getL10nFiles(dir);

        _.each(l10nFiles, function(file) {
            var regex = (/(.*)\/l10n\/(.*).json/).exec(file);

            var parent = regex[1] + '/config/';
            var locale = regex[2];
            var path = parent + locale;
            var config = path + '.json';
            var dest = path + '.config.js';

            // check config counterpart exists, if not fall back to en-GB.json
            if (!grunt.file.exists(config)){
                config = parent + options.default;
            }

            var configJSON = grunt.file.readJSON(config);
            var localeJSON = grunt.file.readJSON(file);

            if (configJSON.extends){
                var extJSON = grunt.file.readJSON(configJSON.extends);
                configJSON = _.merge(configJSON, extJSON);
            }

            if (localeJSON.extends){
                var extJSON = grunt.file.readJSON(localeJSON.extends);
                localeJSON = _.merge(localeJSON, extJSON);
            }

            var merged = _.merge(configJSON, localeJSON, locales);

            grunt.file.write(dest, JSON.stringify(merged));
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