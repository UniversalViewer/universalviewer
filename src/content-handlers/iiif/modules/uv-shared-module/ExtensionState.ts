export interface ExtensionState {
  downloadDialogueOpen: boolean;
  dialogueTriggerButton: HTMLElement | null;
  openDownloadDialogue: (triggerButton: HTMLElement) => void;
  closeDownloadDialogue: () => void;
}
