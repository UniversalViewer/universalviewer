/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.6 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.6',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && navigator && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
    //PS3 indicates loaded and complete, but need to wait for complete
    //specifically. Sequence is 'loading', 'loaded', execution,
    // then 'complete'. The UA check is unfortunate, but not sure how
    //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
            /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
    //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value !== 'string') {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
        //registry of just enabled modules, to speed
        //cycle breaking code when lots of modules
        //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (getOwn(config.pkgs, baseName)) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    }

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = getOwn(config.pkgs, (pkgName = name[0]));
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                        scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                removeScript(id);
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                '_unnormalized' + (unnormalizedCounter += 1) :
                '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                    prefix + '!' + normalizedName :
                    normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                    [defQueue.length - 1, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return mod.exports;
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            var c,
                                pkg = getOwn(config.pkgs, mod.map.id);
                            // For packages, only support config targeted
                            // at the main module.
                            c = pkg ? getOwn(config.config, mod.map.id + '/' + pkg.main) :
                                getOwn(config.config, mod.map.id);
                            return  c || {};
                        },
                        exports: defined[mod.map.id]
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var map, modId, err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
            //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                map = mod.map;
                modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
             this.depMaps = [],
             this.enabled, this.fetched
             */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                    cjsModule.exports !== undefined &&
                                    //Make sure it is not already the exports value
                                    cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                                } else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                            this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                    'fromText eval for ' + id +
                                    ' failed: ' + e,
                                e,
                                [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                            (this.map.isDefine ? this.map : this.map.parentMap),
                            false,
                            !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    objs = {
                        paths: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (prop === 'map') {
                            if (!config.map) {
                                config.map = {};
                            }
                            mixin(config[prop], value, true, true);
                        } else {
                            mixin(config[prop], value, true);
                        }
                    } else {
                        config[prop] = value;
                    }
                });

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                .replace(currDirRegExp, '')
                                .replace(jsSuffixRegExp, '')
                        };
                    });

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                id +
                                '" has not been loaded yet for context: ' +
                                contextName +
                                (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overriden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                    'No define call for ' + moduleName,
                                null,
                                [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = getOwn(pkgs, parentModule);
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        } else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                            } else {
                                pkgPath = pkg.location;
                            }
                            syms.splice(0, i, pkgPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                    ((url.indexOf('?') === -1 ? '?' : '&') +
                        config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                    (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
            node.type = config.scriptType || 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                //Check if node.attachEvent is artificially added by custom script or
                //natively supported by browser
                //read https://github.com/jrburke/requirejs/issues/187
                //if we can NOT find [native code] then it must NOT natively supported.
                //in IE8, node.attachEvent does not have toString()
                //Note the test for "[native code" with no closing brace, see:
                //https://github.com/jrburke/requirejs/issues/273
                !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                        'importScripts failed for ' +
                        moduleName + ' at ' + url,
                    e,
                    [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

define("../components/requirejs/require", function(){});

(function(){(function(context) {
    var require = function (file, cwd) {
        var resolved = require.resolve(file, cwd || '/');
        var mod = require.modules[resolved];
        if (!mod) throw new Error(
                'Failed to resolve module ' + file + ', tried ' + resolved
        );
        var cached = require.cache[resolved];
        var res = cached? cached.exports : mod();
        return res;
    };

    require.paths = [];
    require.modules = {};
    require.cache = {};
    require.extensions = [".js",".coffee",".json"];

    require._core = {
        'assert': true,
        'events': true,
        'fs': true,
        'path': true,
        'vm': true
    };

    require.resolve = (function () {
        return function (x, cwd) {
            if (!cwd) cwd = '/';

            if (require._core[x]) return x;
            var path = require.modules.path();
            cwd = path.resolve('/', cwd);
            var y = cwd || '/';

            if (x.match(/^(?:\.\.?\/|\/)/)) {
                var m = loadAsFileSync(path.resolve(y, x))
                    || loadAsDirectorySync(path.resolve(y, x));
                if (m) return m;
            }

            var n = loadNodeModulesSync(x, y);
            if (n) return n;

            throw new Error("Cannot find module '" + x + "'");

            function loadAsFileSync (x) {
                x = path.normalize(x);
                if (require.modules[x]) {
                    return x;
                }

                for (var i = 0; i < require.extensions.length; i++) {
                    var ext = require.extensions[i];
                    if (require.modules[x + ext]) return x + ext;
                }
            }

            function loadAsDirectorySync (x) {
                x = x.replace(/\/+$/, '');
                var pkgfile = path.normalize(x + '/package.json');
                if (require.modules[pkgfile]) {
                    var pkg = require.modules[pkgfile]();
                    var b = pkg.browserify;
                    if (typeof b === 'object' && b.main) {
                        var m = loadAsFileSync(path.resolve(x, b.main));
                        if (m) return m;
                    }
                    else if (typeof b === 'string') {
                        var m = loadAsFileSync(path.resolve(x, b));
                        if (m) return m;
                    }
                    else if (pkg.main) {
                        var m = loadAsFileSync(path.resolve(x, pkg.main));
                        if (m) return m;
                    }
                }

                return loadAsFileSync(x + '/index');
            }

            function loadNodeModulesSync (x, start) {
                var dirs = nodeModulesPathsSync(start);
                for (var i = 0; i < dirs.length; i++) {
                    var dir = dirs[i];
                    var m = loadAsFileSync(dir + '/' + x);
                    if (m) return m;
                    var n = loadAsDirectorySync(dir + '/' + x);
                    if (n) return n;
                }

                var m = loadAsFileSync(x);
                if (m) return m;
            }

            function nodeModulesPathsSync (start) {
                var parts;
                if (start === '/') parts = [ '' ];
                else parts = path.normalize(start).split('/');

                var dirs = [];
                for (var i = parts.length - 1; i >= 0; i--) {
                    if (parts[i] === 'node_modules') continue;
                    var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                    dirs.push(dir);
                }

                return dirs;
            }
        };
    })();

    require.alias = function (from, to) {
        var path = require.modules.path();
        var res = null;
        try {
            res = require.resolve(from + '/package.json', '/');
        }
        catch (err) {
            res = require.resolve(from, '/');
        }
        var basedir = path.dirname(res);

        var keys = (Object.keys || function (obj) {
            var res = [];
            for (var key in obj) res.push(key);
            return res;
        })(require.modules);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.slice(0, basedir.length + 1) === basedir + '/') {
                var f = key.slice(basedir.length);
                require.modules[to + f] = require.modules[basedir + f];
            }
            else if (key === basedir) {
                require.modules[to] = require.modules[basedir];
            }
        }
    };

    (function () {
        var process = {};

        require.define = function (filename, fn) {
            if (require.modules.__browserify_process) {
                process = require.modules.__browserify_process();
            }

            var dirname = require._core[filename]
                    ? ''
                    : require.modules.path().dirname(filename)
                ;

            var require_ = function (file) {
                var requiredModule = require(file, dirname);
                var cached = require.cache[require.resolve(file, dirname)];

                if (cached && cached.parent === null) {
                    cached.parent = module_;
                }

                return requiredModule;
            };
            require_.resolve = function (name) {
                return require.resolve(name, dirname);
            };
            require_.modules = require.modules;
            require_.define = require.define;
            require_.cache = require.cache;
            var module_ = {
                id : filename,
                filename: filename,
                exports : {},
                loaded : false,
                parent: null
            };

            require.modules[filename] = function () {
                require.cache[filename] = module_;
                fn.call(
                    module_.exports,
                    require_,
                    module_,
                    module_.exports,
                    dirname,
                    filename,
                    process
                );
                module_.loaded = true;
                return module_.exports;
            };
        };
    })();


    require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (fn(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    }

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
        function normalizeArray(parts, allowAboveRoot) {
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for (var i = parts.length; i >= 0; i--) {
                var last = parts[i];
                if (last == '.') {
                    parts.splice(i, 1);
                } else if (last === '..') {
                    parts.splice(i, 1);
                    up++;
                } else if (up) {
                    parts.splice(i, 1);
                    up--;
                }
            }

            // if the path is allowed to go above the root, restore leading ..s
            if (allowAboveRoot) {
                for (; up--; up) {
                    parts.unshift('..');
                }
            }

            return parts;
        }

// Regex to split a filename into [*, dir, basename, ext]
// posix version
        var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
        exports.resolve = function() {
            var resolvedPath = '',
                resolvedAbsolute = false;

            for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
                var path = (i >= 0)
                    ? arguments[i]
                    : process.cwd();

                // Skip empty and invalid entries
                if (typeof path !== 'string' || !path) {
                    continue;
                }

                resolvedPath = path + '/' + resolvedPath;
                resolvedAbsolute = path.charAt(0) === '/';
            }

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
            resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
                return !!p;
            }), !resolvedAbsolute).join('/');

            return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
        };

// path.normalize(path)
// posix version
        exports.normalize = function(path) {
            var isAbsolute = path.charAt(0) === '/',
                trailingSlash = path.slice(-1) === '/';

// Normalize the path
            path = normalizeArray(filter(path.split('/'), function(p) {
                return !!p;
            }), !isAbsolute).join('/');

            if (!path && !isAbsolute) {
                path = '.';
            }
            if (path && trailingSlash) {
                path += '/';
            }

            return (isAbsolute ? '/' : '') + path;
        };


// posix version
        exports.join = function() {
            var paths = Array.prototype.slice.call(arguments, 0);
            return exports.normalize(filter(paths, function(p, index) {
                return p && typeof p === 'string';
            }).join('/'));
        };


        exports.dirname = function(path) {
            var dir = splitPathRe.exec(path)[1] || '';
            var isWindows = false;
            if (!dir) {
                // No dirname
                return '.';
            } else if (dir.length === 1 ||
                (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
                // It is just a slash or a drive letter with a slash
                return dir;
            } else {
                // It is a full dirname, strip trailing slash
                return dir.substring(0, dir.length - 1);
            }
        };


        exports.basename = function(path, ext) {
            var f = splitPathRe.exec(path)[2] || '';
            // TODO: make this comparison case-insensitive on windows?
            if (ext && f.substr(-1 * ext.length) === ext) {
                f = f.substr(0, f.length - ext.length);
            }
            return f;
        };


        exports.extname = function(path) {
            return splitPathRe.exec(path)[3] || '';
        };

    });

    require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

        process.nextTick = (function () {
            var canSetImmediate = typeof window !== 'undefined'
                && window.setImmediate;
            var canPost = typeof window !== 'undefined'
                    && window.postMessage && window.addEventListener
                ;

            if (canSetImmediate) {
                return window.setImmediate;
            }

            if (canPost) {
                var queue = [];
                window.addEventListener('message', function (ev) {
                    if (ev.source === window && ev.data === 'browserify-tick') {
                        ev.stopPropagation();
                        if (queue.length > 0) {
                            var fn = queue.shift();
                            fn();
                        }
                    }
                }, true);

                return function nextTick(fn) {
                    queue.push(fn);
                    window.postMessage('browserify-tick', '*');
                };
            }

            return function nextTick(fn) {
                setTimeout(fn, 0);
            };
        })();

        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];

        process.binding = function (name) {
            if (name === 'evals') return (require)('vm')
            else throw new Error('No such module. (Possibly not yet loaded)')
        };

        (function () {
            var cwd = '/';
            var path;
            process.cwd = function () { return cwd };
            process.chdir = function (dir) {
                if (!path) path = require('path');
                cwd = path.resolve(dir, cwd);
            };
        })();

    });

    require.define("/node_modules/cucumber-html/src/main/resources/cucumber/formatter/formatter.js",function(require,module,exports,__dirname,__filename,process){var CucumberHTML = {};

        CucumberHTML.DOMFormatter = function(rootNode) {
            var currentUri;
            var currentFeature;
            var currentElement;
            var currentSteps;

            var currentStepIndex;
            var currentStep;
            var $templates = $(CucumberHTML.templates);

            this.uri = function(uri) {
                currentUri = uri;
            };

            this.feature = function(feature) {
                currentFeature = blockElement(rootNode, feature, 'feature');
            };

            this.background = function(background) {
                currentElement = featureElement(background, 'background');
                currentStepIndex = 1;
            };

            this.scenario = function(scenario) {
                currentElement = featureElement(scenario, 'scenario');
                currentStepIndex = 1;
            };

            this.scenarioOutline = function(scenarioOutline) {
                currentElement = featureElement(scenarioOutline, 'scenario_outline');
                currentStepIndex = 1;
            };

            this.step = function(step) {
                var stepElement = $('.step', $templates).clone();
                stepElement.appendTo(currentSteps);
                populate(stepElement, step, 'step');

                if (step.doc_string) {
                    docString = $('.doc_string', $templates).clone();
                    docString.appendTo(stepElement);
                    // TODO: use a syntax highlighter based on the content_type
                    docString.text(step.doc_string.value);
                }
                if (step.rows) {
                    dataTable = $('.data_table', $templates).clone();
                    dataTable.appendTo(stepElement);
                    var tBody = dataTable.find('tbody');
                    $.each(step.rows, function(index, row) {
                        var tr = $('<tr></tr>').appendTo(tBody);
                        $.each(row.cells, function(index, cell) {
                            var td = $('<td>' + cell + '</td>').appendTo(tBody);
                        });
                    });
                }
            };

            this.examples = function(examples) {
                var examplesElement = blockElement(currentElement.children('details'), examples, 'examples');
                var examplesTable = $('.examples_table', $templates).clone();
                examplesTable.appendTo(examplesElement.children('details'));

                $.each(examples.rows, function(index, row) {
                    var parent = index == 0 ? examplesTable.find('thead') : examplesTable.find('tbody');
                    var tr = $('<tr></tr>').appendTo(parent);
                    $.each(row.cells, function(index, cell) {
                        var td = $('<td>' + cell + '</td>').appendTo(tr);
                    });
                });
            };

            this.match = function(match) {
                currentStep = currentSteps.find('li:nth-child(' + currentStepIndex + ')');
                currentStepIndex++;
            };

            this.result = function(result) {
                currentStep.addClass(result.status);
                if (result.status == 'failed') {
                    populateStepError(currentStep, result.error_message);
                }
                currentElement.addClass(result.status);
                var isLastStep = currentSteps.find('li:nth-child(' + currentStepIndex + ')').length == 0;
                if (isLastStep) {
                    if (currentSteps.find('.failed').length == 0) {
                        // No failed steps. Collapse it.
                        currentElement.find('details').removeAttr('open');
                    } else {
                        currentElement.find('details').attr('open', 'open');
                    }
                }
            };

            this.embedding = function(mimeType, data) {
                if (mimeType.match(/^image\//))
                {
                    currentStep.append('<img src="' + data + '">');
                }
                else if (mimeType.match(/^video\//))
                {
                    currentStep.append('<video src="' + data + '" type="' + mimeType + '" autobuffer controls>Your browser doesn\'t support video.</video>');
                }
                else if (mimeType.match(/^text\//))
                {
                    this.write(data);
                }
            };

            this.write = function(text) {
                currentStep.append('<pre class="embedded-text">' + text + '</pre>');
            }

            function featureElement(statement, itemtype) {
                var e = blockElement(currentFeature.children('details'), statement, itemtype);

                currentSteps = $('.steps', $templates).clone();
                currentSteps.appendTo(e.children('details'));

                return e;
            }

            function blockElement(parent, statement, itemtype) {
                var e = $('.blockelement', $templates).clone();
                e.appendTo(parent);
                return populate(e, statement, itemtype);
            }

            function populate(e, statement, itemtype) {
                populateTags(e, statement.tags);
                populateComments(e, statement.comments);
                e.find('.keyword').text(statement.keyword);
                e.find('.name').text(statement.name);
                e.find('.description').text(statement.description);
                e.attr('itemtype', 'http://cukes.info/microformat/' + itemtype);
                e.addClass(itemtype);
                return e;
            }

            function populateComments(e, comments) {
                if (comments !== undefined) {
                    var commentsNode = $('.comments', $templates).clone().prependTo(e.find('.header'));
                    $.each(comments, function(index, comment) {
                        var commentNode = $('.comment', $templates).clone().appendTo(commentsNode);
                        commentNode.text(comment.value);
                    });
                }
            }

            function populateTags(e, tags) {
                if (tags !== undefined) {
                    var tagsNode = $('.tags', $templates).clone().prependTo(e.find('.header'));
                    $.each(tags, function(index, tag) {
                        var tagNode = $('.tag', $templates).clone().appendTo(tagsNode);
                        tagNode.text(tag.name);
                    });
                }
            }

            function populateStepError(e, error) {
                if (error !== undefined) {
                    errorNode = $('.error', $templates).clone().appendTo(e);
                    errorNode.text(error);
                }
            }
        };

        CucumberHTML.templates = '<div>\
  <section class="blockelement" itemscope>\
    <details open>\
      <summary class="header">\
        <span class="keyword" itemprop="keyword">Keyword</span>: <span itemprop="name" class="name">This is the block name</span>\
      </summary>\
      <div itemprop="description" class="description">The description goes here</div>\
    </details>\
  </section>\
\
  <ol class="steps"></ol>\
\
  <ol>\
    <li class="step"><span class="keyword" itemprop="keyword">Keyword</span><span class="name" itemprop="name">Name</span></li>\
  </ol>\
\
  <pre class="doc_string"></pre>\
\
  <pre class="error"></pre>\
\
  <table class="data_table">\
    <tbody>\
    </tbody>\
  </table>\
\
  <table class="examples_table">\
    <thead></thead>\
    <tbody></tbody>\
  </table>\
\
  <section class="embed">\
    <img itemprop="screenshot" class="screenshot" />\
  </section>\
  <div class="tags"></div>\
  <span class="tag"></span>\
  <div class="comments"></div>\
  <div class="comment"></div>\
<div>';

        if (typeof module !== 'undefined') {
            module.exports = CucumberHTML;
        } else if (typeof define !== 'undefined') {
            define('../vendor/cucumber.js',[], function() { return CucumberHTML; });
        }

    });

    require.define("/cucumber/ast",function(require,module,exports,__dirname,__filename,process){var Ast        = {};
        Ast.Assembler  = require('./ast/assembler');
        Ast.Background = require('./ast/background');
        Ast.DataTable  = require('./ast/data_table');
        Ast.DocString  = require('./ast/doc_string');
        Ast.Feature    = require('./ast/feature');
        Ast.Features   = require('./ast/features');
        Ast.Filter     = require('./ast/filter');
        Ast.Scenario   = require('./ast/scenario');
        Ast.Step       = require('./ast/step');
        Ast.Tag        = require('./ast/tag');
        module.exports = Ast;

    });

    require.define("/cucumber/ast/assembler",function(require,module,exports,__dirname,__filename,process){var Assembler = function(features, filter) {
        var currentFeature, currentScenarioOrBackground, currentStep, suggestedFeature;
        var stashedTags = [];

        var self = {
            setCurrentFeature: function setCurrentFeature(feature) {
                currentFeature = feature;
                self.setCurrentScenarioOrBackground(undefined);
            },

            getCurrentFeature: function getCurrentFeature() {
                return currentFeature;
            },

            setCurrentScenarioOrBackground: function setCurrentScenarioOrBackground(scenarioOrBackground) {
                currentScenarioOrBackground = scenarioOrBackground;
                self.setCurrentStep(undefined);
            },

            getCurrentScenarioOrBackground: function getCurrentScenarioOrBackground() {
                return currentScenarioOrBackground;
            },

            setCurrentStep: function setCurrentStep(step) {
                currentStep = step;
            },

            getCurrentStep: function getCurrentStep() {
                return currentStep;
            },

            stashTag: function stashTag(tag) {
                stashedTags.push(tag);
            },

            revealTags: function revealTags() {
                var revealedTags = stashedTags;
                stashedTags      = [];
                return revealedTags;
            },

            applyCurrentFeatureTagsToElement: function applyCurrentFeatureTagsToElement(element) {
                var currentFeature = self.getCurrentFeature();
                var featureTags    = currentFeature.getTags();
                element.addTags(featureTags);
            },

            applyStashedTagsToElement: function applyStashedTagsToElement(element) {
                var revealedTags = self.revealTags();
                element.addTags(revealedTags);
            },

            insertBackground: function insertBackground(background) {
                self.setCurrentScenarioOrBackground(background);
                var currentFeature = self.getCurrentFeature();
                currentFeature.addBackground(background);
            },

            insertDataTableRow: function insertDataTableRow(dataTableRow) {
                var currentStep = self.getCurrentStep();
                currentStep.attachDataTableRow(dataTableRow);
            },

            insertDocString: function insertDocString(docString) {
                var currentStep = self.getCurrentStep();
                currentStep.attachDocString(docString);
            },

            insertFeature: function insertFeature(feature) {
                self.tryEnrollingSuggestedFeature();
                self.applyStashedTagsToElement(feature);
                self.setCurrentFeature(feature);
                self.suggestFeature(feature);
            },

            insertScenario: function insertScenario(scenario) {
                self.applyCurrentFeatureTagsToElement(scenario);
                self.applyStashedTagsToElement(scenario);
                self.setCurrentScenarioOrBackground(scenario);
                if (filter.isElementEnrolled(scenario)) {
                    var currentFeature = self.getCurrentFeature();
                    currentFeature.addScenario(scenario);
                }
            },

            insertStep: function insertStep(step) {
                self.setCurrentStep(step);
                var currentScenarioOrBackground = self.getCurrentScenarioOrBackground();
                currentScenarioOrBackground.addStep(step);
            },

            insertTag: function insertTag(tag) {
                self.stashTag(tag);
            },

            finish: function finish() {
                self.tryEnrollingSuggestedFeature();
            },

            suggestFeature: function suggestFeature(feature) {
                suggestedFeature = feature;
            },

            isSuggestedFeatureEnrollable: function isSuggestedFeatureEnrollable() {
                var enrollable = suggestedFeature && (suggestedFeature.hasScenarios() || filter.isElementEnrolled(suggestedFeature));
                return enrollable;
            },

            tryEnrollingSuggestedFeature: function tryEnrollingSuggestedFeature() {
                if (self.isSuggestedFeatureEnrollable())
                    self.enrolSuggestedFeature();
            },

            enrolSuggestedFeature: function enrolSuggestedFeature() {
                features.addFeature(suggestedFeature);
                suggestedFeature = null;
            }
        };
        return self;
    };

        module.exports = Assembler;

    });

    require.define("/cucumber/ast/background",function(require,module,exports,__dirname,__filename,process){var Background = function(keyword, name, description, uri, line) {
        var Cucumber = require('../../cucumber');

        var steps = Cucumber.Type.Collection();

        var self = {
            getKeyword: function getKeyword() {
                return keyword;
            },

            getName: function getName() {
                return name;
            },

            getDescription: function getDescription() {
                return description;
            },

            getUri: function getUri() {
                return uri;
            },

            getLine: function getLine() {
                return line;
            },

            addStep: function addStep(step) {
                var lastStep = self.getLastStep();
                step.setPreviousStep(lastStep);
                steps.add(step);
            },

            getLastStep: function getLastStep() {
                return steps.getLast();
            },

            getSteps: function getSteps() {
                return steps;
            }
        };
        return self;
    };
        module.exports = Background;

    });

    require.define("/cucumber",function(require,module,exports,__dirname,__filename,process){var Cucumber = function(featureSource, supportCodeInitializer, options) {
        var configuration = Cucumber.VolatileConfiguration(featureSource, supportCodeInitializer, options);
        var runtime       = Cucumber.Runtime(configuration);
        return runtime;
    };
        Cucumber.Ast                   = require('./cucumber/ast');
// browserify won't load ./cucumber/cli and throw an exception:
        try { Cucumber.Cli             = require('./cucumber/cli'); } catch(e) {}
        Cucumber.Debug                 = require('./cucumber/debug'); // Untested namespace
        Cucumber.Listener              = require('./cucumber/listener');
        Cucumber.Parser                = require('./cucumber/parser');
        Cucumber.Runtime               = require('./cucumber/runtime');
        Cucumber.SupportCode           = require('./cucumber/support_code');
        Cucumber.TagGroupParser        = require('./cucumber/tag_group_parser');
        Cucumber.Type                  = require('./cucumber/type');
        Cucumber.Util                  = require('./cucumber/util');
        Cucumber.VolatileConfiguration = require('./cucumber/volatile_configuration');

        Cucumber.VERSION               = "0.3.0";

        module.exports                 = Cucumber;

    });

    require.define("/cucumber/debug",function(require,module,exports,__dirname,__filename,process){var Debug = {
        TODO: function TODO(description) {
            return function() { throw(new Error("IMPLEMENT ME: " + description)); };
        },

        warn: function warn(string, caption, level) {
            if (Debug.isMessageLeveltoBeDisplayed(level))
                process.stdout.write(Debug.warningString(string, caption));
        },

        notice: function notice(string, caption, level) {
            if (Debug.isMessageLeveltoBeDisplayed(level))
                process.stdout.write(Debug.noticeString(string, caption));
        },

        warningString: function warningString(string, caption) {
            caption = caption || 'debug-warning';
            return "\033[30;43m" + caption + ":\033[0m \033[33m" + string + "\033[0m"
        },

        noticeString: function noticeString(string, caption) {
            caption = caption || 'debug-notice';
            return "\033[30;46m" + caption + ":\033[0m \033[36m" + string + "\033[0m"
        },

        prefix: function prefix() {
            return ;
        },

        isMessageLeveltoBeDisplayed: function isMessageLeveltoBeDisplayed(level) {
            if (process.env) {
                level = level || 3; // default level
                return (level <= process.env['DEBUG_LEVEL']);
            } else {
                return false;
            }
        }
    };
        Debug.SimpleAstListener = require('./debug/simple_ast_listener');
        module.exports          = Debug;

    });

    require.define("/cucumber/debug/simple_ast_listener",function(require,module,exports,__dirname,__filename,process){var SimpleAstListener = function(options) {
        var logs                        = '';
        var failed                      = false;
        var beforeEachScenarioCallbacks = [];
        var currentStep;

        if (!options)
            var options = {};

        var self = {
            hear: function hear(event, callback) {
                switch(event.getName()) {
                    case 'BeforeFeature':
                        self.hearBeforeFeature(event.getPayloadItem('feature'), callback);
                        break;
                    case 'BeforeScenario':
                        self.hearBeforeScenario(event.getPayloadItem('scenario'), callback);
                        break;
                    case 'BeforeStep':
                        self.hearBeforeStep(event.getPayloadItem('step'), callback);
                        break;
                    case 'StepResult':
                        self.hearStepResult(event.getPayloadItem('stepResult'), callback);
                        break;
                    default:
                        callback();
                }
            },

            hearBeforeFeature: function hearBeforeFeature(feature, callback) {
                log("Feature: " + feature.getName());
                var description = feature.getDescription();
                if (description != "")
                    log(description, 1);
                callback();
            },

            hearBeforeScenario: function hearBeforeScenario(scenario, callback) {
                beforeEachScenarioCallbacks.forEach(function(func) {
                    func();
                });
                log("");
                log(scenario.getKeyword() + ": " + scenario.getName(), 1);
                callback();
            },

            hearBeforeStep: function hearBeforeStep(step, callback) {
                currentStep = step;
                callback();
            },

            hearStepResult: function hearStepResult(stepResult, callback) {
                log(currentStep.getKeyword() + currentStep.getName(), 2);
                if (currentStep.hasDocString()) {
                    log('"""', 3);
                    log(currentStep.getDocString().getContents(), 3);
                    log('"""', 3);
                };
                callback();
            },

            getLogs: function getLogs() {
                return logs;
            },

            featuresPassed: function featuresPassed() {
                return !failed;
            },

            beforeEachScenarioDo: function beforeEachScenarioDo(func) {
                beforeEachScenarioCallbacks.push(func);
            }
        };
        return self;

        function log(message, indentation) {
            if (indentation)
                message = indent(message, indentation);
            logs = logs + message + "\n";
            if (options['logToConsole'])
                console.log(message);
            if (typeof(options['logToFunction']) == 'function')
                options['logToFunction'](message);
        };

        function indent(text, indentation) {
            var indented;
            text.split("\n").forEach(function(line) {
                var prefix = new Array(indentation + 1).join("  ");
                line = prefix + line;
                indented = (typeof(indented) == 'undefined' ? line : indented + "\n" + line);
            });
            return indented;
        };
    };
        module.exports = SimpleAstListener;

    });

    require.define("/cucumber/listener",function(require,module,exports,__dirname,__filename,process){var Listener = function () {
        var self = {
            hear: function hear(event, callback) {
                if (self.hasHandlerForEvent(event)) {
                    var handler = self.getHandlerForEvent(event);
                    handler(event, callback);
                } else {
                    callback();
                }
            },

            hasHandlerForEvent: function hasHandlerForEvent(event) {
                var handlerName = self.buildHandlerNameForEvent(event);
                return self[handlerName] != undefined;
            },

            buildHandlerNameForEvent: function buildHandlerNameForEvent(event) {
                var handlerName =
                    Listener.EVENT_HANDLER_NAME_PREFIX +
                    event.getName() +
                    Listener.EVENT_HANDLER_NAME_SUFFIX;
                return handlerName;
            },

            getHandlerForEvent: function getHandlerForEvent(event) {
                var eventHandlerName = self.buildHandlerNameForEvent(event);
                return self[eventHandlerName];
            }
        };
        return self;
    };

        Listener.EVENT_HANDLER_NAME_PREFIX = 'handle';
        Listener.EVENT_HANDLER_NAME_SUFFIX = 'Event';

        Listener.Formatter         = require('./listener/formatter');
        Listener.PrettyFormatter   = require('./listener/pretty_formatter');
        Listener.ProgressFormatter = require('./listener/progress_formatter');
        Listener.JsonFormatter     = require('./listener/json_formatter');
        Listener.StatsJournal      = require('./listener/stats_journal');
        Listener.SummaryFormatter  = require('./listener/summary_formatter');
        module.exports             = Listener;

    });

    require.define("/cucumber/listener/formatter",function(require,module,exports,__dirname,__filename,process){var Formatter = function (options) {
        var Cucumber = require('../../cucumber');

        if (!options)
            options = {};
        if (options['logToConsole'] == undefined)
            options['logToConsole'] = true;

        var logs = "";

        var self = Cucumber.Listener();

        self.log = function log(string) {
            logs += string;
            if (options['logToConsole'])
                process.stdout.write(string);
            if (typeof(options['logToFunction']) == 'function')
                options['logToFunction'](string);
        };

        self.getLogs = function getLogs() {
            return logs;
        };

        return self;
    };
        module.exports = Formatter;

    });

    require.define("/cucumber/listener/pretty_formatter",function(require,module,exports,__dirname,__filename,process){var PrettyFormatter = function(options) {
        var Cucumber = require('../../cucumber');

        var self             = Cucumber.Listener.Formatter(options);
        var summaryFormatter = Cucumber.Listener.SummaryFormatter({logToConsole: false});

        var parentHear = self.hear;
        self.hear = function hear(event, callback) {
            summaryFormatter.hear(event, function () {
                parentHear(event, callback);
            });
        };

        self.handleBeforeFeatureEvent = function handleBeforeFeatureEvent(event, callback) {
            var feature = event.getPayloadItem('feature');
            var source = feature.getKeyword() + ": " + feature.getName() + "\n\n";
            self.log(source);
            callback();
        };

        self.handleBeforeScenarioEvent = function handleBeforeScenarioEvent(event, callback) {
            var scenario = event.getPayloadItem('scenario');
            var source = scenario.getKeyword() + ": " + scenario.getName() + "\n";
            self.logIndented(source, 1);
            callback();
        };

        self.handleAfterScenarioEvent = function handleAfterScenarioEvent(event, callback) {
            self.log("\n");
            callback();
        };

        self.handleStepResultEvent = function handleStepResultEvent(event, callback) {
            var stepResult = event.getPayloadItem('stepResult');
            var step = stepResult.getStep();
            var source = step.getKeyword() + step.getName() + "\n";
            self.logIndented(source, 2);

            if (step.hasDataTable()) {
                var dataTable = step.getDataTable();
                self.logDataTable(dataTable);
            }

            if (step.hasDocString()) {
                var docString = step.getDocString();
                self.logDocString(docString);
            }

            stepResult.isFailed();
            if (stepResult.isFailed()) {
                var failure            = stepResult.getFailureException();
                var failureDescription = failure.stack || failure;
                self.logIndented(failureDescription + "\n", 3);
            }
            callback();
        };

        self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
            var summaryLogs = summaryFormatter.getLogs();
            self.log("\n");
            self.log(summaryLogs);
            callback();
        };

        self.logDataTable = function logDataTable(dataTable) {
            var rows         = dataTable.raw();
            var columnWidths = self._determineColumnWidthsFromRows(rows);
            var rowCount     = rows.length;
            var columnCount  = columnWidths.length;

            for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                var cells = rows[rowIndex];
                var line = "|";
                for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                    var cell        = cells[columnIndex];
                    var columnWidth = columnWidths[columnIndex];
                    line += " " + self._pad(cell, columnWidth) + " |"
                }
                line += "\n";
                self.logIndented(line, 3);
            }
        };

        self.logDocString = function logDocString(docString) {
            var contents = docString.getContents();
            self.logIndented('"""\n' + contents + '\n"""\n' , 3);
        };

        self.logIndented = function logIndented(text, level) {
            var indented = self.indent(text, level);
            self.log(indented);
        };

        self.indent = function indent(text, level) {
            var indented;
            text.split("\n").forEach(function(line) {
                var prefix = new Array(level + 1).join("  ");
                line = (prefix + line).replace(/\s+$/, '');
                indented = (typeof(indented) == 'undefined' ? line : indented + "\n" + line);
            });
            return indented;
        };

        self._determineColumnWidthsFromRows = function _determineColumnWidthsFromRows(rows) {
            var columnWidths = [];
            var currentColumn;

            rows.forEach(function (cells) {
                currentColumn = 0;
                cells.forEach(function (cell) {
                    var currentColumnWidth = columnWidths[currentColumn];
                    var currentCellWidth   = cell.length;
                    if (typeof currentColumnWidth == "undefined" || currentColumnWidth < currentCellWidth)
                        columnWidths[currentColumn] = currentCellWidth;
                    currentColumn += 1;
                });
            });

            return columnWidths;
        };

        self._pad = function _pad(text, width) {
            var padded = "" + text;
            while (padded.length < width) {
                padded += " ";
            }
            return padded;
        };

        return self;
    };
        module.exports = PrettyFormatter;

    });

    require.define("/cucumber/listener/progress_formatter",function(require,module,exports,__dirname,__filename,process){var ProgressFormatter = function(options) {
        var Cucumber = require('../../cucumber');

        if (!options)
            options = {};

        var self             = Cucumber.Listener.Formatter(options);
        var summaryFormatter = Cucumber.Listener.SummaryFormatter({logToConsole: false});

        var parentHear = self.hear;
        self.hear = function hear(event, callback) {
            summaryFormatter.hear(event, function () {
                parentHear(event, callback);
            });
        };

        self.handleStepResultEvent = function handleStepResult(event, callback) {
            var stepResult = event.getPayloadItem('stepResult');
            if (stepResult.isSuccessful())
                self.handleSuccessfulStepResult();
            else if (stepResult.isPending())
                self.handlePendingStepResult();
            else if (stepResult.isSkipped())
                self.handleSkippedStepResult();
            else if (stepResult.isUndefined())
                self.handleUndefinedStepResult();
            else
                self.handleFailedStepResult();
            callback();
        };

        self.handleSuccessfulStepResult = function handleSuccessfulStepResult() {
            self.log(ProgressFormatter.PASSED_STEP_CHARACTER);
        };

        self.handlePendingStepResult = function handlePendingStepResult() {
            self.log(ProgressFormatter.PENDING_STEP_CHARACTER);
        };

        self.handleSkippedStepResult = function handleSkippedStepResult() {
            self.log(ProgressFormatter.SKIPPED_STEP_CHARACTER);
        };

        self.handleUndefinedStepResult = function handleUndefinedStepResult() {
            self.log(ProgressFormatter.UNDEFINED_STEP_CHARACTER);
        };

        self.handleFailedStepResult = function handleFailedStepResult() {
            self.log(ProgressFormatter.FAILED_STEP_CHARACTER);
        };

        self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
            var summaryLogs = summaryFormatter.getLogs();
            self.log("\n\n");
            self.log(summaryLogs);
            callback();
        };

        return self;
    };
        ProgressFormatter.PASSED_STEP_CHARACTER    = '.';
        ProgressFormatter.SKIPPED_STEP_CHARACTER   = '-';
        ProgressFormatter.UNDEFINED_STEP_CHARACTER = 'U';
        ProgressFormatter.PENDING_STEP_CHARACTER   = 'P';
        ProgressFormatter.FAILED_STEP_CHARACTER    = 'F';
        module.exports                             = ProgressFormatter;

    });

    require.define("/cucumber/listener/json_formatter",function(require,module,exports,__dirname,__filename,process){var JsonFormatter = function(options) {
        var Cucumber             = require('../../cucumber');
        var GherkinJsonFormatter = require('gherkin/lib/gherkin/formatter/json_formatter');

        var currentFeatureId     = 'undefined';
        var self                 = Cucumber.Listener.Formatter(options);

        var formatterIo = {
            write: function(string){
                self.log(string);
            }
        };
        var gherkinJsonFormatter =  new GherkinJsonFormatter(formatterIo);

        var parentFeatureTags;

        self.getGherkinFormatter = function() {
            return gherkinJsonFormatter;
        }

        self.formatStep = function formatStep(step) {
            var stepProperties = {
                name:    step.getName(),
                line:    step.getLine(),
                keyword: step.getKeyword()
            };
            if (step.hasDocString()) {
                var docString = step.getDocString();
                stepProperties['doc_string'] = {
                    value:        docString.getContents(),
                    line:         docString.getLine(),
                    content_type: docString.getContentType()
                };
            }
            if (step.hasDataTable()) {
                var tableContents   = step.getDataTable().getContents();
                var raw             = tableContents.raw();
                var tableProperties = [];
                raw.forEach(function (rawRow) {
                    var row = {line: undefined, cells: rawRow};
                    tableProperties.push(row);
                });
                stepProperties['rows'] = tableProperties;
            }
            gherkinJsonFormatter.step(stepProperties);
        }

        self.formatTags = function formatTags(tags, parentTags) {
            var tagsProperties = [];
            tags.forEach(function (tag) {
                var isParentTag = false;
                if (parentTags) {
                    parentTags.forEach(function (parentTag) {
                        if ((tag.getName() == parentTag.getName()) && (tag.getLine() == parentTag.getLine())) {
                            isParentTag = true;
                        }
                    });
                }
                if (!isParentTag) {
                    tagsProperties.push({name: tag.getName(), line: tag.getLine()});
                }
            });
            return tagsProperties;
        }

        self.handleBeforeFeatureEvent = function handleBeforeFeatureEvent(event, callback) {
            var feature      = event.getPayloadItem('feature');
            currentFeatureId = feature.getName().replace(' ', '-'); // FIXME: wrong abstraction level, this should be encapsulated "somewhere"

            var featureProperties = {
                id:          currentFeatureId,
                name:        feature.getName(),
                description: feature.getDescription(),
                line:        feature.getLine(),
                keyword:     feature.getKeyword()
            };

            var tags = feature.getTags();
            if (tags.length > 0) {
                formattedTags = self.formatTags(tags, []);
                featureProperties['tags'] = formattedTags;
            }

            gherkinJsonFormatter.uri(feature.getUri());
            gherkinJsonFormatter.feature(featureProperties);
            parentFeatureTags = tags;
            callback();
        }

        self.handleBackgroundEvent = function handleBackgroundEvent(event, callback) {
            var background = event.getPayloadItem('background');
            gherkinJsonFormatter.background({name: background.getName(), keyword: "Background", description: background.getDescription(), type: 'background', line: background.getLine()})
            var steps = background.getSteps();
            steps.forEach(function(value, index, ar) { self.formatStep(value); });
            callback();
        }

        self.handleBeforeScenarioEvent = function handleBeforeScenarioEvent(event, callback) {

            var scenario = event.getPayloadItem('scenario');

            var id = currentFeatureId + ';' + scenario.getName().replace(/ /g, '-').toLowerCase();
            var scenarioProperties = {name: scenario.getName(), id: id, line: scenario.getLine(), keyword: 'Scenario',  description: scenario.getDescription(), type: 'scenario'};

            var tags = scenario.getTags();
            if (tags.length > 0) {
                var formattedTags = self.formatTags(tags, parentFeatureTags);
                if (formattedTags.length > 0) {
                    scenarioProperties['tags'] = formattedTags;
                }
            }
            gherkinJsonFormatter.scenario(scenarioProperties);
            callback();
        }

        self.handleStepResultEvent = function handleStepResult(event, callback) {
            var stepResult = event.getPayloadItem('stepResult');

            var step = stepResult.getStep();
            self.formatStep(step);

            var stepOutput = {};
            var resultStatus = 'failed';

            if (stepResult.isSuccessful()) {
                resultStatus = 'passed';
            }
            else if (stepResult.isPending()) {
                resultStatus = 'pending';
                stepOutput['error_message'] = undefined;
            }
            else if (stepResult.isSkipped()) {
                resultStatus = 'skipped';
            }
            else if (stepResult.isUndefined()) {
                resultStatus = 'undefined';
            }
            else {
                var failureMessage = stepResult.getFailureException();
                if (failureMessage) {
                    stepOutput['error_message'] = (failureMessage.stack || failureMessage);
                }
            }

            stepOutput['status'] = resultStatus;
            gherkinJsonFormatter.result(stepOutput);
            gherkinJsonFormatter.match({location: undefined});
            callback();
        }

        self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
            gherkinJsonFormatter.eof();
            gherkinJsonFormatter.done();
            callback();
        }

        return self;
    };

        module.exports = JsonFormatter;


    });

    require.define("/node_modules/gherkin/lib/gherkin/formatter/json_formatter.js",function(require,module,exports,__dirname,__filename,process){// This is a straight port of json_formatter.rb
        var JSONFormatter = function(io) {
            var feature_hashes = [];
            var uri, feature_hash, current_step_or_hook;

            this.done = function() {
                io.write(JSON.stringify(feature_hashes));
            };

            this.uri = function(_uri) {
                uri = _uri;
            };

            this.feature = function(feature) {
                feature_hash = feature;
                feature_hash['uri'] = uri;
                feature_hashes.push(feature_hash);
            };

            this.background = function(background) {
                feature_elements().push(background);
            };

            this.scenario = function(scenario) {
                feature_elements().push(scenario);
            };

            this.scenario_outline = function(scenario_outline) {
                feature_elements().push(scenario_outline);
            };

            this.examples = function(examples) {
                all_examples().push(examples);
            };

            this.step = function(step) {
                current_step_or_hook = step;
                steps().push(current_step_or_hook);
            }

            this.match = function(match) {
                current_step_or_hook['match'] = match;
            }

            this.result = function(result) {
                current_step_or_hook['result'] = result;
            }

            this.before = function(match, result) {
                add_hook(match, result, "before");
            }

            this.after = function(match, result) {
                add_hook(match, result, "after");
            }

            this.embedding = function(mime_type, data) {
                embeddings().push({'mime_type': mime_type, 'data': encode64s(data)})
            }

            this.write = function(text) {
                output().push(text);
            };

            this.eof = function() {};

            // "private" methods

            function add_hook(match, result, hook) {
                if(!feature_element()[hook]) {
                    feature_element()[hook] = [];
                }
                var hooks = feature_element()[hook];
                hooks.push({'match': match, 'result': result});
            }

            function feature_elements() {
                if(!feature_hash['elements']) {
                    feature_hash['elements'] = [];
                }
                return feature_hash['elements'];
            }

            function feature_element() {
                return feature_elements()[feature_elements().length - 1];
            }

            function all_examples() {
                if(!feature_element()['examples']) {
                    feature_element()['examples'] = [];
                }
                return feature_element()['examples'];
            }

            function steps() {
                if(!feature_element()['steps']) {
                    feature_element()['steps'] = [];
                }
                return feature_element()['steps'];
            }

            function embeddings() {
                if(!current_step_or_hook['embeddings']) {
                    current_step_or_hook['embeddings'] = [];
                }
                return current_step_or_hook['embeddings'];
            }

            function output() {
                if(!current_step_or_hook['output']) {
                    current_step_or_hook['output'] = [];
                }
                return current_step_or_hook['output'];
            }

            // http://gitorious.org/javascript-base64/javascript-base64/blobs/master/base64.js
            function encode64s(input) {
                var swaps = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
                var input_binary = "";
                var output = "";
                var temp_binary;
                var index;
                for (index=0; index < input.length; index++) {
                    temp_binary = input.charCodeAt(index).toString(2);
                    while (temp_binary.length < 8) {
                        temp_binary = "0"+temp_binary;
                    }
                    input_binary = input_binary + temp_binary;
                    while (input_binary.length >= 6) {
                        output = output + swaps[parseInt(input_binary.substring(0,6),2)];
                        input_binary = input_binary.substring(6);
                    }
                }
                if (input_binary.length == 4) {
                    temp_binary = input_binary + "00";
                    output = output + swaps[parseInt(temp_binary,2)];
                    output = output + "=";
                }
                if (input_binary.length == 2) {
                    temp_binary = input_binary + "0000";
                    output = output + swaps[parseInt(temp_binary,2)];
                    output = output + "==";
                }
                return output;
            }
        }

        module.exports = JSONFormatter;

    });

    require.define("/cucumber/listener/stats_journal",function(require,module,exports,__dirname,__filename,process){var StatsJournal = function(options) {
        var Cucumber = require('../../cucumber');

        var passedScenarioCount      = 0;
        var undefinedScenarioCount   = 0;
        var pendingScenarioCount     = 0;
        var failedScenarioCount      = 0;
        var passedStepCount          = 0;
        var failedStepCount          = 0;
        var skippedStepCount         = 0;
        var undefinedStepCount       = 0;
        var pendingStepCount         = 0;
        var currentScenarioFailing   = false;
        var currentScenarioUndefined = false;
        var currentScenarioPending   = false;

        if (!options)
            options = {};

        var self = Cucumber.Listener();

        self.handleBeforeScenarioEvent = function handleBeforeScenarioEvent(event, callback) {
            self.prepareBeforeScenario();
            callback();
        };

        self.handleStepResultEvent = function handleStepResult(event, callback) {
            var stepResult = event.getPayloadItem('stepResult');
            if (stepResult.isSuccessful())
                self.handleSuccessfulStepResult();
            else if (stepResult.isPending())
                self.handlePendingStepResult();
            else if (stepResult.isSkipped())
                self.handleSkippedStepResult();
            else if (stepResult.isUndefined())
                self.handleUndefinedStepResult(stepResult);
            else
                self.handleFailedStepResult(stepResult);
            callback();
        };

        self.handleSuccessfulStepResult = function handleSuccessfulStepResult() {
            self.witnessPassedStep();
        };

        self.handlePendingStepResult = function handlePendingStepResult() {
            self.witnessPendingStep();
            self.markCurrentScenarioAsPending();
        };

        self.handleSkippedStepResult = function handleSkippedStepResult() {
            self.witnessSkippedStep();
        };

        self.handleUndefinedStepResult = function handleUndefinedStepResult(stepResult) {
            var step = stepResult.getStep();
            self.witnessUndefinedStep();
            self.markCurrentScenarioAsUndefined();
        };

        self.handleFailedStepResult = function handleFailedStepResult(stepResult) {
            self.witnessFailedStep();
            self.markCurrentScenarioAsFailing();
        };

        self.handleAfterScenarioEvent = function handleAfterScenarioEvent(event, callback) {
            if (self.isCurrentScenarioFailing()) {
                var scenario = event.getPayloadItem('scenario');
                self.witnessFailedScenario();
            } else if (self.isCurrentScenarioUndefined()) {
                self.witnessUndefinedScenario();
            } else if (self.isCurrentScenarioPending()) {
                self.witnessPendingScenario();
            } else {
                self.witnessPassedScenario();
            }
            callback();
        };

        self.prepareBeforeScenario = function prepareBeforeScenario() {
            currentScenarioFailing   = false;
            currentScenarioPending   = false;
            currentScenarioUndefined = false;
        };

        self.markCurrentScenarioAsFailing = function markCurrentScenarioAsFailing() {
            currentScenarioFailing = true;
        };

        self.markCurrentScenarioAsUndefined = function markCurrentScenarioAsUndefined() {
            currentScenarioUndefined = true;
        };

        self.markCurrentScenarioAsPending = function markCurrentScenarioAsPending() {
            currentScenarioPending = true;
        };

        self.isCurrentScenarioFailing = function isCurrentScenarioFailing() {
            return currentScenarioFailing;
        };

        self.isCurrentScenarioUndefined = function isCurrentScenarioUndefined() {
            return currentScenarioUndefined;
        };

        self.isCurrentScenarioPending = function isCurrentScenarioPending() {
            return currentScenarioPending;
        };

        self.witnessPassedScenario = function witnessPassedScenario() {
            passedScenarioCount++;
        };

        self.witnessUndefinedScenario = function witnessUndefinedScenario() {
            undefinedScenarioCount++;
        };

        self.witnessPendingScenario = function witnessPendingScenario() {
            pendingScenarioCount++;
        };

        self.witnessFailedScenario = function witnessFailedScenario() {
            failedScenarioCount++;
        };

        self.witnessPassedStep = function witnessPassedStep() {
            passedStepCount++;
        };

        self.witnessUndefinedStep = function witnessUndefinedStep() {
            undefinedStepCount++;
        };

        self.witnessPendingStep = function witnessPendingStep() {
            pendingStepCount++;
        };

        self.witnessFailedStep = function witnessFailedStep() {
            failedStepCount++;
        };

        self.witnessSkippedStep = function witnessSkippedStep() {
            skippedStepCount++;
        };

        self.getScenarioCount = function getScenarioCount() {
            var scenarioCount =
                self.getPassedScenarioCount()    +
                self.getUndefinedScenarioCount() +
                self.getPendingScenarioCount()   +
                self.getFailedScenarioCount();
            return scenarioCount;
        };

        self.getPassedScenarioCount = function getPassedScenarioCount() {
            return passedScenarioCount;
        };

        self.getUndefinedScenarioCount = function getUndefinedScenarioCount() {
            return undefinedScenarioCount;
        };

        self.getPendingScenarioCount = function getPendingScenarioCount() {
            return pendingScenarioCount;
        };

        self.getFailedScenarioCount = function getFailedScenarioCount() {
            return failedScenarioCount;
        };

        self.getStepCount = function getStepCount() {
            var stepCount =
                self.getPassedStepCount()    +
                self.getUndefinedStepCount() +
                self.getSkippedStepCount()   +
                self.getPendingStepCount()   +
                self.getFailedStepCount();
            return stepCount;
        };

        self.getPassedStepCount = function getPassedStepCount() {
            return passedStepCount;
        };

        self.getPendingStepCount = function getPendingStepCount() {
            return pendingStepCount;
        };

        self.getFailedStepCount = function getFailedStepCount() {
            return failedStepCount;
        };

        self.getSkippedStepCount = function getSkippedStepCount() {
            return skippedStepCount;
        };

        self.getUndefinedStepCount = function getUndefinedStepCount() {
            return undefinedStepCount;
        };

        self.witnessedAnyFailedStep = function witnessedAnyFailedStep() {
            return failedStepCount > 0;
        };

        self.witnessedAnyUndefinedStep = function witnessedAnyUndefinedStep() {
            return undefinedStepCount > 0;
        };

        return self;
    };
        StatsJournal.EVENT_HANDLER_NAME_PREFIX = 'handle';
        StatsJournal.EVENT_HANDLER_NAME_SUFFIX = 'Event';
        module.exports = StatsJournal;

    });

    require.define("/cucumber/listener/summary_formatter",function(require,module,exports,__dirname,__filename,process){var SummaryFormatter = function (options) {
        var Cucumber = require('../../cucumber');

        var failedScenarioLogBuffer = "";
        var undefinedStepLogBuffer  = "";
        var failedStepResults       = Cucumber.Type.Collection();
        var statsJournal            = Cucumber.Listener.StatsJournal();

        var self = Cucumber.Listener.Formatter(options);

        var parentHear = self.hear;
        self.hear = function hear(event, callback) {
            statsJournal.hear(event, function () {
                parentHear(event, callback);
            });
        };

        self.handleStepResultEvent = function handleStepResult(event, callback) {
            var stepResult = event.getPayloadItem('stepResult');
            if (stepResult.isUndefined()) {
                self.handleUndefinedStepResult(stepResult);
            } else if (stepResult.isFailed()) {
                self.handleFailedStepResult(stepResult);
            }
            callback();
        };

        self.handleUndefinedStepResult = function handleUndefinedStepResult(stepResult) {
            var step = stepResult.getStep();
            self.storeUndefinedStep(step);
        };

        self.handleFailedStepResult = function handleFailedStepResult(stepResult) {
            self.storeFailedStepResult(stepResult);
        };

        self.handleAfterScenarioEvent = function handleAfterScenarioEvent(event, callback) {
            if (statsJournal.isCurrentScenarioFailing()) {
                var scenario = event.getPayloadItem('scenario');
                self.storeFailedScenario(scenario);
            }
            callback();
        };

        self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
            self.logSummary();
            callback();
        };

        self.storeFailedStepResult = function storeFailedStepResult(failedStepResult) {
            failedStepResults.add(failedStepResult);
        };

        self.storeFailedScenario = function storeFailedScenario(failedScenario) {
            var name = failedScenario.getName();
            var uri  = failedScenario.getUri();
            var line = failedScenario.getLine();
            self.appendStringToFailedScenarioLogBuffer(uri + ":" + line + " # Scenario: " + name);
        };

        self.storeUndefinedStep = function storeUndefinedStep(step) {
            var snippetBuilder = Cucumber.SupportCode.StepDefinitionSnippetBuilder(step);
            var snippet        = snippetBuilder.buildSnippet();
            self.appendStringToUndefinedStepLogBuffer(snippet);
        };

        self.appendStringToFailedScenarioLogBuffer = function appendStringToFailedScenarioLogBuffer(string) {
            failedScenarioLogBuffer += string + "\n";
        };

        self.appendStringToUndefinedStepLogBuffer = function appendStringToUndefinedStepLogBuffer(string) {
            if (undefinedStepLogBuffer.indexOf(string) == -1)
                undefinedStepLogBuffer += string + "\n";
        };

        self.getFailedScenarioLogBuffer = function getFailedScenarioLogBuffer() {
            return failedScenarioLogBuffer;
        };

        self.getUndefinedStepLogBuffer = function getUndefinedStepLogBuffer() {
            return undefinedStepLogBuffer;
        };

        self.logSummary = function logSummary() {
            if (statsJournal.witnessedAnyFailedStep())
                self.logFailedStepResults();
            self.logScenariosSummary();
            self.logStepsSummary();
            if (statsJournal.witnessedAnyUndefinedStep())
                self.logUndefinedStepSnippets();
        };

        self.logFailedStepResults = function logFailedStepResults() {
            self.log("(::) failed steps (::)\n\n");
            failedStepResults.syncForEach(function(stepResult) {
                self.logFailedStepResult(stepResult);
            });
            self.log("Failing scenarios:\n");
            var failedScenarios = self.getFailedScenarioLogBuffer();
            self.log(failedScenarios);
            self.log("\n");
        };

        self.logFailedStepResult = function logFailedStepResult(stepResult) {
            var failureMessage = stepResult.getFailureException();
            self.log(failureMessage.stack || failureMessage);
            self.log("\n\n");
        };

        self.logScenariosSummary = function logScenariosSummary() {
            var scenarioCount          = statsJournal.getScenarioCount();
            var passedScenarioCount    = statsJournal.getPassedScenarioCount();
            var undefinedScenarioCount = statsJournal.getUndefinedScenarioCount();
            var pendingScenarioCount   = statsJournal.getPendingScenarioCount();
            var failedScenarioCount    = statsJournal.getFailedScenarioCount();
            var details                = [];

            self.log(scenarioCount + " scenario" + (scenarioCount != 1 ? "s" : ""));
            if (scenarioCount > 0 ) {
                if (failedScenarioCount > 0)
                    details.push(failedScenarioCount + " failed");
                if (undefinedScenarioCount > 0)
                    details.push(undefinedScenarioCount + " undefined");
                if (pendingScenarioCount > 0)
                    details.push(pendingScenarioCount + " pending");
                if (passedScenarioCount > 0)
                    details.push(passedScenarioCount + " passed");
                self.log(" (" + details.join(', ') + ")");
            }
            self.log("\n");
        };

        self.logStepsSummary = function logStepsSummary() {
            var stepCount          = statsJournal.getStepCount();
            var passedStepCount    = statsJournal.getPassedStepCount();
            var undefinedStepCount = statsJournal.getUndefinedStepCount();
            var skippedStepCount   = statsJournal.getSkippedStepCount();
            var pendingStepCount   = statsJournal.getPendingStepCount();
            var failedStepCount    = statsJournal.getFailedStepCount();
            var details            = [];

            self.log(stepCount + " step" + (stepCount != 1 ? "s" : ""));
            if (stepCount > 0) {
                if (failedStepCount > 0)
                    details.push(failedStepCount    + " failed");
                if (undefinedStepCount > 0)
                    details.push(undefinedStepCount + " undefined");
                if (pendingStepCount > 0)
                    details.push(pendingStepCount   + " pending");
                if (skippedStepCount > 0)
                    details.push(skippedStepCount   + " skipped");
                if (passedStepCount > 0)
                    details.push(passedStepCount    + " passed");
                self.log(" (" + details.join(', ') + ")");
            }
            self.log("\n");
        };

        self.logUndefinedStepSnippets = function logUndefinedStepSnippets() {
            var undefinedStepLogBuffer = self.getUndefinedStepLogBuffer();
            self.log("\nYou can implement step definitions for undefined steps with these snippets:\n\n");
            self.log(undefinedStepLogBuffer);
        };

        return self;
    };
        module.exports = SummaryFormatter;

    });

    require.define("/cucumber/parser",function(require,module,exports,__dirname,__filename,process){var Parser = function(featureSources, astFilter) {
        var Gherkin      = require('gherkin');
        var GherkinLexer = require('gherkin/lib/gherkin/lexer/en');
        var Cucumber     = require('../cucumber');

        var features     = Cucumber.Ast.Features();
        var astAssembler = Cucumber.Ast.Assembler(features, astFilter);
        var currentSourceUri;

        var self = {
            parse: function parse() {
                var eventHandler = self.getEventHandlers();
                var lexer = new GherkinLexer(self.getEventHandlers());
                for (i in featureSources) {
                    var currentSourceUri = featureSources[i][Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX];
                    var featureSource    = featureSources[i][Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX];
                    self.setCurrentSourceUri(currentSourceUri);
                    lexer.scan(featureSource);
                }
                return features;
            },

            setCurrentSourceUri: function setCurrentSourceUri(uri) {
                currentSourceUri = uri;
            },

            getCurrentSourceUri: function getCurrentSourceUri() {
                return currentSourceUri;
            },

            getEventHandlers: function getEventHandlers() {
                return {
                    background:       self.handleBackground,
                    comment:          self.handleComment,
                    doc_string:       self.handleDocString,
                    eof:              self.handleEof,
                    feature:          self.handleFeature,
                    row:              self.handleDataTableRow,
                    scenario:         self.handleScenario,
                    step:             self.handleStep,
                    tag:              self.handleTag,
                    scenario_outline: self.handleScenarioOutline,
                    examples:         self.handleExamples
                };
            },

            handleBackground: function handleBackground(keyword, name, description, line) {
                var uri        = self.getCurrentSourceUri();
                var background = Cucumber.Ast.Background(keyword, name, description, uri, line);
                astAssembler.insertBackground(background);
            },

            handleComment: function handleComment() {},

            handleDocString: function handleDocString(contentType, string, line) {
                var uri       = self.getCurrentSourceUri();
                var docString = Cucumber.Ast.DocString(contentType, string, uri, line);
                astAssembler.insertDocString(docString);
            },

            handleEof: function handleEof() {
                astAssembler.finish();
            },

            handleFeature: function handleFeature(keyword, name, description, line) {
                var uri     = self.getCurrentSourceUri();
                var feature = Cucumber.Ast.Feature(keyword, name, description, uri, line);
                astAssembler.insertFeature(feature);
            },

            handleDataTableRow: function handleDataTableRow(cells, line) {
                var uri          = self.getCurrentSourceUri();
                var dataTableRow = Cucumber.Ast.DataTable.Row(cells, uri, line);
                astAssembler.insertDataTableRow(dataTableRow);
            },

            handleScenario: function handleScenario(keyword, name, description, line) {
                var uri      = self.getCurrentSourceUri();
                var scenario = Cucumber.Ast.Scenario(keyword, name, description, uri, line);
                astAssembler.insertScenario(scenario);
            },

            handleStep: function handleStep(keyword, name, line) {
                var uri  = self.getCurrentSourceUri();
                var step = Cucumber.Ast.Step(keyword, name, uri, line);
                astAssembler.insertStep(step);
            },

            handleTag: function handleTag(tag, line) {
                var uri = self.getCurrentSourceUri();
                var tag = Cucumber.Ast.Tag(tag, uri, line);
                astAssembler.insertTag(tag);
            },

            handleScenarioOutline: function handleScenarioOutline(keyword, name, description, line) {
                throw new Error("Scenario outlines are not supported yet. See https://github.com/cucumber/cucumber-js/issues/10");
            },

            handleExamples: function handleExamples(keyword, name, description, line) {
                throw new Error("Examples are not supported yet. See https://github.com/cucumber/cucumber-js/issues/10");
            }
        };
        return self;
    };
        Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX = 0;
        Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX = 1;
        module.exports = Parser;

    });

    require.define("/node_modules/gherkin/package.json",function(require,module,exports,__dirname,__filename,process){module.exports = {"main":"./lib/gherkin"}
    });

    require.define("/node_modules/gherkin/lib/gherkin.js",function(require,module,exports,__dirname,__filename,process){/**
     * Creates a new Lexer for a specific language.
     */
    module.exports.Lexer = function(lang) {
        return require('./gherkin/lexer/' + lang);
    };

        /**
         * Creates a connect middleware for loading lexer sources (typically for browsers).
         */
        module.exports.connect = function(path) {
            var gherkinFiles = require('connect').static(__dirname);

            return function(req, res, next) {
                if(req.url.indexOf(path) == 0) {
                    req.url = req.url.slice(path.length);
                    gherkinFiles(req, res, next);
                } else {
                    next();
                }
            };
        };

    });

    require.define("/node_modules/gherkin/lib/gherkin/lexer/en.js",function(require,module,exports,__dirname,__filename,process){
        /* line 1 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */
        ;(function() {


            /* line 126 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */



            /* line 11 "js/lib/gherkin/lexer/en.js" */
            var _lexer_actions = [
                0, 1, 0, 1, 1, 1, 2, 1,
                3, 1, 4, 1, 5, 1, 6, 1,
                7, 1, 8, 1, 9, 1, 10, 1,
                11, 1, 12, 1, 13, 1, 16, 1,
                17, 1, 18, 1, 19, 1, 20, 1,
                21, 1, 22, 1, 23, 2, 2, 18,
                2, 3, 4, 2, 13, 0, 2, 14,
                15, 2, 17, 0, 2, 17, 1, 2,
                17, 16, 2, 17, 19, 2, 18, 6,
                2, 18, 7, 2, 18, 8, 2, 18,
                9, 2, 18, 10, 2, 18, 16, 2,
                20, 21, 2, 22, 0, 2, 22, 1,
                2, 22, 16, 2, 22, 19, 3, 4,
                14, 15, 3, 5, 14, 15, 3, 11,
                14, 15, 3, 12, 14, 15, 3, 13,
                14, 15, 3, 14, 15, 18, 3, 17,
                0, 11, 3, 17, 14, 15, 4, 2,
                14, 15, 18, 4, 3, 4, 14, 15,
                4, 17, 0, 14, 15, 5, 17, 0,
                11, 14, 15
            ];

            var _lexer_key_offsets = [
                0, 0, 19, 37, 38, 39, 41, 43,
                48, 53, 58, 63, 67, 71, 73, 74,
                75, 76, 77, 78, 79, 80, 81, 82,
                83, 84, 85, 86, 87, 88, 89, 91,
                93, 98, 105, 110, 112, 113, 114, 115,
                116, 117, 118, 119, 120, 132, 134, 136,
                138, 140, 142, 144, 146, 148, 150, 152,
                154, 156, 158, 160, 162, 164, 166, 168,
                170, 172, 174, 192, 194, 195, 196, 197,
                198, 199, 200, 201, 202, 203, 204, 205,
                220, 222, 224, 226, 228, 230, 232, 234,
                236, 238, 240, 242, 244, 246, 248, 250,
                253, 255, 257, 259, 261, 263, 265, 267,
                269, 272, 274, 276, 278, 280, 282, 284,
                286, 288, 290, 292, 294, 296, 298, 300,
                302, 304, 306, 308, 310, 312, 314, 316,
                318, 320, 322, 324, 326, 329, 332, 334,
                336, 338, 340, 342, 344, 346, 348, 350,
                352, 354, 356, 358, 359, 360, 361, 362,
                363, 364, 365, 366, 367, 368, 369, 370,
                371, 372, 373, 374, 375, 376, 377, 378,
                387, 389, 391, 393, 395, 397, 399, 401,
                403, 405, 407, 409, 411, 413, 415, 417,
                419, 421, 423, 425, 427, 429, 431, 433,
                435, 437, 438, 439, 440, 441, 442, 443,
                444, 445, 446, 447, 448, 449, 450, 451,
                452, 453, 454, 457, 459, 460, 461, 462,
                463, 464, 465, 466, 467, 468, 483, 485,
                487, 489, 491, 493, 495, 497, 499, 501,
                503, 505, 507, 509, 511, 513, 516, 518,
                520, 522, 524, 526, 528, 530, 532, 535,
                537, 539, 541, 543, 545, 547, 549, 551,
                553, 555, 557, 559, 561, 563, 565, 567,
                569, 571, 573, 575, 577, 579, 581, 583,
                585, 587, 589, 591, 592, 593, 594, 595,
                596, 597, 598, 599, 614, 616, 618, 620,
                622, 624, 626, 628, 630, 632, 634, 636,
                638, 640, 642, 644, 647, 649, 651, 653,
                655, 657, 659, 661, 664, 666, 668, 670,
                672, 674, 676, 678, 680, 683, 685, 687,
                689, 691, 693, 695, 697, 699, 701, 703,
                705, 707, 709, 711, 713, 715, 717, 719,
                721, 723, 725, 727, 729, 731, 733, 735,
                738, 741, 743, 745, 747, 749, 751, 753,
                755, 757, 759, 761, 763, 765, 766, 770,
                776, 779, 781, 787, 805, 808, 810, 812,
                814, 816, 818, 820, 822, 824, 826, 828,
                830, 832, 834, 836, 838, 840, 842, 844,
                846, 848, 850, 852, 854, 856, 858, 860,
                862, 864, 866, 868, 870, 872, 874, 876,
                878, 880, 882, 884, 888, 891, 893, 895,
                897, 899, 901, 903, 905, 907, 909, 911,
                913, 914, 915, 916
            ];

            var _lexer_trans_keys = [
                10, 32, 34, 35, 37, 42, 64, 65,
                66, 69, 70, 71, 83, 84, 87, 124,
                239, 9, 13, 10, 32, 34, 35, 37,
                42, 64, 65, 66, 69, 70, 71, 83,
                84, 87, 124, 9, 13, 34, 34, 10,
                13, 10, 13, 10, 32, 34, 9, 13,
                10, 32, 34, 9, 13, 10, 32, 34,
                9, 13, 10, 32, 34, 9, 13, 10,
                32, 9, 13, 10, 32, 9, 13, 10,
                13, 10, 95, 70, 69, 65, 84, 85,
                82, 69, 95, 69, 78, 68, 95, 37,
                32, 10, 13, 10, 13, 13, 32, 64,
                9, 10, 9, 10, 13, 32, 64, 11,
                12, 10, 32, 64, 9, 13, 98, 110,
                105, 108, 105, 116, 121, 58, 10, 10,
                10, 32, 35, 37, 64, 65, 66, 69,
                70, 83, 9, 13, 10, 95, 10, 70,
                10, 69, 10, 65, 10, 84, 10, 85,
                10, 82, 10, 69, 10, 95, 10, 69,
                10, 78, 10, 68, 10, 95, 10, 37,
                10, 98, 10, 105, 10, 108, 10, 105,
                10, 116, 10, 121, 10, 58, 10, 32,
                34, 35, 37, 42, 64, 65, 66, 69,
                70, 71, 83, 84, 87, 124, 9, 13,
                97, 117, 99, 107, 103, 114, 111, 117,
                110, 100, 58, 10, 10, 10, 32, 35,
                37, 42, 64, 65, 66, 70, 71, 83,
                84, 87, 9, 13, 10, 95, 10, 70,
                10, 69, 10, 65, 10, 84, 10, 85,
                10, 82, 10, 69, 10, 95, 10, 69,
                10, 78, 10, 68, 10, 95, 10, 37,
                10, 32, 10, 98, 110, 10, 105, 10,
                108, 10, 105, 10, 116, 10, 121, 10,
                58, 10, 100, 10, 117, 10, 115, 116,
                10, 105, 10, 110, 10, 101, 10, 115,
                10, 115, 10, 32, 10, 78, 10, 101,
                10, 101, 10, 100, 10, 101, 10, 97,
                10, 116, 10, 117, 10, 114, 10, 101,
                10, 105, 10, 118, 10, 101, 10, 110,
                10, 99, 10, 101, 10, 110, 10, 97,
                10, 114, 10, 105, 10, 111, 10, 32,
                58, 10, 79, 84, 10, 117, 10, 116,
                10, 108, 10, 105, 10, 110, 10, 101,
                10, 109, 10, 112, 10, 108, 10, 97,
                10, 116, 10, 104, 115, 116, 105, 110,
                101, 115, 115, 32, 78, 101, 101, 100,
                120, 97, 109, 112, 108, 101, 115, 58,
                10, 10, 10, 32, 35, 65, 66, 70,
                124, 9, 13, 10, 98, 10, 105, 10,
                108, 10, 105, 10, 116, 10, 121, 10,
                58, 10, 117, 10, 115, 10, 105, 10,
                110, 10, 101, 10, 115, 10, 115, 10,
                32, 10, 78, 10, 101, 10, 101, 10,
                100, 10, 101, 10, 97, 10, 116, 10,
                117, 10, 114, 10, 101, 101, 97, 116,
                117, 114, 101, 105, 118, 101, 110, 99,
                101, 110, 97, 114, 105, 111, 32, 58,
                115, 79, 84, 117, 116, 108, 105, 110,
                101, 58, 10, 10, 10, 32, 35, 37,
                42, 64, 65, 66, 70, 71, 83, 84,
                87, 9, 13, 10, 95, 10, 70, 10,
                69, 10, 65, 10, 84, 10, 85, 10,
                82, 10, 69, 10, 95, 10, 69, 10,
                78, 10, 68, 10, 95, 10, 37, 10,
                32, 10, 98, 110, 10, 105, 10, 108,
                10, 105, 10, 116, 10, 121, 10, 58,
                10, 100, 10, 117, 10, 115, 116, 10,
                105, 10, 110, 10, 101, 10, 115, 10,
                115, 10, 32, 10, 78, 10, 101, 10,
                101, 10, 100, 10, 101, 10, 97, 10,
                116, 10, 117, 10, 114, 10, 101, 10,
                105, 10, 118, 10, 101, 10, 110, 10,
                99, 10, 101, 10, 110, 10, 97, 10,
                114, 10, 105, 10, 111, 10, 104, 101,
                109, 112, 108, 97, 116, 10, 10, 10,
                32, 35, 37, 42, 64, 65, 66, 70,
                71, 83, 84, 87, 9, 13, 10, 95,
                10, 70, 10, 69, 10, 65, 10, 84,
                10, 85, 10, 82, 10, 69, 10, 95,
                10, 69, 10, 78, 10, 68, 10, 95,
                10, 37, 10, 32, 10, 98, 110, 10,
                105, 10, 108, 10, 105, 10, 116, 10,
                121, 10, 58, 10, 100, 10, 97, 117,
                10, 99, 10, 107, 10, 103, 10, 114,
                10, 111, 10, 117, 10, 110, 10, 100,
                10, 115, 116, 10, 105, 10, 110, 10,
                101, 10, 115, 10, 115, 10, 32, 10,
                78, 10, 101, 10, 101, 10, 101, 10,
                97, 10, 116, 10, 117, 10, 114, 10,
                101, 10, 105, 10, 118, 10, 101, 10,
                110, 10, 99, 10, 101, 10, 110, 10,
                97, 10, 114, 10, 105, 10, 111, 10,
                32, 58, 10, 79, 84, 10, 117, 10,
                116, 10, 108, 10, 105, 10, 110, 10,
                101, 10, 109, 10, 112, 10, 108, 10,
                97, 10, 116, 10, 104, 104, 32, 124,
                9, 13, 10, 32, 92, 124, 9, 13,
                10, 92, 124, 10, 92, 10, 32, 92,
                124, 9, 13, 10, 32, 34, 35, 37,
                42, 64, 65, 66, 69, 70, 71, 83,
                84, 87, 124, 9, 13, 10, 97, 117,
                10, 99, 10, 107, 10, 103, 10, 114,
                10, 111, 10, 117, 10, 110, 10, 100,
                10, 115, 10, 105, 10, 110, 10, 101,
                10, 115, 10, 115, 10, 32, 10, 78,
                10, 101, 10, 101, 10, 120, 10, 97,
                10, 109, 10, 112, 10, 108, 10, 101,
                10, 115, 10, 101, 10, 97, 10, 116,
                10, 117, 10, 114, 10, 101, 10, 99,
                10, 101, 10, 110, 10, 97, 10, 114,
                10, 105, 10, 111, 10, 32, 58, 115,
                10, 79, 84, 10, 117, 10, 116, 10,
                108, 10, 105, 10, 110, 10, 101, 10,
                109, 10, 112, 10, 108, 10, 97, 10,
                116, 100, 187, 191, 0
            ];

            var _lexer_single_lengths = [
                0, 17, 16, 1, 1, 2, 2, 3,
                3, 3, 3, 2, 2, 2, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 2, 2,
                3, 5, 3, 2, 1, 1, 1, 1,
                1, 1, 1, 1, 10, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 16, 2, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 13,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 3,
                2, 2, 2, 2, 2, 2, 2, 2,
                3, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 3, 3, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 7,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 3, 2, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 13, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 3, 2, 2,
                2, 2, 2, 2, 2, 2, 3, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 1, 1, 1, 1, 1,
                1, 1, 1, 13, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 3, 2, 2, 2, 2,
                2, 2, 2, 3, 2, 2, 2, 2,
                2, 2, 2, 2, 3, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 3,
                3, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 1, 2, 4,
                3, 2, 4, 16, 3, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 4, 3, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                1, 1, 1, 0
            ];

            var _lexer_range_lengths = [
                0, 1, 1, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 1, 1,
                0, 0, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0
            ];

            var _lexer_index_offsets = [
                0, 0, 19, 37, 39, 41, 44, 47,
                52, 57, 62, 67, 71, 75, 78, 80,
                82, 84, 86, 88, 90, 92, 94, 96,
                98, 100, 102, 104, 106, 108, 110, 113,
                116, 121, 128, 133, 136, 138, 140, 142,
                144, 146, 148, 150, 152, 164, 167, 170,
                173, 176, 179, 182, 185, 188, 191, 194,
                197, 200, 203, 206, 209, 212, 215, 218,
                221, 224, 227, 245, 248, 250, 252, 254,
                256, 258, 260, 262, 264, 266, 268, 270,
                285, 288, 291, 294, 297, 300, 303, 306,
                309, 312, 315, 318, 321, 324, 327, 330,
                334, 337, 340, 343, 346, 349, 352, 355,
                358, 362, 365, 368, 371, 374, 377, 380,
                383, 386, 389, 392, 395, 398, 401, 404,
                407, 410, 413, 416, 419, 422, 425, 428,
                431, 434, 437, 440, 443, 447, 451, 454,
                457, 460, 463, 466, 469, 472, 475, 478,
                481, 484, 487, 490, 492, 494, 496, 498,
                500, 502, 504, 506, 508, 510, 512, 514,
                516, 518, 520, 522, 524, 526, 528, 530,
                539, 542, 545, 548, 551, 554, 557, 560,
                563, 566, 569, 572, 575, 578, 581, 584,
                587, 590, 593, 596, 599, 602, 605, 608,
                611, 614, 616, 618, 620, 622, 624, 626,
                628, 630, 632, 634, 636, 638, 640, 642,
                644, 646, 648, 652, 655, 657, 659, 661,
                663, 665, 667, 669, 671, 673, 688, 691,
                694, 697, 700, 703, 706, 709, 712, 715,
                718, 721, 724, 727, 730, 733, 737, 740,
                743, 746, 749, 752, 755, 758, 761, 765,
                768, 771, 774, 777, 780, 783, 786, 789,
                792, 795, 798, 801, 804, 807, 810, 813,
                816, 819, 822, 825, 828, 831, 834, 837,
                840, 843, 846, 849, 851, 853, 855, 857,
                859, 861, 863, 865, 880, 883, 886, 889,
                892, 895, 898, 901, 904, 907, 910, 913,
                916, 919, 922, 925, 929, 932, 935, 938,
                941, 944, 947, 950, 954, 957, 960, 963,
                966, 969, 972, 975, 978, 982, 985, 988,
                991, 994, 997, 1000, 1003, 1006, 1009, 1012,
                1015, 1018, 1021, 1024, 1027, 1030, 1033, 1036,
                1039, 1042, 1045, 1048, 1051, 1054, 1057, 1060,
                1064, 1068, 1071, 1074, 1077, 1080, 1083, 1086,
                1089, 1092, 1095, 1098, 1101, 1104, 1106, 1110,
                1116, 1120, 1123, 1129, 1147, 1151, 1154, 1157,
                1160, 1163, 1166, 1169, 1172, 1175, 1178, 1181,
                1184, 1187, 1190, 1193, 1196, 1199, 1202, 1205,
                1208, 1211, 1214, 1217, 1220, 1223, 1226, 1229,
                1232, 1235, 1238, 1241, 1244, 1247, 1250, 1253,
                1256, 1259, 1262, 1265, 1270, 1274, 1277, 1280,
                1283, 1286, 1289, 1292, 1295, 1298, 1301, 1304,
                1307, 1309, 1311, 1313
            ];

            var _lexer_indicies = [
                2, 1, 3, 4, 5, 6, 7, 8,
                9, 10, 11, 12, 13, 14, 14, 15,
                16, 1, 0, 2, 1, 3, 4, 5,
                6, 7, 8, 9, 10, 11, 12, 13,
                14, 14, 15, 1, 0, 17, 0, 18,
                0, 20, 21, 19, 23, 24, 22, 27,
                26, 28, 26, 25, 31, 30, 32, 30,
                29, 31, 30, 33, 30, 29, 31, 30,
                34, 30, 29, 36, 35, 35, 0, 2,
                37, 37, 0, 39, 40, 38, 2, 0,
                41, 0, 42, 0, 43, 0, 44, 0,
                45, 0, 46, 0, 47, 0, 48, 0,
                49, 0, 50, 0, 51, 0, 52, 0,
                53, 0, 54, 0, 55, 0, 57, 58,
                56, 60, 61, 59, 0, 0, 0, 0,
                62, 63, 64, 63, 63, 66, 65, 62,
                2, 67, 7, 67, 0, 68, 69, 0,
                70, 0, 71, 0, 72, 0, 73, 0,
                74, 0, 75, 0, 77, 76, 79, 78,
                79, 80, 81, 82, 81, 83, 84, 85,
                86, 87, 80, 78, 79, 88, 78, 79,
                89, 78, 79, 90, 78, 79, 91, 78,
                79, 92, 78, 79, 93, 78, 79, 94,
                78, 79, 95, 78, 79, 96, 78, 79,
                97, 78, 79, 98, 78, 79, 99, 78,
                79, 100, 78, 79, 101, 78, 79, 102,
                78, 79, 103, 78, 79, 104, 78, 79,
                105, 78, 79, 106, 78, 79, 107, 78,
                79, 108, 78, 110, 109, 111, 112, 113,
                114, 115, 116, 117, 118, 119, 120, 121,
                122, 122, 123, 109, 0, 124, 125, 0,
                126, 0, 127, 0, 128, 0, 129, 0,
                130, 0, 131, 0, 132, 0, 133, 0,
                134, 0, 136, 135, 138, 137, 138, 139,
                140, 141, 142, 140, 143, 144, 145, 146,
                147, 148, 148, 139, 137, 138, 149, 137,
                138, 150, 137, 138, 151, 137, 138, 152,
                137, 138, 153, 137, 138, 154, 137, 138,
                155, 137, 138, 156, 137, 138, 157, 137,
                138, 158, 137, 138, 159, 137, 138, 160,
                137, 138, 161, 137, 138, 162, 137, 138,
                163, 137, 138, 164, 165, 137, 138, 166,
                137, 138, 167, 137, 138, 168, 137, 138,
                169, 137, 138, 170, 137, 138, 163, 137,
                138, 171, 137, 138, 172, 137, 138, 173,
                171, 137, 138, 174, 137, 138, 175, 137,
                138, 176, 137, 138, 177, 137, 138, 178,
                137, 138, 179, 137, 138, 180, 137, 138,
                181, 137, 138, 182, 137, 138, 170, 137,
                138, 183, 137, 138, 184, 137, 138, 185,
                137, 138, 186, 137, 138, 187, 137, 138,
                170, 137, 138, 188, 137, 138, 189, 137,
                138, 190, 137, 138, 171, 137, 138, 191,
                137, 138, 192, 137, 138, 193, 137, 138,
                194, 137, 138, 195, 137, 138, 196, 137,
                138, 197, 137, 138, 198, 163, 137, 138,
                199, 200, 137, 138, 201, 137, 138, 202,
                137, 138, 203, 137, 138, 204, 137, 138,
                187, 137, 138, 205, 137, 138, 206, 137,
                138, 207, 137, 138, 208, 137, 138, 209,
                137, 138, 187, 137, 138, 189, 137, 210,
                211, 0, 212, 0, 213, 0, 214, 0,
                215, 0, 216, 0, 217, 0, 218, 0,
                219, 0, 220, 0, 74, 0, 221, 0,
                222, 0, 223, 0, 224, 0, 225, 0,
                226, 0, 227, 0, 228, 0, 230, 229,
                232, 231, 232, 233, 234, 235, 236, 237,
                234, 233, 231, 232, 238, 231, 232, 239,
                231, 232, 240, 231, 232, 241, 231, 232,
                242, 231, 232, 243, 231, 232, 244, 231,
                232, 245, 231, 232, 246, 231, 232, 247,
                231, 232, 248, 231, 232, 249, 231, 232,
                250, 231, 232, 251, 231, 232, 252, 231,
                232, 253, 231, 232, 254, 231, 232, 255,
                231, 232, 243, 231, 232, 256, 231, 232,
                257, 231, 232, 258, 231, 232, 259, 231,
                232, 260, 231, 232, 243, 231, 261, 0,
                262, 0, 263, 0, 264, 0, 265, 0,
                74, 0, 266, 0, 267, 0, 268, 0,
                211, 0, 269, 0, 270, 0, 271, 0,
                272, 0, 273, 0, 274, 0, 275, 0,
                276, 277, 227, 0, 278, 279, 0, 280,
                0, 281, 0, 282, 0, 283, 0, 284,
                0, 285, 0, 286, 0, 288, 287, 290,
                289, 290, 291, 292, 293, 294, 292, 295,
                296, 297, 298, 299, 300, 300, 291, 289,
                290, 301, 289, 290, 302, 289, 290, 303,
                289, 290, 304, 289, 290, 305, 289, 290,
                306, 289, 290, 307, 289, 290, 308, 289,
                290, 309, 289, 290, 310, 289, 290, 311,
                289, 290, 312, 289, 290, 313, 289, 290,
                314, 289, 290, 315, 289, 290, 316, 317,
                289, 290, 318, 289, 290, 319, 289, 290,
                320, 289, 290, 321, 289, 290, 322, 289,
                290, 315, 289, 290, 323, 289, 290, 324,
                289, 290, 325, 323, 289, 290, 326, 289,
                290, 327, 289, 290, 328, 289, 290, 329,
                289, 290, 330, 289, 290, 331, 289, 290,
                332, 289, 290, 333, 289, 290, 334, 289,
                290, 322, 289, 290, 335, 289, 290, 336,
                289, 290, 337, 289, 290, 338, 289, 290,
                339, 289, 290, 322, 289, 290, 340, 289,
                290, 341, 289, 290, 342, 289, 290, 323,
                289, 290, 343, 289, 290, 344, 289, 290,
                345, 289, 290, 346, 289, 290, 347, 289,
                290, 348, 289, 290, 322, 289, 290, 341,
                289, 349, 0, 350, 0, 351, 0, 352,
                0, 353, 0, 284, 0, 355, 354, 357,
                356, 357, 358, 359, 360, 361, 359, 362,
                363, 364, 365, 366, 367, 367, 358, 356,
                357, 368, 356, 357, 369, 356, 357, 370,
                356, 357, 371, 356, 357, 372, 356, 357,
                373, 356, 357, 374, 356, 357, 375, 356,
                357, 376, 356, 357, 377, 356, 357, 378,
                356, 357, 379, 356, 357, 380, 356, 357,
                381, 356, 357, 382, 356, 357, 383, 384,
                356, 357, 385, 356, 357, 386, 356, 357,
                387, 356, 357, 388, 356, 357, 389, 356,
                357, 382, 356, 357, 390, 356, 357, 391,
                392, 356, 357, 393, 356, 357, 394, 356,
                357, 395, 356, 357, 396, 356, 357, 397,
                356, 357, 398, 356, 357, 399, 356, 357,
                389, 356, 357, 400, 390, 356, 357, 401,
                356, 357, 402, 356, 357, 403, 356, 357,
                404, 356, 357, 405, 356, 357, 406, 356,
                357, 407, 356, 357, 408, 356, 357, 399,
                356, 357, 409, 356, 357, 410, 356, 357,
                411, 356, 357, 412, 356, 357, 413, 356,
                357, 389, 356, 357, 414, 356, 357, 415,
                356, 357, 416, 356, 357, 390, 356, 357,
                417, 356, 357, 418, 356, 357, 419, 356,
                357, 420, 356, 357, 421, 356, 357, 422,
                356, 357, 423, 356, 357, 424, 382, 356,
                357, 425, 426, 356, 357, 427, 356, 357,
                428, 356, 357, 429, 356, 357, 430, 356,
                357, 413, 356, 357, 431, 356, 357, 432,
                356, 357, 433, 356, 357, 434, 356, 357,
                435, 356, 357, 413, 356, 357, 415, 356,
                267, 0, 436, 437, 436, 0, 440, 439,
                441, 442, 439, 438, 0, 444, 445, 443,
                0, 444, 443, 440, 446, 444, 445, 446,
                443, 440, 447, 448, 449, 450, 451, 452,
                453, 454, 455, 456, 457, 458, 459, 459,
                460, 447, 0, 79, 461, 462, 78, 79,
                463, 78, 79, 464, 78, 79, 465, 78,
                79, 466, 78, 79, 467, 78, 79, 468,
                78, 79, 469, 78, 79, 107, 78, 79,
                470, 78, 79, 471, 78, 79, 472, 78,
                79, 473, 78, 79, 474, 78, 79, 475,
                78, 79, 476, 78, 79, 477, 78, 79,
                478, 78, 79, 469, 78, 79, 479, 78,
                79, 480, 78, 79, 481, 78, 79, 482,
                78, 79, 483, 78, 79, 484, 78, 79,
                107, 78, 79, 485, 78, 79, 486, 78,
                79, 487, 78, 79, 488, 78, 79, 489,
                78, 79, 107, 78, 79, 490, 78, 79,
                491, 78, 79, 492, 78, 79, 493, 78,
                79, 494, 78, 79, 495, 78, 79, 496,
                78, 79, 497, 108, 107, 78, 79, 498,
                499, 78, 79, 500, 78, 79, 501, 78,
                79, 502, 78, 79, 503, 78, 79, 489,
                78, 79, 504, 78, 79, 505, 78, 79,
                506, 78, 79, 507, 78, 79, 508, 78,
                79, 489, 78, 211, 0, 509, 0, 1,
                0, 510, 0
            ];

            var _lexer_trans_targs = [
                0, 2, 2, 3, 13, 15, 29, 32,
                35, 67, 157, 193, 199, 203, 357, 358,
                417, 4, 5, 6, 7, 6, 6, 7,
                6, 8, 8, 8, 9, 8, 8, 8,
                9, 10, 11, 12, 2, 12, 13, 2,
                14, 16, 17, 18, 19, 20, 21, 22,
                23, 24, 25, 26, 27, 28, 419, 30,
                31, 2, 14, 31, 2, 14, 33, 34,
                2, 33, 32, 34, 36, 416, 37, 38,
                39, 40, 41, 42, 43, 44, 43, 44,
                44, 2, 45, 59, 364, 383, 390, 396,
                46, 47, 48, 49, 50, 51, 52, 53,
                54, 55, 56, 57, 58, 2, 60, 61,
                62, 63, 64, 65, 66, 2, 2, 3,
                13, 15, 29, 32, 35, 67, 157, 193,
                199, 203, 357, 358, 68, 146, 69, 70,
                71, 72, 73, 74, 75, 76, 77, 78,
                79, 78, 79, 79, 2, 80, 94, 95,
                103, 115, 121, 125, 145, 81, 82, 83,
                84, 85, 86, 87, 88, 89, 90, 91,
                92, 93, 2, 66, 96, 102, 97, 98,
                99, 100, 101, 94, 104, 105, 106, 107,
                108, 109, 110, 111, 112, 113, 114, 116,
                117, 118, 119, 120, 122, 123, 124, 126,
                127, 128, 129, 130, 131, 132, 133, 134,
                139, 135, 136, 137, 138, 140, 141, 142,
                143, 144, 147, 29, 148, 149, 150, 151,
                152, 153, 154, 155, 156, 158, 159, 160,
                161, 162, 163, 164, 165, 166, 167, 166,
                167, 167, 2, 168, 175, 187, 169, 170,
                171, 172, 173, 174, 66, 176, 177, 178,
                179, 180, 181, 182, 183, 184, 185, 186,
                188, 189, 190, 191, 192, 194, 195, 196,
                197, 198, 200, 201, 202, 204, 205, 206,
                207, 208, 209, 210, 211, 281, 212, 275,
                213, 214, 215, 216, 217, 218, 219, 220,
                221, 220, 221, 221, 2, 222, 236, 237,
                245, 257, 263, 267, 274, 223, 224, 225,
                226, 227, 228, 229, 230, 231, 232, 233,
                234, 235, 2, 66, 238, 244, 239, 240,
                241, 242, 243, 236, 246, 247, 248, 249,
                250, 251, 252, 253, 254, 255, 256, 258,
                259, 260, 261, 262, 264, 265, 266, 268,
                269, 270, 271, 272, 273, 276, 277, 278,
                279, 280, 282, 283, 282, 283, 283, 2,
                284, 298, 299, 307, 326, 332, 336, 356,
                285, 286, 287, 288, 289, 290, 291, 292,
                293, 294, 295, 296, 297, 2, 66, 300,
                306, 301, 302, 303, 304, 305, 298, 308,
                316, 309, 310, 311, 312, 313, 314, 315,
                317, 318, 319, 320, 321, 322, 323, 324,
                325, 327, 328, 329, 330, 331, 333, 334,
                335, 337, 338, 339, 340, 341, 342, 343,
                344, 345, 350, 346, 347, 348, 349, 351,
                352, 353, 354, 355, 358, 359, 360, 362,
                363, 361, 359, 360, 361, 359, 362, 363,
                3, 13, 15, 29, 32, 35, 67, 157,
                193, 199, 203, 357, 358, 365, 373, 366,
                367, 368, 369, 370, 371, 372, 374, 375,
                376, 377, 378, 379, 380, 381, 382, 384,
                385, 386, 387, 388, 389, 391, 392, 393,
                394, 395, 397, 398, 399, 400, 401, 402,
                403, 404, 405, 410, 406, 407, 408, 409,
                411, 412, 413, 414, 415, 418, 0
            ];

            var _lexer_trans_actions = [
                43, 0, 54, 3, 1, 0, 29, 1,
                29, 29, 29, 29, 29, 29, 29, 35,
                0, 0, 0, 7, 139, 48, 0, 102,
                9, 5, 45, 134, 45, 0, 33, 122,
                33, 33, 0, 11, 106, 0, 0, 114,
                25, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                57, 149, 126, 0, 110, 23, 0, 27,
                118, 27, 51, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 57, 144, 0, 54,
                0, 69, 33, 84, 84, 84, 84, 84,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 13, 0, 0,
                0, 0, 0, 0, 13, 31, 130, 60,
                57, 31, 63, 57, 63, 63, 63, 63,
                63, 63, 63, 66, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 57,
                144, 0, 54, 0, 72, 33, 84, 84,
                84, 84, 84, 84, 84, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 15, 15, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 57, 144, 0,
                54, 0, 81, 84, 84, 84, 0, 0,
                0, 0, 0, 0, 21, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 57,
                144, 0, 54, 0, 78, 33, 84, 84,
                84, 84, 84, 84, 84, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 19, 19, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 57, 144, 0, 54, 0, 75,
                33, 84, 84, 84, 84, 84, 84, 84,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 17, 17, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 37, 37,
                54, 37, 87, 0, 0, 39, 0, 0,
                93, 90, 41, 96, 90, 96, 96, 96,
                96, 96, 96, 96, 99, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0
            ];

            var _lexer_eof_actions = [
                0, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43
            ];

            var lexer_start = 1;
            var lexer_first_final = 419;
            var lexer_error = 0;

            var lexer_en_main = 1;


            /* line 129 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

            /* line 130 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

            /* line 131 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

            var Lexer = function(listener) {
                // Check that listener has the required functions
                var events = ['comment', 'tag', 'feature', 'background', 'scenario', 'scenario_outline', 'examples', 'step', 'doc_string', 'row', 'eof'];
                for(e in events) {
                    var event = events[e];
                    if(typeof listener[event] != 'function') {
                        throw "Error. No " + event + " function exists on " + JSON.stringify(listener);
                    }
                }
                this.listener = listener;
            };

            Lexer.prototype.scan = function(data) {
                var ending = "\n%_FEATURE_END_%";
                if(typeof data == 'string') {
                    data = this.stringToBytes(data + ending);
                } else if(typeof Buffer != 'undefined' && Buffer.isBuffer(data)) {
                    // Node.js
                    var buf = new Buffer(data.length + ending.length);
                    data.copy(buf, 0, 0);
                    new Buffer(ending).copy(buf, data.length, 0);
                    data = buf;
                }
                var eof = pe = data.length;
                var p = 0;

                this.line_number = 1;
                this.last_newline = 0;


                /* line 778 "js/lib/gherkin/lexer/en.js" */
                {
                    this.cs = lexer_start;
                } /* JSCodeGen::writeInit */

                /* line 162 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                /* line 785 "js/lib/gherkin/lexer/en.js" */
                {
                    var _klen, _trans, _keys, _ps, _widec, _acts, _nacts;
                    var _goto_level, _resume, _eof_trans, _again, _test_eof;
                    var _out;
                    _klen = _trans = _keys = _acts = _nacts = null;
                    _goto_level = 0;
                    _resume = 10;
                    _eof_trans = 15;
                    _again = 20;
                    _test_eof = 30;
                    _out = 40;
                    while (true) {
                        _trigger_goto = false;
                        if (_goto_level <= 0) {
                            if (p == pe) {
                                _goto_level = _test_eof;
                                continue;
                            }
                            if ( this.cs == 0) {
                                _goto_level = _out;
                                continue;
                            }
                        }
                        if (_goto_level <= _resume) {
                            _keys = _lexer_key_offsets[ this.cs];
                            _trans = _lexer_index_offsets[ this.cs];
                            _klen = _lexer_single_lengths[ this.cs];
                            _break_match = false;

                            do {
                                if (_klen > 0) {
                                    _lower = _keys;
                                    _upper = _keys + _klen - 1;

                                    while (true) {
                                        if (_upper < _lower) { break; }
                                        _mid = _lower + ( (_upper - _lower) >> 1 );

                                        if ( data[p] < _lexer_trans_keys[_mid]) {
                                            _upper = _mid - 1;
                                        } else if ( data[p] > _lexer_trans_keys[_mid]) {
                                            _lower = _mid + 1;
                                        } else {
                                            _trans += (_mid - _keys);
                                            _break_match = true;
                                            break;
                                        };
                                    } /* while */
                                    if (_break_match) { break; }
                                    _keys += _klen;
                                    _trans += _klen;
                                }
                                _klen = _lexer_range_lengths[ this.cs];
                                if (_klen > 0) {
                                    _lower = _keys;
                                    _upper = _keys + (_klen << 1) - 2;
                                    while (true) {
                                        if (_upper < _lower) { break; }
                                        _mid = _lower + (((_upper-_lower) >> 1) & ~1);
                                        if ( data[p] < _lexer_trans_keys[_mid]) {
                                            _upper = _mid - 2;
                                        } else if ( data[p] > _lexer_trans_keys[_mid+1]) {
                                            _lower = _mid + 2;
                                        } else {
                                            _trans += ((_mid - _keys) >> 1);
                                            _break_match = true;
                                            break;
                                        }
                                    } /* while */
                                    if (_break_match) { break; }
                                    _trans += _klen
                                }
                            } while (false);
                            _trans = _lexer_indicies[_trans];
                            this.cs = _lexer_trans_targs[_trans];
                            if (_lexer_trans_actions[_trans] != 0) {
                                _acts = _lexer_trans_actions[_trans];
                                _nacts = _lexer_actions[_acts];
                                _acts += 1;
                                while (_nacts > 0) {
                                    _nacts -= 1;
                                    _acts += 1;
                                    switch (_lexer_actions[_acts - 1]) {
                                        case 0:
                                            /* line 6 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.content_start = p;
                                            this.current_line = this.line_number;
                                            this.start_col = p - this.last_newline - (this.keyword+':').length;
                                            break;
                                        case 1:
                                            /* line 12 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.current_line = this.line_number;
                                            this.start_col = p - this.last_newline;
                                            break;
                                        case 2:
                                            /* line 17 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.content_start = p;
                                            break;
                                        case 3:
                                            /* line 21 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.docstring_content_type_start = p;
                                            break;
                                        case 4:
                                            /* line 25 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.docstring_content_type_end = p;
                                            break;
                                        case 5:
                                            /* line 29 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.unindent(
                                                this.start_col,
                                                this.bytesToString(data.slice(this.content_start, this.next_keyword_start-1)).replace(/(\r?\n)?([\t ])*$/, '').replace(/\\\"\\\"\\\"/mg, '"""')
                                            );
                                            var con_type = this.bytesToString(data.slice(this.docstring_content_type_start, this.docstring_content_type_end)).trim();
                                            this.listener.doc_string(con_type, con, this.current_line);
                                            break;
                                        case 6:
                                            /* line 38 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('feature', data, p, eof);
                                            break;
                                        case 7:
                                            /* line 42 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('background', data, p, eof);
                                            break;
                                        case 8:
                                            /* line 46 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('scenario', data, p, eof);
                                            break;
                                        case 9:
                                            /* line 50 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('scenario_outline', data, p, eof);
                                            break;
                                        case 10:
                                            /* line 54 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('examples', data, p, eof);
                                            break;
                                        case 11:
                                            /* line 58 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            this.listener.step(this.keyword, con, this.current_line);
                                            break;
                                        case 12:
                                            /* line 63 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            this.listener.comment(con, this.line_number);
                                            this.keyword_start = null;
                                            break;
                                        case 13:
                                            /* line 69 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            this.listener.tag(con, this.line_number);
                                            this.keyword_start = null;
                                            break;
                                        case 14:
                                            /* line 75 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.line_number++;
                                            break;
                                        case 15:
                                            /* line 79 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.last_newline = p + 1;
                                            break;
                                        case 16:
                                            /* line 83 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.keyword_start = this.keyword_start || p;
                                            break;
                                        case 17:
                                            /* line 87 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.keyword = this.bytesToString(data.slice(this.keyword_start, p)).replace(/:$/, '');
                                            this.keyword_start = null;
                                            break;
                                        case 18:
                                            /* line 92 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.next_keyword_start = p;
                                            break;
                                        case 19:
                                            /* line 96 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = p - 1;
                                            current_row = [];
                                            this.current_line = this.line_number;
                                            break;
                                        case 20:
                                            /* line 102 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.content_start = p;
                                            break;
                                        case 21:
                                            /* line 106 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            current_row.push(con.replace(/\\\|/, "|").replace(/\\n/, "\n").replace(/\\\\/, "\\"));
                                            break;
                                        case 22:
                                            /* line 111 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.listener.row(current_row, this.current_line);
                                            break;
                                        case 23:
                                            /* line 115 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            if(this.cs < lexer_first_final) {
                                                var content = this.current_line_content(data, p);
                                                throw "Lexing error on line " + this.line_number + ": '" + content + "'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.";
                                            } else {
                                                this.listener.eof();
                                            }

                                            break;
                                        /* line 1012 "js/lib/gherkin/lexer/en.js" */
                                    } /* action switch */
                                }
                            }
                            if (_trigger_goto) {
                                continue;
                            }
                        }
                        if (_goto_level <= _again) {
                            if ( this.cs == 0) {
                                _goto_level = _out;
                                continue;
                            }
                            p += 1;
                            if (p != pe) {
                                _goto_level = _resume;
                                continue;
                            }
                        }
                        if (_goto_level <= _test_eof) {
                            if (p == eof) {
                                __acts = _lexer_eof_actions[ this.cs];
                                __nacts =  _lexer_actions[__acts];
                                __acts += 1;
                                while (__nacts > 0) {
                                    __nacts -= 1;
                                    __acts += 1;
                                    switch (_lexer_actions[__acts - 1]) {
                                        case 23:
                                            /* line 115 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            if(this.cs < lexer_first_final) {
                                                var content = this.current_line_content(data, p);
                                                throw "Lexing error on line " + this.line_number + ": '" + content + "'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.";
                                            } else {
                                                this.listener.eof();
                                            }

                                            break;
                                        /* line 1051 "js/lib/gherkin/lexer/en.js" */
                                    } /* eof action switch */
                                }
                                if (_trigger_goto) {
                                    continue;
                                }
                            }
                        }
                        if (_goto_level <= _out) {
                            break;
                        }
                    }
                }

                /* line 163 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */
            };

            Lexer.prototype.bytesToString = function(bytes) {
                if(typeof bytes.write == 'function') {
                    // Node.js
                    return bytes.toString('utf-8');
                } else {
                    var result = "";
                    for(var b in bytes) {
                        result += String.fromCharCode(bytes[b]);
                    }
                    return result;
                }
            };

            Lexer.prototype.stringToBytes = function(string) {
                var bytes = [];
                for(var i = 0; i < string.length; i++) {
                    bytes[i] = string.charCodeAt(i);
                }
                return bytes;
            };

            Lexer.prototype.unindent = function(startcol, text) {
                startcol = startcol || 0;
                return text.replace(new RegExp('^[\t ]{0,' + startcol + '}', 'gm'), '');
            };

            Lexer.prototype.store_keyword_content = function(event, data, p, eof) {
                var end_point = (!this.next_keyword_start || (p == eof)) ? p : this.next_keyword_start;
                var content = this.unindent(this.start_col + 2, this.bytesToString(data.slice(this.content_start, end_point))).replace(/\s+$/,"");
                var content_lines = content.split("\n")
                var name = content_lines.shift() || "";
                name = name.trim();
                var description = content_lines.join("\n");
                this.listener[event](this.keyword, name, description, this.current_line);
                var nks = this.next_keyword_start;
                this.next_keyword_start = null;
                return nks ? nks - 1 : p;
            };

            Lexer.prototype.current_line_content = function(data, p) {
                var rest = data.slice(this.last_newline, -1);
                var end = rest.indexOf(10) || -1;
                return this.bytesToString(rest.slice(0, end)).trim();
            };

// Node.js export
            if(typeof module !== 'undefined') {
                module.exports = Lexer;
            }
// Require.js export
            if (typeof define !== 'undefined') {
                if(define.amd) {
                    define('gherkin/lexer/en', [], function() {
                        return Lexer;
                    });
                } else {
                    define('gherkin/lexer/en', function(require, exports, module) {
                        exports.Lexer = Lexer;
                    });
                }
            }

        })();

    });

    require.define("/cucumber/runtime",function(require,module,exports,__dirname,__filename,process){var Runtime = function(configuration) {
        var Cucumber = require('../cucumber');

        var listeners = Cucumber.Type.Collection();

        var self = {
            start: function start(callback) {
                if (typeof(callback) !== 'function')
                    throw new Error(Runtime.START_MISSING_CALLBACK_ERROR);
                var features           = self.getFeatures();
                var supportCodeLibrary = self.getSupportCodeLibrary();
                var astTreeWalker      = Runtime.AstTreeWalker(features, supportCodeLibrary, listeners);
                astTreeWalker.walk(callback);
            },

            attachListener: function attachListener(listener) {
                listeners.add(listener);
            },

            getFeatures: function getFeatures() {
                var featureSources = configuration.getFeatureSources();
                var astFilter      = configuration.getAstFilter();
                var parser         = Cucumber.Parser(featureSources, astFilter);
                var features       = parser.parse();
                return features;
            },

            getSupportCodeLibrary: function getSupportCodeLibrary() {
                var supportCodeLibrary = configuration.getSupportCodeLibrary();
                return supportCodeLibrary;
            }
        };
        return self;
    };
        Runtime.START_MISSING_CALLBACK_ERROR = "Cucumber.Runtime.start() expects a callback";
        Runtime.AstTreeWalker        = require('./runtime/ast_tree_walker');
        Runtime.StepResult           = require('./runtime/step_result');
        Runtime.SuccessfulStepResult = require('./runtime/successful_step_result');
        Runtime.PendingStepResult    = require('./runtime/pending_step_result');
        Runtime.FailedStepResult     = require('./runtime/failed_step_result');
        Runtime.SkippedStepResult    = require('./runtime/skipped_step_result');
        Runtime.UndefinedStepResult  = require('./runtime/undefined_step_result');
        module.exports               = Runtime;

    });

    require.define("/cucumber/runtime/ast_tree_walker",function(require,module,exports,__dirname,__filename,process){var AstTreeWalker = function(features, supportCodeLibrary, listeners) {
        var Cucumber = require('../../cucumber');

        var listeners;
        var world;
        var allFeaturesSucceded = true;
        var skippingSteps       = false;

        var self = {
            walk: function walk(callback) {
                self.visitFeatures(features, function() {
                    var featuresResult = self.didAllFeaturesSucceed();
                    callback(featuresResult);
                });
            },

            visitFeatures: function visitFeatures(features, callback) {
                var event = AstTreeWalker.Event(AstTreeWalker.FEATURES_EVENT_NAME);
                self.broadcastEventAroundUserFunction(
                    event,
                    function(callback) { features.acceptVisitor(self, callback); },
                    callback
                );
            },

            visitFeature: function visitFeature(feature, callback) {
                var payload = { feature: feature };
                var event   = AstTreeWalker.Event(AstTreeWalker.FEATURE_EVENT_NAME, payload);
                self.broadcastEventAroundUserFunction(
                    event,
                    function(callback) { feature.acceptVisitor(self, callback); },
                    callback
                );
            },

            visitBackground: function visitBackground(background, callback) {
                var payload = { background: background };
                var event   = AstTreeWalker.Event(AstTreeWalker.BACKGROUND_EVENT_NAME, payload);
                self.broadcastEvent(event, callback);
            },

            visitScenario: function visitScenario(scenario, callback) {
                supportCodeLibrary.instantiateNewWorld(function(world) {
                    self.setWorld(world);
                    self.witnessNewScenario();
                    var payload = { scenario: scenario };
                    var event   = AstTreeWalker.Event(AstTreeWalker.SCENARIO_EVENT_NAME, payload);
                    var hookedUpScenarioVisit = supportCodeLibrary.hookUpFunction(
                        function(callback) { scenario.acceptVisitor(self, callback); },
                        scenario,
                        world
                    );
                    self.broadcastEventAroundUserFunction(
                        event,
                        hookedUpScenarioVisit,
                        callback
                    );
                });
            },

            visitStep: function visitStep(step, callback) {
                var payload = { step: step };
                var event   = AstTreeWalker.Event(AstTreeWalker.STEP_EVENT_NAME, payload);
                self.broadcastEventAroundUserFunction(
                    event,
                    function(callback) {
                        self.processStep(step, callback);
                    },
                    callback
                );
            },

            visitStepResult: function visitStepResult(stepResult, callback) {
                if (stepResult.isFailed())
                    self.witnessFailedStep();
                else if (stepResult.isPending())
                    self.witnessPendingStep();
                var payload = { stepResult: stepResult };
                var event   = AstTreeWalker.Event(AstTreeWalker.STEP_RESULT_EVENT_NAME, payload);
                self.broadcastEvent(event, callback);
            },

            broadcastEventAroundUserFunction: function broadcastEventAroundUserFunction(event, userFunction, callback) {
                var userFunctionWrapper = self.wrapUserFunctionAndAfterEventBroadcast(userFunction, event, callback);
                self.broadcastBeforeEvent(event, userFunctionWrapper);
            },

            wrapUserFunctionAndAfterEventBroadcast: function wrapUserFunctionAndAfterEventBroadcast(userFunction, event, callback) {
                var callAfterEventBroadcast = self.wrapAfterEventBroadcast(event, callback);
                return function callUserFunctionAndBroadcastAfterEvent() {
                    userFunction(callAfterEventBroadcast);
                };
            },

            wrapAfterEventBroadcast: function wrapAfterEventBroadcast(event, callback) {
                return function() { self.broadcastAfterEvent(event, callback); };
            },

            broadcastBeforeEvent: function broadcastBeforeEvent(event, callback) {
                var preEvent = event.replicateAsPreEvent();
                self.broadcastEvent(preEvent, callback);
            },

            broadcastAfterEvent: function broadcastAfterEvent(event, callback) {
                var postEvent = event.replicateAsPostEvent();
                self.broadcastEvent(postEvent, callback);
            },

            broadcastEvent: function broadcastEvent(event, callback) {
                listeners.forEach(
                    function(listener, callback) { listener.hear(event, callback); },
                    callback
                );
            },

            lookupStepDefinitionByName: function lookupStepDefinitionByName(stepName) {
                return supportCodeLibrary.lookupStepDefinitionByName(stepName);
            },

            setWorld: function setWorld(newWorld) {
                world = newWorld;
            },

            getWorld: function getWorld() {
                return world;
            },

            isStepUndefined: function isStepUndefined(step) {
                var stepName = step.getName();
                return !supportCodeLibrary.isStepDefinitionNameDefined(stepName);
            },

            didAllFeaturesSucceed: function didAllFeaturesSucceed() {
                return allFeaturesSucceded;
            },

            witnessFailedStep: function witnessFailedStep() {
                allFeaturesSucceded = false;
                skippingSteps       = true;
            },

            witnessPendingStep: function witnessPendingStep() {
                skippingSteps = true;
            },

            witnessUndefinedStep: function witnessUndefinedStep() {
                skippingSteps = true;
            },

            witnessNewScenario: function witnessNewScenario() {
                skippingSteps = false;
            },

            isSkippingSteps: function isSkippingSteps() {
                return skippingSteps;
            },

            processStep: function processStep(step, callback) {
                if (self.isStepUndefined(step)) {
                    self.witnessUndefinedStep();
                    self.skipUndefinedStep(step, callback);
                } else if (self.isSkippingSteps()) {
                    self.skipStep(step, callback);
                } else {
                    self.executeStep(step, callback);
                }
            },

            executeStep: function executeStep(step, callback) {
                step.acceptVisitor(self, callback);
            },

            skipStep: function skipStep(step, callback) {
                var skippedStepResult = Cucumber.Runtime.SkippedStepResult({step: step});
                var payload           = { stepResult: skippedStepResult };
                var event             = AstTreeWalker.Event(AstTreeWalker.STEP_RESULT_EVENT_NAME, payload);
                self.broadcastEvent(event, callback);
            },

            skipUndefinedStep: function skipUndefinedStep(step, callback) {
                var undefinedStepResult = Cucumber.Runtime.UndefinedStepResult({step: step});
                var payload = { stepResult: undefinedStepResult };
                var event   = AstTreeWalker.Event(AstTreeWalker.STEP_RESULT_EVENT_NAME, payload);
                self.broadcastEvent(event, callback);
            }
        };
        return self;
    };
        AstTreeWalker.FEATURES_EVENT_NAME                 = 'Features';
        AstTreeWalker.FEATURE_EVENT_NAME                  = 'Feature';
        AstTreeWalker.BACKGROUND_EVENT_NAME               = 'Background';
        AstTreeWalker.SCENARIO_EVENT_NAME                 = 'Scenario';
        AstTreeWalker.STEP_EVENT_NAME                     = 'Step';
        AstTreeWalker.STEP_RESULT_EVENT_NAME              = 'StepResult';
        AstTreeWalker.BEFORE_EVENT_NAME_PREFIX            = 'Before';
        AstTreeWalker.AFTER_EVENT_NAME_PREFIX             = 'After';
        AstTreeWalker.NON_EVENT_LEADING_PARAMETERS_COUNT  = 0;
        AstTreeWalker.NON_EVENT_TRAILING_PARAMETERS_COUNT = 2;
        AstTreeWalker.Event                               = require('./ast_tree_walker/event');
        module.exports                                    = AstTreeWalker;

    });

    require.define("/cucumber/runtime/ast_tree_walker/event",function(require,module,exports,__dirname,__filename,process){var Event = function(name, payload) {
        var AstTreeWalker = require('../ast_tree_walker');

        var self = {
            getName: function getName() {
                return name;
            },

            getPayloadItem: function getPayloadItem(itemName) {
                return payload[itemName];
            },

            replicateAsPreEvent: function replicateAsPreEvent() {
                var newName = buildBeforeEventName(name);
                return AstTreeWalker.Event(newName, payload);
            },

            replicateAsPostEvent: function replicateAsPostEvent() {
                var newName = buildAfterEventName(name);
                return AstTreeWalker.Event(newName, payload);
            },

            occurredOn: function occurredOn(eventName) {
                return eventName == name;
            },

            occurredAfter: function occurredAfter(eventName) {
                var afterEventName = buildAfterEventName(eventName);
                return afterEventName == name;
            }
        };

        function buildBeforeEventName(eventName) {
            return AstTreeWalker.BEFORE_EVENT_NAME_PREFIX + eventName;
        }

        function buildAfterEventName(eventName) {
            return AstTreeWalker.AFTER_EVENT_NAME_PREFIX + eventName;
        }

        return self;
    };
        module.exports = Event;

    });

    require.define("/cucumber/runtime/step_result",function(require,module,exports,__dirname,__filename,process){var StepResult = function (payload) {
        var self = {
            isFailed:     function isFailed()     { return false; },
            isPending:    function isPending()    { return false; },
            isSkipped:    function isSkipped()    { return false; },
            isSuccessful: function isSuccessful() { return false; },
            isUndefined:  function isUndefined()  { return false; },

            getStep: function getStep() {
                return payload.step;
            }
        };

        return self;
    };

        module.exports = StepResult;
    });

    require.define("/cucumber/runtime/successful_step_result",function(require,module,exports,__dirname,__filename,process){var SuccessfulStepResult = function(payload) {
        var Cucumber = require('../../cucumber');

        var self = Cucumber.Runtime.StepResult(payload);

        self.isSuccessful = function isSuccessful() { return true; };

        return self;
    };
        module.exports = SuccessfulStepResult;

    });

    require.define("/cucumber/runtime/pending_step_result",function(require,module,exports,__dirname,__filename,process){var PendingStepResult = function(payload) {
        var Cucumber = require('../../cucumber');

        var self = Cucumber.Runtime.StepResult(payload);

        self.isPending = function isPending() { return true; };

        return self;
    };
        module.exports = PendingStepResult;

    });

    require.define("/cucumber/runtime/failed_step_result",function(require,module,exports,__dirname,__filename,process){var FailedStepResult = function(payload) {
        var Cucumber = require('../../cucumber');

        var self = Cucumber.Runtime.StepResult(payload);

        self.isFailed = function isFailed() { return true; };

        self.getFailureException = function getFailureException() {
            return payload.failureException;
        };

        return self;
    };
        module.exports = FailedStepResult;

    });

    require.define("/cucumber/runtime/skipped_step_result",function(require,module,exports,__dirname,__filename,process){var SkippedStepResult = function(payload) {
        var Cucumber = require('../../cucumber');

        var self = Cucumber.Runtime.StepResult(payload);

        self.isSkipped = function isSkipped() { return true; };

        return self;
    };
        module.exports = SkippedStepResult;

    });

    require.define("/cucumber/runtime/undefined_step_result",function(require,module,exports,__dirname,__filename,process){var UndefinedStepResult = function(payload) {
        var Cucumber = require('../../cucumber');

        var self = Cucumber.Runtime.StepResult(payload);

        self.isUndefined = function isUndefined() { return true; };

        return self;
    };
        module.exports = UndefinedStepResult;

    });

    require.define("/cucumber/support_code",function(require,module,exports,__dirname,__filename,process){var SupportCode                          = {};
        SupportCode.Hook                         = require('./support_code/hook');
        SupportCode.Library                      = require('./support_code/library');
        SupportCode.StepDefinition               = require('./support_code/step_definition');
        SupportCode.StepDefinitionSnippetBuilder = require('./support_code/step_definition_snippet_builder');
        SupportCode.WorldConstructor             = require('./support_code/world_constructor');
        module.exports                           = SupportCode;

    });

    require.define("/cucumber/support_code/hook",function(require,module,exports,__dirname,__filename,process){var _ = require('underscore');

        var Hook = function(code, options) {
            var Cucumber = require('../../cucumber');

            var tags = options['tags'] || [];

            var self = {
                invokeBesideScenario: function invokeBesideScenario(scenario, world, callback) {
                    if (self.appliesToScenario(scenario))
                        code.call(world, callback);
                    else
                        callback(function(endPostScenarioAroundHook) { endPostScenarioAroundHook(); });
                },

                appliesToScenario: function appliesToScenario(scenario) {
                    var astFilter = self.getAstFilter();
                    return astFilter.isElementEnrolled(scenario);
                },

                getAstFilter: function getAstFilter() {
                    var tagGroups = Cucumber.TagGroupParser.getTagGroupsFromStrings(tags);
                    var rules = _.map(tagGroups, function(tagGroup) {
                        var rule = Cucumber.Ast.Filter.AnyOfTagsRule(tagGroup);
                        return rule;
                    });
                    var astFilter = Cucumber.Ast.Filter(rules);
                    return astFilter;
                }
            };
            return self;
        };
        module.exports = Hook;

    });

    require.define("/node_modules/underscore/package.json",function(require,module,exports,__dirname,__filename,process){module.exports = {"main":"underscore.js"}
    });

    require.define("/node_modules/underscore/underscore.js",function(require,module,exports,__dirname,__filename,process){//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

        (function() {

            // Baseline setup
            // --------------

            // Establish the root object, `window` in the browser, or `global` on the server.
            var root = this;

            // Save the previous value of the `_` variable.
            var previousUnderscore = root._;

            // Establish the object that gets returned to break out of a loop iteration.
            var breaker = {};

            // Save bytes in the minified (but not gzipped) version:
            var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

            // Create quick reference variables for speed access to core prototypes.
            var slice            = ArrayProto.slice,
                unshift          = ArrayProto.unshift,
                toString         = ObjProto.toString,
                hasOwnProperty   = ObjProto.hasOwnProperty;

            // All **ECMAScript 5** native function implementations that we hope to use
            // are declared here.
            var
                nativeForEach      = ArrayProto.forEach,
                nativeMap          = ArrayProto.map,
                nativeReduce       = ArrayProto.reduce,
                nativeReduceRight  = ArrayProto.reduceRight,
                nativeFilter       = ArrayProto.filter,
                nativeEvery        = ArrayProto.every,
                nativeSome         = ArrayProto.some,
                nativeIndexOf      = ArrayProto.indexOf,
                nativeLastIndexOf  = ArrayProto.lastIndexOf,
                nativeIsArray      = Array.isArray,
                nativeKeys         = Object.keys,
                nativeBind         = FuncProto.bind;

            // Create a safe reference to the Underscore object for use below.
            var _ = function(obj) { return new wrapper(obj); };

            // Export the Underscore object for **Node.js**, with
            // backwards-compatibility for the old `require()` API. If we're in
            // the browser, add `_` as a global object via a string identifier,
            // for Closure Compiler "advanced" mode.
            if (typeof exports !== 'undefined') {
                if (typeof module !== 'undefined' && module.exports) {
                    exports = module.exports = _;
                }
                exports._ = _;
            } else {
                root['_'] = _;
            }

            // Current version.
            _.VERSION = '1.3.3';

            // Collection Functions
            // --------------------

            // The cornerstone, an `each` implementation, aka `forEach`.
            // Handles objects with the built-in `forEach`, arrays, and raw objects.
            // Delegates to **ECMAScript 5**'s native `forEach` if available.
            var each = _.each = _.forEach = function(obj, iterator, context) {
                if (obj == null) return;
                if (nativeForEach && obj.forEach === nativeForEach) {
                    obj.forEach(iterator, context);
                } else if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
                    }
                } else {
                    for (var key in obj) {
                        if (_.has(obj, key)) {
                            if (iterator.call(context, obj[key], key, obj) === breaker) return;
                        }
                    }
                }
            };

            // Return the results of applying the iterator to each element.
            // Delegates to **ECMAScript 5**'s native `map` if available.
            _.map = _.collect = function(obj, iterator, context) {
                var results = [];
                if (obj == null) return results;
                if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
                each(obj, function(value, index, list) {
                    results[results.length] = iterator.call(context, value, index, list);
                });
                if (obj.length === +obj.length) results.length = obj.length;
                return results;
            };

            // **Reduce** builds up a single result from a list of values, aka `inject`,
            // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
            _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (obj == null) obj = [];
                if (nativeReduce && obj.reduce === nativeReduce) {
                    if (context) iterator = _.bind(iterator, context);
                    return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                }
                each(obj, function(value, index, list) {
                    if (!initial) {
                        memo = value;
                        initial = true;
                    } else {
                        memo = iterator.call(context, memo, value, index, list);
                    }
                });
                if (!initial) throw new TypeError('Reduce of empty array with no initial value');
                return memo;
            };

            // The right-associative version of reduce, also known as `foldr`.
            // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
            _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (obj == null) obj = [];
                if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
                    if (context) iterator = _.bind(iterator, context);
                    return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                }
                var reversed = _.toArray(obj).reverse();
                if (context && !initial) iterator = _.bind(iterator, context);
                return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
            };

            // Return the first value which passes a truth test. Aliased as `detect`.
            _.find = _.detect = function(obj, iterator, context) {
                var result;
                any(obj, function(value, index, list) {
                    if (iterator.call(context, value, index, list)) {
                        result = value;
                        return true;
                    }
                });
                return result;
            };

            // Return all the elements that pass a truth test.
            // Delegates to **ECMAScript 5**'s native `filter` if available.
            // Aliased as `select`.
            _.filter = _.select = function(obj, iterator, context) {
                var results = [];
                if (obj == null) return results;
                if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
                each(obj, function(value, index, list) {
                    if (iterator.call(context, value, index, list)) results[results.length] = value;
                });
                return results;
            };

            // Return all the elements for which a truth test fails.
            _.reject = function(obj, iterator, context) {
                var results = [];
                if (obj == null) return results;
                each(obj, function(value, index, list) {
                    if (!iterator.call(context, value, index, list)) results[results.length] = value;
                });
                return results;
            };

            // Determine whether all of the elements match a truth test.
            // Delegates to **ECMAScript 5**'s native `every` if available.
            // Aliased as `all`.
            _.every = _.all = function(obj, iterator, context) {
                var result = true;
                if (obj == null) return result;
                if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
                each(obj, function(value, index, list) {
                    if (!(result = result && iterator.call(context, value, index, list))) return breaker;
                });
                return !!result;
            };

            // Determine if at least one element in the object matches a truth test.
            // Delegates to **ECMAScript 5**'s native `some` if available.
            // Aliased as `any`.
            var any = _.some = _.any = function(obj, iterator, context) {
                iterator || (iterator = _.identity);
                var result = false;
                if (obj == null) return result;
                if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
                each(obj, function(value, index, list) {
                    if (result || (result = iterator.call(context, value, index, list))) return breaker;
                });
                return !!result;
            };

            // Determine if a given value is included in the array or object using `===`.
            // Aliased as `contains`.
            _.include = _.contains = function(obj, target) {
                var found = false;
                if (obj == null) return found;
                if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
                found = any(obj, function(value) {
                    return value === target;
                });
                return found;
            };

            // Invoke a method (with arguments) on every item in a collection.
            _.invoke = function(obj, method) {
                var args = slice.call(arguments, 2);
                return _.map(obj, function(value) {
                    return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
                });
            };

            // Convenience version of a common use case of `map`: fetching a property.
            _.pluck = function(obj, key) {
                return _.map(obj, function(value){ return value[key]; });
            };

            // Return the maximum element or (element-based computation).
            _.max = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
                if (!iterator && _.isEmpty(obj)) return -Infinity;
                var result = {computed : -Infinity};
                each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed >= result.computed && (result = {value : value, computed : computed});
                });
                return result.value;
            };

            // Return the minimum element (or element-based computation).
            _.min = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
                if (!iterator && _.isEmpty(obj)) return Infinity;
                var result = {computed : Infinity};
                each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed < result.computed && (result = {value : value, computed : computed});
                });
                return result.value;
            };

            // Shuffle an array.
            _.shuffle = function(obj) {
                var shuffled = [], rand;
                each(obj, function(value, index, list) {
                    rand = Math.floor(Math.random() * (index + 1));
                    shuffled[index] = shuffled[rand];
                    shuffled[rand] = value;
                });
                return shuffled;
            };

            // Sort the object's values by a criterion produced by an iterator.
            _.sortBy = function(obj, val, context) {
                var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
                return _.pluck(_.map(obj, function(value, index, list) {
                    return {
                        value : value,
                        criteria : iterator.call(context, value, index, list)
                    };
                }).sort(function(left, right) {
                    var a = left.criteria, b = right.criteria;
                    if (a === void 0) return 1;
                    if (b === void 0) return -1;
                    return a < b ? -1 : a > b ? 1 : 0;
                }), 'value');
            };

            // Groups the object's values by a criterion. Pass either a string attribute
            // to group by, or a function that returns the criterion.
            _.groupBy = function(obj, val) {
                var result = {};
                var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
                each(obj, function(value, index) {
                    var key = iterator(value, index);
                    (result[key] || (result[key] = [])).push(value);
                });
                return result;
            };

            // Use a comparator function to figure out at what index an object should
            // be inserted so as to maintain order. Uses binary search.
            _.sortedIndex = function(array, obj, iterator) {
                iterator || (iterator = _.identity);
                var low = 0, high = array.length;
                while (low < high) {
                    var mid = (low + high) >> 1;
                    iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
                }
                return low;
            };

            // Safely convert anything iterable into a real, live array.
            _.toArray = function(obj) {
                if (!obj)                                     return [];
                if (_.isArray(obj))                           return slice.call(obj);
                if (_.isArguments(obj))                       return slice.call(obj);
                if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
                return _.values(obj);
            };

            // Return the number of elements in an object.
            _.size = function(obj) {
                return _.isArray(obj) ? obj.length : _.keys(obj).length;
            };

            // Array Functions
            // ---------------

            // Get the first element of an array. Passing **n** will return the first N
            // values in the array. Aliased as `head` and `take`. The **guard** check
            // allows it to work with `_.map`.
            _.first = _.head = _.take = function(array, n, guard) {
                return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
            };

            // Returns everything but the last entry of the array. Especcialy useful on
            // the arguments object. Passing **n** will return all the values in
            // the array, excluding the last N. The **guard** check allows it to work with
            // `_.map`.
            _.initial = function(array, n, guard) {
                return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
            };

            // Get the last element of an array. Passing **n** will return the last N
            // values in the array. The **guard** check allows it to work with `_.map`.
            _.last = function(array, n, guard) {
                if ((n != null) && !guard) {
                    return slice.call(array, Math.max(array.length - n, 0));
                } else {
                    return array[array.length - 1];
                }
            };

            // Returns everything but the first entry of the array. Aliased as `tail`.
            // Especially useful on the arguments object. Passing an **index** will return
            // the rest of the values in the array from that index onward. The **guard**
            // check allows it to work with `_.map`.
            _.rest = _.tail = function(array, index, guard) {
                return slice.call(array, (index == null) || guard ? 1 : index);
            };

            // Trim out all falsy values from an array.
            _.compact = function(array) {
                return _.filter(array, function(value){ return !!value; });
            };

            // Return a completely flattened version of an array.
            _.flatten = function(array, shallow) {
                return _.reduce(array, function(memo, value) {
                    if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
                    memo[memo.length] = value;
                    return memo;
                }, []);
            };

            // Return a version of the array that does not contain the specified value(s).
            _.without = function(array) {
                return _.difference(array, slice.call(arguments, 1));
            };

            // Produce a duplicate-free version of the array. If the array has already
            // been sorted, you have the option of using a faster algorithm.
            // Aliased as `unique`.
            _.uniq = _.unique = function(array, isSorted, iterator) {
                var initial = iterator ? _.map(array, iterator) : array;
                var results = [];
                // The `isSorted` flag is irrelevant if the array only contains two elements.
                if (array.length < 3) isSorted = true;
                _.reduce(initial, function (memo, value, index) {
                    if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
                        memo.push(value);
                        results.push(array[index]);
                    }
                    return memo;
                }, []);
                return results;
            };

            // Produce an array that contains the union: each distinct element from all of
            // the passed-in arrays.
            _.union = function() {
                return _.uniq(_.flatten(arguments, true));
            };

            // Produce an array that contains every item shared between all the
            // passed-in arrays. (Aliased as "intersect" for back-compat.)
            _.intersection = _.intersect = function(array) {
                var rest = slice.call(arguments, 1);
                return _.filter(_.uniq(array), function(item) {
                    return _.every(rest, function(other) {
                        return _.indexOf(other, item) >= 0;
                    });
                });
            };

            // Take the difference between one array and a number of other arrays.
            // Only the elements present in just the first array will remain.
            _.difference = function(array) {
                var rest = _.flatten(slice.call(arguments, 1), true);
                return _.filter(array, function(value){ return !_.include(rest, value); });
            };

            // Zip together multiple lists into a single array -- elements that share
            // an index go together.
            _.zip = function() {
                var args = slice.call(arguments);
                var length = _.max(_.pluck(args, 'length'));
                var results = new Array(length);
                for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
                return results;
            };

            // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
            // we need this function. Return the position of the first occurrence of an
            // item in an array, or -1 if the item is not included in the array.
            // Delegates to **ECMAScript 5**'s native `indexOf` if available.
            // If the array is large and already in sort order, pass `true`
            // for **isSorted** to use binary search.
            _.indexOf = function(array, item, isSorted) {
                if (array == null) return -1;
                var i, l;
                if (isSorted) {
                    i = _.sortedIndex(array, item);
                    return array[i] === item ? i : -1;
                }
                if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
                for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
                return -1;
            };

            // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
            _.lastIndexOf = function(array, item) {
                if (array == null) return -1;
                if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
                var i = array.length;
                while (i--) if (i in array && array[i] === item) return i;
                return -1;
            };

            // Generate an integer Array containing an arithmetic progression. A port of
            // the native Python `range()` function. See
            // [the Python documentation](http://docs.python.org/library/functions.html#range).
            _.range = function(start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = arguments[2] || 1;

                var len = Math.max(Math.ceil((stop - start) / step), 0);
                var idx = 0;
                var range = new Array(len);

                while(idx < len) {
                    range[idx++] = start;
                    start += step;
                }

                return range;
            };

            // Function (ahem) Functions
            // ------------------

            // Reusable constructor function for prototype setting.
            var ctor = function(){};

            // Create a function bound to a given object (assigning `this`, and arguments,
            // optionally). Binding with arguments is also known as `curry`.
            // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
            // We check for `func.bind` first, to fail fast when `func` is undefined.
            _.bind = function bind(func, context) {
                var bound, args;
                if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError;
                args = slice.call(arguments, 2);
                return bound = function() {
                    if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                    ctor.prototype = func.prototype;
                    var self = new ctor;
                    var result = func.apply(self, args.concat(slice.call(arguments)));
                    if (Object(result) === result) return result;
                    return self;
                };
            };

            // Bind all of an object's methods to that object. Useful for ensuring that
            // all callbacks defined on an object belong to it.
            _.bindAll = function(obj) {
                var funcs = slice.call(arguments, 1);
                if (funcs.length == 0) funcs = _.functions(obj);
                each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
                return obj;
            };

            // Memoize an expensive function by storing its results.
            _.memoize = function(func, hasher) {
                var memo = {};
                hasher || (hasher = _.identity);
                return function() {
                    var key = hasher.apply(this, arguments);
                    return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
                };
            };

            // Delays a function for the given number of milliseconds, and then calls
            // it with the arguments supplied.
            _.delay = function(func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function(){ return func.apply(null, args); }, wait);
            };

            // Defers a function, scheduling it to run after the current call stack has
            // cleared.
            _.defer = function(func) {
                return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
            };

            // Returns a function, that, when invoked, will only be triggered at most once
            // during a given window of time.
            _.throttle = function(func, wait) {
                var context, args, timeout, throttling, more, result;
                var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
                return function() {
                    context = this; args = arguments;
                    var later = function() {
                        timeout = null;
                        if (more) func.apply(context, args);
                        whenDone();
                    };
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (throttling) {
                        more = true;
                    } else {
                        result = func.apply(context, args);
                    }
                    whenDone();
                    throttling = true;
                    return result;
                };
            };

            // Returns a function, that, as long as it continues to be invoked, will not
            // be triggered. The function will be called after it stops being called for
            // N milliseconds. If `immediate` is passed, trigger the function on the
            // leading edge, instead of the trailing.
            _.debounce = function(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    if (immediate && !timeout) func.apply(context, args);
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };

            // Returns a function that will be executed at most one time, no matter how
            // often you call it. Useful for lazy initialization.
            _.once = function(func) {
                var ran = false, memo;
                return function() {
                    if (ran) return memo;
                    ran = true;
                    return memo = func.apply(this, arguments);
                };
            };

            // Returns the first function passed as an argument to the second,
            // allowing you to adjust arguments, run code before and after, and
            // conditionally execute the original function.
            _.wrap = function(func, wrapper) {
                return function() {
                    var args = [func].concat(slice.call(arguments, 0));
                    return wrapper.apply(this, args);
                };
            };

            // Returns a function that is the composition of a list of functions, each
            // consuming the return value of the function that follows.
            _.compose = function() {
                var funcs = arguments;
                return function() {
                    var args = arguments;
                    for (var i = funcs.length - 1; i >= 0; i--) {
                        args = [funcs[i].apply(this, args)];
                    }
                    return args[0];
                };
            };

            // Returns a function that will only be executed after being called N times.
            _.after = function(times, func) {
                if (times <= 0) return func();
                return function() {
                    if (--times < 1) { return func.apply(this, arguments); }
                };
            };

            // Object Functions
            // ----------------

            // Retrieve the names of an object's properties.
            // Delegates to **ECMAScript 5**'s native `Object.keys`
            _.keys = nativeKeys || function(obj) {
                if (obj !== Object(obj)) throw new TypeError('Invalid object');
                var keys = [];
                for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
                return keys;
            };

            // Retrieve the values of an object's properties.
            _.values = function(obj) {
                return _.map(obj, _.identity);
            };

            // Return a sorted list of the function names available on the object.
            // Aliased as `methods`
            _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj) {
                    if (_.isFunction(obj[key])) names.push(key);
                }
                return names.sort();
            };

            // Extend a given object with all the properties in passed-in object(s).
            _.extend = function(obj) {
                each(slice.call(arguments, 1), function(source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                });
                return obj;
            };

            // Return a copy of the object only containing the whitelisted properties.
            _.pick = function(obj) {
                var result = {};
                each(_.flatten(slice.call(arguments, 1)), function(key) {
                    if (key in obj) result[key] = obj[key];
                });
                return result;
            };

            // Fill in a given object with default properties.
            _.defaults = function(obj) {
                each(slice.call(arguments, 1), function(source) {
                    for (var prop in source) {
                        if (obj[prop] == null) obj[prop] = source[prop];
                    }
                });
                return obj;
            };

            // Create a (shallow-cloned) duplicate of an object.
            _.clone = function(obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
            };

            // Invokes interceptor with the obj, and then returns obj.
            // The primary purpose of this method is to "tap into" a method chain, in
            // order to perform operations on intermediate results within the chain.
            _.tap = function(obj, interceptor) {
                interceptor(obj);
                return obj;
            };

            // Internal recursive comparison function.
            function eq(a, b, stack) {
                // Identical objects are equal. `0 === -0`, but they aren't identical.
                // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
                if (a === b) return a !== 0 || 1 / a == 1 / b;
                // A strict comparison is necessary because `null == undefined`.
                if (a == null || b == null) return a === b;
                // Unwrap any wrapped objects.
                if (a._chain) a = a._wrapped;
                if (b._chain) b = b._wrapped;
                // Invoke a custom `isEqual` method if one is provided.
                if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
                if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
                // Compare `[[Class]]` names.
                var className = toString.call(a);
                if (className != toString.call(b)) return false;
                switch (className) {
                    // Strings, numbers, dates, and booleans are compared by value.
                    case '[object String]':
                        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                        // equivalent to `new String("5")`.
                        return a == String(b);
                    case '[object Number]':
                        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                        // other numeric values.
                        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                    case '[object Date]':
                    case '[object Boolean]':
                        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                        // millisecond representations. Note that invalid dates with millisecond representations
                        // of `NaN` are not equivalent.
                        return +a == +b;
                    // RegExps are compared by their source patterns and flags.
                    case '[object RegExp]':
                        return a.source == b.source &&
                            a.global == b.global &&
                            a.multiline == b.multiline &&
                            a.ignoreCase == b.ignoreCase;
                }
                if (typeof a != 'object' || typeof b != 'object') return false;
                // Assume equality for cyclic structures. The algorithm for detecting cyclic
                // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
                var length = stack.length;
                while (length--) {
                    // Linear search. Performance is inversely proportional to the number of
                    // unique nested structures.
                    if (stack[length] == a) return true;
                }
                // Add the first object to the stack of traversed objects.
                stack.push(a);
                var size = 0, result = true;
                // Recursively compare objects and arrays.
                if (className == '[object Array]') {
                    // Compare array lengths to determine if a deep comparison is necessary.
                    size = a.length;
                    result = size == b.length;
                    if (result) {
                        // Deep compare the contents, ignoring non-numeric properties.
                        while (size--) {
                            // Ensure commutative equality for sparse arrays.
                            if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
                        }
                    }
                } else {
                    // Objects with different constructors are not equivalent.
                    if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
                    // Deep compare objects.
                    for (var key in a) {
                        if (_.has(a, key)) {
                            // Count the expected number of properties.
                            size++;
                            // Deep compare each member.
                            if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
                        }
                    }
                    // Ensure that both objects contain the same number of properties.
                    if (result) {
                        for (key in b) {
                            if (_.has(b, key) && !(size--)) break;
                        }
                        result = !size;
                    }
                }
                // Remove the first object from the stack of traversed objects.
                stack.pop();
                return result;
            }

            // Perform a deep comparison to check if two objects are equal.
            _.isEqual = function(a, b) {
                return eq(a, b, []);
            };

            // Is a given array, string, or object empty?
            // An "empty" object has no enumerable own-properties.
            _.isEmpty = function(obj) {
                if (obj == null) return true;
                if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
                for (var key in obj) if (_.has(obj, key)) return false;
                return true;
            };

            // Is a given value a DOM element?
            _.isElement = function(obj) {
                return !!(obj && obj.nodeType == 1);
            };

            // Is a given value an array?
            // Delegates to ECMA5's native Array.isArray
            _.isArray = nativeIsArray || function(obj) {
                return toString.call(obj) == '[object Array]';
            };

            // Is a given variable an object?
            _.isObject = function(obj) {
                return obj === Object(obj);
            };

            // Is a given variable an arguments object?
            _.isArguments = function(obj) {
                return toString.call(obj) == '[object Arguments]';
            };
            if (!_.isArguments(arguments)) {
                _.isArguments = function(obj) {
                    return !!(obj && _.has(obj, 'callee'));
                };
            }

            // Is a given value a function?
            _.isFunction = function(obj) {
                return toString.call(obj) == '[object Function]';
            };

            // Is a given value a string?
            _.isString = function(obj) {
                return toString.call(obj) == '[object String]';
            };

            // Is a given value a number?
            _.isNumber = function(obj) {
                return toString.call(obj) == '[object Number]';
            };

            // Is a given object a finite number?
            _.isFinite = function(obj) {
                return _.isNumber(obj) && isFinite(obj);
            };

            // Is the given value `NaN`?
            _.isNaN = function(obj) {
                // `NaN` is the only value for which `===` is not reflexive.
                return obj !== obj;
            };

            // Is a given value a boolean?
            _.isBoolean = function(obj) {
                return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
            };

            // Is a given value a date?
            _.isDate = function(obj) {
                return toString.call(obj) == '[object Date]';
            };

            // Is the given value a regular expression?
            _.isRegExp = function(obj) {
                return toString.call(obj) == '[object RegExp]';
            };

            // Is a given value equal to null?
            _.isNull = function(obj) {
                return obj === null;
            };

            // Is a given variable undefined?
            _.isUndefined = function(obj) {
                return obj === void 0;
            };

            // Has own property?
            _.has = function(obj, key) {
                return hasOwnProperty.call(obj, key);
            };

            // Utility Functions
            // -----------------

            // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
            // previous owner. Returns a reference to the Underscore object.
            _.noConflict = function() {
                root._ = previousUnderscore;
                return this;
            };

            // Keep the identity function around for default iterators.
            _.identity = function(value) {
                return value;
            };

            // Run a function **n** times.
            _.times = function (n, iterator, context) {
                for (var i = 0; i < n; i++) iterator.call(context, i);
            };

            // Escape a string for HTML interpolation.
            _.escape = function(string) {
                return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
            };

            // If the value of the named property is a function then invoke it;
            // otherwise, return it.
            _.result = function(object, property) {
                if (object == null) return null;
                var value = object[property];
                return _.isFunction(value) ? value.call(object) : value;
            };

            // Add your own custom functions to the Underscore object, ensuring that
            // they're correctly added to the OOP wrapper as well.
            _.mixin = function(obj) {
                each(_.functions(obj), function(name){
                    addToWrapper(name, _[name] = obj[name]);
                });
            };

            // Generate a unique integer id (unique within the entire client session).
            // Useful for temporary DOM ids.
            var idCounter = 0;
            _.uniqueId = function(prefix) {
                var id = idCounter++;
                return prefix ? prefix + id : id;
            };

            // By default, Underscore uses ERB-style template delimiters, change the
            // following template settings to use alternative delimiters.
            _.templateSettings = {
                evaluate    : /<%([\s\S]+?)%>/g,
                interpolate : /<%=([\s\S]+?)%>/g,
                escape      : /<%-([\s\S]+?)%>/g
            };

            // When customizing `templateSettings`, if you don't want to define an
            // interpolation, evaluation or escaping regex, we need one that is
            // guaranteed not to match.
            var noMatch = /.^/;

            // Certain characters need to be escaped so that they can be put into a
            // string literal.
            var escapes = {
                '\\': '\\',
                "'": "'",
                'r': '\r',
                'n': '\n',
                't': '\t',
                'u2028': '\u2028',
                'u2029': '\u2029'
            };

            for (var p in escapes) escapes[escapes[p]] = p;
            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

            // Within an interpolation, evaluation, or escaping, remove HTML escaping
            // that had been previously added.
            var unescape = function(code) {
                return code.replace(unescaper, function(match, escape) {
                    return escapes[escape];
                });
            };

            // JavaScript micro-templating, similar to John Resig's implementation.
            // Underscore templating handles arbitrary delimiters, preserves whitespace,
            // and correctly escapes quotes within interpolated code.
            _.template = function(text, data, settings) {
                settings = _.defaults(settings || {}, _.templateSettings);

                // Compile the template source, taking care to escape characters that
                // cannot be included in a string literal and then unescape them in code
                // blocks.
                var source = "__p+='" + text
                    .replace(escaper, function(match) {
                        return '\\' + escapes[match];
                    })
                    .replace(settings.escape || noMatch, function(match, code) {
                        return "'+\n_.escape(" + unescape(code) + ")+\n'";
                    })
                    .replace(settings.interpolate || noMatch, function(match, code) {
                        return "'+\n(" + unescape(code) + ")+\n'";
                    })
                    .replace(settings.evaluate || noMatch, function(match, code) {
                        return "';\n" + unescape(code) + "\n;__p+='";
                    }) + "';\n";

                // If a variable is not specified, place data values in local scope.
                if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

                source = "var __p='';" +
                    "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
                    source + "return __p;\n";

                var render = new Function(settings.variable || 'obj', '_', source);
                if (data) return render(data, _);
                var template = function(data) {
                    return render.call(this, data, _);
                };

                // Provide the compiled function source as a convenience for build time
                // precompilation.
                template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
                    source + '}';

                return template;
            };

            // Add a "chain" function, which will delegate to the wrapper.
            _.chain = function(obj) {
                return _(obj).chain();
            };

            // The OOP Wrapper
            // ---------------

            // If Underscore is called as a function, it returns a wrapped object that
            // can be used OO-style. This wrapper holds altered versions of all the
            // underscore functions. Wrapped objects may be chained.
            var wrapper = function(obj) { this._wrapped = obj; };

            // Expose `wrapper.prototype` as `_.prototype`
            _.prototype = wrapper.prototype;

            // Helper function to continue chaining intermediate results.
            var result = function(obj, chain) {
                return chain ? _(obj).chain() : obj;
            };

            // A method to easily add functions to the OOP wrapper.
            var addToWrapper = function(name, func) {
                wrapper.prototype[name] = function() {
                    var args = slice.call(arguments);
                    unshift.call(args, this._wrapped);
                    return result(func.apply(_, args), this._chain);
                };
            };

            // Add all of the Underscore functions to the wrapper object.
            _.mixin(_);

            // Add all mutator Array functions to the wrapper.
            each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
                var method = ArrayProto[name];
                wrapper.prototype[name] = function() {
                    var wrapped = this._wrapped;
                    method.apply(wrapped, arguments);
                    var length = wrapped.length;
                    if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
                    return result(wrapped, this._chain);
                };
            });

            // Add all accessor Array functions to the wrapper.
            each(['concat', 'join', 'slice'], function(name) {
                var method = ArrayProto[name];
                wrapper.prototype[name] = function() {
                    return result(method.apply(this._wrapped, arguments), this._chain);
                };
            });

            // Start chaining a wrapped Underscore object.
            wrapper.prototype.chain = function() {
                this._chain = true;
                return this;
            };

            // Extracts the result from a wrapped and chained object.
            wrapper.prototype.value = function() {
                return this._wrapped;
            };

        }).call(this);

    });

    require.define("/cucumber/support_code/library",function(require,module,exports,__dirname,__filename,process){var Library = function(supportCodeDefinition) {
        var Cucumber = require('../../cucumber');

        var stepDefinitions  = Cucumber.Type.Collection();
        var hooker           = Cucumber.SupportCode.Library.Hooker();
        var worldConstructor = Cucumber.SupportCode.WorldConstructor();

        var self = {
            lookupStepDefinitionByName: function lookupStepDefinitionByName(name) {
                var matchingStepDefinition;

                stepDefinitions.syncForEach(function(stepDefinition) {
                    if (stepDefinition.matchesStepName(name)) {
                        matchingStepDefinition = stepDefinition;
                    }
                });
                return matchingStepDefinition;
            },

            isStepDefinitionNameDefined: function isStepDefinitionNameDefined(name) {
                var stepDefinition = self.lookupStepDefinitionByName(name);
                return (stepDefinition != undefined);
            },

            hookUpFunction: function hookUpFunction(userFunction, scenario, world) {
                var hookedUpFunction = hooker.hookUpFunction(userFunction, scenario, world);
                return hookedUpFunction;
            },

            defineAroundHook: function defineAroundHook() {
                var tagGroupStrings = Cucumber.Util.Arguments(arguments);
                var code            = tagGroupStrings.pop();
                hooker.addAroundHookCode(code, {tags: tagGroupStrings});
            },

            defineBeforeHook: function defineBeforeHook() {
                var tagGroupStrings = Cucumber.Util.Arguments(arguments);
                var code            = tagGroupStrings.pop();
                hooker.addBeforeHookCode(code, {tags: tagGroupStrings});
            },

            defineAfterHook: function defineAfterHook() {
                var tagGroupStrings = Cucumber.Util.Arguments(arguments);
                var code            = tagGroupStrings.pop();
                hooker.addAfterHookCode(code, {tags: tagGroupStrings});
            },

            defineStep: function defineStep(name, code) {
                var stepDefinition = Cucumber.SupportCode.StepDefinition(name, code);
                stepDefinitions.add(stepDefinition);
            },

            instantiateNewWorld: function instantiateNewWorld(callback) {
                var world = new worldConstructor(function(explicitWorld) {
                    process.nextTick(function() { // release the constructor
                        callback(explicitWorld || world);
                    });
                });
            }
        };

        var supportCodeHelper = {
            Around     : self.defineAroundHook,
            Before     : self.defineBeforeHook,
            After      : self.defineAfterHook,
            Given      : self.defineStep,
            When       : self.defineStep,
            Then       : self.defineStep,
            defineStep : self.defineStep,
            World      : worldConstructor
        };
        supportCodeDefinition.call(supportCodeHelper);
        worldConstructor = supportCodeHelper.World;

        return self;
    };
        Library.Hooker = require('./library/hooker');
        module.exports = Library;

    });

    require.define("/cucumber/support_code/library/hooker",function(require,module,exports,__dirname,__filename,process){var Hooker = function() {
        var Cucumber = require('../../../cucumber');

        var aroundHooks = Cucumber.Type.Collection();
        var beforeHooks = Cucumber.Type.Collection();
        var afterHooks  = Cucumber.Type.Collection();

        var self = {
            addAroundHookCode: function addAroundHookCode(code, options) {
                var aroundHook = Cucumber.SupportCode.Hook(code, options);
                aroundHooks.add(aroundHook);
            },

            addBeforeHookCode: function addBeforeHookCode(code, options) {
                var beforeHook = Cucumber.SupportCode.Hook(code, options);
                beforeHooks.add(beforeHook);
            },

            addAfterHookCode: function addAfterHookCode(code, options) {
                var afterHook = Cucumber.SupportCode.Hook(code, options);
                afterHooks.unshift(afterHook);
            },

            hookUpFunction: function hookUpFunction(userFunction, scenario, world) {
                var hookedUpFunction = function(callback) {
                    var postScenarioAroundHookCallbacks = Cucumber.Type.Collection();
                    aroundHooks.forEach(callPreScenarioAroundHook, callBeforeHooks);

                    function callPreScenarioAroundHook(aroundHook, preScenarioAroundHookCallback) {
                        aroundHook.invokeBesideScenario(scenario, world, function(postScenarioAroundHookCallback) {
                            postScenarioAroundHookCallbacks.unshift(postScenarioAroundHookCallback);
                            preScenarioAroundHookCallback();
                        });
                    }

                    function callBeforeHooks() {
                        self.triggerBeforeHooks(scenario, world, callUserFunction);
                    }

                    function callUserFunction() {
                        userFunction(callAfterHooks);
                    }

                    function callAfterHooks() {
                        self.triggerAfterHooks(scenario, world, callPostScenarioAroundHooks);
                    }

                    function callPostScenarioAroundHooks() {
                        postScenarioAroundHookCallbacks.forEach(
                            callPostScenarioAroundHook,
                            callback
                        );
                    }

                    function callPostScenarioAroundHook(postScenarioAroundHookCallback, callback) {
                        postScenarioAroundHookCallback.call(world, callback);
                    }
                };
                return hookedUpFunction;
            },

            triggerBeforeHooks: function triggerBeforeHooks(scenario, world, callback) {
                beforeHooks.forEach(function(beforeHook, callback) {
                    beforeHook.invokeBesideScenario(scenario, world, callback);
                }, callback);
            },

            triggerAfterHooks: function triggerAfterHooks(scenario, world, callback) {
                afterHooks.forEach(function(afterHook, callback) {
                    afterHook.invokeBesideScenario(scenario, world, callback);
                }, callback);
            }
        };
        return self;
    };
        module.exports = Hooker;

    });

    require.define("/cucumber/support_code/step_definition",function(require,module,exports,__dirname,__filename,process){var StepDefinition = function (pattern, code) {
        var Cucumber = require('../../cucumber');

        var self = {
            getPatternRegexp: function getPatternRegexp() {
                var regexp;
                if (pattern.replace) {
                    var regexpString = pattern
                        .replace(StepDefinition.UNSAFE_STRING_CHARACTERS_REGEXP, StepDefinition.PREVIOUS_REGEXP_MATCH)
                        .replace(StepDefinition.QUOTED_DOLLAR_PARAMETER_REGEXP, StepDefinition.QUOTED_DOLLAR_PARAMETER_SUBSTITUTION)
                        .replace(StepDefinition.DOLLAR_PARAMETER_REGEXP, StepDefinition.DOLLAR_PARAMETER_SUBSTITUTION);
                    regexpString =
                        StepDefinition.STRING_PATTERN_REGEXP_PREFIX +
                        regexpString +
                        StepDefinition.STRING_PATTERN_REGEXP_SUFFIX;
                    regexp = RegExp(regexpString);
                }
                else
                    regexp = pattern;
                return regexp;
            },

            matchesStepName: function matchesStepName(stepName) {
                var regexp = self.getPatternRegexp();
                return regexp.test(stepName);
            },

            invoke: function invoke(step, world, callback) {
                var cleanUp = function cleanUp() {
                    Cucumber.Util.Exception.unregisterUncaughtExceptionHandler(handleException);
                };

                var codeCallback = function (error) {
                    if (error) {
                        codeCallback.fail(error);
                    } else {
                        var successfulStepResult = Cucumber.Runtime.SuccessfulStepResult({step: step});
                        cleanUp();
                        callback(successfulStepResult);
                    }
                };

                codeCallback.pending = function pending(reason) {
                    var pendingStepResult = Cucumber.Runtime.PendingStepResult({step: step, pendingReason: reason});
                    cleanUp();
                    callback(pendingStepResult);
                };

                codeCallback.fail = function fail(failureReason) {
                    var failureException = failureReason || new Error(StepDefinition.UNKNOWN_STEP_FAILURE_MESSAGE);
                    var failedStepResult = Cucumber.Runtime.FailedStepResult({step: step, failureException: failureException});
                    cleanUp();
                    callback(failedStepResult);
                };

                var parameters      = self.buildInvocationParameters(step, codeCallback);
                var handleException = self.buildExceptionHandlerToCodeCallback(codeCallback);
                Cucumber.Util.Exception.registerUncaughtExceptionHandler(handleException);

                try {
                    code.apply(world, parameters);
                } catch (exception) {
                    handleException(exception);
                }
            },

            buildInvocationParameters: function buildInvocationParameters(step, callback) {
                var stepName      = step.getName();
                var patternRegexp = self.getPatternRegexp();
                var parameters    = patternRegexp.exec(stepName);
                parameters.shift();
                if (step.hasAttachment()) {
                    var attachmentContents = step.getAttachmentContents();
                    parameters.push(attachmentContents);
                }
                parameters.push(callback);
                return parameters;
            },

            buildExceptionHandlerToCodeCallback: function buildExceptionHandlerToCodeCallback(codeCallback) {
                var exceptionHandler = function handleScenarioException(exception) {
                    if (exception)
                        Cucumber.Debug.warn(exception.stack || exception, 'exception inside feature', 3);
                    codeCallback.fail(exception);
                };
                return exceptionHandler;
            }
        };
        return self;
    };

        StepDefinition.DOLLAR_PARAMETER_REGEXP              = /\$[a-zA-Z_-]+/;
        StepDefinition.DOLLAR_PARAMETER_SUBSTITUTION        = '(.*)';
        StepDefinition.PREVIOUS_REGEXP_MATCH                = "\\$&";
        StepDefinition.QUOTED_DOLLAR_PARAMETER_REGEXP       = /"\$[a-zA-Z_-]+"/;
        StepDefinition.QUOTED_DOLLAR_PARAMETER_SUBSTITUTION = '"([^"]*)"';
        StepDefinition.STRING_PATTERN_REGEXP_PREFIX         = '^';
        StepDefinition.STRING_PATTERN_REGEXP_SUFFIX         = '$';
        StepDefinition.UNSAFE_STRING_CHARACTERS_REGEXP      = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\|]/g;
        StepDefinition.UNKNOWN_STEP_FAILURE_MESSAGE         = "Step failure";

        module.exports = StepDefinition;

    });

    require.define("/cucumber/support_code/step_definition_snippet_builder",function(require,module,exports,__dirname,__filename,process){var _  = require('underscore');

        var StepDefinitionSnippetBuilder = function(step) {
            var Cucumber = require('../../cucumber');

            var self = {
                buildSnippet: function buildSnippet() {
                    var functionName = self.buildStepDefinitionFunctionName();
                    var pattern      = self.buildStepDefinitionPattern();
                    var parameters   = self.buildStepDefinitionParameters();
                    var snippet =
                        StepDefinitionSnippetBuilder.STEP_DEFINITION_START  +
                        functionName                                        +
                        StepDefinitionSnippetBuilder.STEP_DEFINITION_INNER1 +
                        pattern                                             +
                        StepDefinitionSnippetBuilder.STEP_DEFINITION_INNER2 +
                        parameters                                          +
                        StepDefinitionSnippetBuilder.STEP_DEFINITION_END;
                    return snippet;
                },

                buildStepDefinitionFunctionName: function buildStepDefinitionFunctionName() {
                    var functionName;
                    if (step.isOutcomeStep())
                        functionName = StepDefinitionSnippetBuilder.OUTCOME_STEP_DEFINITION_FUNCTION_NAME;
                    else if (step.isEventStep())
                        functionName = StepDefinitionSnippetBuilder.EVENT_STEP_DEFINITION_FUNCTION_NAME;
                    else
                        functionName = StepDefinitionSnippetBuilder.CONTEXT_STEP_DEFINITION_FUNCTION_NAME;
                    return functionName;
                },

                buildStepDefinitionPattern: function buildStepDefinitionPattern() {
                    var stepName              = step.getName();
                    var escapedStepName       = Cucumber.Util.RegExp.escapeString(stepName);
                    var parameterizedStepName = self.parameterizeStepName(escapedStepName);
                    var pattern               =
                        StepDefinitionSnippetBuilder.PATTERN_START +
                        parameterizedStepName                      +
                        StepDefinitionSnippetBuilder.PATTERN_END
                    return pattern;
                },

                buildStepDefinitionParameters: function buildStepDefinitionParameters() {
                    var parameters = self.getStepDefinitionPatternMatchingGroupParameters();
                    if (step.hasDocString())
                        parameters = parameters.concat([StepDefinitionSnippetBuilder.STEP_DEFINITION_DOC_STRING]);
                    else if (step.hasDataTable())
                        parameters = parameters.concat([StepDefinitionSnippetBuilder.STEP_DEFINITION_DATA_TABLE]);
                    var parametersAndCallback =
                        parameters.concat([StepDefinitionSnippetBuilder.STEP_DEFINITION_CALLBACK]);
                    var parameterString = parametersAndCallback.join(StepDefinitionSnippetBuilder.FUNCTION_PARAMETER_SEPARATOR);
                    return parameterString;
                },

                getStepDefinitionPatternMatchingGroupParameters: function getStepDefinitionPatternMatchingGroupParameters() {
                    var parameterCount = self.countStepDefinitionPatternMatchingGroups();
                    var parameters = [];
                    _(parameterCount).times(function(n) {
                        var offset = n + 1;
                        parameters.push('arg' + offset);
                    });
                    return parameters;
                },

                countStepDefinitionPatternMatchingGroups: function countStepDefinitionPatternMatchingGroups() {
                    var stepDefinitionPattern    = self.buildStepDefinitionPattern();
                    var numberMatchingGroupCount =
                        Cucumber.Util.String.count(stepDefinitionPattern, StepDefinitionSnippetBuilder.NUMBER_MATCHING_GROUP);
                    var quotedStringMatchingGroupCount =
                        Cucumber.Util.String.count(stepDefinitionPattern, StepDefinitionSnippetBuilder.QUOTED_STRING_MATCHING_GROUP);
                    var count = numberMatchingGroupCount + quotedStringMatchingGroupCount;
                    return count;
                },

                parameterizeStepName: function parameterizeStepName(stepName) {
                    var parameterizedStepName =
                        stepName
                            .replace(StepDefinitionSnippetBuilder.NUMBER_PATTERN, StepDefinitionSnippetBuilder.NUMBER_MATCHING_GROUP)
                            .replace(StepDefinitionSnippetBuilder.QUOTED_STRING_PATTERN, StepDefinitionSnippetBuilder.QUOTED_STRING_MATCHING_GROUP);
                    return parameterizedStepName;
                }
            };
            return self;
        };

        StepDefinitionSnippetBuilder.STEP_DEFINITION_START                 = 'this.';
        StepDefinitionSnippetBuilder.STEP_DEFINITION_INNER1                = '(';
        StepDefinitionSnippetBuilder.STEP_DEFINITION_INNER2                = ', function(';
        StepDefinitionSnippetBuilder.STEP_DEFINITION_END                   = ") {\n  // express the regexp above with the code you wish you had\n  callback.pending();\n});\n";
        StepDefinitionSnippetBuilder.STEP_DEFINITION_DOC_STRING            = 'string';
        StepDefinitionSnippetBuilder.STEP_DEFINITION_DATA_TABLE            = 'table';
        StepDefinitionSnippetBuilder.STEP_DEFINITION_CALLBACK              = 'callback';
        StepDefinitionSnippetBuilder.PATTERN_START                         = '/^';
        StepDefinitionSnippetBuilder.PATTERN_END                           = '$/';
        StepDefinitionSnippetBuilder.CONTEXT_STEP_DEFINITION_FUNCTION_NAME = 'Given';
        StepDefinitionSnippetBuilder.EVENT_STEP_DEFINITION_FUNCTION_NAME   = 'When';
        StepDefinitionSnippetBuilder.OUTCOME_STEP_DEFINITION_FUNCTION_NAME = 'Then';
        StepDefinitionSnippetBuilder.NUMBER_PATTERN                        = /\d+/gi;
        StepDefinitionSnippetBuilder.NUMBER_MATCHING_GROUP                 = '(\\d+)';
        StepDefinitionSnippetBuilder.QUOTED_STRING_PATTERN                 = /"[^"]*"/gi;
        StepDefinitionSnippetBuilder.QUOTED_STRING_MATCHING_GROUP          = '"([^"]*)"';
        StepDefinitionSnippetBuilder.FUNCTION_PARAMETER_SEPARATOR          = ', ';
        module.exports = StepDefinitionSnippetBuilder;

    });

    require.define("/cucumber/support_code/world_constructor",function(require,module,exports,__dirname,__filename,process){var WorldConstructor = function() {
        return function World(callback) { callback() };
    };
        module.exports = WorldConstructor;

    });

    require.define("/cucumber/tag_group_parser",function(require,module,exports,__dirname,__filename,process){var _ = require('underscore');

        var TagGroupParser = function(tagGroupString) {
            var self = {
                parse: function parse() {
                    var splitTags = tagGroupString.split(TagGroupParser.TAG_SEPARATOR);
                    var trimmedTags = _.map(splitTags, function(tag) { return tag.trim(); });
                    return trimmedTags;
                }
            };
            return self;
        };

        TagGroupParser.getTagGroupsFromStrings = function getTagGroupsFromStrings(tagGroupStrings) {
            var Cucumber = require('../cucumber');

            var tagGroups = _.map(tagGroupStrings, function(tagOptionValue) {
                var tagGroupParser = Cucumber.TagGroupParser(tagOptionValue);
                var tagGroup       = tagGroupParser.parse();
                return tagGroup;
            });
            return tagGroups;
        };

        TagGroupParser.TAG_SEPARATOR = ',';
        module.exports = TagGroupParser;

    });

    require.define("/cucumber/type",function(require,module,exports,__dirname,__filename,process){var Type           = {};
        Type.Collection    = require('./type/collection');
        Type.HashDataTable = require('./type/hash_data_table');
        Type.String        = require('./type/string');
        module.exports     = Type;

    });

    require.define("/cucumber/type/collection",function(require,module,exports,__dirname,__filename,process){var Collection = function() {
        var items = new Array();
        var self = {
            add:         function add(item)                       { items.push(item); },
            unshift:     function unshift(item)                   { items.unshift(item); },
            getLast:     function getLast()                       { return items[items.length-1]; },
            syncForEach: function syncForEach(userFunction)       { items.forEach(userFunction); },
            forEach:     function forEach(userFunction, callback) {
                var itemsCopy = items.slice(0);
                function iterate() {
                    if (itemsCopy.length > 0) {
                        processItem();
                    } else {
                        callback();
                    };
                }
                function processItem() {
                    var item = itemsCopy.shift();
                    userFunction(item, function() {
                        iterate();
                    });
                };
                iterate();
            },
            length: function length() { return items.length; }
        };
        return self;
    };
        module.exports = Collection;

    });

    require.define("/cucumber/type/hash_data_table",function(require,module,exports,__dirname,__filename,process){var HashDataTable = function(rawArray) {
        var self = {
            raw: function raw() {
                var hashKeys        = self.getHashKeys();
                var hashValueArrays = self.getHashValueArrays();
                var hashes          = self.createHashesFromKeysAndValueArrays(hashKeys, hashValueArrays);
                return hashes;
            },

            getHashKeys: function getHashKeys() {
                return rawArray[0];
            },

            getHashValueArrays: function getHashValueArrays() {
                var _rawArray = [].concat(rawArray);
                _rawArray.shift();
                return _rawArray;
            },

            createHashesFromKeysAndValueArrays: function createHashesFromKeysAndValueArrays(keys, valueArrays) {
                var hashes = [];
                valueArrays.forEach(function(values) {
                    var hash = self.createHashFromKeysAndValues(keys, values);
                    hashes.push(hash);
                });
                return hashes;
            },

            createHashFromKeysAndValues: function createHashFromKeysAndValues(keys, values) {
                var hash = {};
                var len  = keys.length;
                for (var i = 0; i < len; i++) {
                    hash[keys[i]] = values[i];
                }
                return hash;
            }
        };
        return self;
    };

        module.exports = HashDataTable;
    });

    require.define("/cucumber/type/string",function(require,module,exports,__dirname,__filename,process){if(!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }
        module.exports = String;

    });

    require.define("/cucumber/util",function(require,module,exports,__dirname,__filename,process){var Util       = {};
        Util.Arguments = require('./util/arguments');
        Util.Exception = require('./util/exception');
        Util.RegExp    = require('./util/reg_exp');
        Util.String    = require('./util/string');
        module.exports = Util;

    });

    require.define("/cucumber/util/arguments",function(require,module,exports,__dirname,__filename,process){var Arguments = function Arguments(argumentsObject) {
        return Array.prototype.slice.call(argumentsObject);
    };
        module.exports = Arguments;
    });

    require.define("/cucumber/util/exception",function(require,module,exports,__dirname,__filename,process){var Exception = {
        registerUncaughtExceptionHandler: function registerUncaughtExceptionHandler(exceptionHandler) {
            if (process.on)
                process.on('uncaughtException', exceptionHandler);
            else
                window.onerror = exceptionHandler;
        },

        unregisterUncaughtExceptionHandler: function unregisterUncaughtExceptionHandler(exceptionHandler) {
            if (process.removeListener)
                process.removeListener('uncaughtException', exceptionHandler);
            else
                window.onerror = void(0);
        }
    };

        module.exports = Exception;

    });

    require.define("/cucumber/util/reg_exp",function(require,module,exports,__dirname,__filename,process){var RegExp = {
        escapeString: function escapeString(string) {
            var escaped = string.replace(RegExp.ESCAPE_PATTERN, RegExp.ESCAPE_REPLACEMENT);
            return escaped;
        }
    };

        RegExp.ESCAPE_PATTERN     = /[-[\]{}()*+?.\\^$|#\n\/]/g;
        RegExp.ESCAPE_REPLACEMENT = "\\$&";
        module.exports = RegExp;

    });

    require.define("/cucumber/util/string",function(require,module,exports,__dirname,__filename,process){var String = {
        count: function count(hayStack, needle) {
            var splitHayStack = hayStack.split(needle);
            return splitHayStack.length - 1;
        }
    };
        module.exports = String;

    });

    require.define("/cucumber/volatile_configuration",function(require,module,exports,__dirname,__filename,process){var VolatileConfiguration = function VolatileConfiguration(features, supportCodeInitializer, options) {
        var Cucumber = require('../cucumber');
        var supportCodeLibrary = Cucumber.SupportCode.Library(supportCodeInitializer);

        options = options || {};
        var tagGroupStrings = options['tags'] || [];

        var self = {
            getFeatureSources: function getFeatureSources() {
                if (features.replace) { // single source
                    var featureNameSourcePair = [VolatileConfiguration.FEATURE_SOURCE_NAME, features];
                    return [featureNameSourcePair];
                } else { // multiple features
                    return features;
                }
            },

            getAstFilter: function getAstFilter() {
                var tagRules = self.getTagAstFilterRules();
                var astFilter = Cucumber.Ast.Filter(tagRules);
                return astFilter;
            },

            getSupportCodeLibrary: function getSupportCodeLibrary() {
                return supportCodeLibrary;
            },

            getTagAstFilterRules: function getTagAstFilterRules() {
                var rules = [];
                tagGroupStrings.forEach(function(tagGroupString) {
                    var rule = self.buildAstFilterRuleFromTagGroupString(tagGroupString);
                    rules.push(rule);
                });
                return rules;
            },

            buildAstFilterRuleFromTagGroupString: function buildAstFilterRuleFromTagGroupString(tagGroupString) {
                var tagGroupParser = Cucumber.TagGroupParser(tagGroupString);
                var tagGroup       = tagGroupParser.parse();
                var rule           = Cucumber.Ast.Filter.AnyOfTagsRule(tagGroup);
                return rule;
            }
        };
        return self;
    };
        VolatileConfiguration.FEATURE_SOURCE_NAME = "(feature)";
        module.exports = VolatileConfiguration;

    });

    require.define("/cucumber/ast/data_table",function(require,module,exports,__dirname,__filename,process){var DataTable  = function() {
        var Cucumber = require('../../cucumber');

        var rowsCollection = Cucumber.Type.Collection();

        var self = {
            attachRow: function attachRow(row) {
                rowsCollection.add(row);
            },

            getContents: function getContents() {
                return self;
            },

            raw: function raw() {
                rawRows = [];
                rowsCollection.syncForEach(function(row) {
                    var rawRow = row.raw();
                    rawRows.push(rawRow);
                });
                return rawRows;
            },

            rows: function rows() {
                rawRows = [];
                rowsCollection.syncForEach(function(row, index) {
                    if (index > 0) {
                        rawRows.push(row.raw());
                    }
                });
                return rawRows;
            },

            hashes: function hashes() {
                var raw              = self.raw();
                var hashDataTable    = Cucumber.Type.HashDataTable(raw);
                var rawHashDataTable = hashDataTable.raw();
                return rawHashDataTable;
            }
        };
        return self;
    };
        DataTable.Row  = require('./data_table/row');
        module.exports = DataTable;

    });

    require.define("/cucumber/ast/data_table/row",function(require,module,exports,__dirname,__filename,process){var Row = function(cells, uri, line) {
        var Cucumber = require('../../../cucumber');

        self = {
            raw: function raw() {
                return cells;
            }
        };
        return self;
    }
        module.exports = Row;

    });

    require.define("/cucumber/ast/doc_string",function(require,module,exports,__dirname,__filename,process){var DocString = function(contentType, contents, uri, line) {
        var self = {
            getContents: function getContents() {
                return contents;
            },

            getContentType: function getContentType() {
                return contentType;
            },

            getUri: function getUri() {
                return uri;
            },

            getLine: function getLine() {
                return line;
            }
        };
        return self;
    };
        module.exports = DocString;

    });

    require.define("/cucumber/ast/feature",function(require,module,exports,__dirname,__filename,process){var Feature = function(keyword, name, description, uri, line) {
        var Cucumber = require('../../cucumber');

        var background;
        var scenarios = Cucumber.Type.Collection();
        var tags      = [];

        var self = {
            getKeyword: function getKeyword() {
                return keyword;
            },

            getName: function getName() {
                return name;
            },

            getDescription: function getDescription() {
                return description;
            },

            getUri: function getUri() {
                return uri;
            },

            getLine: function getLine() {
                return line;
            },

            addBackground: function addBackground(newBackground) {
                background = newBackground;
            },

            getBackground: function getBackground() {
                return background;
            },

            hasBackground: function hasBackground() {
                return (typeof(background) != 'undefined');
            },

            addScenario: function addScenario(scenario) {
                var background = self.getBackground();
                scenario.setBackground(background);
                scenarios.add(scenario);
            },

            getLastScenario: function getLastScenario() {
                return scenarios.getLast();
            },

            hasScenarios: function hasScenarios() {
                return scenarios.length() > 0;
            },

            addTags: function setTags(newTags) {
                tags = tags.concat(newTags);
            },

            getTags: function getTags() {
                return tags;
            },

            acceptVisitor: function acceptVisitor(visitor, callback) {
                self.instructVisitorToVisitBackground(visitor, function() {
                    self.instructVisitorToVisitScenarios(visitor, callback);
                });
            },

            instructVisitorToVisitBackground: function instructVisitorToVisitBackground(visitor, callback) {
                if (self.hasBackground()) {
                    var background = self.getBackground();
                    visitor.visitBackground(background, callback);
                } else {
                    callback();
                }
            },

            instructVisitorToVisitScenarios: function instructVisitorToVisitScenarios(visitor, callback) {
                scenarios.forEach(function(scenario, iterate) {
                    visitor.visitScenario(scenario, iterate);
                }, callback);
            }
        };
        return self;
    };
        module.exports = Feature;

    });

    require.define("/cucumber/ast/features",function(require,module,exports,__dirname,__filename,process){var Features = function() {
        var Cucumber = require('../../cucumber');

        var features = Cucumber.Type.Collection();

        var self = {
            addFeature: function addFeature(feature) {
                features.add(feature);
            },

            getLastFeature: function getLastFeature() {
                return features.getLast();
            },

            acceptVisitor: function acceptVisitor(visitor, callback) {
                features.forEach(function(feature, iterate) {
                    visitor.visitFeature(feature, iterate);
                }, callback);
            }
        };
        return self;
    };
        module.exports = Features;

    });

    require.define("/cucumber/ast/filter",function(require,module,exports,__dirname,__filename,process){var _ = require('underscore');

        var Filter = function(rules) {
            var self = {
                isElementEnrolled: function isElementEnrolled(element) {
                    var enrolled = _.all(rules, function(rule) {
                        return rule.isSatisfiedByElement(element);
                    });
                    return enrolled;
                }
            };
            return self;
        };
        Filter.AnyOfTagsRule          = require('./filter/any_of_tags_rule');
        Filter.ElementMatchingTagSpec = require('./filter/element_matching_tag_spec');
        module.exports = Filter;

    });

    require.define("/cucumber/ast/filter/any_of_tags_rule",function(require,module,exports,__dirname,__filename,process){var _ = require('underscore');

        var AnyOfTagsRule = function(tags) {
            var Cucumber = require('../../../cucumber');

            var self = {
                isSatisfiedByElement: function isSatisfiedByElement(element) {
                    var satisfied = _.any(tags, function(tag) {
                        var spec = Cucumber.Ast.Filter.ElementMatchingTagSpec(tag);
                        return spec.isMatching(element);
                    });
                    return satisfied;
                }
            };
            return self;
        };
        module.exports = AnyOfTagsRule;

    });

    require.define("/cucumber/ast/filter/element_matching_tag_spec",function(require,module,exports,__dirname,__filename,process){var _ = require('underscore');

        var ElementMatchingTagSpec = function(tagName) {
            var self = {
                isMatching: function isMatching(element) {
                    var elementTags = element.getTags();
                    var matching;
                    if (self.isExpectingTag())
                        matching = _.any(elementTags, self.isTagSatisfying);
                    else
                        matching = _.all(elementTags, self.isTagSatisfying);
                    return matching;
                },

                isTagSatisfying: function isTagSatisfying(tag) {
                    var checkedTagName = tag.getName();
                    var satisfying;
                    if (self.isExpectingTag())
                        satisfying = checkedTagName == tagName;
                    else {
                        var negatedCheckedTagName = ElementMatchingTagSpec.NEGATION_CHARACTER + checkedTagName;
                        satisfying = negatedCheckedTagName != tagName;
                    }
                    return satisfying;
                },

                isExpectingTag: function isExpectingTag() {
                    var expectingTag = tagName[0] != ElementMatchingTagSpec.NEGATION_CHARACTER;
                    return expectingTag;
                }
            };
            return self;
        };
        ElementMatchingTagSpec.NEGATION_CHARACTER = '~';
        module.exports = ElementMatchingTagSpec;

    });

    require.define("/cucumber/ast/scenario",function(require,module,exports,__dirname,__filename,process){var Scenario = function(keyword, name, description, uri, line) {
        var Cucumber = require('../../cucumber');

        var background;
        var steps = Cucumber.Type.Collection();
        var tags  = [];

        var self = {
            setBackground: function setBackground(newBackground) {
                background = newBackground;
            },

            getKeyword: function getKeyword() {
                return keyword;
            },

            getName: function getName() {
                return name;
            },

            getDescription: function getDescription() {
                return description;
            },

            getUri: function getUri() {
                return uri;
            },

            getLine: function getLine() {
                return line;
            },

            getBackground: function getBackground() {
                return background;
            },

            addStep: function addStep(step) {
                var lastStep = self.getLastStep();
                step.setPreviousStep(lastStep);
                steps.add(step);
            },

            getLastStep: function getLastStep() {
                return steps.getLast();
            },

            addTags: function setTags(newTags) {
                tags = tags.concat(newTags);
            },

            getTags: function getTags() {
                return tags;
            },

            acceptVisitor: function acceptVisitor(visitor, callback) {
                self.instructVisitorToVisitBackgroundSteps(visitor, function() {
                    self.instructVisitorToVisitScenarioSteps(visitor, callback);
                });
            },

            instructVisitorToVisitBackgroundSteps: function instructVisitorToVisitBackgroundSteps(visitor, callback) {
                var background = self.getBackground();
                if (typeof(background) != 'undefined') {
                    var steps = background.getSteps();
                    self.instructVisitorToVisitSteps(visitor, steps, callback);
                } else {
                    callback();
                }
            },

            instructVisitorToVisitScenarioSteps: function instructVisitorToVisitScenarioSteps(visitor, callback) {
                self.instructVisitorToVisitSteps(visitor, steps, callback);
            },

            instructVisitorToVisitSteps: function instructVisitorToVisitSteps(visitor, steps, callback) {
                steps.forEach(function(step, iterate) {
                    visitor.visitStep(step, iterate);
                }, callback);
            }
        };
        return self;
    };
        module.exports = Scenario;

    });

    require.define("/cucumber/ast/step",function(require,module,exports,__dirname,__filename,process){var Step = function(keyword, name, uri, line) {
        var Cucumber = require('../../cucumber');
        var docString, dataTable, previousStep;

        var self = {
            setPreviousStep: function setPreviousStep(newPreviousStep) {
                previousStep = newPreviousStep;
            },

            getKeyword: function getKeyword() {
                return keyword;
            },

            getName: function getName() {
                return name;
            },

            getUri: function getUri() {
                return uri;
            },

            getLine: function getLine() {
                return line;
            },

            getPreviousStep: function getPreviousStep() {
                return previousStep;
            },

            hasPreviousStep: function hasPreviousStep() {
                return !!previousStep;
            },

            getAttachment: function getAttachment() {
                var attachment;
                if (self.hasDocString()) {
                    attachment = self.getDocString();
                } else if (self.hasDataTable()) {
                    attachment = self.getDataTable();
                }
                return attachment;
            },

            getAttachmentContents: function getAttachmentContents() {
                var attachment         = self.getAttachment();
                var attachmentContents;
                if (attachment)
                    attachmentContents = attachment.getContents();
                return attachmentContents;
            },

            getDocString: function getDocString() { return docString; },

            getDataTable: function getDataTable() { return dataTable; },

            hasAttachment: function hasAttachment() {
                return self.hasDocString() || self.hasDataTable();
            },

            hasDocString: function hasDocString() {
                return !!docString;
            },

            hasDataTable: function hasDataTable() {
                return !!dataTable;
            },

            attachDocString: function attachDocString(_docString) { docString = _docString; },

            attachDataTable: function attachDataTable(_dataTable) { dataTable = _dataTable; },

            attachDataTableRow: function attachDataTableRow(row) {
                self.ensureDataTableIsAttached();
                var dataTable = self.getDataTable();
                dataTable.attachRow(row);
            },

            ensureDataTableIsAttached: function ensureDataTableIsAttached() {
                var dataTable = self.getDataTable();
                if (!dataTable) {
                    dataTable = Cucumber.Ast.DataTable();
                    self.attachDataTable(dataTable);
                }
            },

            isOutcomeStep: function isOutcomeStep() {
                var isOutcomeStep =
                    self.hasOutcomeStepKeyword() || self.isRepeatingOutcomeStep();
                return isOutcomeStep;
            },

            isEventStep: function isEventStep() {
                var isEventStep =
                    self.hasEventStepKeyword() || self.isRepeatingEventStep();
                return isEventStep;
            },

            hasOutcomeStepKeyword: function hasOutcomeStepKeyword() {
                var hasOutcomeStepKeyword =
                    keyword == Step.OUTCOME_STEP_KEYWORD;
                return hasOutcomeStepKeyword;
            },

            hasEventStepKeyword: function hasEventStepKeyword() {
                var hasEventStepKeyword =
                    keyword == Step.EVENT_STEP_KEYWORD;
                return hasEventStepKeyword;
            },

            isRepeatingOutcomeStep: function isRepeatingOutcomeStep() {
                var isRepeatingOutcomeStep =
                    self.hasRepeatStepKeyword() && self.isPrecededByOutcomeStep();
                return isRepeatingOutcomeStep;
            },

            isRepeatingEventStep: function isRepeatingEventStep() {
                var isRepeatingEventStep =
                    self.hasRepeatStepKeyword() && self.isPrecededByEventStep();
                return isRepeatingEventStep;
            },

            hasRepeatStepKeyword: function hasRepeatStepKeyword() {
                var hasRepeatStepKeyword =
                    keyword == Step.AND_STEP_KEYWORD || keyword == Step.BUT_STEP_KEYWORD || keyword == Step.STAR_STEP_KEYWORD;
                return hasRepeatStepKeyword;
            },

            isPrecededByOutcomeStep: function isPrecededByOutcomeStep() {
                var isPrecededByOutcomeStep = false;

                if (self.hasPreviousStep()) {
                    var previousStep            = self.getPreviousStep();
                    var isPrecededByOutcomeStep = previousStep.isOutcomeStep();
                }
                return isPrecededByOutcomeStep;
            },

            isPrecededByEventStep: function isPrecededByEventStep() {
                var isPrecededByEventStep = false;

                if (self.hasPreviousStep()) {
                    var previousStep          = self.getPreviousStep();
                    var isPrecededByEventStep = previousStep.isEventStep();
                }
                return isPrecededByEventStep;
            },

            acceptVisitor: function acceptVisitor(visitor, callback) {
                self.execute(visitor, function(stepResult) {
                    visitor.visitStepResult(stepResult, callback);
                });
            },

            execute: function execute(visitor, callback) {
                var stepDefinition = visitor.lookupStepDefinitionByName(name);
                var world          = visitor.getWorld();
                stepDefinition.invoke(self, world, callback);
            }
        };
        return self;
    };
        Step.EVENT_STEP_KEYWORD   = 'When ';
        Step.OUTCOME_STEP_KEYWORD = 'Then ';
        Step.AND_STEP_KEYWORD     = 'And ';
        Step.BUT_STEP_KEYWORD     = 'But ';
        Step.STAR_STEP_KEYWORD    = '* ';
        module.exports = Step;

    });

    require.define("/cucumber/ast/tag",function(require,module,exports,__dirname,__filename,process){var Tag = function(name, uri, line) {
        var Cucumber = require('../../cucumber');

        var self = {
            getName: function getName() {
                return name;
            },

            getUri: function getUri() {
                return uri;
            },

            getLine: function getLine() {
                return line;
            }
        };
        return self;
    };
        module.exports = Tag;

    });

    require.define("/node_modules/underscore",function(require,module,exports,__dirname,__filename,process){//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

        (function() {

            // Baseline setup
            // --------------

            // Establish the root object, `window` in the browser, or `global` on the server.
            var root = this;

            // Save the previous value of the `_` variable.
            var previousUnderscore = root._;

            // Establish the object that gets returned to break out of a loop iteration.
            var breaker = {};

            // Save bytes in the minified (but not gzipped) version:
            var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

            // Create quick reference variables for speed access to core prototypes.
            var slice            = ArrayProto.slice,
                unshift          = ArrayProto.unshift,
                toString         = ObjProto.toString,
                hasOwnProperty   = ObjProto.hasOwnProperty;

            // All **ECMAScript 5** native function implementations that we hope to use
            // are declared here.
            var
                nativeForEach      = ArrayProto.forEach,
                nativeMap          = ArrayProto.map,
                nativeReduce       = ArrayProto.reduce,
                nativeReduceRight  = ArrayProto.reduceRight,
                nativeFilter       = ArrayProto.filter,
                nativeEvery        = ArrayProto.every,
                nativeSome         = ArrayProto.some,
                nativeIndexOf      = ArrayProto.indexOf,
                nativeLastIndexOf  = ArrayProto.lastIndexOf,
                nativeIsArray      = Array.isArray,
                nativeKeys         = Object.keys,
                nativeBind         = FuncProto.bind;

            // Create a safe reference to the Underscore object for use below.
            var _ = function(obj) { return new wrapper(obj); };

            // Export the Underscore object for **Node.js**, with
            // backwards-compatibility for the old `require()` API. If we're in
            // the browser, add `_` as a global object via a string identifier,
            // for Closure Compiler "advanced" mode.
            if (typeof exports !== 'undefined') {
                if (typeof module !== 'undefined' && module.exports) {
                    exports = module.exports = _;
                }
                exports._ = _;
            } else {
                root['_'] = _;
            }

            // Current version.
            _.VERSION = '1.3.3';

            // Collection Functions
            // --------------------

            // The cornerstone, an `each` implementation, aka `forEach`.
            // Handles objects with the built-in `forEach`, arrays, and raw objects.
            // Delegates to **ECMAScript 5**'s native `forEach` if available.
            var each = _.each = _.forEach = function(obj, iterator, context) {
                if (obj == null) return;
                if (nativeForEach && obj.forEach === nativeForEach) {
                    obj.forEach(iterator, context);
                } else if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
                    }
                } else {
                    for (var key in obj) {
                        if (_.has(obj, key)) {
                            if (iterator.call(context, obj[key], key, obj) === breaker) return;
                        }
                    }
                }
            };

            // Return the results of applying the iterator to each element.
            // Delegates to **ECMAScript 5**'s native `map` if available.
            _.map = _.collect = function(obj, iterator, context) {
                var results = [];
                if (obj == null) return results;
                if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
                each(obj, function(value, index, list) {
                    results[results.length] = iterator.call(context, value, index, list);
                });
                if (obj.length === +obj.length) results.length = obj.length;
                return results;
            };

            // **Reduce** builds up a single result from a list of values, aka `inject`,
            // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
            _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (obj == null) obj = [];
                if (nativeReduce && obj.reduce === nativeReduce) {
                    if (context) iterator = _.bind(iterator, context);
                    return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                }
                each(obj, function(value, index, list) {
                    if (!initial) {
                        memo = value;
                        initial = true;
                    } else {
                        memo = iterator.call(context, memo, value, index, list);
                    }
                });
                if (!initial) throw new TypeError('Reduce of empty array with no initial value');
                return memo;
            };

            // The right-associative version of reduce, also known as `foldr`.
            // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
            _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
                var initial = arguments.length > 2;
                if (obj == null) obj = [];
                if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
                    if (context) iterator = _.bind(iterator, context);
                    return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                }
                var reversed = _.toArray(obj).reverse();
                if (context && !initial) iterator = _.bind(iterator, context);
                return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
            };

            // Return the first value which passes a truth test. Aliased as `detect`.
            _.find = _.detect = function(obj, iterator, context) {
                var result;
                any(obj, function(value, index, list) {
                    if (iterator.call(context, value, index, list)) {
                        result = value;
                        return true;
                    }
                });
                return result;
            };

            // Return all the elements that pass a truth test.
            // Delegates to **ECMAScript 5**'s native `filter` if available.
            // Aliased as `select`.
            _.filter = _.select = function(obj, iterator, context) {
                var results = [];
                if (obj == null) return results;
                if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
                each(obj, function(value, index, list) {
                    if (iterator.call(context, value, index, list)) results[results.length] = value;
                });
                return results;
            };

            // Return all the elements for which a truth test fails.
            _.reject = function(obj, iterator, context) {
                var results = [];
                if (obj == null) return results;
                each(obj, function(value, index, list) {
                    if (!iterator.call(context, value, index, list)) results[results.length] = value;
                });
                return results;
            };

            // Determine whether all of the elements match a truth test.
            // Delegates to **ECMAScript 5**'s native `every` if available.
            // Aliased as `all`.
            _.every = _.all = function(obj, iterator, context) {
                var result = true;
                if (obj == null) return result;
                if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
                each(obj, function(value, index, list) {
                    if (!(result = result && iterator.call(context, value, index, list))) return breaker;
                });
                return !!result;
            };

            // Determine if at least one element in the object matches a truth test.
            // Delegates to **ECMAScript 5**'s native `some` if available.
            // Aliased as `any`.
            var any = _.some = _.any = function(obj, iterator, context) {
                iterator || (iterator = _.identity);
                var result = false;
                if (obj == null) return result;
                if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
                each(obj, function(value, index, list) {
                    if (result || (result = iterator.call(context, value, index, list))) return breaker;
                });
                return !!result;
            };

            // Determine if a given value is included in the array or object using `===`.
            // Aliased as `contains`.
            _.include = _.contains = function(obj, target) {
                var found = false;
                if (obj == null) return found;
                if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
                found = any(obj, function(value) {
                    return value === target;
                });
                return found;
            };

            // Invoke a method (with arguments) on every item in a collection.
            _.invoke = function(obj, method) {
                var args = slice.call(arguments, 2);
                return _.map(obj, function(value) {
                    return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
                });
            };

            // Convenience version of a common use case of `map`: fetching a property.
            _.pluck = function(obj, key) {
                return _.map(obj, function(value){ return value[key]; });
            };

            // Return the maximum element or (element-based computation).
            _.max = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
                if (!iterator && _.isEmpty(obj)) return -Infinity;
                var result = {computed : -Infinity};
                each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed >= result.computed && (result = {value : value, computed : computed});
                });
                return result.value;
            };

            // Return the minimum element (or element-based computation).
            _.min = function(obj, iterator, context) {
                if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
                if (!iterator && _.isEmpty(obj)) return Infinity;
                var result = {computed : Infinity};
                each(obj, function(value, index, list) {
                    var computed = iterator ? iterator.call(context, value, index, list) : value;
                    computed < result.computed && (result = {value : value, computed : computed});
                });
                return result.value;
            };

            // Shuffle an array.
            _.shuffle = function(obj) {
                var shuffled = [], rand;
                each(obj, function(value, index, list) {
                    rand = Math.floor(Math.random() * (index + 1));
                    shuffled[index] = shuffled[rand];
                    shuffled[rand] = value;
                });
                return shuffled;
            };

            // Sort the object's values by a criterion produced by an iterator.
            _.sortBy = function(obj, val, context) {
                var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
                return _.pluck(_.map(obj, function(value, index, list) {
                    return {
                        value : value,
                        criteria : iterator.call(context, value, index, list)
                    };
                }).sort(function(left, right) {
                    var a = left.criteria, b = right.criteria;
                    if (a === void 0) return 1;
                    if (b === void 0) return -1;
                    return a < b ? -1 : a > b ? 1 : 0;
                }), 'value');
            };

            // Groups the object's values by a criterion. Pass either a string attribute
            // to group by, or a function that returns the criterion.
            _.groupBy = function(obj, val) {
                var result = {};
                var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
                each(obj, function(value, index) {
                    var key = iterator(value, index);
                    (result[key] || (result[key] = [])).push(value);
                });
                return result;
            };

            // Use a comparator function to figure out at what index an object should
            // be inserted so as to maintain order. Uses binary search.
            _.sortedIndex = function(array, obj, iterator) {
                iterator || (iterator = _.identity);
                var low = 0, high = array.length;
                while (low < high) {
                    var mid = (low + high) >> 1;
                    iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
                }
                return low;
            };

            // Safely convert anything iterable into a real, live array.
            _.toArray = function(obj) {
                if (!obj)                                     return [];
                if (_.isArray(obj))                           return slice.call(obj);
                if (_.isArguments(obj))                       return slice.call(obj);
                if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
                return _.values(obj);
            };

            // Return the number of elements in an object.
            _.size = function(obj) {
                return _.isArray(obj) ? obj.length : _.keys(obj).length;
            };

            // Array Functions
            // ---------------

            // Get the first element of an array. Passing **n** will return the first N
            // values in the array. Aliased as `head` and `take`. The **guard** check
            // allows it to work with `_.map`.
            _.first = _.head = _.take = function(array, n, guard) {
                return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
            };

            // Returns everything but the last entry of the array. Especcialy useful on
            // the arguments object. Passing **n** will return all the values in
            // the array, excluding the last N. The **guard** check allows it to work with
            // `_.map`.
            _.initial = function(array, n, guard) {
                return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
            };

            // Get the last element of an array. Passing **n** will return the last N
            // values in the array. The **guard** check allows it to work with `_.map`.
            _.last = function(array, n, guard) {
                if ((n != null) && !guard) {
                    return slice.call(array, Math.max(array.length - n, 0));
                } else {
                    return array[array.length - 1];
                }
            };

            // Returns everything but the first entry of the array. Aliased as `tail`.
            // Especially useful on the arguments object. Passing an **index** will return
            // the rest of the values in the array from that index onward. The **guard**
            // check allows it to work with `_.map`.
            _.rest = _.tail = function(array, index, guard) {
                return slice.call(array, (index == null) || guard ? 1 : index);
            };

            // Trim out all falsy values from an array.
            _.compact = function(array) {
                return _.filter(array, function(value){ return !!value; });
            };

            // Return a completely flattened version of an array.
            _.flatten = function(array, shallow) {
                return _.reduce(array, function(memo, value) {
                    if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
                    memo[memo.length] = value;
                    return memo;
                }, []);
            };

            // Return a version of the array that does not contain the specified value(s).
            _.without = function(array) {
                return _.difference(array, slice.call(arguments, 1));
            };

            // Produce a duplicate-free version of the array. If the array has already
            // been sorted, you have the option of using a faster algorithm.
            // Aliased as `unique`.
            _.uniq = _.unique = function(array, isSorted, iterator) {
                var initial = iterator ? _.map(array, iterator) : array;
                var results = [];
                // The `isSorted` flag is irrelevant if the array only contains two elements.
                if (array.length < 3) isSorted = true;
                _.reduce(initial, function (memo, value, index) {
                    if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
                        memo.push(value);
                        results.push(array[index]);
                    }
                    return memo;
                }, []);
                return results;
            };

            // Produce an array that contains the union: each distinct element from all of
            // the passed-in arrays.
            _.union = function() {
                return _.uniq(_.flatten(arguments, true));
            };

            // Produce an array that contains every item shared between all the
            // passed-in arrays. (Aliased as "intersect" for back-compat.)
            _.intersection = _.intersect = function(array) {
                var rest = slice.call(arguments, 1);
                return _.filter(_.uniq(array), function(item) {
                    return _.every(rest, function(other) {
                        return _.indexOf(other, item) >= 0;
                    });
                });
            };

            // Take the difference between one array and a number of other arrays.
            // Only the elements present in just the first array will remain.
            _.difference = function(array) {
                var rest = _.flatten(slice.call(arguments, 1), true);
                return _.filter(array, function(value){ return !_.include(rest, value); });
            };

            // Zip together multiple lists into a single array -- elements that share
            // an index go together.
            _.zip = function() {
                var args = slice.call(arguments);
                var length = _.max(_.pluck(args, 'length'));
                var results = new Array(length);
                for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
                return results;
            };

            // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
            // we need this function. Return the position of the first occurrence of an
            // item in an array, or -1 if the item is not included in the array.
            // Delegates to **ECMAScript 5**'s native `indexOf` if available.
            // If the array is large and already in sort order, pass `true`
            // for **isSorted** to use binary search.
            _.indexOf = function(array, item, isSorted) {
                if (array == null) return -1;
                var i, l;
                if (isSorted) {
                    i = _.sortedIndex(array, item);
                    return array[i] === item ? i : -1;
                }
                if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
                for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
                return -1;
            };

            // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
            _.lastIndexOf = function(array, item) {
                if (array == null) return -1;
                if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
                var i = array.length;
                while (i--) if (i in array && array[i] === item) return i;
                return -1;
            };

            // Generate an integer Array containing an arithmetic progression. A port of
            // the native Python `range()` function. See
            // [the Python documentation](http://docs.python.org/library/functions.html#range).
            _.range = function(start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = arguments[2] || 1;

                var len = Math.max(Math.ceil((stop - start) / step), 0);
                var idx = 0;
                var range = new Array(len);

                while(idx < len) {
                    range[idx++] = start;
                    start += step;
                }

                return range;
            };

            // Function (ahem) Functions
            // ------------------

            // Reusable constructor function for prototype setting.
            var ctor = function(){};

            // Create a function bound to a given object (assigning `this`, and arguments,
            // optionally). Binding with arguments is also known as `curry`.
            // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
            // We check for `func.bind` first, to fail fast when `func` is undefined.
            _.bind = function bind(func, context) {
                var bound, args;
                if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError;
                args = slice.call(arguments, 2);
                return bound = function() {
                    if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                    ctor.prototype = func.prototype;
                    var self = new ctor;
                    var result = func.apply(self, args.concat(slice.call(arguments)));
                    if (Object(result) === result) return result;
                    return self;
                };
            };

            // Bind all of an object's methods to that object. Useful for ensuring that
            // all callbacks defined on an object belong to it.
            _.bindAll = function(obj) {
                var funcs = slice.call(arguments, 1);
                if (funcs.length == 0) funcs = _.functions(obj);
                each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
                return obj;
            };

            // Memoize an expensive function by storing its results.
            _.memoize = function(func, hasher) {
                var memo = {};
                hasher || (hasher = _.identity);
                return function() {
                    var key = hasher.apply(this, arguments);
                    return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
                };
            };

            // Delays a function for the given number of milliseconds, and then calls
            // it with the arguments supplied.
            _.delay = function(func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function(){ return func.apply(null, args); }, wait);
            };

            // Defers a function, scheduling it to run after the current call stack has
            // cleared.
            _.defer = function(func) {
                return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
            };

            // Returns a function, that, when invoked, will only be triggered at most once
            // during a given window of time.
            _.throttle = function(func, wait) {
                var context, args, timeout, throttling, more, result;
                var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
                return function() {
                    context = this; args = arguments;
                    var later = function() {
                        timeout = null;
                        if (more) func.apply(context, args);
                        whenDone();
                    };
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (throttling) {
                        more = true;
                    } else {
                        result = func.apply(context, args);
                    }
                    whenDone();
                    throttling = true;
                    return result;
                };
            };

            // Returns a function, that, as long as it continues to be invoked, will not
            // be triggered. The function will be called after it stops being called for
            // N milliseconds. If `immediate` is passed, trigger the function on the
            // leading edge, instead of the trailing.
            _.debounce = function(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    if (immediate && !timeout) func.apply(context, args);
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };

            // Returns a function that will be executed at most one time, no matter how
            // often you call it. Useful for lazy initialization.
            _.once = function(func) {
                var ran = false, memo;
                return function() {
                    if (ran) return memo;
                    ran = true;
                    return memo = func.apply(this, arguments);
                };
            };

            // Returns the first function passed as an argument to the second,
            // allowing you to adjust arguments, run code before and after, and
            // conditionally execute the original function.
            _.wrap = function(func, wrapper) {
                return function() {
                    var args = [func].concat(slice.call(arguments, 0));
                    return wrapper.apply(this, args);
                };
            };

            // Returns a function that is the composition of a list of functions, each
            // consuming the return value of the function that follows.
            _.compose = function() {
                var funcs = arguments;
                return function() {
                    var args = arguments;
                    for (var i = funcs.length - 1; i >= 0; i--) {
                        args = [funcs[i].apply(this, args)];
                    }
                    return args[0];
                };
            };

            // Returns a function that will only be executed after being called N times.
            _.after = function(times, func) {
                if (times <= 0) return func();
                return function() {
                    if (--times < 1) { return func.apply(this, arguments); }
                };
            };

            // Object Functions
            // ----------------

            // Retrieve the names of an object's properties.
            // Delegates to **ECMAScript 5**'s native `Object.keys`
            _.keys = nativeKeys || function(obj) {
                if (obj !== Object(obj)) throw new TypeError('Invalid object');
                var keys = [];
                for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
                return keys;
            };

            // Retrieve the values of an object's properties.
            _.values = function(obj) {
                return _.map(obj, _.identity);
            };

            // Return a sorted list of the function names available on the object.
            // Aliased as `methods`
            _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj) {
                    if (_.isFunction(obj[key])) names.push(key);
                }
                return names.sort();
            };

            // Extend a given object with all the properties in passed-in object(s).
            _.extend = function(obj) {
                each(slice.call(arguments, 1), function(source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                });
                return obj;
            };

            // Return a copy of the object only containing the whitelisted properties.
            _.pick = function(obj) {
                var result = {};
                each(_.flatten(slice.call(arguments, 1)), function(key) {
                    if (key in obj) result[key] = obj[key];
                });
                return result;
            };

            // Fill in a given object with default properties.
            _.defaults = function(obj) {
                each(slice.call(arguments, 1), function(source) {
                    for (var prop in source) {
                        if (obj[prop] == null) obj[prop] = source[prop];
                    }
                });
                return obj;
            };

            // Create a (shallow-cloned) duplicate of an object.
            _.clone = function(obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
            };

            // Invokes interceptor with the obj, and then returns obj.
            // The primary purpose of this method is to "tap into" a method chain, in
            // order to perform operations on intermediate results within the chain.
            _.tap = function(obj, interceptor) {
                interceptor(obj);
                return obj;
            };

            // Internal recursive comparison function.
            function eq(a, b, stack) {
                // Identical objects are equal. `0 === -0`, but they aren't identical.
                // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
                if (a === b) return a !== 0 || 1 / a == 1 / b;
                // A strict comparison is necessary because `null == undefined`.
                if (a == null || b == null) return a === b;
                // Unwrap any wrapped objects.
                if (a._chain) a = a._wrapped;
                if (b._chain) b = b._wrapped;
                // Invoke a custom `isEqual` method if one is provided.
                if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
                if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
                // Compare `[[Class]]` names.
                var className = toString.call(a);
                if (className != toString.call(b)) return false;
                switch (className) {
                    // Strings, numbers, dates, and booleans are compared by value.
                    case '[object String]':
                        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                        // equivalent to `new String("5")`.
                        return a == String(b);
                    case '[object Number]':
                        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                        // other numeric values.
                        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                    case '[object Date]':
                    case '[object Boolean]':
                        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                        // millisecond representations. Note that invalid dates with millisecond representations
                        // of `NaN` are not equivalent.
                        return +a == +b;
                    // RegExps are compared by their source patterns and flags.
                    case '[object RegExp]':
                        return a.source == b.source &&
                            a.global == b.global &&
                            a.multiline == b.multiline &&
                            a.ignoreCase == b.ignoreCase;
                }
                if (typeof a != 'object' || typeof b != 'object') return false;
                // Assume equality for cyclic structures. The algorithm for detecting cyclic
                // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
                var length = stack.length;
                while (length--) {
                    // Linear search. Performance is inversely proportional to the number of
                    // unique nested structures.
                    if (stack[length] == a) return true;
                }
                // Add the first object to the stack of traversed objects.
                stack.push(a);
                var size = 0, result = true;
                // Recursively compare objects and arrays.
                if (className == '[object Array]') {
                    // Compare array lengths to determine if a deep comparison is necessary.
                    size = a.length;
                    result = size == b.length;
                    if (result) {
                        // Deep compare the contents, ignoring non-numeric properties.
                        while (size--) {
                            // Ensure commutative equality for sparse arrays.
                            if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
                        }
                    }
                } else {
                    // Objects with different constructors are not equivalent.
                    if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
                    // Deep compare objects.
                    for (var key in a) {
                        if (_.has(a, key)) {
                            // Count the expected number of properties.
                            size++;
                            // Deep compare each member.
                            if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
                        }
                    }
                    // Ensure that both objects contain the same number of properties.
                    if (result) {
                        for (key in b) {
                            if (_.has(b, key) && !(size--)) break;
                        }
                        result = !size;
                    }
                }
                // Remove the first object from the stack of traversed objects.
                stack.pop();
                return result;
            }

            // Perform a deep comparison to check if two objects are equal.
            _.isEqual = function(a, b) {
                return eq(a, b, []);
            };

            // Is a given array, string, or object empty?
            // An "empty" object has no enumerable own-properties.
            _.isEmpty = function(obj) {
                if (obj == null) return true;
                if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
                for (var key in obj) if (_.has(obj, key)) return false;
                return true;
            };

            // Is a given value a DOM element?
            _.isElement = function(obj) {
                return !!(obj && obj.nodeType == 1);
            };

            // Is a given value an array?
            // Delegates to ECMA5's native Array.isArray
            _.isArray = nativeIsArray || function(obj) {
                return toString.call(obj) == '[object Array]';
            };

            // Is a given variable an object?
            _.isObject = function(obj) {
                return obj === Object(obj);
            };

            // Is a given variable an arguments object?
            _.isArguments = function(obj) {
                return toString.call(obj) == '[object Arguments]';
            };
            if (!_.isArguments(arguments)) {
                _.isArguments = function(obj) {
                    return !!(obj && _.has(obj, 'callee'));
                };
            }

            // Is a given value a function?
            _.isFunction = function(obj) {
                return toString.call(obj) == '[object Function]';
            };

            // Is a given value a string?
            _.isString = function(obj) {
                return toString.call(obj) == '[object String]';
            };

            // Is a given value a number?
            _.isNumber = function(obj) {
                return toString.call(obj) == '[object Number]';
            };

            // Is a given object a finite number?
            _.isFinite = function(obj) {
                return _.isNumber(obj) && isFinite(obj);
            };

            // Is the given value `NaN`?
            _.isNaN = function(obj) {
                // `NaN` is the only value for which `===` is not reflexive.
                return obj !== obj;
            };

            // Is a given value a boolean?
            _.isBoolean = function(obj) {
                return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
            };

            // Is a given value a date?
            _.isDate = function(obj) {
                return toString.call(obj) == '[object Date]';
            };

            // Is the given value a regular expression?
            _.isRegExp = function(obj) {
                return toString.call(obj) == '[object RegExp]';
            };

            // Is a given value equal to null?
            _.isNull = function(obj) {
                return obj === null;
            };

            // Is a given variable undefined?
            _.isUndefined = function(obj) {
                return obj === void 0;
            };

            // Has own property?
            _.has = function(obj, key) {
                return hasOwnProperty.call(obj, key);
            };

            // Utility Functions
            // -----------------

            // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
            // previous owner. Returns a reference to the Underscore object.
            _.noConflict = function() {
                root._ = previousUnderscore;
                return this;
            };

            // Keep the identity function around for default iterators.
            _.identity = function(value) {
                return value;
            };

            // Run a function **n** times.
            _.times = function (n, iterator, context) {
                for (var i = 0; i < n; i++) iterator.call(context, i);
            };

            // Escape a string for HTML interpolation.
            _.escape = function(string) {
                return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
            };

            // If the value of the named property is a function then invoke it;
            // otherwise, return it.
            _.result = function(object, property) {
                if (object == null) return null;
                var value = object[property];
                return _.isFunction(value) ? value.call(object) : value;
            };

            // Add your own custom functions to the Underscore object, ensuring that
            // they're correctly added to the OOP wrapper as well.
            _.mixin = function(obj) {
                each(_.functions(obj), function(name){
                    addToWrapper(name, _[name] = obj[name]);
                });
            };

            // Generate a unique integer id (unique within the entire client session).
            // Useful for temporary DOM ids.
            var idCounter = 0;
            _.uniqueId = function(prefix) {
                var id = idCounter++;
                return prefix ? prefix + id : id;
            };

            // By default, Underscore uses ERB-style template delimiters, change the
            // following template settings to use alternative delimiters.
            _.templateSettings = {
                evaluate    : /<%([\s\S]+?)%>/g,
                interpolate : /<%=([\s\S]+?)%>/g,
                escape      : /<%-([\s\S]+?)%>/g
            };

            // When customizing `templateSettings`, if you don't want to define an
            // interpolation, evaluation or escaping regex, we need one that is
            // guaranteed not to match.
            var noMatch = /.^/;

            // Certain characters need to be escaped so that they can be put into a
            // string literal.
            var escapes = {
                '\\': '\\',
                "'": "'",
                'r': '\r',
                'n': '\n',
                't': '\t',
                'u2028': '\u2028',
                'u2029': '\u2029'
            };

            for (var p in escapes) escapes[escapes[p]] = p;
            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

            // Within an interpolation, evaluation, or escaping, remove HTML escaping
            // that had been previously added.
            var unescape = function(code) {
                return code.replace(unescaper, function(match, escape) {
                    return escapes[escape];
                });
            };

            // JavaScript micro-templating, similar to John Resig's implementation.
            // Underscore templating handles arbitrary delimiters, preserves whitespace,
            // and correctly escapes quotes within interpolated code.
            _.template = function(text, data, settings) {
                settings = _.defaults(settings || {}, _.templateSettings);

                // Compile the template source, taking care to escape characters that
                // cannot be included in a string literal and then unescape them in code
                // blocks.
                var source = "__p+='" + text
                    .replace(escaper, function(match) {
                        return '\\' + escapes[match];
                    })
                    .replace(settings.escape || noMatch, function(match, code) {
                        return "'+\n_.escape(" + unescape(code) + ")+\n'";
                    })
                    .replace(settings.interpolate || noMatch, function(match, code) {
                        return "'+\n(" + unescape(code) + ")+\n'";
                    })
                    .replace(settings.evaluate || noMatch, function(match, code) {
                        return "';\n" + unescape(code) + "\n;__p+='";
                    }) + "';\n";

                // If a variable is not specified, place data values in local scope.
                if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

                source = "var __p='';" +
                    "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
                    source + "return __p;\n";

                var render = new Function(settings.variable || 'obj', '_', source);
                if (data) return render(data, _);
                var template = function(data) {
                    return render.call(this, data, _);
                };

                // Provide the compiled function source as a convenience for build time
                // precompilation.
                template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
                    source + '}';

                return template;
            };

            // Add a "chain" function, which will delegate to the wrapper.
            _.chain = function(obj) {
                return _(obj).chain();
            };

            // The OOP Wrapper
            // ---------------

            // If Underscore is called as a function, it returns a wrapped object that
            // can be used OO-style. This wrapper holds altered versions of all the
            // underscore functions. Wrapped objects may be chained.
            var wrapper = function(obj) { this._wrapped = obj; };

            // Expose `wrapper.prototype` as `_.prototype`
            _.prototype = wrapper.prototype;

            // Helper function to continue chaining intermediate results.
            var result = function(obj, chain) {
                return chain ? _(obj).chain() : obj;
            };

            // A method to easily add functions to the OOP wrapper.
            var addToWrapper = function(name, func) {
                wrapper.prototype[name] = function() {
                    var args = slice.call(arguments);
                    unshift.call(args, this._wrapped);
                    return result(func.apply(_, args), this._chain);
                };
            };

            // Add all of the Underscore functions to the wrapper object.
            _.mixin(_);

            // Add all mutator Array functions to the wrapper.
            each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
                var method = ArrayProto[name];
                wrapper.prototype[name] = function() {
                    var wrapped = this._wrapped;
                    method.apply(wrapped, arguments);
                    var length = wrapped.length;
                    if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
                    return result(wrapped, this._chain);
                };
            });

            // Add all accessor Array functions to the wrapper.
            each(['concat', 'join', 'slice'], function(name) {
                var method = ArrayProto[name];
                wrapper.prototype[name] = function() {
                    return result(method.apply(this._wrapped, arguments), this._chain);
                };
            });

            // Start chaining a wrapped Underscore object.
            wrapper.prototype.chain = function() {
                this._chain = true;
                return this;
            };

            // Extracts the result from a wrapped and chained object.
            wrapper.prototype.value = function() {
                return this._wrapped;
            };

        }).call(this);

    });
    require("/node_modules/underscore");

    require.define("/node_modules/gherkin",function(require,module,exports,__dirname,__filename,process){/**
     * Creates a new Lexer for a specific language.
     */
    module.exports.Lexer = function(lang) {
        return require('./gherkin/lexer/' + lang);
    };

        /**
         * Creates a connect middleware for loading lexer sources (typically for browsers).
         */
        module.exports.connect = function(path) {
            var gherkinFiles = require('connect').static(__dirname);

            return function(req, res, next) {
                if(req.url.indexOf(path) == 0) {
                    req.url = req.url.slice(path.length);
                    gherkinFiles(req, res, next);
                } else {
                    next();
                }
            };
        };

    });
    require("/node_modules/gherkin");

    require.define("/cucumber",function(require,module,exports,__dirname,__filename,process){var Cucumber = function(featureSource, supportCodeInitializer, options) {
        var configuration = Cucumber.VolatileConfiguration(featureSource, supportCodeInitializer, options);
        var runtime       = Cucumber.Runtime(configuration);
        return runtime;
    };
        Cucumber.Ast                   = require('./cucumber/ast');
// browserify won't load ./cucumber/cli and throw an exception:
        try { Cucumber.Cli             = require('./cucumber/cli'); } catch(e) {}
        Cucumber.Debug                 = require('./cucumber/debug'); // Untested namespace
        Cucumber.Listener              = require('./cucumber/listener');
        Cucumber.Parser                = require('./cucumber/parser');
        Cucumber.Runtime               = require('./cucumber/runtime');
        Cucumber.SupportCode           = require('./cucumber/support_code');
        Cucumber.TagGroupParser        = require('./cucumber/tag_group_parser');
        Cucumber.Type                  = require('./cucumber/type');
        Cucumber.Util                  = require('./cucumber/util');
        Cucumber.VolatileConfiguration = require('./cucumber/volatile_configuration');

        Cucumber.VERSION               = "0.3.0";

        module.exports                 = Cucumber;

    });
    require("/cucumber");

    require.define("/node_modules/gherkin/lexer/en",function(require,module,exports,__dirname,__filename,process){
        /* line 1 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */
        ;(function() {


            /* line 126 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */



            /* line 11 "js/lib/gherkin/lexer/en.js" */
            var _lexer_actions = [
                0, 1, 0, 1, 1, 1, 2, 1,
                3, 1, 4, 1, 5, 1, 6, 1,
                7, 1, 8, 1, 9, 1, 10, 1,
                11, 1, 12, 1, 13, 1, 16, 1,
                17, 1, 18, 1, 19, 1, 20, 1,
                21, 1, 22, 1, 23, 2, 2, 18,
                2, 3, 4, 2, 13, 0, 2, 14,
                15, 2, 17, 0, 2, 17, 1, 2,
                17, 16, 2, 17, 19, 2, 18, 6,
                2, 18, 7, 2, 18, 8, 2, 18,
                9, 2, 18, 10, 2, 18, 16, 2,
                20, 21, 2, 22, 0, 2, 22, 1,
                2, 22, 16, 2, 22, 19, 3, 4,
                14, 15, 3, 5, 14, 15, 3, 11,
                14, 15, 3, 12, 14, 15, 3, 13,
                14, 15, 3, 14, 15, 18, 3, 17,
                0, 11, 3, 17, 14, 15, 4, 2,
                14, 15, 18, 4, 3, 4, 14, 15,
                4, 17, 0, 14, 15, 5, 17, 0,
                11, 14, 15
            ];

            var _lexer_key_offsets = [
                0, 0, 19, 37, 38, 39, 41, 43,
                48, 53, 58, 63, 67, 71, 73, 74,
                75, 76, 77, 78, 79, 80, 81, 82,
                83, 84, 85, 86, 87, 88, 89, 91,
                93, 98, 105, 110, 112, 113, 114, 115,
                116, 117, 118, 119, 120, 132, 134, 136,
                138, 140, 142, 144, 146, 148, 150, 152,
                154, 156, 158, 160, 162, 164, 166, 168,
                170, 172, 174, 192, 194, 195, 196, 197,
                198, 199, 200, 201, 202, 203, 204, 205,
                220, 222, 224, 226, 228, 230, 232, 234,
                236, 238, 240, 242, 244, 246, 248, 250,
                253, 255, 257, 259, 261, 263, 265, 267,
                269, 272, 274, 276, 278, 280, 282, 284,
                286, 288, 290, 292, 294, 296, 298, 300,
                302, 304, 306, 308, 310, 312, 314, 316,
                318, 320, 322, 324, 326, 329, 332, 334,
                336, 338, 340, 342, 344, 346, 348, 350,
                352, 354, 356, 358, 359, 360, 361, 362,
                363, 364, 365, 366, 367, 368, 369, 370,
                371, 372, 373, 374, 375, 376, 377, 378,
                387, 389, 391, 393, 395, 397, 399, 401,
                403, 405, 407, 409, 411, 413, 415, 417,
                419, 421, 423, 425, 427, 429, 431, 433,
                435, 437, 438, 439, 440, 441, 442, 443,
                444, 445, 446, 447, 448, 449, 450, 451,
                452, 453, 454, 457, 459, 460, 461, 462,
                463, 464, 465, 466, 467, 468, 483, 485,
                487, 489, 491, 493, 495, 497, 499, 501,
                503, 505, 507, 509, 511, 513, 516, 518,
                520, 522, 524, 526, 528, 530, 532, 535,
                537, 539, 541, 543, 545, 547, 549, 551,
                553, 555, 557, 559, 561, 563, 565, 567,
                569, 571, 573, 575, 577, 579, 581, 583,
                585, 587, 589, 591, 592, 593, 594, 595,
                596, 597, 598, 599, 614, 616, 618, 620,
                622, 624, 626, 628, 630, 632, 634, 636,
                638, 640, 642, 644, 647, 649, 651, 653,
                655, 657, 659, 661, 664, 666, 668, 670,
                672, 674, 676, 678, 680, 683, 685, 687,
                689, 691, 693, 695, 697, 699, 701, 703,
                705, 707, 709, 711, 713, 715, 717, 719,
                721, 723, 725, 727, 729, 731, 733, 735,
                738, 741, 743, 745, 747, 749, 751, 753,
                755, 757, 759, 761, 763, 765, 766, 770,
                776, 779, 781, 787, 805, 808, 810, 812,
                814, 816, 818, 820, 822, 824, 826, 828,
                830, 832, 834, 836, 838, 840, 842, 844,
                846, 848, 850, 852, 854, 856, 858, 860,
                862, 864, 866, 868, 870, 872, 874, 876,
                878, 880, 882, 884, 888, 891, 893, 895,
                897, 899, 901, 903, 905, 907, 909, 911,
                913, 914, 915, 916
            ];

            var _lexer_trans_keys = [
                10, 32, 34, 35, 37, 42, 64, 65,
                66, 69, 70, 71, 83, 84, 87, 124,
                239, 9, 13, 10, 32, 34, 35, 37,
                42, 64, 65, 66, 69, 70, 71, 83,
                84, 87, 124, 9, 13, 34, 34, 10,
                13, 10, 13, 10, 32, 34, 9, 13,
                10, 32, 34, 9, 13, 10, 32, 34,
                9, 13, 10, 32, 34, 9, 13, 10,
                32, 9, 13, 10, 32, 9, 13, 10,
                13, 10, 95, 70, 69, 65, 84, 85,
                82, 69, 95, 69, 78, 68, 95, 37,
                32, 10, 13, 10, 13, 13, 32, 64,
                9, 10, 9, 10, 13, 32, 64, 11,
                12, 10, 32, 64, 9, 13, 98, 110,
                105, 108, 105, 116, 121, 58, 10, 10,
                10, 32, 35, 37, 64, 65, 66, 69,
                70, 83, 9, 13, 10, 95, 10, 70,
                10, 69, 10, 65, 10, 84, 10, 85,
                10, 82, 10, 69, 10, 95, 10, 69,
                10, 78, 10, 68, 10, 95, 10, 37,
                10, 98, 10, 105, 10, 108, 10, 105,
                10, 116, 10, 121, 10, 58, 10, 32,
                34, 35, 37, 42, 64, 65, 66, 69,
                70, 71, 83, 84, 87, 124, 9, 13,
                97, 117, 99, 107, 103, 114, 111, 117,
                110, 100, 58, 10, 10, 10, 32, 35,
                37, 42, 64, 65, 66, 70, 71, 83,
                84, 87, 9, 13, 10, 95, 10, 70,
                10, 69, 10, 65, 10, 84, 10, 85,
                10, 82, 10, 69, 10, 95, 10, 69,
                10, 78, 10, 68, 10, 95, 10, 37,
                10, 32, 10, 98, 110, 10, 105, 10,
                108, 10, 105, 10, 116, 10, 121, 10,
                58, 10, 100, 10, 117, 10, 115, 116,
                10, 105, 10, 110, 10, 101, 10, 115,
                10, 115, 10, 32, 10, 78, 10, 101,
                10, 101, 10, 100, 10, 101, 10, 97,
                10, 116, 10, 117, 10, 114, 10, 101,
                10, 105, 10, 118, 10, 101, 10, 110,
                10, 99, 10, 101, 10, 110, 10, 97,
                10, 114, 10, 105, 10, 111, 10, 32,
                58, 10, 79, 84, 10, 117, 10, 116,
                10, 108, 10, 105, 10, 110, 10, 101,
                10, 109, 10, 112, 10, 108, 10, 97,
                10, 116, 10, 104, 115, 116, 105, 110,
                101, 115, 115, 32, 78, 101, 101, 100,
                120, 97, 109, 112, 108, 101, 115, 58,
                10, 10, 10, 32, 35, 65, 66, 70,
                124, 9, 13, 10, 98, 10, 105, 10,
                108, 10, 105, 10, 116, 10, 121, 10,
                58, 10, 117, 10, 115, 10, 105, 10,
                110, 10, 101, 10, 115, 10, 115, 10,
                32, 10, 78, 10, 101, 10, 101, 10,
                100, 10, 101, 10, 97, 10, 116, 10,
                117, 10, 114, 10, 101, 101, 97, 116,
                117, 114, 101, 105, 118, 101, 110, 99,
                101, 110, 97, 114, 105, 111, 32, 58,
                115, 79, 84, 117, 116, 108, 105, 110,
                101, 58, 10, 10, 10, 32, 35, 37,
                42, 64, 65, 66, 70, 71, 83, 84,
                87, 9, 13, 10, 95, 10, 70, 10,
                69, 10, 65, 10, 84, 10, 85, 10,
                82, 10, 69, 10, 95, 10, 69, 10,
                78, 10, 68, 10, 95, 10, 37, 10,
                32, 10, 98, 110, 10, 105, 10, 108,
                10, 105, 10, 116, 10, 121, 10, 58,
                10, 100, 10, 117, 10, 115, 116, 10,
                105, 10, 110, 10, 101, 10, 115, 10,
                115, 10, 32, 10, 78, 10, 101, 10,
                101, 10, 100, 10, 101, 10, 97, 10,
                116, 10, 117, 10, 114, 10, 101, 10,
                105, 10, 118, 10, 101, 10, 110, 10,
                99, 10, 101, 10, 110, 10, 97, 10,
                114, 10, 105, 10, 111, 10, 104, 101,
                109, 112, 108, 97, 116, 10, 10, 10,
                32, 35, 37, 42, 64, 65, 66, 70,
                71, 83, 84, 87, 9, 13, 10, 95,
                10, 70, 10, 69, 10, 65, 10, 84,
                10, 85, 10, 82, 10, 69, 10, 95,
                10, 69, 10, 78, 10, 68, 10, 95,
                10, 37, 10, 32, 10, 98, 110, 10,
                105, 10, 108, 10, 105, 10, 116, 10,
                121, 10, 58, 10, 100, 10, 97, 117,
                10, 99, 10, 107, 10, 103, 10, 114,
                10, 111, 10, 117, 10, 110, 10, 100,
                10, 115, 116, 10, 105, 10, 110, 10,
                101, 10, 115, 10, 115, 10, 32, 10,
                78, 10, 101, 10, 101, 10, 101, 10,
                97, 10, 116, 10, 117, 10, 114, 10,
                101, 10, 105, 10, 118, 10, 101, 10,
                110, 10, 99, 10, 101, 10, 110, 10,
                97, 10, 114, 10, 105, 10, 111, 10,
                32, 58, 10, 79, 84, 10, 117, 10,
                116, 10, 108, 10, 105, 10, 110, 10,
                101, 10, 109, 10, 112, 10, 108, 10,
                97, 10, 116, 10, 104, 104, 32, 124,
                9, 13, 10, 32, 92, 124, 9, 13,
                10, 92, 124, 10, 92, 10, 32, 92,
                124, 9, 13, 10, 32, 34, 35, 37,
                42, 64, 65, 66, 69, 70, 71, 83,
                84, 87, 124, 9, 13, 10, 97, 117,
                10, 99, 10, 107, 10, 103, 10, 114,
                10, 111, 10, 117, 10, 110, 10, 100,
                10, 115, 10, 105, 10, 110, 10, 101,
                10, 115, 10, 115, 10, 32, 10, 78,
                10, 101, 10, 101, 10, 120, 10, 97,
                10, 109, 10, 112, 10, 108, 10, 101,
                10, 115, 10, 101, 10, 97, 10, 116,
                10, 117, 10, 114, 10, 101, 10, 99,
                10, 101, 10, 110, 10, 97, 10, 114,
                10, 105, 10, 111, 10, 32, 58, 115,
                10, 79, 84, 10, 117, 10, 116, 10,
                108, 10, 105, 10, 110, 10, 101, 10,
                109, 10, 112, 10, 108, 10, 97, 10,
                116, 100, 187, 191, 0
            ];

            var _lexer_single_lengths = [
                0, 17, 16, 1, 1, 2, 2, 3,
                3, 3, 3, 2, 2, 2, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 2, 2,
                3, 5, 3, 2, 1, 1, 1, 1,
                1, 1, 1, 1, 10, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 16, 2, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 13,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 3,
                2, 2, 2, 2, 2, 2, 2, 2,
                3, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 3, 3, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 7,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 3, 2, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 13, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 3, 2, 2,
                2, 2, 2, 2, 2, 2, 3, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 1, 1, 1, 1, 1,
                1, 1, 1, 13, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 3, 2, 2, 2, 2,
                2, 2, 2, 3, 2, 2, 2, 2,
                2, 2, 2, 2, 3, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 3,
                3, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 1, 2, 4,
                3, 2, 4, 16, 3, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                2, 2, 2, 4, 3, 2, 2, 2,
                2, 2, 2, 2, 2, 2, 2, 2,
                1, 1, 1, 0
            ];

            var _lexer_range_lengths = [
                0, 1, 1, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 1, 1,
                0, 0, 1, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0
            ];

            var _lexer_index_offsets = [
                0, 0, 19, 37, 39, 41, 44, 47,
                52, 57, 62, 67, 71, 75, 78, 80,
                82, 84, 86, 88, 90, 92, 94, 96,
                98, 100, 102, 104, 106, 108, 110, 113,
                116, 121, 128, 133, 136, 138, 140, 142,
                144, 146, 148, 150, 152, 164, 167, 170,
                173, 176, 179, 182, 185, 188, 191, 194,
                197, 200, 203, 206, 209, 212, 215, 218,
                221, 224, 227, 245, 248, 250, 252, 254,
                256, 258, 260, 262, 264, 266, 268, 270,
                285, 288, 291, 294, 297, 300, 303, 306,
                309, 312, 315, 318, 321, 324, 327, 330,
                334, 337, 340, 343, 346, 349, 352, 355,
                358, 362, 365, 368, 371, 374, 377, 380,
                383, 386, 389, 392, 395, 398, 401, 404,
                407, 410, 413, 416, 419, 422, 425, 428,
                431, 434, 437, 440, 443, 447, 451, 454,
                457, 460, 463, 466, 469, 472, 475, 478,
                481, 484, 487, 490, 492, 494, 496, 498,
                500, 502, 504, 506, 508, 510, 512, 514,
                516, 518, 520, 522, 524, 526, 528, 530,
                539, 542, 545, 548, 551, 554, 557, 560,
                563, 566, 569, 572, 575, 578, 581, 584,
                587, 590, 593, 596, 599, 602, 605, 608,
                611, 614, 616, 618, 620, 622, 624, 626,
                628, 630, 632, 634, 636, 638, 640, 642,
                644, 646, 648, 652, 655, 657, 659, 661,
                663, 665, 667, 669, 671, 673, 688, 691,
                694, 697, 700, 703, 706, 709, 712, 715,
                718, 721, 724, 727, 730, 733, 737, 740,
                743, 746, 749, 752, 755, 758, 761, 765,
                768, 771, 774, 777, 780, 783, 786, 789,
                792, 795, 798, 801, 804, 807, 810, 813,
                816, 819, 822, 825, 828, 831, 834, 837,
                840, 843, 846, 849, 851, 853, 855, 857,
                859, 861, 863, 865, 880, 883, 886, 889,
                892, 895, 898, 901, 904, 907, 910, 913,
                916, 919, 922, 925, 929, 932, 935, 938,
                941, 944, 947, 950, 954, 957, 960, 963,
                966, 969, 972, 975, 978, 982, 985, 988,
                991, 994, 997, 1000, 1003, 1006, 1009, 1012,
                1015, 1018, 1021, 1024, 1027, 1030, 1033, 1036,
                1039, 1042, 1045, 1048, 1051, 1054, 1057, 1060,
                1064, 1068, 1071, 1074, 1077, 1080, 1083, 1086,
                1089, 1092, 1095, 1098, 1101, 1104, 1106, 1110,
                1116, 1120, 1123, 1129, 1147, 1151, 1154, 1157,
                1160, 1163, 1166, 1169, 1172, 1175, 1178, 1181,
                1184, 1187, 1190, 1193, 1196, 1199, 1202, 1205,
                1208, 1211, 1214, 1217, 1220, 1223, 1226, 1229,
                1232, 1235, 1238, 1241, 1244, 1247, 1250, 1253,
                1256, 1259, 1262, 1265, 1270, 1274, 1277, 1280,
                1283, 1286, 1289, 1292, 1295, 1298, 1301, 1304,
                1307, 1309, 1311, 1313
            ];

            var _lexer_indicies = [
                2, 1, 3, 4, 5, 6, 7, 8,
                9, 10, 11, 12, 13, 14, 14, 15,
                16, 1, 0, 2, 1, 3, 4, 5,
                6, 7, 8, 9, 10, 11, 12, 13,
                14, 14, 15, 1, 0, 17, 0, 18,
                0, 20, 21, 19, 23, 24, 22, 27,
                26, 28, 26, 25, 31, 30, 32, 30,
                29, 31, 30, 33, 30, 29, 31, 30,
                34, 30, 29, 36, 35, 35, 0, 2,
                37, 37, 0, 39, 40, 38, 2, 0,
                41, 0, 42, 0, 43, 0, 44, 0,
                45, 0, 46, 0, 47, 0, 48, 0,
                49, 0, 50, 0, 51, 0, 52, 0,
                53, 0, 54, 0, 55, 0, 57, 58,
                56, 60, 61, 59, 0, 0, 0, 0,
                62, 63, 64, 63, 63, 66, 65, 62,
                2, 67, 7, 67, 0, 68, 69, 0,
                70, 0, 71, 0, 72, 0, 73, 0,
                74, 0, 75, 0, 77, 76, 79, 78,
                79, 80, 81, 82, 81, 83, 84, 85,
                86, 87, 80, 78, 79, 88, 78, 79,
                89, 78, 79, 90, 78, 79, 91, 78,
                79, 92, 78, 79, 93, 78, 79, 94,
                78, 79, 95, 78, 79, 96, 78, 79,
                97, 78, 79, 98, 78, 79, 99, 78,
                79, 100, 78, 79, 101, 78, 79, 102,
                78, 79, 103, 78, 79, 104, 78, 79,
                105, 78, 79, 106, 78, 79, 107, 78,
                79, 108, 78, 110, 109, 111, 112, 113,
                114, 115, 116, 117, 118, 119, 120, 121,
                122, 122, 123, 109, 0, 124, 125, 0,
                126, 0, 127, 0, 128, 0, 129, 0,
                130, 0, 131, 0, 132, 0, 133, 0,
                134, 0, 136, 135, 138, 137, 138, 139,
                140, 141, 142, 140, 143, 144, 145, 146,
                147, 148, 148, 139, 137, 138, 149, 137,
                138, 150, 137, 138, 151, 137, 138, 152,
                137, 138, 153, 137, 138, 154, 137, 138,
                155, 137, 138, 156, 137, 138, 157, 137,
                138, 158, 137, 138, 159, 137, 138, 160,
                137, 138, 161, 137, 138, 162, 137, 138,
                163, 137, 138, 164, 165, 137, 138, 166,
                137, 138, 167, 137, 138, 168, 137, 138,
                169, 137, 138, 170, 137, 138, 163, 137,
                138, 171, 137, 138, 172, 137, 138, 173,
                171, 137, 138, 174, 137, 138, 175, 137,
                138, 176, 137, 138, 177, 137, 138, 178,
                137, 138, 179, 137, 138, 180, 137, 138,
                181, 137, 138, 182, 137, 138, 170, 137,
                138, 183, 137, 138, 184, 137, 138, 185,
                137, 138, 186, 137, 138, 187, 137, 138,
                170, 137, 138, 188, 137, 138, 189, 137,
                138, 190, 137, 138, 171, 137, 138, 191,
                137, 138, 192, 137, 138, 193, 137, 138,
                194, 137, 138, 195, 137, 138, 196, 137,
                138, 197, 137, 138, 198, 163, 137, 138,
                199, 200, 137, 138, 201, 137, 138, 202,
                137, 138, 203, 137, 138, 204, 137, 138,
                187, 137, 138, 205, 137, 138, 206, 137,
                138, 207, 137, 138, 208, 137, 138, 209,
                137, 138, 187, 137, 138, 189, 137, 210,
                211, 0, 212, 0, 213, 0, 214, 0,
                215, 0, 216, 0, 217, 0, 218, 0,
                219, 0, 220, 0, 74, 0, 221, 0,
                222, 0, 223, 0, 224, 0, 225, 0,
                226, 0, 227, 0, 228, 0, 230, 229,
                232, 231, 232, 233, 234, 235, 236, 237,
                234, 233, 231, 232, 238, 231, 232, 239,
                231, 232, 240, 231, 232, 241, 231, 232,
                242, 231, 232, 243, 231, 232, 244, 231,
                232, 245, 231, 232, 246, 231, 232, 247,
                231, 232, 248, 231, 232, 249, 231, 232,
                250, 231, 232, 251, 231, 232, 252, 231,
                232, 253, 231, 232, 254, 231, 232, 255,
                231, 232, 243, 231, 232, 256, 231, 232,
                257, 231, 232, 258, 231, 232, 259, 231,
                232, 260, 231, 232, 243, 231, 261, 0,
                262, 0, 263, 0, 264, 0, 265, 0,
                74, 0, 266, 0, 267, 0, 268, 0,
                211, 0, 269, 0, 270, 0, 271, 0,
                272, 0, 273, 0, 274, 0, 275, 0,
                276, 277, 227, 0, 278, 279, 0, 280,
                0, 281, 0, 282, 0, 283, 0, 284,
                0, 285, 0, 286, 0, 288, 287, 290,
                289, 290, 291, 292, 293, 294, 292, 295,
                296, 297, 298, 299, 300, 300, 291, 289,
                290, 301, 289, 290, 302, 289, 290, 303,
                289, 290, 304, 289, 290, 305, 289, 290,
                306, 289, 290, 307, 289, 290, 308, 289,
                290, 309, 289, 290, 310, 289, 290, 311,
                289, 290, 312, 289, 290, 313, 289, 290,
                314, 289, 290, 315, 289, 290, 316, 317,
                289, 290, 318, 289, 290, 319, 289, 290,
                320, 289, 290, 321, 289, 290, 322, 289,
                290, 315, 289, 290, 323, 289, 290, 324,
                289, 290, 325, 323, 289, 290, 326, 289,
                290, 327, 289, 290, 328, 289, 290, 329,
                289, 290, 330, 289, 290, 331, 289, 290,
                332, 289, 290, 333, 289, 290, 334, 289,
                290, 322, 289, 290, 335, 289, 290, 336,
                289, 290, 337, 289, 290, 338, 289, 290,
                339, 289, 290, 322, 289, 290, 340, 289,
                290, 341, 289, 290, 342, 289, 290, 323,
                289, 290, 343, 289, 290, 344, 289, 290,
                345, 289, 290, 346, 289, 290, 347, 289,
                290, 348, 289, 290, 322, 289, 290, 341,
                289, 349, 0, 350, 0, 351, 0, 352,
                0, 353, 0, 284, 0, 355, 354, 357,
                356, 357, 358, 359, 360, 361, 359, 362,
                363, 364, 365, 366, 367, 367, 358, 356,
                357, 368, 356, 357, 369, 356, 357, 370,
                356, 357, 371, 356, 357, 372, 356, 357,
                373, 356, 357, 374, 356, 357, 375, 356,
                357, 376, 356, 357, 377, 356, 357, 378,
                356, 357, 379, 356, 357, 380, 356, 357,
                381, 356, 357, 382, 356, 357, 383, 384,
                356, 357, 385, 356, 357, 386, 356, 357,
                387, 356, 357, 388, 356, 357, 389, 356,
                357, 382, 356, 357, 390, 356, 357, 391,
                392, 356, 357, 393, 356, 357, 394, 356,
                357, 395, 356, 357, 396, 356, 357, 397,
                356, 357, 398, 356, 357, 399, 356, 357,
                389, 356, 357, 400, 390, 356, 357, 401,
                356, 357, 402, 356, 357, 403, 356, 357,
                404, 356, 357, 405, 356, 357, 406, 356,
                357, 407, 356, 357, 408, 356, 357, 399,
                356, 357, 409, 356, 357, 410, 356, 357,
                411, 356, 357, 412, 356, 357, 413, 356,
                357, 389, 356, 357, 414, 356, 357, 415,
                356, 357, 416, 356, 357, 390, 356, 357,
                417, 356, 357, 418, 356, 357, 419, 356,
                357, 420, 356, 357, 421, 356, 357, 422,
                356, 357, 423, 356, 357, 424, 382, 356,
                357, 425, 426, 356, 357, 427, 356, 357,
                428, 356, 357, 429, 356, 357, 430, 356,
                357, 413, 356, 357, 431, 356, 357, 432,
                356, 357, 433, 356, 357, 434, 356, 357,
                435, 356, 357, 413, 356, 357, 415, 356,
                267, 0, 436, 437, 436, 0, 440, 439,
                441, 442, 439, 438, 0, 444, 445, 443,
                0, 444, 443, 440, 446, 444, 445, 446,
                443, 440, 447, 448, 449, 450, 451, 452,
                453, 454, 455, 456, 457, 458, 459, 459,
                460, 447, 0, 79, 461, 462, 78, 79,
                463, 78, 79, 464, 78, 79, 465, 78,
                79, 466, 78, 79, 467, 78, 79, 468,
                78, 79, 469, 78, 79, 107, 78, 79,
                470, 78, 79, 471, 78, 79, 472, 78,
                79, 473, 78, 79, 474, 78, 79, 475,
                78, 79, 476, 78, 79, 477, 78, 79,
                478, 78, 79, 469, 78, 79, 479, 78,
                79, 480, 78, 79, 481, 78, 79, 482,
                78, 79, 483, 78, 79, 484, 78, 79,
                107, 78, 79, 485, 78, 79, 486, 78,
                79, 487, 78, 79, 488, 78, 79, 489,
                78, 79, 107, 78, 79, 490, 78, 79,
                491, 78, 79, 492, 78, 79, 493, 78,
                79, 494, 78, 79, 495, 78, 79, 496,
                78, 79, 497, 108, 107, 78, 79, 498,
                499, 78, 79, 500, 78, 79, 501, 78,
                79, 502, 78, 79, 503, 78, 79, 489,
                78, 79, 504, 78, 79, 505, 78, 79,
                506, 78, 79, 507, 78, 79, 508, 78,
                79, 489, 78, 211, 0, 509, 0, 1,
                0, 510, 0
            ];

            var _lexer_trans_targs = [
                0, 2, 2, 3, 13, 15, 29, 32,
                35, 67, 157, 193, 199, 203, 357, 358,
                417, 4, 5, 6, 7, 6, 6, 7,
                6, 8, 8, 8, 9, 8, 8, 8,
                9, 10, 11, 12, 2, 12, 13, 2,
                14, 16, 17, 18, 19, 20, 21, 22,
                23, 24, 25, 26, 27, 28, 419, 30,
                31, 2, 14, 31, 2, 14, 33, 34,
                2, 33, 32, 34, 36, 416, 37, 38,
                39, 40, 41, 42, 43, 44, 43, 44,
                44, 2, 45, 59, 364, 383, 390, 396,
                46, 47, 48, 49, 50, 51, 52, 53,
                54, 55, 56, 57, 58, 2, 60, 61,
                62, 63, 64, 65, 66, 2, 2, 3,
                13, 15, 29, 32, 35, 67, 157, 193,
                199, 203, 357, 358, 68, 146, 69, 70,
                71, 72, 73, 74, 75, 76, 77, 78,
                79, 78, 79, 79, 2, 80, 94, 95,
                103, 115, 121, 125, 145, 81, 82, 83,
                84, 85, 86, 87, 88, 89, 90, 91,
                92, 93, 2, 66, 96, 102, 97, 98,
                99, 100, 101, 94, 104, 105, 106, 107,
                108, 109, 110, 111, 112, 113, 114, 116,
                117, 118, 119, 120, 122, 123, 124, 126,
                127, 128, 129, 130, 131, 132, 133, 134,
                139, 135, 136, 137, 138, 140, 141, 142,
                143, 144, 147, 29, 148, 149, 150, 151,
                152, 153, 154, 155, 156, 158, 159, 160,
                161, 162, 163, 164, 165, 166, 167, 166,
                167, 167, 2, 168, 175, 187, 169, 170,
                171, 172, 173, 174, 66, 176, 177, 178,
                179, 180, 181, 182, 183, 184, 185, 186,
                188, 189, 190, 191, 192, 194, 195, 196,
                197, 198, 200, 201, 202, 204, 205, 206,
                207, 208, 209, 210, 211, 281, 212, 275,
                213, 214, 215, 216, 217, 218, 219, 220,
                221, 220, 221, 221, 2, 222, 236, 237,
                245, 257, 263, 267, 274, 223, 224, 225,
                226, 227, 228, 229, 230, 231, 232, 233,
                234, 235, 2, 66, 238, 244, 239, 240,
                241, 242, 243, 236, 246, 247, 248, 249,
                250, 251, 252, 253, 254, 255, 256, 258,
                259, 260, 261, 262, 264, 265, 266, 268,
                269, 270, 271, 272, 273, 276, 277, 278,
                279, 280, 282, 283, 282, 283, 283, 2,
                284, 298, 299, 307, 326, 332, 336, 356,
                285, 286, 287, 288, 289, 290, 291, 292,
                293, 294, 295, 296, 297, 2, 66, 300,
                306, 301, 302, 303, 304, 305, 298, 308,
                316, 309, 310, 311, 312, 313, 314, 315,
                317, 318, 319, 320, 321, 322, 323, 324,
                325, 327, 328, 329, 330, 331, 333, 334,
                335, 337, 338, 339, 340, 341, 342, 343,
                344, 345, 350, 346, 347, 348, 349, 351,
                352, 353, 354, 355, 358, 359, 360, 362,
                363, 361, 359, 360, 361, 359, 362, 363,
                3, 13, 15, 29, 32, 35, 67, 157,
                193, 199, 203, 357, 358, 365, 373, 366,
                367, 368, 369, 370, 371, 372, 374, 375,
                376, 377, 378, 379, 380, 381, 382, 384,
                385, 386, 387, 388, 389, 391, 392, 393,
                394, 395, 397, 398, 399, 400, 401, 402,
                403, 404, 405, 410, 406, 407, 408, 409,
                411, 412, 413, 414, 415, 418, 0
            ];

            var _lexer_trans_actions = [
                43, 0, 54, 3, 1, 0, 29, 1,
                29, 29, 29, 29, 29, 29, 29, 35,
                0, 0, 0, 7, 139, 48, 0, 102,
                9, 5, 45, 134, 45, 0, 33, 122,
                33, 33, 0, 11, 106, 0, 0, 114,
                25, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                57, 149, 126, 0, 110, 23, 0, 27,
                118, 27, 51, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 57, 144, 0, 54,
                0, 69, 33, 84, 84, 84, 84, 84,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 13, 0, 0,
                0, 0, 0, 0, 13, 31, 130, 60,
                57, 31, 63, 57, 63, 63, 63, 63,
                63, 63, 63, 66, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 57,
                144, 0, 54, 0, 72, 33, 84, 84,
                84, 84, 84, 84, 84, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 15, 15, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 57, 144, 0,
                54, 0, 81, 84, 84, 84, 0, 0,
                0, 0, 0, 0, 21, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 57,
                144, 0, 54, 0, 78, 33, 84, 84,
                84, 84, 84, 84, 84, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 19, 19, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 57, 144, 0, 54, 0, 75,
                33, 84, 84, 84, 84, 84, 84, 84,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 17, 17, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 37, 37,
                54, 37, 87, 0, 0, 39, 0, 0,
                93, 90, 41, 96, 90, 96, 96, 96,
                96, 96, 96, 96, 99, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0
            ];

            var _lexer_eof_actions = [
                0, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43, 43, 43, 43, 43,
                43, 43, 43, 43
            ];

            var lexer_start = 1;
            var lexer_first_final = 419;
            var lexer_error = 0;

            var lexer_en_main = 1;


            /* line 129 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

            /* line 130 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

            /* line 131 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

            var Lexer = function(listener) {
                // Check that listener has the required functions
                var events = ['comment', 'tag', 'feature', 'background', 'scenario', 'scenario_outline', 'examples', 'step', 'doc_string', 'row', 'eof'];
                for(e in events) {
                    var event = events[e];
                    if(typeof listener[event] != 'function') {
                        throw "Error. No " + event + " function exists on " + JSON.stringify(listener);
                    }
                }
                this.listener = listener;
            };

            Lexer.prototype.scan = function(data) {
                var ending = "\n%_FEATURE_END_%";
                if(typeof data == 'string') {
                    data = this.stringToBytes(data + ending);
                } else if(typeof Buffer != 'undefined' && Buffer.isBuffer(data)) {
                    // Node.js
                    var buf = new Buffer(data.length + ending.length);
                    data.copy(buf, 0, 0);
                    new Buffer(ending).copy(buf, data.length, 0);
                    data = buf;
                }
                var eof = pe = data.length;
                var p = 0;

                this.line_number = 1;
                this.last_newline = 0;


                /* line 778 "js/lib/gherkin/lexer/en.js" */
                {
                    this.cs = lexer_start;
                } /* JSCodeGen::writeInit */

                /* line 162 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                /* line 785 "js/lib/gherkin/lexer/en.js" */
                {
                    var _klen, _trans, _keys, _ps, _widec, _acts, _nacts;
                    var _goto_level, _resume, _eof_trans, _again, _test_eof;
                    var _out;
                    _klen = _trans = _keys = _acts = _nacts = null;
                    _goto_level = 0;
                    _resume = 10;
                    _eof_trans = 15;
                    _again = 20;
                    _test_eof = 30;
                    _out = 40;
                    while (true) {
                        _trigger_goto = false;
                        if (_goto_level <= 0) {
                            if (p == pe) {
                                _goto_level = _test_eof;
                                continue;
                            }
                            if ( this.cs == 0) {
                                _goto_level = _out;
                                continue;
                            }
                        }
                        if (_goto_level <= _resume) {
                            _keys = _lexer_key_offsets[ this.cs];
                            _trans = _lexer_index_offsets[ this.cs];
                            _klen = _lexer_single_lengths[ this.cs];
                            _break_match = false;

                            do {
                                if (_klen > 0) {
                                    _lower = _keys;
                                    _upper = _keys + _klen - 1;

                                    while (true) {
                                        if (_upper < _lower) { break; }
                                        _mid = _lower + ( (_upper - _lower) >> 1 );

                                        if ( data[p] < _lexer_trans_keys[_mid]) {
                                            _upper = _mid - 1;
                                        } else if ( data[p] > _lexer_trans_keys[_mid]) {
                                            _lower = _mid + 1;
                                        } else {
                                            _trans += (_mid - _keys);
                                            _break_match = true;
                                            break;
                                        };
                                    } /* while */
                                    if (_break_match) { break; }
                                    _keys += _klen;
                                    _trans += _klen;
                                }
                                _klen = _lexer_range_lengths[ this.cs];
                                if (_klen > 0) {
                                    _lower = _keys;
                                    _upper = _keys + (_klen << 1) - 2;
                                    while (true) {
                                        if (_upper < _lower) { break; }
                                        _mid = _lower + (((_upper-_lower) >> 1) & ~1);
                                        if ( data[p] < _lexer_trans_keys[_mid]) {
                                            _upper = _mid - 2;
                                        } else if ( data[p] > _lexer_trans_keys[_mid+1]) {
                                            _lower = _mid + 2;
                                        } else {
                                            _trans += ((_mid - _keys) >> 1);
                                            _break_match = true;
                                            break;
                                        }
                                    } /* while */
                                    if (_break_match) { break; }
                                    _trans += _klen
                                }
                            } while (false);
                            _trans = _lexer_indicies[_trans];
                            this.cs = _lexer_trans_targs[_trans];
                            if (_lexer_trans_actions[_trans] != 0) {
                                _acts = _lexer_trans_actions[_trans];
                                _nacts = _lexer_actions[_acts];
                                _acts += 1;
                                while (_nacts > 0) {
                                    _nacts -= 1;
                                    _acts += 1;
                                    switch (_lexer_actions[_acts - 1]) {
                                        case 0:
                                            /* line 6 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.content_start = p;
                                            this.current_line = this.line_number;
                                            this.start_col = p - this.last_newline - (this.keyword+':').length;
                                            break;
                                        case 1:
                                            /* line 12 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.current_line = this.line_number;
                                            this.start_col = p - this.last_newline;
                                            break;
                                        case 2:
                                            /* line 17 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.content_start = p;
                                            break;
                                        case 3:
                                            /* line 21 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.docstring_content_type_start = p;
                                            break;
                                        case 4:
                                            /* line 25 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.docstring_content_type_end = p;
                                            break;
                                        case 5:
                                            /* line 29 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.unindent(
                                                this.start_col,
                                                this.bytesToString(data.slice(this.content_start, this.next_keyword_start-1)).replace(/(\r?\n)?([\t ])*$/, '').replace(/\\\"\\\"\\\"/mg, '"""')
                                            );
                                            var con_type = this.bytesToString(data.slice(this.docstring_content_type_start, this.docstring_content_type_end)).trim();
                                            this.listener.doc_string(con_type, con, this.current_line);
                                            break;
                                        case 6:
                                            /* line 38 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('feature', data, p, eof);
                                            break;
                                        case 7:
                                            /* line 42 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('background', data, p, eof);
                                            break;
                                        case 8:
                                            /* line 46 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('scenario', data, p, eof);
                                            break;
                                        case 9:
                                            /* line 50 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('scenario_outline', data, p, eof);
                                            break;
                                        case 10:
                                            /* line 54 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = this.store_keyword_content('examples', data, p, eof);
                                            break;
                                        case 11:
                                            /* line 58 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            this.listener.step(this.keyword, con, this.current_line);
                                            break;
                                        case 12:
                                            /* line 63 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            this.listener.comment(con, this.line_number);
                                            this.keyword_start = null;
                                            break;
                                        case 13:
                                            /* line 69 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            this.listener.tag(con, this.line_number);
                                            this.keyword_start = null;
                                            break;
                                        case 14:
                                            /* line 75 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.line_number++;
                                            break;
                                        case 15:
                                            /* line 79 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.last_newline = p + 1;
                                            break;
                                        case 16:
                                            /* line 83 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.keyword_start = this.keyword_start || p;
                                            break;
                                        case 17:
                                            /* line 87 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.keyword = this.bytesToString(data.slice(this.keyword_start, p)).replace(/:$/, '');
                                            this.keyword_start = null;
                                            break;
                                        case 18:
                                            /* line 92 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.next_keyword_start = p;
                                            break;
                                        case 19:
                                            /* line 96 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            p = p - 1;
                                            current_row = [];
                                            this.current_line = this.line_number;
                                            break;
                                        case 20:
                                            /* line 102 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.content_start = p;
                                            break;
                                        case 21:
                                            /* line 106 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            var con = this.bytesToString(data.slice(this.content_start, p)).trim();
                                            current_row.push(con.replace(/\\\|/, "|").replace(/\\n/, "\n").replace(/\\\\/, "\\"));
                                            break;
                                        case 22:
                                            /* line 111 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            this.listener.row(current_row, this.current_line);
                                            break;
                                        case 23:
                                            /* line 115 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            if(this.cs < lexer_first_final) {
                                                var content = this.current_line_content(data, p);
                                                throw "Lexing error on line " + this.line_number + ": '" + content + "'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.";
                                            } else {
                                                this.listener.eof();
                                            }

                                            break;
                                        /* line 1012 "js/lib/gherkin/lexer/en.js" */
                                    } /* action switch */
                                }
                            }
                            if (_trigger_goto) {
                                continue;
                            }
                        }
                        if (_goto_level <= _again) {
                            if ( this.cs == 0) {
                                _goto_level = _out;
                                continue;
                            }
                            p += 1;
                            if (p != pe) {
                                _goto_level = _resume;
                                continue;
                            }
                        }
                        if (_goto_level <= _test_eof) {
                            if (p == eof) {
                                __acts = _lexer_eof_actions[ this.cs];
                                __nacts =  _lexer_actions[__acts];
                                __acts += 1;
                                while (__nacts > 0) {
                                    __nacts -= 1;
                                    __acts += 1;
                                    switch (_lexer_actions[__acts - 1]) {
                                        case 23:
                                            /* line 115 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */

                                            if(this.cs < lexer_first_final) {
                                                var content = this.current_line_content(data, p);
                                                throw "Lexing error on line " + this.line_number + ": '" + content + "'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.";
                                            } else {
                                                this.listener.eof();
                                            }

                                            break;
                                        /* line 1051 "js/lib/gherkin/lexer/en.js" */
                                    } /* eof action switch */
                                }
                                if (_trigger_goto) {
                                    continue;
                                }
                            }
                        }
                        if (_goto_level <= _out) {
                            break;
                        }
                    }
                }

                /* line 163 "/Users/ahellesoy/github/gherkin/tasks/../ragel/i18n/en.js.rl" */
            };

            Lexer.prototype.bytesToString = function(bytes) {
                if(typeof bytes.write == 'function') {
                    // Node.js
                    return bytes.toString('utf-8');
                } else {
                    var result = "";
                    for(var b in bytes) {
                        result += String.fromCharCode(bytes[b]);
                    }
                    return result;
                }
            };

            Lexer.prototype.stringToBytes = function(string) {
                var bytes = [];
                for(var i = 0; i < string.length; i++) {
                    bytes[i] = string.charCodeAt(i);
                }
                return bytes;
            };

            Lexer.prototype.unindent = function(startcol, text) {
                startcol = startcol || 0;
                return text.replace(new RegExp('^[\t ]{0,' + startcol + '}', 'gm'), '');
            };

            Lexer.prototype.store_keyword_content = function(event, data, p, eof) {
                var end_point = (!this.next_keyword_start || (p == eof)) ? p : this.next_keyword_start;
                var content = this.unindent(this.start_col + 2, this.bytesToString(data.slice(this.content_start, end_point))).replace(/\s+$/,"");
                var content_lines = content.split("\n")
                var name = content_lines.shift() || "";
                name = name.trim();
                var description = content_lines.join("\n");
                this.listener[event](this.keyword, name, description, this.current_line);
                var nks = this.next_keyword_start;
                this.next_keyword_start = null;
                return nks ? nks - 1 : p;
            };

            Lexer.prototype.current_line_content = function(data, p) {
                var rest = data.slice(this.last_newline, -1);
                var end = rest.indexOf(10) || -1;
                return this.bytesToString(rest.slice(0, end)).trim();
            };

// Node.js export
            if(typeof module !== 'undefined') {
                module.exports = Lexer;
            }
// Require.js export
            if (typeof define !== 'undefined') {
                if(define.amd) {
                    define('gherkin/lexer/en', [], function() {
                        return Lexer;
                    });
                } else {
                    define('gherkin/lexer/en', function(require, exports, module) {
                        exports.Lexer = Lexer;
                    });
                }
            }

        })();

    });
    require("/node_modules/gherkin/lexer/en");

    context.Cucumber = require('/cucumber');
    context.CucumberHTML = require('cucumber-html/src/main/resources/cucumber/formatter/formatter');
})(window);})();

/*! jQuery v1.10.1 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
 //@ sourceMappingURL=jquery-1.10.1.min.map
 */
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.1",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=lt(),k=lt(),E=lt(),S=!1,A=function(){return 0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=bt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+xt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return At(e.replace(z,"$1"),t,n,i)}function st(e){return K.test(e+"")}function lt(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function ut(e){return e[b]=!0,e}function ct(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function pt(e,t,n){e=e.split("|");var r,i=e.length,a=n?null:t;while(i--)(r=o.attrHandle[e[i]])&&r!==t||(o.attrHandle[e[i]]=a)}function ft(e,t){var n=e.getAttributeNode(t);return n&&n.specified?n.value:e[t]===!0?t.toLowerCase():null}function dt(e,t){return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}function ht(e){return"input"===e.nodeName.toLowerCase()?e.defaultValue:t}function gt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function mt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function yt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function vt(e){return ut(function(t){return t=+t,ut(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.parentWindow;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.frameElement&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ct(function(e){return e.innerHTML="<a href='#'></a>",pt("type|href|height|width",dt,"#"===e.firstChild.getAttribute("href")),pt(B,ft,null==e.getAttribute("disabled")),e.className="i",!e.getAttribute("className")}),r.input=ct(function(e){return e.innerHTML="<input>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")}),pt("value",ht,r.attributes&&r.input),r.getElementsByTagName=ct(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ct(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ct(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=st(n.querySelectorAll))&&(ct(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ct(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=st(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ct(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=st(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},r.sortDetached=ct(function(e){return 1&e.compareDocumentPosition(n.createElement("div"))}),A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return gt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?gt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:ut,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=bt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?ut(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ut(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?ut(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ut(function(e){return function(t){return at(e,t).length>0}}),contains:ut(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:ut(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:vt(function(){return[0]}),last:vt(function(e,t){return[t-1]}),eq:vt(function(e,t,n){return[0>n?n+t:n]}),even:vt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:vt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:vt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:vt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=mt(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=yt(n);function bt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function xt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function wt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function Tt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function Ct(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function Nt(e,t,n,r,i,o){return r&&!r[b]&&(r=Nt(r)),i&&!i[b]&&(i=Nt(i,o)),ut(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||St(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:Ct(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=Ct(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=Ct(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function kt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=wt(function(e){return e===t},s,!0),p=wt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[wt(Tt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return Nt(l>1&&Tt(f),l>1&&xt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&kt(e.slice(l,r)),i>r&&kt(e=e.slice(r)),i>r&&xt(e))}f.push(n)}return Tt(f)}function Et(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=Ct(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?ut(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=bt(e)),n=t.length;while(n--)o=kt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Et(i,r))}return o};function St(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function At(e,t,n,i){var a,s,u,c,p,f=bt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&xt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}o.pseudos.nth=o.pseudos.eq;function jt(){}jt.prototype=o.filters=o.pseudos,o.setFilters=new jt,r.sortStable=b.split("").sort(A).join("")===b,p(),[0,0].sort(A),r.detectDuplicates=S,x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!l||i&&!u||(n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)
}),n=s=l=u=r=o=null,t}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=x(this),l=t,u=e.match(T)||[];while(o=u[a++])l=r?l:!s.hasClass(o),s[l?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
    u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);

define("../vendor/jquery-1.10.1.min.js", function(){});

(function (global) {

    var FileLoader = function FileLoader(karma, window) {
        var self = {
            find: function find(regex) {
                var matchingFiles = [];
                var files = karma.files;
                for (var filePath in files) {
                    if (filePath.match(regex)) {
                        matchingFiles.push(filePath);
                    }
                }
                return matchingFiles;
            },

            loadFile: function loadFile(filePath) {
                var xmlHttp;

                if (window.XMLHttpRequest) {
                    xmlHttp = new window.XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    xmlHttp = new window.ActiveXObject('Microsoft.XMLHTTP');
                }

                xmlHttp.open("GET", filePath, false);
                xmlHttp.send();
                return xmlHttp.responseText;
            },

            toString: function toString() {
                return '[object FileLoader]';
            }
        };

        return self;
    };

    define('adapter/file_loader',[], function () {
        return FileLoader;
    });

}(window));
(function (global) {
    var TemplateLoader = function TemplateLoader(karma, window) {
        var $ = TemplateLoader.$;
        var body = $('body');
        var head = $('head');

        var fileLoader = TemplateLoader.FileLoader(karma, window);

        var self = {
            loadHtml: function loadHtml() {
                self.loadCSS();
                self.loadFeatureRunnerTemplate();
                self.loadAppTemplate();
            },

            loadCSS: function loadCSS() {
                var cssFiles = fileLoader.find(TemplateLoader.CSS_REGEX);
                if (cssFiles && cssFiles.length > 0) {
                    cssFiles.forEach(self.addLinkTag);
                }
            },

            loadAppTemplate: function loadAppTemplate() {
                var matches = fileLoader.find(TemplateLoader.APP_TEMPLATE_REGEX);
                if (matches && matches.length) {
                    var cucumberHtmlReporter = $('#cucumber_html_reporter');
                    matches.forEach(function (match) {
                        cucumberHtmlReporter.prepend(fileLoader.loadFile(match));
                    });
                }
            },

            loadFeatureRunnerTemplate: function loadFeatureRunnerTemplate() {
                body.append(TemplateLoader.FEATURE_RUNNER_TEMPLATE);
            },

            addLinkTag: function addLinkTag(filePath) {
                var link  = TemplateLoader.document.createElement('link');
                link.href = filePath;
                link.type = "text/css";
                link.rel  = "stylesheet";
                head.append(link);
                return link;
            }
        };

        return self;
    };

    TemplateLoader.FEATURE_RUNNER_TEMPLATE = '' +
        '<div class="cucumberjs">karma-cucumberjs</div>' +
        '<div id="cucumber_html_reporter" style="position: relative; z-index: 9999;"></div>';

    TemplateLoader.CSS_REGEX = /\.css$/;
    TemplateLoader.APP_TEMPLATE_REGEX = /app\.template$/;

    define('adapter/template_loader',['./file_loader'], function (FileLoader) {
        TemplateLoader.FileLoader = FileLoader;

        // The adapter contains jquery, this reference is assumed to exist
        TemplateLoader.$ = global.$;

        TemplateLoader.document = global.document;

        return TemplateLoader;
    });
}(window));
(function (global) {
    var HtmlListener = function HtmlListener() {
        var $ = HtmlListener.$, domFormatter;

        var self = {
            output: null,
            domFormatterFeatureReport: null,
            cucumberHtmlReporter: null,
            cucumberJsHtmlReport: null,
            eventMap: null,
            currentStep: null,

            hear: function hear(event, callback) {
                if (!self.eventMap) {
                    self.eventMap = {
                        'BeforeFeature': self.beforeFeature,
                        'BeforeScenario': self.beforeScenario,
                        'BeforeStep': self.beforeStep,
                        'StepResult': self.stepResult
                    };
                }

                var eventName = event.getName();

                // Some event names are not handled, those throw
                try {
                    self.eventMap[eventName](event);
                } catch (e) {}

                callback();
            },

            beforeFeature: function beforeFeature(event) {
                var feature = event.getPayloadItem('feature');
                var featureData = {
                    keyword: feature.getKeyword(),
                    name: feature.getName(),
                    line: feature.getLine(),
                    description: feature.getDescription()
                };
                domFormatter.feature(featureData);
            },

            beforeScenario: function beforeScenario(event) {
                var scenario = event.getPayloadItem('scenario');
                var scenarioData = {
                    keyword: scenario.getKeyword(),
                    name: scenario.getName(),
                    line: scenario.getLine(),
                    description: scenario.getDescription()
                };
                domFormatter.scenario(scenarioData);
            },

            beforeStep: function beforeStep(event) {
                var step = event.getPayloadItem('step');
                self.currentStep = step;
                var stepData = {
                    keyword: step.getKeyword(),
                    name: step.getName(),
                    line: step.getLine()
                };
                domFormatter.step(stepData);
            },

            stepResult: function stepResult(event) {
                var result = event.getPayloadItem('stepResult');

                var currentLine = self.currentStep.getLine();
                domFormatter.match({uri: HtmlListener.URI, step: {line: currentLine}});

                var update = {};
                if (result.isSuccessful()) {
                    update.status = 'passed';
                } else if (result.isPending()) {
                    update.status = 'pending';
                } else if (result.isUndefined() || result.isSkipped()) {
                    update.status = 'skipped';
                } else {
                    var error = result.getFailureException();
                    update.status = 'failed';
                    update.error_message = error.stack || error;
                }
                domFormatter.result(update);
            }
        };

        self.output                     = $(HtmlListener.OUTPUT_TEMPLATE);
        self.domFormatterFeatureReport  = $(HtmlListener.DOM_FORMATTER_REPORT_TEMPLATE);
        self.cucumberHtmlReporter       = $(HtmlListener.CUCUMBER_HTML_REPORTER_DIV_SELECTOR);
        self.cucumberJsHtmlReport       = $(HtmlListener.CUCUMBER_HTML_REPORT_TEMPLATE);

        self.cucumberJsHtmlReport.appendTo(self.cucumberHtmlReporter);
        self.output.appendTo(self.cucumberHtmlReporter);
        self.output.append(self.domFormatterFeatureReport);

        domFormatter = new HtmlListener.CucumberHTML.DOMFormatter(self.domFormatterFeatureReport);
        domFormatter.uri(HtmlListener.URI);

        return self;
    };

    HtmlListener.OUTPUT_TEMPLATE                      = '<div id=\'output\' class=\'cucumber-report\'></div>';
    HtmlListener.DOM_FORMATTER_REPORT_TEMPLATE        = '<div></div>';
    HtmlListener.CUCUMBER_HTML_REPORTER_DIV_SELECTOR  = '#cucumber_html_reporter';
    HtmlListener.CUCUMBER_HTML_REPORT_TEMPLATE        = '<div id=\'CucumberJsHtmlReport\'></div>';
    HtmlListener.URI                                  = 'report.feature';

    define('adapter/cucumber_runner/html_listener',[], function () {
        HtmlListener.$ = global.jQuery;
        HtmlListener.CucumberHTML = global.CucumberHTML;

        return HtmlListener;
    });

}(window));
(function (global) {
    var KarmaListener = function KarmaListener(karma) {
        var self = {
            currentStep: null,
            currentScenario: null,
            currentFeature: null,
            scenarioSuccess: true,
            scenarioSkipped: false,
            scenarioLog: [],
            totalSteps: 0,
            eventMap: null,

            hear: function hear(event, callback) {
                if (!self.eventMap) {
                    self.eventMap = {
                        'BeforeFeature': self.beforeFeature,
                        'BeforeScenario': self.beforeScenario,
                        'BeforeStep': self.beforeStep,
                        'StepResult': self.stepResult
                    };
                }

                var eventName = event.getName();

                // Some event names are not handled, those throw
                try {
                    self.eventMap[eventName](event);
                } catch (e) {}

                callback();
            },

            beforeFeature: function beforeFeature(event) {
                self.currentFeature = event.getPayloadItem('feature');
            },

            beforeScenario: function beforeScenario(event) {
                self.currentScenario = event.getPayloadItem('scenario');
                self.currentScenario._time = new Date().getTime();
            },

            beforeStep: function beforeStep(event) {
                self.currentStep = event.getPayloadItem('step');
            },

            stepResult: function stepResult(event) {
                self.totalSteps++;
                karma.info({total: self.totalSteps});

                var result = event.getPayloadItem('stepResult');
                var stepSuccessful = self.checkStepSuccess(result);
                var stepSkipped = self.checkStepSkipped(result);

                self.checkStepFailure(result);

                var currentScenarioName = self.currentScenario.getName();
                var currentFeatureName = self.currentFeature.getName();
                var timeElapsed = self.getScenarioTimeElapsed(stepSkipped);

                karma.result({
                    description: currentScenarioName,
                    log: self.scenarioLog,
                    suite: [currentFeatureName],
                    success: stepSuccessful,
                    skipped: stepSkipped,
                    time: timeElapsed
                });
            },

            checkStepSuccess: function checkStepSuccess(stepResult) {
                return self.scenarioSuccess && stepResult.isSuccessful();
            },

            checkStepSkipped: function checkStepSkipped(stepResult) {
                return stepResult.isSkipped();
            },

            checkStepFailure: function checkStepFailure(stepResult) {
                if (!stepResult.isSuccessful() &&
                    !stepResult.isPending() &&
                    !stepResult.isUndefined() &&
                    !stepResult.isSkipped()) {
                    var error = stepResult.getFailureException();
                    var currentStepName = self.currentStep.getName();

                    var errorLog = "";
                    if (error.stack) {
                        errorLog = currentStepName + '\n' + error.stack;
                    } else {
                        errorLog = currentStepName + '\n' + error;
                    }
                    self.scenarioLog.push(errorLog);
                }
            },

            getScenarioTimeElapsed: function getScenarioTimeElapsed(scenarioSkippedStatus) {
                var timeElapsed;
                if (scenarioSkippedStatus) {
                    timeElapsed = 0;
                } else {
                    timeElapsed = new Date().getTime() - self.currentStep._time;
                }

                return timeElapsed;
            },

            toString: function toString() {
                return '[object KarmaListener]';
            }
        };

        return self;
    };

    define('adapter/cucumber_runner/karma_listener',[], function () {
        return KarmaListener;
    });
}(window));
(function (global) {
    var CucumberRunner = function CucumberRunner(karma, window) {
        var fileLoader = CucumberRunner.FileLoader(karma, window);

        var self = {
            // Reference to the context object created by CucumberJS with the API hooks (Given, When, Then, World, etc)
            // https://github.com/cucumber/cucumber-js/blob/master/lib/cucumber/support_code/library.js#L62
            supportCodeHelper: null,

            features: [],
            karmaFiles: karma.files,

            initialize: function initialize() {
                var featureFiles = self.getFeatureFilePaths();

                if (featureFiles && featureFiles.length) {
                    featureFiles.forEach(self.loadFeature);
                } else {
                    throw new Error("No .feature files were found in your Karma config. Please add some .feature files to your Karma configuration.");
                }
            },

            getFeatureFilePaths: function getFeatureFilePaths() {
                var featureFilesPaths = [];
                for (var filePath in self.karmaFiles) {
                    if (filePath.match(/\.feature$/)) {
                        featureFilesPaths.push(filePath);
                    }
                }
                return featureFilesPaths;
            },

            loadFeature: function loadFeature(featureFilePath) {
                var fileContents = fileLoader.loadFile(featureFilePath);
                self.features.push([featureFilePath, fileContents]);
            },

            startCucumberRun: function startCucumberRun() {
                var cucumber = CucumberRunner.Cucumber(self.features, self.stepDefinitionsFunction);
                cucumber.attachListener(CucumberRunner.HtmlListener());
                cucumber.attachListener(CucumberRunner.KarmaListener(karma));
                cucumber.attachListener(CucumberRunner.Cucumber.Listener.PrettyFormatter({
                    logToConsole: false,
                    logToFunction: self.prettyFormatterLogger
                }));

                setTimeout(function () {
                    cucumber.start(self.onCucumberFinished);
                }, 1);
            },

            stepDefinitionsFunction: function stepDefinitionsFunction() {
                self.supportCodeHelper = this;
                CucumberRunner.stepDefinitions.forEach(self.runStepDefinition);
            },

            runStepDefinition: function runStepDefinition(stepDefinition) {
                stepDefinition(self.supportCodeHelper);
            },

            prettyFormatterLogger: function prettyFormatterLogger(cucumberLog) {
                cucumberLog = cucumberLog.trim();
                cucumberLog = cucumberLog.split('\n');
                cucumberLog.forEach(self.log);
            },

            log: function log(message) {
                if (window.console && window.console.log) {
                    window.console.log(message);
                }
            },

            onCucumberFinished: function onCucumberFinished() {
                karma.complete({});
            }
        };

        window.startCucumberRun = self.startCucumberRun;

        return self;
    };

    CucumberRunner.stepDefinitions = [];

    CucumberRunner.addStepDefinitions = function addStepDefinitions(stepDefinitionsFunction) {
        CucumberRunner.stepDefinitions.push(stepDefinitionsFunction);
    };
    window.addStepDefinitions = CucumberRunner.addStepDefinitions;

    define('adapter/cucumber_runner',['./file_loader', './cucumber_runner/html_listener', './cucumber_runner/karma_listener'], function (FileLoader, HtmlListener, KarmaListener) {
        CucumberRunner.FileLoader = FileLoader;
        CucumberRunner.HtmlListener = HtmlListener;
        CucumberRunner.KarmaListener = KarmaListener;

        CucumberRunner.global = global;
        CucumberRunner.Cucumber = global.Cucumber;

        return CucumberRunner;
    });
}(window));
(function (global) {
    var Adapter = function Adapter() {
        var karma = Adapter.karma;
        var window = Adapter.window;

        var templateLoader = Adapter.TemplateLoader(karma, window);
        var cucumberRunner = Adapter.CucumberRunner(karma, window);

        var self = {
            start: function start() {
                templateLoader.loadHtml();
                cucumberRunner.initialize();
            },

            dump: function dump(value) {
                if (self.isAngularMockDumpAvailable()) {
                    value = window.angular.mock.dump(value);
                }
                return value;
            },

            isAngularMockDumpAvailable: function isAngularMockDumpAvailable() {
                return (window &&
                    window.angular &&
                    window.angular.mock &&
                    typeof window.angular.mock.dump === 'function') ? true:false;
            }
        };

        karma.start = self.start;
        karma.loaded = self.noop;
        window.dump = self.dump;

        return self;
    };

    define('adapter',[
        './adapter/template_loader',
        './adapter/cucumber_runner'
    ], function (TemplateLoader, CucumberRunner) {
        Adapter.TemplateLoader = TemplateLoader;
        Adapter.CucumberRunner = CucumberRunner;

        Adapter.karma = global.__karma__;
        Adapter.window = global;

        return Adapter;
    });
}(window));









window.__karma__.loaded = function () {};
require(["adapter"], function (Adapter) {
    Adapter().start();
});
define("main", function(){});
