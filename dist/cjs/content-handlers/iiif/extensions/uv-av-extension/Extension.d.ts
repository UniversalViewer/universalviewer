import { AVCenterPanel } from "../../modules/uv-avcenterpanel-module/AVCenterPanel";
import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { DownloadDialogue } from "./DownloadDialogue";
import { FooterPanel } from "../../modules/uv-shared-module/FooterPanel";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-avmobilefooterpanel-module/MobileFooter";
import { HeaderPanel } from "../../modules/uv-shared-module/HeaderPanel";
import { IAVExtension } from "./IAVExtension";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { TreeNode } from "manifesto.js";
import "./theme/theme.less";
export default class Extension extends BaseExtension implements IAVExtension {
    $downloadDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: AVCenterPanel;
    downloadDialogue: DownloadDialogue;
    footerPanel: FooterPanel;
    headerPanel: HeaderPanel;
    leftPanel: ContentLeftPanel;
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
                contentLeftPanel: {
                    options: {
                        autoExpandTreeEnabled: boolean;
                        autoExpandTreeIfFewerThan: number;
                        branchNodesExpandOnClick: boolean;
                        branchNodesSelectable: boolean;
                        defaultToTreeEnabled: boolean;
                        defaultToTreeIfGreaterThan: number;
                        elideCount: number;
                        expandFullEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        tabOrder: string;
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
                avCenterPanel: {
                    options: {
                        autoPlay: boolean;
                        includeParentInTitleEnabled: boolean;
                        posterImageRatio: number;
                        subtitleMetadataField: string;
                        titleEnabled: boolean;
                        subtitleEnabled: boolean;
                    };
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
                    contentLeftPanel: {
                        options: {
                            autoExpandTreeEnabled: boolean;
                            autoExpandTreeIfFewerThan: number;
                            branchNodesExpandOnClick: boolean;
                            branchNodesSelectable: boolean;
                            defaultToTreeEnabled: boolean;
                            defaultToTreeIfGreaterThan: number;
                            elideCount: number;
                            expandFullEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            tabOrder: string;
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
                            searchResult: string;
                            searchResults: string;
                            sortBy: string;
                            thumbnails: string;
                            title: string;
                            volume: string;
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
                    avCenterPanel: {
                        options: {
                            autoPlay: boolean;
                            includeParentInTitleEnabled: boolean;
                            posterImageRatio: number;
                            subtitleMetadataField: string;
                            titleEnabled: boolean;
                            subtitleEnabled: boolean;
                        };
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
                contentLeftPanel: {
                    options: {
                        autoExpandTreeEnabled: boolean;
                        autoExpandTreeIfFewerThan: number;
                        branchNodesExpandOnClick: boolean;
                        branchNodesSelectable: boolean;
                        defaultToTreeEnabled: boolean;
                        defaultToTreeIfGreaterThan: number;
                        elideCount: number;
                        expandFullEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        tabOrder: string;
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
                        searchResult: string;
                        searchResults: string;
                        sortBy: string;
                        thumbnails: string;
                        title: string;
                        volume: string;
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
                avCenterPanel: {
                    options: {
                        autoPlay: boolean;
                        includeParentInTitleEnabled: boolean;
                        posterImageRatio: number;
                        subtitleMetadataField: string;
                        titleEnabled: boolean;
                        subtitleEnabled: boolean;
                    };
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
                    contentLeftPanel: {
                        options: {
                            autoExpandTreeEnabled: boolean;
                            autoExpandTreeIfFewerThan: number;
                            branchNodesExpandOnClick: boolean;
                            branchNodesSelectable: boolean;
                            defaultToTreeEnabled: boolean;
                            defaultToTreeIfGreaterThan: number;
                            elideCount: number;
                            expandFullEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            tabOrder: string;
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
                    avCenterPanel: {
                        options: {
                            autoPlay: boolean;
                            includeParentInTitleEnabled: boolean;
                            posterImageRatio: number;
                            subtitleMetadataField: string;
                            titleEnabled: boolean;
                            subtitleEnabled: boolean;
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
                contentLeftPanel: {
                    options: {
                        autoExpandTreeEnabled: boolean;
                        autoExpandTreeIfFewerThan: number;
                        branchNodesExpandOnClick: boolean;
                        branchNodesSelectable: boolean;
                        defaultToTreeEnabled: boolean;
                        defaultToTreeIfGreaterThan: number;
                        elideCount: number;
                        expandFullEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        tabOrder: string;
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
                avCenterPanel: {
                    options: {
                        autoPlay: boolean;
                        includeParentInTitleEnabled: boolean;
                        posterImageRatio: number;
                        subtitleMetadataField: string;
                        titleEnabled: boolean;
                        subtitleEnabled: boolean;
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
                    contentLeftPanel: {
                        options: {
                            autoExpandTreeEnabled: boolean;
                            autoExpandTreeIfFewerThan: number;
                            branchNodesExpandOnClick: boolean;
                            branchNodesSelectable: boolean;
                            defaultToTreeEnabled: boolean;
                            defaultToTreeIfGreaterThan: number;
                            elideCount: number;
                            expandFullEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            tabOrder: string;
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
                    avCenterPanel: {
                        options: {
                            autoPlay: boolean;
                            includeParentInTitleEnabled: boolean;
                            posterImageRatio: number;
                            subtitleMetadataField: string;
                            titleEnabled: boolean;
                            subtitleEnabled: boolean;
                        };
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
                contentLeftPanel: {
                    options: {
                        autoExpandTreeEnabled: boolean;
                        autoExpandTreeIfFewerThan: number;
                        branchNodesExpandOnClick: boolean;
                        branchNodesSelectable: boolean;
                        defaultToTreeEnabled: boolean;
                        defaultToTreeIfGreaterThan: number;
                        elideCount: number;
                        expandFullEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        tabOrder: string;
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
                avCenterPanel: {
                    options: {
                        autoPlay: boolean;
                        includeParentInTitleEnabled: boolean;
                        posterImageRatio: number;
                        subtitleMetadataField: string;
                        titleEnabled: boolean;
                        subtitleEnabled: boolean;
                    };
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
                    contentLeftPanel: {
                        options: {
                            autoExpandTreeEnabled: boolean;
                            autoExpandTreeIfFewerThan: number;
                            branchNodesExpandOnClick: boolean;
                            branchNodesSelectable: boolean;
                            defaultToTreeEnabled: boolean;
                            defaultToTreeIfGreaterThan: number;
                            elideCount: number;
                            expandFullEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            oneColThumbHeight: number;
                            oneColThumbWidth: number;
                            pageModeEnabled: boolean;
                            panelAnimationDuration: number;
                            panelCollapsedWidth: number;
                            panelExpandedWidth: number;
                            panelOpen: boolean;
                            tabOrder: string;
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
                    avCenterPanel: {
                        options: {
                            autoPlay: boolean;
                            includeParentInTitleEnabled: boolean;
                            posterImageRatio: number;
                            subtitleMetadataField: string;
                            titleEnabled: boolean;
                            subtitleEnabled: boolean;
                        };
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
                contentLeftPanel: {
                    options: {
                        autoExpandTreeEnabled: boolean;
                        autoExpandTreeIfFewerThan: number;
                        branchNodesExpandOnClick: boolean;
                        branchNodesSelectable: boolean;
                        defaultToTreeEnabled: boolean;
                        defaultToTreeIfGreaterThan: number;
                        elideCount: number;
                        expandFullEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        oneColThumbHeight: number;
                        oneColThumbWidth: number;
                        pageModeEnabled: boolean;
                        panelAnimationDuration: number;
                        panelCollapsedWidth: number;
                        panelExpandedWidth: number;
                        panelOpen: boolean;
                        tabOrder: string;
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
                avCenterPanel: {
                    options: {
                        autoPlay: boolean;
                        includeParentInTitleEnabled: boolean;
                        posterImageRatio: number;
                        subtitleMetadataField: string;
                        titleEnabled: boolean;
                        subtitleEnabled: boolean;
                    };
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
    lastAvCanvasIndex?: number;
    create(): void;
    dependencyLoaded(index: number, dep: any): void;
    createModules(): void;
    isLeftPanelEnabled(): boolean;
    render(): void;
    getEmbedScript(template: string, width: number, height: number): string;
    treeNodeSelected(node: TreeNode): void;
    viewRange(path: string): void;
}
