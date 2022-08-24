export interface ExtensionState {
    downloadDialogueOpen: boolean;
    dialogueTriggerButton: HTMLElement | null;
    openDownloadDialogue: (triggerButton: HTMLElement) => void;
    closeDialogue: () => void;
}
