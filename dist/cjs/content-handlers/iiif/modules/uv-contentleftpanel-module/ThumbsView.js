"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var vocabulary_1 = require("@iiif/vocabulary");
var react_intersection_observer_1 = require("react-intersection-observer");
var classnames_1 = __importDefault(require("classnames"));
var ThumbImage = function (_a) {
    var first = _a.first, onClick = _a.onClick, paged = _a.paged, selected = _a.selected, thumb = _a.thumb, viewingDirection = _a.viewingDirection;
    var _b = (0, react_intersection_observer_1.useInView)({
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
        triggerOnce: true,
    }), ref = _b[0], inView = _b[1];
    return (react_1.default.createElement("div", { onClick: function () { return onClick(thumb); }, className: (0, classnames_1.default)("thumb", {
            first: first,
            placeholder: !thumb.uri,
            twoCol: paged &&
                (viewingDirection === vocabulary_1.ViewingDirection.LEFT_TO_RIGHT ||
                    viewingDirection === vocabulary_1.ViewingDirection.RIGHT_TO_LEFT),
            oneCol: !paged,
            selected: selected,
        }), tabIndex: 0 },
        react_1.default.createElement("div", { ref: ref, className: "wrap", style: {
                height: thumb.height + 8 + "px",
            } }, inView && react_1.default.createElement("img", { src: thumb.uri, alt: thumb.label })),
        react_1.default.createElement("div", { className: "info" },
            react_1.default.createElement("span", { className: "label", title: thumb.label },
                thumb.label,
                "\u00A0"),
            thumb.data.searchResults && (react_1.default.createElement("span", { className: "searchResults" }, thumb.data.searchResults)))));
};
var Thumbnails = function (_a) {
    var onClick = _a.onClick, paged = _a.paged, selected = _a.selected, thumbs = _a.thumbs, viewingDirection = _a.viewingDirection;
    var ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        var thumb = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.querySelector("#thumb-" + selected[0]);
        var y = thumb === null || thumb === void 0 ? void 0 : thumb.offsetTop;
        (_b = ref.current) === null || _b === void 0 ? void 0 : _b.parentElement.scrollTo({
            top: y,
            left: 0,
            behavior: 'smooth'
        });
    }, [selected]);
    function showSeparator(paged, viewingHint, index) {
        if (viewingHint === vocabulary_1.ViewingHint.NON_PAGED) {
            return true;
        }
        if (paged) {
            // if paged, show separator after every 2 thumbs
            return !((index - 1) % 2 === 0);
        }
        return true;
    }
    var firstNonPagedIndex = thumbs.findIndex(function (t) {
        return t.viewingHint !== vocabulary_1.ViewingHint.NON_PAGED;
    });
    return (react_1.default.createElement("div", { ref: ref, className: (0, classnames_1.default)("thumbs", {
            "left-to-right": viewingDirection === vocabulary_1.ViewingDirection.LEFT_TO_RIGHT,
            "right-to-left": viewingDirection === vocabulary_1.ViewingDirection.RIGHT_TO_LEFT,
            paged: paged,
        }) }, thumbs.map(function (thumb, index) { return (react_1.default.createElement("span", { key: "thumb-" + index, id: "thumb-" + index },
        react_1.default.createElement(ThumbImage, { first: index === firstNonPagedIndex, onClick: onClick, paged: paged, selected: selected.includes(index), thumb: thumb, viewingDirection: viewingDirection }),
        showSeparator(paged, thumb.viewingHint, index) && (react_1.default.createElement("div", { className: "separator" })))); })));
};
exports.default = Thumbnails;
//# sourceMappingURL=ThumbsView.js.map