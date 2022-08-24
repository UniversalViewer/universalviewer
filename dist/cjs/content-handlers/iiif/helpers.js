"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContentStateParameter = void 0;
var content_state_1 = require("./content-state/content-state");
function parseContentStateParameter(contentState) {
    if (!contentState) {
        return null;
    }
    if (typeof contentState === "string" && contentState.startsWith("http")) {
        return { type: "remote-content-state", id: contentState };
    }
    try {
        return (0, content_state_1.normaliseContentState)(typeof contentState === "string"
            ? (0, content_state_1.parseContentState)(contentState)
            : contentState);
    }
    catch (err) {
        return null;
    }
}
exports.parseContentStateParameter = parseContentStateParameter;
//# sourceMappingURL=helpers.js.map