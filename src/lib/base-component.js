// base-component v1.0.1 https://github.com/edsilv/base-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.baseComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


var Components;
(function (Components) {
    var BaseComponent = (function () {
        function BaseComponent(options) {
            this.options = $.extend(this._getDefaultOptions(), options);
        }
        BaseComponent.prototype._init = function () {
            this._$element = $(this.options.element);
            if (!this._$element.length) {
                console.warn('element not found');
                return false;
            }
            this._$element.empty();
            return true;
        };
        BaseComponent.prototype._getDefaultOptions = function () {
            return {};
        };
        BaseComponent.prototype._emit = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.emit(event, args);
        };
        BaseComponent.prototype._resize = function () {
        };
        BaseComponent.prototype.databind = function (data) {
        };
        return BaseComponent;
    }());
    Components.BaseComponent = BaseComponent;
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    Components.applyMixins = applyMixins;
    applyMixins(BaseComponent, [EventEmitter2]);
})(Components || (Components = {}));
(function (w) {
    if (!w.Components) {
        w.Components = Components;
    }
})(window);





},{}]},{},[1])(1)
});