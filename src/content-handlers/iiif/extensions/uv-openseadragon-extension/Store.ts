import { createStore as create } from "zustand/vanilla";
import type { ExtensionState } from "../../modules/uv-shared-module/ExtensionState";

export interface OpenSeadragonExtensionState extends ExtensionState {}

export const createStore = () =>
  create<OpenSeadragonExtensionState>((set) => ({
    downloadDialogueOpen: false,
    dialogueTriggerButton: null,
    openDownloadDialogue: (triggerButton: HTMLElement) =>
      set({ downloadDialogueOpen: true, dialogueTriggerButton: triggerButton }),
    closeDialogue: () =>
      set({
        downloadDialogueOpen: false,
        dialogueTriggerButton: null,
      }),
  }));
