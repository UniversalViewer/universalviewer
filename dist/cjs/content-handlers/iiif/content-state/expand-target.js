"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandTarget = void 0;
var parse_selector_1 = require("./parse-selector");
function expandTarget(target, options) {
    if (options === void 0) { options = {}; }
    if (Array.isArray(target)) {
        // Don't support multiple targets for now.
        return expandTarget(target[0]);
    }
    if (typeof target === "string") {
        var _a = target.split("#"), id = _a[0], fragment = _a[1];
        if (!fragment) {
            // This is an unknown selector.
            return {
                type: "SpecificResource",
                source: {
                    id: id,
                    type: (options.typeMap && options.typeMap[id]) || "Unknown",
                },
                selector: null,
                selectors: [],
            };
        }
        return expandTarget({
            type: "SpecificResource",
            source: { id: id, type: "Unknown" },
            selector: {
                type: "FragmentSelector",
                value: fragment,
            },
        });
    }
    // @todo, how do we want to support choices for targets.
    if (target.type === "Choice" ||
        target.type === "List" ||
        target.type === "Composite" ||
        target.type === "Independents") {
        // we also don't support these, just choose the first.
        return expandTarget(target.items[0]);
    }
    if (target.type === "SpecificResource") {
        if (target.source.type === "Canvas" &&
            target.source.partOf &&
            typeof target.source.partOf === "string") {
            target.source.partOf = [
                {
                    id: target.source.partOf,
                    type: "Manifest",
                },
            ];
        }
        var _b = target.selector
            ? (0, parse_selector_1.parseSelector)(target.selector)
            : { selector: null, selectors: [] }, selector = _b.selector, selectors = _b.selectors;
        return {
            type: "SpecificResource",
            source: target.source,
            selector: selector,
            selectors: selectors,
        };
    }
    if (target.id) {
        if (target.type === "Canvas" &&
            target.partOf &&
            typeof target.partOf === "string") {
            target.partOf = [
                {
                    id: target.partOf,
                    type: "Manifest",
                },
            ];
        }
        var _c = target.id.split("#"), id = _c[0], fragment = _c[1];
        if (!fragment) {
            // This is an unknown selector.
            return {
                type: "SpecificResource",
                source: __assign(__assign({}, target), { id: id }),
                selector: null,
                selectors: [],
            };
        }
        return expandTarget({
            type: "SpecificResource",
            source: __assign(__assign({}, target), { id: id }),
            selector: {
                type: "FragmentSelector",
                value: fragment,
            },
        });
    }
    return {
        type: "SpecificResource",
        source: target,
        selector: null,
        selectors: [],
    };
}
exports.expandTarget = expandTarget;
//# sourceMappingURL=expand-target.js.map