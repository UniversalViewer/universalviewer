import create from "zustand/vanilla";
import { ExtensionState } from "../../modules/uv-shared-module/ExtensionState";

export interface OpenSeadragonExtensionState extends ExtensionState {}

const store = create<OpenSeadragonExtensionState>((set) => ({
  downloadDialogueOpen: false,
  dialogueTriggerButton: null,
  openDownloadDialogue: (triggerButton: HTMLElement) =>
    set({ downloadDialogueOpen: true, dialogueTriggerButton: triggerButton }),
  closeDownloadDialogue: () =>
    set({ downloadDialogueOpen: false, dialogueTriggerButton: null }),
}));

export default store;
