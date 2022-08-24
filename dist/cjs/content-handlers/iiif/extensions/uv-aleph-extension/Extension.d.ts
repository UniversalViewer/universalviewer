import { AlephCenterPanel } from "../../modules/uv-alephcenterpanel-module/AlephCenterPanel";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAlephExtension } from "./IAlephExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { AlephLeftPanel } from "../../modules/uv-alephleftpanel-module/AlephLeftPanel";
import "./theme/theme.less";
export default class Extension extends BaseExtension implements IAlephExtension {
    $downloadDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: AlephCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: AlephLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;
    defaultConfig: any;
    locales: {
        "en-GB": {
            options: {
                allowStealFocus: boolean;
                authAPIVersion: number;
                bookmarkThumbHeight: number;
                bookmarkThumbWidth: number;
                dropEnabled: boolean;
                footerPanelEnabled: boolean;
                headerPanelEnabled: boolean;
                leftPanelEnabled: boolean;
                limitLocales: boolean;
                metrics: {
                    type: string;
                    minWidth: number;
                }[];
                multiSelectionMimeType: string;
                navigatorEnabled: boolean;
                openTemplate: string;
                overrideFullScreen: boolean;
                pagingEnabled: boolean;
                pagingOptionEnabled: boolean;
                pessimisticAccessControl: boolean;
                preserveViewport: boolean;
                rightPanelEnabled: boolean;
                saveUserSettings: boolean;
                clickToZoomEnabled: boolean;
                searchWithinEnabled: boolean;
                termsOfUseEnabled: boolean;
                theme: string;
                tokenStorage: string;
                useArrowKeysToNavigate: boolean;
                zoomToSearchResultEnabled: boolean;
            };
            modules: {
                alephLeftPanel: {
                    options: {
                        expandFullEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        consoleTabEnabled: boolean;
                        graphTabEnabled: boolean;
                        settingsTabEnabled: boolean;
                        srcTabEnabled: boolean;
                    };
                    content: {
                        collapse: string;
                        collapseFull: string;
                        expand: string;
                        expandFull: string;
                        title: string;
                    };
                };
                dialogue: {
                    topCloseButtonEnabled: boolean;
                    content: {
                        close: string;
                    };
                };
                footerPanel: {
                    options: {
                        bookmarkEnabled: boolean;
                        downloadEnabled: boolean;
                        embedEnabled: boolean;
                        feedbackEnabled: boolean;
                        fullscreenEnabled: boolean;
                        minimiseButtons: boolean;
                        moreInfoEnabled: boolean;
                        openEnabled: boolean;
                        printEnabled: boolean;
                        shareEnabled: boolean;
                    };
                    content: {
                        bookmark: string;
                        download: string;
                        embed: string;
                        exitFullScreen: string;
                        feedback: string;
                        fullScreen: string;
                        moreInfo: string;
                        open: string;
                        share: string;
                    };
                };
                genericDialogue: {
                    content: {
                        emptyValue: string;
                        invalidNumber: string;
                        noMatches: string;
                        ok: string;
                        pageNotFound: string;
                        refresh: string;
                    };
                };
                headerPanel: {
                    options: {
                        localeToggleEnabled: boolean;
                        settingsButtonEnabled: boolean;
                    };
                    content: {
                        settings: string;
                    };
                };
                helpDialogue: {
                    content: {
                        text: string;
                        title: string;
                    };
                };
                moreInfoRightPanel: {
                    options: {
                        canvasDisplayOrder: string;
                        canvasExclude: string;
                        copyToClipboardEnabled: boolean;
                        manifestDisplayOrder: string;
                        manifestExclude: string;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        rtlLanguageCodes: string;
                        showAllLanguages: boolean;
                        textLimit: number;
                        textLimitType: string;
                        limitToRange: boolean;
                    };
                    content: {
                        attribution: string;
                        collapse: string;
                        collapseFull: string;
                        description: string;
                        expand: string;
                        expandFull: string;
                        holdingText: string;
                        less: string;
                        license: string;
                        logo: string;
                        more: string;
                        noData: string;
                        page: string;
                        title: string;
                        manifestHeader: string;
                        canvasHeader: string;
                        copyToClipboard: string;
                        copiedToClipboard: string;
                    };
                };
                alephCenterPanel: {
                    options: {
                        dracoDecoderPath: string;
                    };
                    content: {
                        attribution: string;
                    };
                };
                settingsDialogue: {
                    content: {
                        locale: string;
                        navigatorEnabled: string;
                        clickToZoomEnabled: string;
                        pagingEnabled: string;
                        reducedMotion: string;
                        preserveViewport: string;
                        title: string;
                        website: string;
                    };
                };
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        instructionsEnabled: boolean;
                        shareFrameEnabled: boolean;
                    };
                    content: {
                        customSize: string;
                        embed: string;
                        embedInstructions: string;
                        height: string;
                        iiif: string;
                        share: string;
                        shareInstructions: string;
                        size: string;
                        width: string;
                    };
                };
                authDialogue: {
                    content: {
                        cancel: string;
                        confirm: string;
                    };
                };
                clickThroughDialogue: {
                    content: {
                        viewTerms: string;
                    };
                };
                downloadDialogue: {
                    content: {
                        currentViewAsJpg: string;
                        currentViewAsJpgExplanation: string;
                        download: string;
                        downloadSelection: string;
                        downloadSelectionExplanation: string;
                        editSettings: string;
                        entireDocument: string;
                        entireFileAsOriginal: string;
                        entireFileAsOriginalWithFormat: string;
                        noneAvailable: string;
                        pagingNote: string;
                        preview: string;
                        title: string;
                        wholeImageHighRes: string;
                        wholeImageHighResExplanation: string;
                        wholeImagesHighRes: string;
                        wholeImagesHighResExplanation: string;
                        wholeImageLowResAsJpg: string;
                        wholeImageLowResAsJpgExplanation: string;
                    };
                };
                loginDialogue: {
                    content: {
                        login: string;
                        logout: string;
                        cancel: string;
                    };
                };
                restrictedDialogue: {
                    content: {
                        cancel: string;
                    };
                };
            };
            localisation: {
                label: string;
                locales: {
                    name: string;
                    label: string;
                }[];
            };
            content: {
                authCORSError: string;
                authorisationFailedMessage: string;
                canvasIndexOutOfRange: string;
                fallbackDegradedLabel: string;
                fallbackDegradedMessage: string;
                forbiddenResourceMessage: string;
                termsOfUse: string;
                mediaViewer: string;
                skipToDownload: string;
            };
        };
    };
    create(): void;
    createModules(): Promise<void>;
    render(): void;
    isLeftPanelEnabled(): boolean;
    getEmbedScript(template: string, width: number, height: number): string;
}
