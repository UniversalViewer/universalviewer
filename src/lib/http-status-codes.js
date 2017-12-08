// http-status-codes v0.0.7 https://github.com/edsilv/http-status-codes
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.httpStatusCodes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var HTTPStatusCode;
(function (HTTPStatusCode) {
    HTTPStatusCode.CONTINUE = 100;
    HTTPStatusCode.SWITCHING_PROTOCOLS = 101;
    HTTPStatusCode.PROCESSING = 102;
    HTTPStatusCode.OK = 200;
    HTTPStatusCode.CREATED = 201;
    HTTPStatusCode.ACCEPTED = 202;
    HTTPStatusCode.NON_AUTHORITATIVE_INFORMATION = 203;
    HTTPStatusCode.NO_CONTENT = 204;
    HTTPStatusCode.RESET_CONTENT = 205;
    HTTPStatusCode.PARTIAL_CONTENT = 206;
    HTTPStatusCode.MULTI_STATUS = 207;
    HTTPStatusCode.MULTIPLE_CHOICES = 300;
    HTTPStatusCode.MOVED_PERMANENTLY = 301;
    HTTPStatusCode.MOVED_TEMPORARILY = 302;
    HTTPStatusCode.SEE_OTHER = 303;
    HTTPStatusCode.NOT_MODIFIED = 304;
    HTTPStatusCode.USE_PROXY = 305;
    HTTPStatusCode.TEMPORARY_REDIRECT = 307;
    HTTPStatusCode.BAD_REQUEST = 400;
    HTTPStatusCode.UNAUTHORIZED = 401;
    HTTPStatusCode.PAYMENT_REQUIRED = 402;
    HTTPStatusCode.FORBIDDEN = 403;
    HTTPStatusCode.NOT_FOUND = 404;
    HTTPStatusCode.METHOD_NOT_ALLOWED = 405;
    HTTPStatusCode.NOT_ACCEPTABLE = 406;
    HTTPStatusCode.PROXY_AUTHENTICATION_REQUIRED = 407;
    HTTPStatusCode.REQUEST_TIME_OUT = 408;
    HTTPStatusCode.CONFLICT = 409;
    HTTPStatusCode.GONE = 410;
    HTTPStatusCode.LENGTH_REQUIRED = 411;
    HTTPStatusCode.PRECONDITION_FAILED = 412;
    HTTPStatusCode.REQUEST_ENTITY_TOO_LARGE = 413;
    HTTPStatusCode.REQUEST_URI_TOO_LARGE = 414;
    HTTPStatusCode.UNSUPPORTED_MEDIA_TYPE = 415;
    HTTPStatusCode.REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    HTTPStatusCode.EXPECTATION_FAILED = 417;
    HTTPStatusCode.IM_A_TEAPOT = 418;
    HTTPStatusCode.UNPROCESSABLE_ENTITY = 422;
    HTTPStatusCode.LOCKED = 423;
    HTTPStatusCode.FAILED_DEPENDENCY = 424;
    HTTPStatusCode.UNORDERED_COLLECTION = 425;
    HTTPStatusCode.UPGRADE_REQUIRED = 426;
    HTTPStatusCode.PRECONDITION_REQUIRED = 428;
    HTTPStatusCode.TOO_MANY_REQUESTS = 429;
    HTTPStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    HTTPStatusCode.INTERNAL_SERVER_ERROR = 500;
    HTTPStatusCode.NOT_IMPLEMENTED = 501;
    HTTPStatusCode.BAD_GATEWAY = 502;
    HTTPStatusCode.SERVICE_UNAVAILABLE = 503;
    HTTPStatusCode.GATEWAY_TIME_OUT = 504;
    HTTPStatusCode.HTTP_VERSION_NOT_SUPPORTED = 505;
    HTTPStatusCode.VARIANT_ALSO_NEGOTIATES = 506;
    HTTPStatusCode.INSUFFICIENT_STORAGE = 507;
    HTTPStatusCode.BANDWIDTH_LIMIT_EXCEEDED = 509;
    HTTPStatusCode.NOT_EXTENDED = 510;
    HTTPStatusCode.NETWORK_AUTHENTICATION_REQUIRED = 511;
})(HTTPStatusCode || (HTTPStatusCode = {}));
(function (g) {
    if (!g.HTTPStatusCode) {
        g.HTTPStatusCode = HTTPStatusCode;
    }
})(global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});