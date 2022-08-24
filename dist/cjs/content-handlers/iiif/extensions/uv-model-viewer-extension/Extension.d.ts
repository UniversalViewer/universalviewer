import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { MoreInfoDialogue } from "../../modules/uv-dialogues-module/MoreInfoDialogue";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { ModelViewerCenterPanel } from "../../modules/uv-modelviewercenterpanel-module/ModelViewerCenterPanel";
import "./theme/theme.less";
import { AnnotationGroup } from "@iiif/manifold";
export default class ModelViewerExtension extends BaseExtension {
    $downloadDialogue: JQuery;
    $shareDialogue: JQuery;
    $helpDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $settingsDialogue: JQuery;
    centerPanel: ModelViewerCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    helpDialogue: HelpDialogue;
    leftPanel: ContentLeftPanel;
    mobileFooterPanel: FooterPanel;
    moreInfoDialogue: MoreInfoDialogue;
    rightPanel: MoreInfoRightPanel;
    settingsDialogue: SettingsDialogue;
    shareDialogue: ShareDialogue;
    defaultConfig: any;
    locales: {
        "en-GB": {
            options: {
                authAPIVersion: number;
                bookmarkThumbHeight: number;
                bookmarkThumbWidth: number;
                dropEnabled: boolean;
                footerPanelEnabled: boolean;
                headerPanelEnabled: boolean;
                leftPanelEnabled: boolean;
                limitLocales: boolean;
                doubleClickAnnotationEnabled: boolean;
                metrics: {
                    type: string;
                    minWidth: number;
                }[];
                openTemplate: string;
                rightPanelEnabled: boolean;
                theme: string;
            };
            modules: {
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        shareManifestsEnabled: boolean;
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
                footerPanel: {
                    options: {
                        downloadEnabled: boolean;
                        embedEnabled: boolean;
                        feedbackEnabled: boolean;
                        minimiseButtons: boolean;
                        moreInfoEnabled: boolean;
                        openEnabled: boolean;
                        shareEnabled: boolean;
                    };
                    content: {
                        bookmark: string;
                        download: string;
                        embed: string;
                        exitFullScreen: string;
                        fullScreen: string;
                        moreInfo: string;
                        open: string;
                        share: string;
                    };
                };
                genericDialogue: {
                    content: {
                        ok: string;
                    };
                };
                headerPanel: {
                    content: {
                        close: string;
                        help: string;
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
                contentLeftPanel: {
                    options: {
                        elideCount: number;
                        galleryThumbHeight: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        thumbsEnabled: boolean;
                        thumbsExtraHeight: number;
                        thumbsImageFadeInDuration: number;
                        thumbsLoadRange: number;
                        treeEnabled: boolean;
                        twoColThumbHeight: number;
                        twoColThumbWidth: number;
                    };
                };
                modelViewerCenterPanel: {
                    options: {
                        autoRotateEnabled: boolean;
                        cameraChangeDelay: number;
                        interactionPromptEnabled: boolean;
                    };
                    content: {
                        attribution: string;
                        zoomIn: string;
                        zoomOut: string;
                        vr: string;
                    };
                };
                dialogue: {
                    content: {
                        close: string;
                    };
                };
                downloadDialogue: {
                    content: {
                        download: string;
                        entireFileAsOriginal: string;
                        noneAvailable: string;
                        preview: string;
                        title: string;
                    };
                };
                loginDialogue: {
                    content: {
                        login: string;
                        cancel: string;
                    };
                };
                mediaelementCenterPanel: {
                    content: {};
                };
                settingsDialogue: {
                    content: {
                        locale: string;
                        pagingEnabled: string;
                        reducedMotion: string;
                        preserveViewport: string;
                        title: string;
                        website: string;
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
                degradedResourceMessage: string;
                degradedResourceLogin: string;
                forbiddenResourceMessage: string;
                mediaViewer: string;
                skipToDownload: string;
            };
        };
        "cy-GB": () => Promise<{
            default: {
                options: {
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
                    openTemplate: string;
                    rightPanelEnabled: boolean;
                    theme: string;
                };
                modules: {
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            shareManifestsEnabled: boolean;
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
                    footerPanel: {
                        options: {
                            downloadEnabled: boolean;
                            embedEnabled: boolean;
                            feedbackEnabled: boolean;
                            minimiseButtons: boolean;
                            moreInfoEnabled: boolean;
                            openEnabled: boolean;
                            shareEnabled: boolean;
                        };
                        content: {
                            bookmark: string;
                            download: string;
                            embed: string;
                            exitFullScreen: string;
                            fullScreen: string;
                            moreInfo: string;
                            open: string;
                            share: string;
                        };
                    };
                    genericDialogue: {
                        content: {
                            ok: string;
                        };
                    };
                    headerPanel: {
                        content: {
                            close: string;
                            help: string;
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
                    contentLeftPanel: {
                        options: {
                            elideCount: number;
                            galleryThumbHeight: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            thumbsEnabled: boolean;
                            thumbsExtraHeight: number;
                            thumbsImageFadeInDuration: number;
                            thumbsLoadRange: number;
                            treeEnabled: boolean;
                            twoColThumbHeight: number;
                            twoColThumbWidth: number;
                        };
                    };
                    modelViewerCenterPanel: {
                        options: {
                            autoRotateEnabled: boolean;
                            cameraChangeDelay: number;
                            interactionPromptEnabled: boolean;
                        };
                        content: {
                            attribution: string;
                            zoomIn: string;
                            zoomOut: string;
                            vr: string;
                        };
                    };
                    dialogue: {
                        content: {
                            close: string;
                        };
                    };
                    downloadDialogue: {
                        content: {
                            download: string;
                            entireFileAsOriginal: string;
                            noneAvailable: string;
                            preview: string;
                            title: string;
                        };
                    };
                    loginDialogue: {
                        content: {
                            login: string;
                            cancel: string;
                        };
                    };
                    mediaelementCenterPanel: {
                        content: {};
                    };
                    settingsDialogue: {
                        content: {
                            locale: string;
                            pagingEnabled: string;
                            reducedMotion: string;
                            preserveViewport: string;
                            title: string;
                            website: string;
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
                    degradedResourceMessage: string;
                    degradedResourceLogin: string;
                    forbiddenResourceMessage: string;
                };
            };
            options: {
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
                openTemplate: string;
                rightPanelEnabled: boolean;
                theme: string;
            };
            modules: {
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        shareManifestsEnabled: boolean;
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
                footerPanel: {
                    options: {
                        downloadEnabled: boolean;
                        embedEnabled: boolean;
                        feedbackEnabled: boolean;
                        minimiseButtons: boolean;
                        moreInfoEnabled: boolean;
                        openEnabled: boolean;
                        shareEnabled: boolean;
                    };
                    content: {
                        bookmark: string;
                        download: string;
                        embed: string;
                        exitFullScreen: string;
                        fullScreen: string;
                        moreInfo: string;
                        open: string;
                        share: string;
                    };
                };
                genericDialogue: {
                    content: {
                        ok: string;
                    };
                };
                headerPanel: {
                    content: {
                        close: string;
                        help: string;
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
                contentLeftPanel: {
                    options: {
                        elideCount: number;
                        galleryThumbHeight: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        thumbsEnabled: boolean;
                        thumbsExtraHeight: number;
                        thumbsImageFadeInDuration: number;
                        thumbsLoadRange: number;
                        treeEnabled: boolean;
                        twoColThumbHeight: number;
                        twoColThumbWidth: number;
                    };
                };
                modelViewerCenterPanel: {
                    options: {
                        autoRotateEnabled: boolean;
                        cameraChangeDelay: number;
                        interactionPromptEnabled: boolean;
                    };
                    content: {
                        attribution: string;
                        zoomIn: string;
                        zoomOut: string;
                        vr: string;
                    };
                };
                dialogue: {
                    content: {
                        close: string;
                    };
                };
                downloadDialogue: {
                    content: {
                        download: string;
                        entireFileAsOriginal: string;
                        noneAvailable: string;
                        preview: string;
                        title: string;
                    };
                };
                loginDialogue: {
                    content: {
                        login: string;
                        cancel: string;
                    };
                };
                mediaelementCenterPanel: {
                    content: {};
                };
                settingsDialogue: {
                    content: {
                        locale: string;
                        pagingEnabled: string;
                        reducedMotion: string;
                        preserveViewport: string;
                        title: string;
                        website: string;
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
                degradedResourceMessage: string;
                degradedResourceLogin: string;
                forbiddenResourceMessage: string;
            };
        }>;
        "fr-FR": () => Promise<{
            default: {
                options: {
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
                    openTemplate: string;
                    rightPanelEnabled: boolean;
                    theme: string;
                };
                modules: {
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            shareManifestsEnabled: boolean;
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
                    footerPanel: {
                        options: {
                            downloadEnabled: boolean;
                            embedEnabled: boolean;
                            feedbackEnabled: boolean;
                            minimiseButtons: boolean;
                            moreInfoEnabled: boolean;
                            openEnabled: boolean;
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
                    headerPanel: {};
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
                    contentLeftPanel: {
                        options: {
                            elideCount: number;
                            galleryThumbHeight: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            thumbsEnabled: boolean;
                            thumbsExtraHeight: number;
                            thumbsImageFadeInDuration: number;
                            thumbsLoadRange: number;
                            treeEnabled: boolean;
                            twoColThumbHeight: number;
                            twoColThumbWidth: number;
                        };
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
                    modelViewerCenterPanel: {
                        options: {
                            autoRotateEnabled: boolean;
                            cameraChangeDelay: number;
                            interactionPromptEnabled: boolean;
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
                    dialogue: {
                        content: {
                            close: string;
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
                    openSeadragonCenterPanel: {
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
                openTemplate: string;
                rightPanelEnabled: boolean;
                theme: string;
            };
            modules: {
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        shareManifestsEnabled: boolean;
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
                footerPanel: {
                    options: {
                        downloadEnabled: boolean;
                        embedEnabled: boolean;
                        feedbackEnabled: boolean;
                        minimiseButtons: boolean;
                        moreInfoEnabled: boolean;
                        openEnabled: boolean;
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
                headerPanel: {};
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
                contentLeftPanel: {
                    options: {
                        elideCount: number;
                        galleryThumbHeight: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        thumbsEnabled: boolean;
                        thumbsExtraHeight: number;
                        thumbsImageFadeInDuration: number;
                        thumbsLoadRange: number;
                        treeEnabled: boolean;
                        twoColThumbHeight: number;
                        twoColThumbWidth: number;
                    };
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
                modelViewerCenterPanel: {
                    options: {
                        autoRotateEnabled: boolean;
                        cameraChangeDelay: number;
                        interactionPromptEnabled: boolean;
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
                dialogue: {
                    content: {
                        close: string;
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
                openSeadragonCenterPanel: {
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
                    openTemplate: string;
                    rightPanelEnabled: boolean;
                    theme: string;
                };
                modules: {
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            shareManifestsEnabled: boolean;
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
                    footerPanel: {
                        options: {
                            downloadEnabled: boolean;
                            embedEnabled: boolean;
                            feedbackEnabled: boolean;
                            minimiseButtons: boolean;
                            moreInfoEnabled: boolean;
                            openEnabled: boolean;
                            shareEnabled: boolean;
                        };
                        content: {
                            bookmark: string;
                            download: string;
                            embed: string;
                            exitFullScreen: string;
                            fullScreen: string;
                            moreInfo: string;
                            open: string;
                            share: string;
                        };
                    };
                    genericDialogue: {
                        content: {
                            ok: string;
                        };
                    };
                    headerPanel: {
                        content: {
                            close: string;
                            help: string;
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
                    contentLeftPanel: {
                        options: {
                            elideCount: number;
                            galleryThumbHeight: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            thumbsEnabled: boolean;
                            thumbsExtraHeight: number;
                            thumbsImageFadeInDuration: number;
                            thumbsLoadRange: number;
                            treeEnabled: boolean;
                            twoColThumbHeight: number;
                            twoColThumbWidth: number;
                        };
                    };
                    modelViewerCenterPanel: {
                        options: {
                            autoRotateEnabled: boolean;
                            cameraChangeDelay: number;
                            interactionPromptEnabled: boolean;
                        };
                    };
                    dialogue: {
                        content: {
                            close: string;
                        };
                    };
                    downloadDialogue: {
                        content: {
                            download: string;
                            entireFileAsOriginal: string;
                            noneAvailable: string;
                            preview: string;
                            title: string;
                        };
                    };
                    loginDialogue: {
                        content: {
                            login: string;
                            cancel: string;
                        };
                    };
                    mediaelementCenterPanel: {
                        content: {};
                    };
                    settingsDialogue: {
                        content: {
                            locale: string;
                            pagingEnabled: string;
                            reducedMotion: string;
                            preserveViewport: string;
                            title: string;
                            website: string;
                        };
                    };
                    virtexCenterPanel: {
                        content: {
                            attribution: string;
                            zoomIn: string;
                            zoomOut: string;
                            vr: string;
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
                    degradedResourceMessage: string;
                    degradedResourceLogin: string;
                    forbiddenResourceMessage: string;
                };
            };
            options: {
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
                openTemplate: string;
                rightPanelEnabled: boolean;
                theme: string;
            };
            modules: {
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        shareManifestsEnabled: boolean;
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
                footerPanel: {
                    options: {
                        downloadEnabled: boolean;
                        embedEnabled: boolean;
                        feedbackEnabled: boolean;
                        minimiseButtons: boolean;
                        moreInfoEnabled: boolean;
                        openEnabled: boolean;
                        shareEnabled: boolean;
                    };
                    content: {
                        bookmark: string;
                        download: string;
                        embed: string;
                        exitFullScreen: string;
                        fullScreen: string;
                        moreInfo: string;
                        open: string;
                        share: string;
                    };
                };
                genericDialogue: {
                    content: {
                        ok: string;
                    };
                };
                headerPanel: {
                    content: {
                        close: string;
                        help: string;
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
                contentLeftPanel: {
                    options: {
                        elideCount: number;
                        galleryThumbHeight: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        thumbsEnabled: boolean;
                        thumbsExtraHeight: number;
                        thumbsImageFadeInDuration: number;
                        thumbsLoadRange: number;
                        treeEnabled: boolean;
                        twoColThumbHeight: number;
                        twoColThumbWidth: number;
                    };
                };
                modelViewerCenterPanel: {
                    options: {
                        autoRotateEnabled: boolean;
                        cameraChangeDelay: number;
                        interactionPromptEnabled: boolean;
                    };
                };
                dialogue: {
                    content: {
                        close: string;
                    };
                };
                downloadDialogue: {
                    content: {
                        download: string;
                        entireFileAsOriginal: string;
                        noneAvailable: string;
                        preview: string;
                        title: string;
                    };
                };
                loginDialogue: {
                    content: {
                        login: string;
                        cancel: string;
                    };
                };
                mediaelementCenterPanel: {
                    content: {};
                };
                settingsDialogue: {
                    content: {
                        locale: string;
                        pagingEnabled: string;
                        reducedMotion: string;
                        preserveViewport: string;
                        title: string;
                        website: string;
                    };
                };
                virtexCenterPanel: {
                    content: {
                        attribution: string;
                        zoomIn: string;
                        zoomOut: string;
                        vr: string;
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
                degradedResourceMessage: string;
                degradedResourceLogin: string;
                forbiddenResourceMessage: string;
            };
        }>;
        "sv-SE": () => Promise<{
            default: {
                options: {
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
                    openTemplate: string;
                    rightPanelEnabled: boolean;
                    theme: string;
                };
                modules: {
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            shareManifestsEnabled: boolean;
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
                    footerPanel: {
                        options: {
                            downloadEnabled: boolean;
                            embedEnabled: boolean;
                            feedbackEnabled: boolean;
                            minimiseButtons: boolean;
                            moreInfoEnabled: boolean;
                            openEnabled: boolean;
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
                    headerPanel: {};
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
                    contentLeftPanel: {
                        options: {
                            elideCount: number;
                            galleryThumbHeight: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            thumbsEnabled: boolean;
                            thumbsExtraHeight: number;
                            thumbsImageFadeInDuration: number;
                            thumbsLoadRange: number;
                            treeEnabled: boolean;
                            twoColThumbHeight: number;
                            twoColThumbWidth: number;
                        };
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
                    modelViewerCenterPanel: {
                        options: {
                            autoRotateEnabled: boolean;
                            cameraChangeDelay: number;
                            interactionPromptEnabled: boolean;
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
                    dialogue: {
                        content: {
                            close: string;
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
                    openSeadragonCenterPanel: {
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
                    avCenterPanel: {
                        content: {
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
                openTemplate: string;
                rightPanelEnabled: boolean;
                theme: string;
            };
            modules: {
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        shareManifestsEnabled: boolean;
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
                footerPanel: {
                    options: {
                        downloadEnabled: boolean;
                        embedEnabled: boolean;
                        feedbackEnabled: boolean;
                        minimiseButtons: boolean;
                        moreInfoEnabled: boolean;
                        openEnabled: boolean;
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
                headerPanel: {};
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
                contentLeftPanel: {
                    options: {
                        elideCount: number;
                        galleryThumbHeight: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        thumbsEnabled: boolean;
                        thumbsExtraHeight: number;
                        thumbsImageFadeInDuration: number;
                        thumbsLoadRange: number;
                        treeEnabled: boolean;
                        twoColThumbHeight: number;
                        twoColThumbWidth: number;
                    };
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
                modelViewerCenterPanel: {
                    options: {
                        autoRotateEnabled: boolean;
                        cameraChangeDelay: number;
                        interactionPromptEnabled: boolean;
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
                dialogue: {
                    content: {
                        close: string;
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
                openSeadragonCenterPanel: {
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
                avCenterPanel: {
                    content: {
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
    render(): void;
    checkForTarget(): void;
    checkForAnnotations(): void;
    annotate(annotations: AnnotationGroup[], terms?: string): void;
    groupWebAnnotationsByTarget(annotations: any): AnnotationGroup[];
    isLeftPanelEnabled(): boolean;
    bookmark(): void;
    getEmbedScript(template: string, width: number, height: number): string;
}
