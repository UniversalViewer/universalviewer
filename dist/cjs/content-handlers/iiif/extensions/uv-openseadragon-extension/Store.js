"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
var vanilla_1 = __importDefault(require("zustand/vanilla"));
var createStore = function () {
    return (0, vanilla_1.default)(function (set) { return ({
        downloadDialogueOpen: false,
        dialogueTriggerButton: null,
        openDownloadDialogue: function (triggerButton) {
            return set({ downloadDialogueOpen: true, dialogueTriggerButton: triggerButton });
        },
        closeDialogue: function () {
            return set({
                downloadDialogueOpen: false,
                dialogueTriggerButton: null,
            });
        },
    }); });
};
exports.createStore = createStore;
//# sourceMappingURL=Store.js.map