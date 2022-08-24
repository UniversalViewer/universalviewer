"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSelector = void 0;
var BOX_SELECTOR = /&?(xywh=)?(pixel:|percent:)?([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?)/;
// Does not support 00:00:00 or 00:00 formats.
var TEMPORAL_SELECTOR = /&?(t=)(npt:)?([0-9]+(.[0-9]+)?)?(,([0-9]+(.[0-9]+)?))?/;
function parseSelector(source) {
    if (Array.isArray(source)) {
        return source.reduce(function (data, nextSource) {
            var _a;
            var _b = parseSelector(nextSource), selector = _b.selector, selectors = _b.selectors;
            if (selector) {
                if (!data.selector) {
                    data.selector = selector;
                }
                (_a = data.selectors).push.apply(_a, selectors);
            }
            return data;
        }, {
            selector: null,
            selectors: [],
        });
    }
    if (!source) {
        return {
            selector: null,
            selectors: [],
        };
    }
    if (typeof source === "string") {
        var _a = source.split("#"), _id = _a[0], fragment = _a[1];
        if (!fragment) {
            // This is an unknown selector.
            return {
                selector: null,
                selectors: [],
            };
        }
        return parseSelector({ type: "FragmentSelector", value: fragment });
    }
    if (source.type === "PointSelector" && (source.t || source.t === 0)) {
        var selector = {
            type: "TemporalSelector",
            startTime: source.t,
        };
        return {
            selector: selector,
            selectors: [selector],
        };
    }
    if (source.type === "FragmentSelector") {
        var matchBoxSelector = BOX_SELECTOR.exec(source.value);
        if (matchBoxSelector) {
            var selector = {
                type: "BoxSelector",
                unit: matchBoxSelector[2] === "percent:" ? "percent" : "pixel",
                x: parseFloat(matchBoxSelector[3]),
                y: parseFloat(matchBoxSelector[4]),
                width: parseFloat(matchBoxSelector[5]),
                height: parseFloat(matchBoxSelector[6]),
            };
            return {
                selector: selector,
                selectors: [selector],
            };
        }
        var matchTimeSelector = source.value.match(TEMPORAL_SELECTOR);
        if (matchTimeSelector) {
            var selector = {
                type: "TemporalSelector",
                startTime: matchTimeSelector[4] ? parseFloat(matchTimeSelector[4]) : 0,
                endTime: matchTimeSelector[7]
                    ? parseFloat(matchTimeSelector[7])
                    : undefined,
            };
            return {
                selector: selector,
                selectors: [selector],
            };
        }
        return {
            selector: null,
            selectors: [],
        };
    }
    return {
        selector: null,
        selectors: [],
    };
}
exports.parseSelector = parseSelector;
//# sourceMappingURL=parse-selector.js.map