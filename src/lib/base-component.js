// base-component v1.1.2 https://github.com/iiif-commons/base-component#readme
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.baseComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){

var _Components;
(function (_Components) {
    var BaseComponent = /** @class */ (function () {
        function BaseComponent(options) {
            this.options = options;
            this.options.data = $.extend(this.data(), options.data);
        }
        BaseComponent.prototype._init = function () {
            this._$element = $(this.options.target);
            if (!this._$element.length) {
                console.warn('element not found');
                return false;
            }
            this._$element.empty();
            return true;
        };
        BaseComponent.prototype.data = function () {
            return {};
        };
        BaseComponent.prototype.on = function (name, callback, ctx) {
            var e = this._e || (this._e = {});
            (e[name] || (e[name] = [])).push({
                fn: callback,
                ctx: ctx
            });
        };
        BaseComponent.prototype.fire = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var data = [].slice.call(arguments, 1);
            var evtArr = ((this._e || (this._e = {}))[name] || []).slice();
            var i = 0;
            var len = evtArr.length;
            for (i; i < len; i++) {
                evtArr[i].fn.apply(evtArr[i].ctx, data);
            }
        };
        BaseComponent.prototype._resize = function () {
        };
        BaseComponent.prototype.set = function (data) {
        };
        return BaseComponent;
    }());
    _Components.BaseComponent = BaseComponent;
})(_Components || (_Components = {}));
(function (g) {
    if (!g._Components) {
        g._Components = _Components;
    }
})(global);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});