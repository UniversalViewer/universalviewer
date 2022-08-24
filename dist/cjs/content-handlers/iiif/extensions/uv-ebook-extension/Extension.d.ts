import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { EbookLeftPanel } from "../../modules/uv-ebookleftpanel-module/EbookLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { EbookCenterPanel } from "../../modules/uv-ebookcenterpanel-module/EbookCenterPanel";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-ebookmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IEbookExtension } from "./IEbookExtension";
import { MoreInfoDialogue } from "../../modules/uv-dialogues-module/MoreInfoDialogue";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import "./theme/theme.less";
export default class Extension extends BaseExtension implements IEbookExtension {
    $downloadDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: EbookCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: EbookLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    moreInfoDialogue: MoreInfoDialogue;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;
    cfiFragement: string;
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
                ebookLeftPanel: {
                    options: {
                        expandFullEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                    };
                    content: {
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
                ebookCenterPanel: {
                    options: {};
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
                avCenterPanel: {
                    content: {
                        attribution: string;
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
        "cy-GB": () => Promise<{
            default: {
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
                    ebookLeftPanel: {
                        options: {
                            expandFullEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
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
                    ebookCenterPanel: {
                        options: {};
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
                    clickThroughDialogue: {
                        content: {
                            viewTerms: string;
                        };
                    };
                    contentLeftPanel: {
                        content: {
                            collapse: string;
                            collapseFull: string;
                            date: string;
                            expand: string;
                            expandFull: string;
                            index: string;
                            searchResult: string;
                            searchResults: string;
                            sortBy: string;
                            thumbnails: string;
                            title: string;
                            volume: string;
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
                    mobileFooterPanel: {
                        content: {
                            rotateRight: string;
                            moreInfo: string;
                            zoomIn: string;
                            zoomOut: string;
                        };
                    };
                    avCenterPanel: {
                        content: {
                            attribution: string;
                            currentTime: string;
                            delimiter: string;
                            duration: string;
                            mute: string;
                            next: string;
                            pause: string;
                            play: string;
                            previous: string;
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
                    forbiddenResourceMessage: string;
                    termsOfUse: string;
                };
            };
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
                ebookLeftPanel: {
                    options: {
                        expandFullEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
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
                ebookCenterPanel: {
                    options: {};
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
                clickThroughDialogue: {
                    content: {
                        viewTerms: string;
                    };
                };
                contentLeftPanel: {
                    content: {
                        collapse: string;
                        collapseFull: string;
                        date: string;
                        expand: string;
                        expandFull: string;
                        index: string;
                        searchResult: string;
                        searchResults: string;
                        sortBy: string;
                        thumbnails: string;
                        title: string;
                        volume: string;
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
                mobileFooterPanel: {
                    content: {
                        rotateRight: string;
                        moreInfo: string;
                        zoomIn: string;
                        zoomOut: string;
                    };
                };
                avCenterPanel: {
                    content: {
                        attribution: string;
                        currentTime: string;
                        delimiter: string;
                        duration: string;
                        mute: string;
                        next: string;
                        pause: string;
                        play: string;
                        previous: string;
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
                forbiddenResourceMessage: string;
                termsOfUse: string;
            };
        }>;
        "fr-FR": () => Promise<{
            default: {
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
                    ebookLeftPanel: {
                        options: {
                            expandFullEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
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
                    ebookCenterPanel: {
                        options: {};
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
                    contentLeftPanel: {
                        content: {
                            collapse: string;
                            collapseFull: string;
                            date: string;
                            expand: string;
                            expandFull: string;
                            index: string;
                            manifestRanges: string;
                            searchResult: string;
                            searchResults: string;
                            sortBy: string;
                            thumbnails: string;
                            title: string;
                            volume: string;
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
                    mobileFooterPanel: {
                        content: {
                            rotateRight: string;
                            moreInfo: string;
                            zoomIn: string;
                            zoomOut: string;
                        };
                    };
                    multiSelectDialogue: {
                        content: {
                            select: string;
                            selectAll: string;
                            title: string;
                        };
                    };
                    pagingHeaderPanel: {
                        content: {
                            close: string;
                            emptyValue: string;
                            first: string;
                            firstImage: string;
                            firstPage: string;
                            folio: string;
                            gallery: string;
                            go: string;
                            help: string;
                            image: string;
                            last: string;
                            lastImage: string;
                            lastPage: string;
                            next: string;
                            nextImage: string;
                            nextPage: string;
                            of: string;
                            oneUp: string;
                            page: string;
                            pageSearchLabel: string;
                            previous: string;
                            previousImage: string;
                            previousPage: string;
                            settings: string;
                            twoUp: string;
                        };
                    };
                    seadragonCenterPanel: {
                        content: {
                            attribution: string;
                            goHome: string;
                            imageUnavailable: string;
                            next: string;
                            previous: string;
                            rotateRight: string;
                            zoomIn: string;
                            zoomOut: string;
                        };
                    };
                    restrictedDialogue: {
                        content: {
                            cancel: string;
                        };
                    };
                    searchFooterPanel: {
                        content: {
                            clearSearch: string;
                            defaultLabel: string;
                            displaying: string;
                            enterKeyword: string;
                            image: string;
                            imageCaps: string;
                            instanceFound: string;
                            instancesFound: string;
                            nextResult: string;
                            page: string;
                            pageCaps: string;
                            previousResult: string;
                            print: string;
                            resultFoundFor: string;
                            resultsFoundFor: string;
                            searchWithin: string;
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
                };
            };
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
                ebookLeftPanel: {
                    options: {
                        expandFullEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
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
                ebookCenterPanel: {
                    options: {};
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
                contentLeftPanel: {
                    content: {
                        collapse: string;
                        collapseFull: string;
                        date: string;
                        expand: string;
                        expandFull: string;
                        index: string;
                        manifestRanges: string;
                        searchResult: string;
                        searchResults: string;
                        sortBy: string;
                        thumbnails: string;
                        title: string;
                        volume: string;
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
                mobileFooterPanel: {
                    content: {
                        rotateRight: string;
                        moreInfo: string;
                        zoomIn: string;
                        zoomOut: string;
                    };
                };
                multiSelectDialogue: {
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    content: {
                        close: string;
                        emptyValue: string;
                        first: string;
                        firstImage: string;
                        firstPage: string;
                        folio: string;
                        gallery: string;
                        go: string;
                        help: string;
                        image: string;
                        last: string;
                        lastImage: string;
                        lastPage: string;
                        next: string;
                        nextImage: string;
                        nextPage: string;
                        of: string;
                        oneUp: string;
                        page: string;
                        pageSearchLabel: string;
                        previous: string;
                        previousImage: string;
                        previousPage: string;
                        settings: string;
                        twoUp: string;
                    };
                };
                seadragonCenterPanel: {
                    content: {
                        attribution: string;
                        goHome: string;
                        imageUnavailable: string;
                        next: string;
                        previous: string;
                        rotateRight: string;
                        zoomIn: string;
                        zoomOut: string;
                    };
                };
                restrictedDialogue: {
                    content: {
                        cancel: string;
                    };
                };
                searchFooterPanel: {
                    content: {
                        clearSearch: string;
                        defaultLabel: string;
                        displaying: string;
                        enterKeyword: string;
                        image: string;
                        imageCaps: string;
                        instanceFound: string;
                        instancesFound: string;
                        nextResult: string;
                        page: string;
                        pageCaps: string;
                        previousResult: string;
                        print: string;
                        resultFoundFor: string;
                        resultsFoundFor: string;
                        searchWithin: string;
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
            };
        }>;
        "pl-PL": () => Promise<{
            default: {
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
                    ebookLeftPanel: {
                        options: {
                            expandFullEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                        };
                        content: {
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
                    ebookCenterPanel: {
                        options: {};
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
                    avCenterPanel: {
                        content: {
                            attribution: string;
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
                };
            };
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
                ebookLeftPanel: {
                    options: {
                        expandFullEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                    };
                    content: {
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
                ebookCenterPanel: {
                    options: {};
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
                avCenterPanel: {
                    content: {
                        attribution: string;
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
            };
        }>;
        "sv-SE": () => Promise<{
            default: {
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
                    ebookLeftPanel: {
                        options: {
                            expandFullEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
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
                    ebookCenterPanel: {
                        options: {};
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
                    contentLeftPanel: {
                        content: {
                            collapse: string;
                            collapseFull: string;
                            date: string;
                            expand: string;
                            expandFull: string;
                            index: string;
                            manifestRanges: string;
                            searchResult: string;
                            searchResults: string;
                            sortBy: string;
                            thumbnails: string;
                            title: string;
                            volume: string;
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
                    mobileFooterPanel: {
                        content: {
                            rotateRight: string;
                            moreInfo: string;
                            zoomIn: string;
                            zoomOut: string;
                        };
                    };
                    multiSelectDialogue: {
                        content: {
                            select: string;
                            selectAll: string;
                            title: string;
                        };
                    };
                    pagingHeaderPanel: {
                        content: {
                            close: string;
                            emptyValue: string;
                            first: string;
                            firstImage: string;
                            firstPage: string;
                            folio: string;
                            gallery: string;
                            go: string;
                            help: string;
                            image: string;
                            last: string;
                            lastImage: string;
                            lastPage: string;
                            next: string;
                            nextImage: string;
                            nextPage: string;
                            of: string;
                            oneUp: string;
                            page: string;
                            pageSearchLabel: string;
                            previous: string;
                            previousImage: string;
                            previousPage: string;
                            settings: string;
                            twoUp: string;
                        };
                    };
                    avCenterPanel: {
                        content: {
                            attribution: string;
                            currentTime: string;
                            delimiter: string;
                            duration: string;
                            mute: string;
                            next: string;
                            pause: string;
                            play: string;
                            previous: string;
                        };
                    };
                    restrictedDialogue: {
                        content: {
                            cancel: string;
                        };
                    };
                    searchFooterPanel: {
                        content: {
                            clearSearch: string;
                            defaultLabel: string;
                            displaying: string;
                            enterKeyword: string;
                            image: string;
                            imageCaps: string;
                            instanceFound: string;
                            instancesFound: string;
                            nextResult: string;
                            page: string;
                            pageCaps: string;
                            previousResult: string;
                            print: string;
                            resultFoundFor: string;
                            resultsFoundFor: string;
                            searchWithin: string;
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
                };
            };
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
                ebookLeftPanel: {
                    options: {
                        expandFullEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
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
                ebookCenterPanel: {
                    options: {};
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
                contentLeftPanel: {
                    content: {
                        collapse: string;
                        collapseFull: string;
                        date: string;
                        expand: string;
                        expandFull: string;
                        index: string;
                        manifestRanges: string;
                        searchResult: string;
                        searchResults: string;
                        sortBy: string;
                        thumbnails: string;
                        title: string;
                        volume: string;
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
                mobileFooterPanel: {
                    content: {
                        rotateRight: string;
                        moreInfo: string;
                        zoomIn: string;
                        zoomOut: string;
                    };
                };
                multiSelectDialogue: {
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    content: {
                        close: string;
                        emptyValue: string;
                        first: string;
                        firstImage: string;
                        firstPage: string;
                        folio: string;
                        gallery: string;
                        go: string;
                        help: string;
                        image: string;
                        last: string;
                        lastImage: string;
                        lastPage: string;
                        next: string;
                        nextImage: string;
                        nextPage: string;
                        of: string;
                        oneUp: string;
                        page: string;
                        pageSearchLabel: string;
                        previous: string;
                        previousImage: string;
                        previousPage: string;
                        settings: string;
                        twoUp: string;
                    };
                };
                avCenterPanel: {
                    content: {
                        attribution: string;
                        currentTime: string;
                        delimiter: string;
                        duration: string;
                        mute: string;
                        next: string;
                        pause: string;
                        play: string;
                        previous: string;
                    };
                };
                restrictedDialogue: {
                    content: {
                        cancel: string;
                    };
                };
                searchFooterPanel: {
                    content: {
                        clearSearch: string;
                        defaultLabel: string;
                        displaying: string;
                        enterKeyword: string;
                        image: string;
                        imageCaps: string;
                        instanceFound: string;
                        instancesFound: string;
                        nextResult: string;
                        page: string;
                        pageCaps: string;
                        previousResult: string;
                        print: string;
                        resultFoundFor: string;
                        resultsFoundFor: string;
                        searchWithin: string;
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
            };
        }>;
    };
    create(): void;
    createModules(): void;
    isLeftPanelEnabled(): boolean;
    render(): void;
    getEmbedScript(template: string, width: number, height: number): string;
    checkForCFIParam(): void;
}
