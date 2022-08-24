"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normaliseContentState = exports.decodeContentState = exports.encodeContentState = exports.parseContentState = exports.serialiseContentState = exports.validateContentState = void 0;
var expand_target_1 = require("./expand-target");
function validateContentState(annotation, strict) {
    if (strict === void 0) { strict = false; }
    // Valid content state.
    if (typeof annotation === "string") {
        if (annotation.startsWith("{")) {
            try {
                var parsed = JSON.parse(annotation);
                return validateContentState(parsed);
            }
            catch (err) {
                return [false, { reason: "Invalid JSON" }];
            }
        }
        return [true];
    }
    if (Array.isArray(annotation)) {
        for (var _i = 0, annotation_1 = annotation; _i < annotation_1.length; _i++) {
            var anno = annotation_1[_i];
            var _a = validateContentState(anno), valid = _a[0], reason = _a[1];
            if (!valid && reason) {
                return [valid, reason];
            }
        }
        return [true];
    }
    if (annotation.type === "Annotation") {
        // We are validating the annotation.
        return [true];
    }
    if (strict && annotation.type === "Canvas" && !annotation.partOf) {
        return [false, { reason: "Canvas without partOf cannot be loaded" }];
    }
    return [true];
}
exports.validateContentState = validateContentState;
function serialiseContentState(annotation) {
    return encodeContentState(typeof annotation === "string" ? annotation : JSON.stringify(annotation));
}
exports.serialiseContentState = serialiseContentState;
function parseContentState(state, asyncOrFetcher) {
    state = state.trim();
    if (state[0] === "{") {
        // we might have json.
        return asyncOrFetcher
            ? Promise.resolve(JSON.parse(state))
            : JSON.parse(state);
    }
    if (state.startsWith("http")) {
        if (!asyncOrFetcher) {
            throw new Error("Cannot fetch remote fetch with async=false in parseContentState");
        }
        // resolve.
        return fetch(state).then(function (r) { return r.json(); });
    }
    return parseContentState(decodeContentState(state), asyncOrFetcher);
}
exports.parseContentState = parseContentState;
function encodeContentState(state) {
    var uriEncoded = encodeURIComponent(state); // using built in function
    var base64 = typeof btoa === "undefined"
        ? Buffer.from(uriEncoded, "utf-8").toString("base64")
        : btoa(uriEncoded); // using built in function
    var base64url = base64.replace(/\+/g, "-").replace(/\//g, "_");
    return base64url.replace(/=/g, "");
}
exports.encodeContentState = encodeContentState;
function decodeContentState(encodedContentState) {
    var base64url = restorePadding(encodedContentState);
    var base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    var base64Decoded = typeof atob === "undefined"
        ? Buffer.from(base64, "base64").toString("utf-8")
        : atob(base64); // using built in function
    return decodeURIComponent(base64Decoded).trim(); // using built in function
}
exports.decodeContentState = decodeContentState;
function restorePadding(s) {
    // The length of the restored string must be a multiple of 4
    var pad = s.length % 4;
    if (pad === 1) {
        throw new Error("InvalidLengthError: Input base64url string is the wrong length to determine padding");
    }
    return s + (pad ? "====".slice(0, 4 - pad) : "");
}
function normaliseContentState(state) {
    if (!state) {
        throw new Error("Content state is empty");
    }
    if (!Array.isArray(state)) {
        // We have multiples.
        // throw new Error('Content state is an [Array] and not yet supported');
        state = [state];
    }
    var annoId = "vault://virtual-annotation/" + new Date().getTime(); // <-- need a virtual id
    var motivation = ["contentState"];
    var targets = [];
    for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
        var source = state_1[_i];
        if (typeof source === "string") {
            // Note: this is unlikely to happen in conjunction with parseContentState()
            throw new Error("Content state is a [String] type and cannot be inferred");
        }
        // If we DO have annotation, then this is all we should be returning.
        if (source.type === "Annotation") {
            annoId = source.id;
            if (Array.isArray(source.motivation)) {
                for (var _a = 0, _b = source.motivation; _a < _b.length; _a++) {
                    var singleMotivation = _b[_a];
                    if (motivation.indexOf(singleMotivation) === -1) {
                        motivation.push(singleMotivation);
                    }
                }
            }
            if (Array.isArray(source.target)) {
                for (var _c = 0, _d = source.target; _c < _d.length; _c++) {
                    var target_1 = _d[_c];
                    var expanded = (0, expand_target_1.expandTarget)(target_1);
                    targets.push(expanded);
                }
            }
            else {
                var expanded = (0, expand_target_1.expandTarget)(source.target);
                targets.push(expanded);
            }
            continue;
        }
        var target = (0, expand_target_1.expandTarget)(source);
        targets.push(target);
    }
    return {
        id: annoId,
        type: "Annotation",
        motivation: __spreadArray(["contentState"], (state.motivation || []), true),
        target: targets,
        extensions: {},
    };
}
exports.normaliseContentState = normaliseContentState;
//# sourceMappingURL=content-state.js.map