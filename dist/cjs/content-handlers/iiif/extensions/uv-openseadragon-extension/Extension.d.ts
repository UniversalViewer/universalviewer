import { BaseExtension } from "../../modules/uv-shared-module/BaseExtension";
import { ContentLeftPanel } from "../../modules/uv-contentleftpanel-module/ContentLeftPanel";
import { CroppedImageDimensions } from "./CroppedImageDimensions";
import { ExternalContentDialogue } from "../../modules/uv-dialogues-module/ExternalContentDialogue";
import { FooterPanel as MobileFooterPanel } from "../../modules/uv-osdmobilefooterpanel-module/MobileFooter";
import { FooterPanel } from "../../modules/uv-searchfooterpanel-module/FooterPanel";
import { HelpDialogue } from "../../modules/uv-dialogues-module/HelpDialogue";
import { Mode } from "./Mode";
import { MoreInfoDialogue } from "../../modules/uv-dialogues-module/MoreInfoDialogue";
import { MoreInfoRightPanel } from "../../modules/uv-moreinforightpanel-module/MoreInfoRightPanel";
import { MultiSelectDialogue } from "../../modules/uv-multiselectdialogue-module/MultiSelectDialogue";
import { PagingHeaderPanel } from "../../modules/uv-pagingheaderpanel-module/PagingHeaderPanel";
import { OpenSeadragonCenterPanel } from "../../modules/uv-openseadragoncenterpanel-module/OpenSeadragonCenterPanel";
import { SettingsDialogue } from "./SettingsDialogue";
import { ShareDialogue } from "./ShareDialogue";
import { AnnotationGroup, AnnotationRect } from "@iiif/manifold";
import { Canvas, TreeNode, Service, Size } from "manifesto.js";
import "./theme/theme.less";
import { Root } from "react-dom/client";
export default class OpenSeadragonExtension extends BaseExtension {
    $downloadDialogue: JQuery;
    $externalContentDialogue: JQuery;
    $helpDialogue: JQuery;
    $moreInfoDialogue: JQuery;
    $multiSelectDialogue: JQuery;
    $settingsDialogue: JQuery;
    $shareDialogue: JQuery;
    centerPanel: OpenSeadragonCenterPanel;
    currentAnnotationRect: AnnotationRect | null;
    currentRotation: number;
    downloadDialogueRoot: Root;
    externalContentDialogue: ExternalContentDialogue;
    footerPanel: FooterPanel;
    headerPanel: PagingHeaderPanel;
    helpDialogue: HelpDialogue;
    isAnnotating: boolean;
    leftPanel: ContentLeftPanel;
    mobileFooterPanel: MobileFooterPanel;
    mode: Mode;
    moreInfoDialogue: MoreInfoDialogue;
    multiSelectDialogue: MultiSelectDialogue;
    previousAnnotationRect: AnnotationRect | null;
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
                doubleClickAnnotationEnabled: boolean;
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
                zoomToBoundsEnabled: boolean;
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
                        thumbsCacheInvalidation: {
                            enabled: boolean;
                            paramType: string;
                        };
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
                downloadDialogue: {
                    options: {
                        confinedImageSize: number;
                        currentViewDisabledPercentage: number;
                        maxImageWidth: number;
                        optionsExplanatoryTextEnabled: boolean;
                        selectionEnabled: boolean;
                    };
                    content: {
                        allPages: string;
                        currentViewAsJpg: string;
                        currentViewAsJpgExplanation: string;
                        download: string;
                        downloadSelection: string;
                        downloadSelectionExplanation: string;
                        editSettings: string;
                        entireDocument: string;
                        entireFileAsOriginal: string;
                        individualPages: string;
                        noneAvailable: string;
                        pagingNote: string;
                        preview: string;
                        selection: string;
                        termsOfUse: string;
                        title: string;
                        wholeImageHighRes: string;
                        wholeImageHighResExplanation: string;
                        wholeImageLowResAsJpg: string;
                        wholeImageLowResAsJpgExplanation: string;
                        wholeImagesHighRes: string;
                        wholeImagesHighResExplanation: string;
                    };
                };
                footerPanel: {
                    options: {
                        autocompleteAllowWords: boolean;
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
                        centerOptionsEnabled: boolean;
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
                    };
                    content: {
                        attribution: string;
                        canvasHeader: string;
                        collapse: string;
                        collapseFull: string;
                        copiedToClipboard: string;
                        copyToClipboard: string;
                        description: string;
                        expand: string;
                        expandFull: string;
                        holdingText: string;
                        less: string;
                        license: string;
                        logo: string;
                        manifestHeader: string;
                        more: string;
                        noData: string;
                        page: string;
                        rangeHeader: string;
                        title: string;
                    };
                };
                multiSelectDialogue: {
                    options: {
                        galleryThumbChunkedResizingEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        pageModeEnabled: boolean;
                    };
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    options: {
                        autoCompleteBoxEnabled: boolean;
                        autocompleteAllowWords: boolean;
                        galleryButtonEnabled: boolean;
                        imageSelectionBoxEnabled: boolean;
                        pageModeEnabled: boolean;
                        pagingToggleEnabled: boolean;
                    };
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
                    options: {
                        animationTime: number;
                        autoHideControls: boolean;
                        requiredStatementEnabled: boolean;
                        blendTime: number;
                        constrainDuringPan: boolean;
                        controlsFadeAfterInactive: number;
                        controlsFadeDelay: number;
                        controlsFadeLength: number;
                        defaultZoomLevel: number;
                        immediateRender: boolean;
                        maxZoomPixelRatio: number;
                        navigatorPosition: string;
                        pageGap: number;
                        showHomeControl: boolean;
                        trimAttributionCount: number;
                        visibilityRatio: number;
                    };
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
                searchFooterPanel: {
                    options: {
                        elideDetailsTermsCount: number;
                        elideResultsTermsCount: number;
                        forceImageMode: boolean;
                        pageModeEnabled: boolean;
                        positionMarkerEnabled: boolean;
                    };
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
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        instructionsEnabled: boolean;
                        shareFrameEnabled: boolean;
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
                fallbackDegradedLabel: string;
                fallbackDegradedMessage: string;
                forbiddenResourceMessage: string;
                mediaViewer: string;
                skipToDownload: string;
                termsOfUse: string;
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
                    zoomToBoundsEnabled: boolean;
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
                            thumbsCacheInvalidation: {
                                enabled: boolean;
                                paramType: string;
                            };
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
                    downloadDialogue: {
                        options: {
                            confinedImageSize: number;
                            currentViewDisabledPercentage: number;
                            maxImageWidth: number;
                            optionsExplanatoryTextEnabled: boolean;
                            selectionEnabled: boolean;
                        };
                        content: {
                            allPages: string;
                            currentViewAsJpg: string;
                            currentViewAsJpgExplanation: string;
                            download: string;
                            downloadSelection: string;
                            downloadSelectionExplanation: string;
                            editSettings: string;
                            entireDocument: string;
                            entireFileAsOriginal: string;
                            individualPages: string;
                            noneAvailable: string;
                            pagingNote: string;
                            preview: string;
                            selection: string;
                            termsOfUse: string;
                            title: string;
                            wholeImageHighRes: string;
                            wholeImageHighResExplanation: string;
                            wholeImageLowResAsJpg: string;
                            wholeImageLowResAsJpgExplanation: string;
                            wholeImagesHighRes: string;
                            wholeImagesHighResExplanation: string;
                        };
                    };
                    footerPanel: {
                        options: {
                            autocompleteAllowWords: boolean;
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
                            centerOptionsEnabled: boolean;
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
                    multiSelectDialogue: {
                        options: {
                            galleryThumbChunkedResizingEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            pageModeEnabled: boolean;
                        };
                        content: {
                            select: string;
                            selectAll: string;
                            title: string;
                        };
                    };
                    pagingHeaderPanel: {
                        options: {
                            autoCompleteBoxEnabled: boolean;
                            autocompleteAllowWords: boolean;
                            galleryButtonEnabled: boolean;
                            imageSelectionBoxEnabled: boolean;
                            pageModeEnabled: boolean;
                            pagingToggleEnabled: boolean;
                        };
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
                            previous: string;
                            previousImage: string;
                            previousPage: string;
                            settings: string;
                            twoUp: string;
                        };
                    };
                    openSeadragonCenterPanel: {
                        options: {
                            animationTime: number;
                            autoHideControls: boolean;
                            requiredStatementEnabled: boolean;
                            blendTime: number;
                            constrainDuringPan: boolean;
                            controlsFadeAfterInactive: number;
                            controlsFadeDelay: number;
                            controlsFadeLength: number;
                            defaultZoomLevel: number;
                            immediateRender: boolean;
                            maxZoomPixelRatio: number;
                            navigatorPosition: string;
                            pageGap: number;
                            showHomeControl: boolean;
                            trimAttributionCount: number;
                            visibilityRatio: number;
                        };
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
                    searchFooterPanel: {
                        options: {
                            elideDetailsTermsCount: number;
                            elideResultsTermsCount: number;
                            forceImageMode: boolean;
                            pageModeEnabled: boolean;
                            positionMarkerEnabled: boolean;
                        };
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
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            instructionsEnabled: boolean;
                            shareFrameEnabled: boolean;
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
                    clickThroughDialogue: {
                        content: {
                            viewTerms: string;
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
                zoomToBoundsEnabled: boolean;
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
                        thumbsCacheInvalidation: {
                            enabled: boolean;
                            paramType: string;
                        };
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
                downloadDialogue: {
                    options: {
                        confinedImageSize: number;
                        currentViewDisabledPercentage: number;
                        maxImageWidth: number;
                        optionsExplanatoryTextEnabled: boolean;
                        selectionEnabled: boolean;
                    };
                    content: {
                        allPages: string;
                        currentViewAsJpg: string;
                        currentViewAsJpgExplanation: string;
                        download: string;
                        downloadSelection: string;
                        downloadSelectionExplanation: string;
                        editSettings: string;
                        entireDocument: string;
                        entireFileAsOriginal: string;
                        individualPages: string;
                        noneAvailable: string;
                        pagingNote: string;
                        preview: string;
                        selection: string;
                        termsOfUse: string;
                        title: string;
                        wholeImageHighRes: string;
                        wholeImageHighResExplanation: string;
                        wholeImageLowResAsJpg: string;
                        wholeImageLowResAsJpgExplanation: string;
                        wholeImagesHighRes: string;
                        wholeImagesHighResExplanation: string;
                    };
                };
                footerPanel: {
                    options: {
                        autocompleteAllowWords: boolean;
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
                        centerOptionsEnabled: boolean;
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
                multiSelectDialogue: {
                    options: {
                        galleryThumbChunkedResizingEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        pageModeEnabled: boolean;
                    };
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    options: {
                        autoCompleteBoxEnabled: boolean;
                        autocompleteAllowWords: boolean;
                        galleryButtonEnabled: boolean;
                        imageSelectionBoxEnabled: boolean;
                        pageModeEnabled: boolean;
                        pagingToggleEnabled: boolean;
                    };
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
                        previous: string;
                        previousImage: string;
                        previousPage: string;
                        settings: string;
                        twoUp: string;
                    };
                };
                openSeadragonCenterPanel: {
                    options: {
                        animationTime: number;
                        autoHideControls: boolean;
                        requiredStatementEnabled: boolean;
                        blendTime: number;
                        constrainDuringPan: boolean;
                        controlsFadeAfterInactive: number;
                        controlsFadeDelay: number;
                        controlsFadeLength: number;
                        defaultZoomLevel: number;
                        immediateRender: boolean;
                        maxZoomPixelRatio: number;
                        navigatorPosition: string;
                        pageGap: number;
                        showHomeControl: boolean;
                        trimAttributionCount: number;
                        visibilityRatio: number;
                    };
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
                searchFooterPanel: {
                    options: {
                        elideDetailsTermsCount: number;
                        elideResultsTermsCount: number;
                        forceImageMode: boolean;
                        pageModeEnabled: boolean;
                        positionMarkerEnabled: boolean;
                    };
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
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        instructionsEnabled: boolean;
                        shareFrameEnabled: boolean;
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
                clickThroughDialogue: {
                    content: {
                        viewTerms: string;
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
                fallbackDegradedLabel: string;
                fallbackDegradedMessage: string;
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
                    zoomToBoundsEnabled: boolean;
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
                            thumbsCacheInvalidation: {
                                enabled: boolean;
                                paramType: string;
                            };
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
                    downloadDialogue: {
                        options: {
                            confinedImageSize: number;
                            currentViewDisabledPercentage: number;
                            maxImageWidth: number;
                            optionsExplanatoryTextEnabled: boolean;
                            selectionEnabled: boolean;
                        };
                        content: {
                            allPages: string;
                            currentViewAsJpg: string;
                            currentViewAsJpgExplanation: string;
                            download: string;
                            downloadSelection: string;
                            downloadSelectionExplanation: string;
                            editSettings: string;
                            entireDocument: string;
                            entireFileAsOriginal: string;
                            individualPages: string;
                            noneAvailable: string;
                            pagingNote: string;
                            preview: string;
                            selection: string;
                            termsOfUse: string;
                            title: string;
                            wholeImageHighRes: string;
                            wholeImageHighResExplanation: string;
                            wholeImageLowResAsJpg: string;
                            wholeImageLowResAsJpgExplanation: string;
                            wholeImagesHighRes: string;
                            wholeImagesHighResExplanation: string;
                        };
                    };
                    footerPanel: {
                        options: {
                            autocompleteAllowWords: boolean;
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
                            centerOptionsEnabled: boolean;
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
                    multiSelectDialogue: {
                        options: {
                            galleryThumbChunkedResizingEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            pageModeEnabled: boolean;
                        };
                        content: {
                            select: string;
                            selectAll: string;
                            title: string;
                        };
                    };
                    pagingHeaderPanel: {
                        options: {
                            autoCompleteBoxEnabled: boolean;
                            autocompleteAllowWords: boolean;
                            galleryButtonEnabled: boolean;
                            imageSelectionBoxEnabled: boolean;
                            pageModeEnabled: boolean;
                            pagingToggleEnabled: boolean;
                        };
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
                        options: {
                            animationTime: number;
                            autoHideControls: boolean;
                            requiredStatementEnabled: boolean;
                            blendTime: number;
                            constrainDuringPan: boolean;
                            controlsFadeAfterInactive: number;
                            controlsFadeDelay: number;
                            controlsFadeLength: number;
                            defaultZoomLevel: number;
                            immediateRender: boolean;
                            maxZoomPixelRatio: number;
                            navigatorPosition: string;
                            pageGap: number;
                            showHomeControl: boolean;
                            trimAttributionCount: number;
                            visibilityRatio: number;
                        };
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
                    searchFooterPanel: {
                        options: {
                            elideDetailsTermsCount: number;
                            elideResultsTermsCount: number;
                            forceImageMode: boolean;
                            pageModeEnabled: boolean;
                            positionMarkerEnabled: boolean;
                        };
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
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            instructionsEnabled: boolean;
                            shareFrameEnabled: boolean;
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
                zoomToBoundsEnabled: boolean;
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
                        thumbsCacheInvalidation: {
                            enabled: boolean;
                            paramType: string;
                        };
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
                downloadDialogue: {
                    options: {
                        confinedImageSize: number;
                        currentViewDisabledPercentage: number;
                        maxImageWidth: number;
                        optionsExplanatoryTextEnabled: boolean;
                        selectionEnabled: boolean;
                    };
                    content: {
                        allPages: string;
                        currentViewAsJpg: string;
                        currentViewAsJpgExplanation: string;
                        download: string;
                        downloadSelection: string;
                        downloadSelectionExplanation: string;
                        editSettings: string;
                        entireDocument: string;
                        entireFileAsOriginal: string;
                        individualPages: string;
                        noneAvailable: string;
                        pagingNote: string;
                        preview: string;
                        selection: string;
                        termsOfUse: string;
                        title: string;
                        wholeImageHighRes: string;
                        wholeImageHighResExplanation: string;
                        wholeImageLowResAsJpg: string;
                        wholeImageLowResAsJpgExplanation: string;
                        wholeImagesHighRes: string;
                        wholeImagesHighResExplanation: string;
                    };
                };
                footerPanel: {
                    options: {
                        autocompleteAllowWords: boolean;
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
                        centerOptionsEnabled: boolean;
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
                multiSelectDialogue: {
                    options: {
                        galleryThumbChunkedResizingEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        pageModeEnabled: boolean;
                    };
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    options: {
                        autoCompleteBoxEnabled: boolean;
                        autocompleteAllowWords: boolean;
                        galleryButtonEnabled: boolean;
                        imageSelectionBoxEnabled: boolean;
                        pageModeEnabled: boolean;
                        pagingToggleEnabled: boolean;
                    };
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
                    options: {
                        animationTime: number;
                        autoHideControls: boolean;
                        requiredStatementEnabled: boolean;
                        blendTime: number;
                        constrainDuringPan: boolean;
                        controlsFadeAfterInactive: number;
                        controlsFadeDelay: number;
                        controlsFadeLength: number;
                        defaultZoomLevel: number;
                        immediateRender: boolean;
                        maxZoomPixelRatio: number;
                        navigatorPosition: string;
                        pageGap: number;
                        showHomeControl: boolean;
                        trimAttributionCount: number;
                        visibilityRatio: number;
                    };
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
                searchFooterPanel: {
                    options: {
                        elideDetailsTermsCount: number;
                        elideResultsTermsCount: number;
                        forceImageMode: boolean;
                        pageModeEnabled: boolean;
                        positionMarkerEnabled: boolean;
                    };
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
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        instructionsEnabled: boolean;
                        shareFrameEnabled: boolean;
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
                    zoomToBoundsEnabled: boolean;
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
                            thumbsCacheInvalidation: {
                                enabled: boolean;
                                paramType: string;
                            };
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
                    downloadDialogue: {
                        options: {
                            confinedImageSize: number;
                            currentViewDisabledPercentage: number;
                            maxImageWidth: number;
                            optionsExplanatoryTextEnabled: boolean;
                            selectionEnabled: boolean;
                        };
                        content: {
                            allPages: string;
                            currentViewAsJpg: string;
                            currentViewAsJpgExplanation: string;
                            download: string;
                            downloadSelection: string;
                            downloadSelectionExplanation: string;
                            editSettings: string;
                            entireDocument: string;
                            entireFileAsOriginal: string;
                            individualPages: string;
                            noneAvailable: string;
                            pagingNote: string;
                            preview: string;
                            termsOfUse: string;
                            selection: string;
                            title: string;
                            wholeImageHighRes: string;
                            wholeImageHighResExplanation: string;
                            wholeImageLowResAsJpg: string;
                            wholeImageLowResAsJpgExplanation: string;
                            wholeImagesHighRes: string;
                            wholeImagesHighResExplanation: string;
                        };
                    };
                    footerPanel: {
                        options: {
                            autocompleteAllowWords: boolean;
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
                            centerOptionsEnabled: boolean;
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
                    multiSelectDialogue: {
                        options: {
                            galleryThumbChunkedResizingEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            pageModeEnabled: boolean;
                        };
                        content: {
                            select: string;
                            selectAll: string;
                            title: string;
                        };
                    };
                    pagingHeaderPanel: {
                        options: {
                            autoCompleteBoxEnabled: boolean;
                            autocompleteAllowWords: boolean;
                            galleryButtonEnabled: boolean;
                            imageSelectionBoxEnabled: boolean;
                            pageModeEnabled: boolean;
                            pagingToggleEnabled: boolean;
                        };
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
                        options: {
                            animationTime: number;
                            autoHideControls: boolean;
                            requiredStatementEnabled: boolean;
                            blendTime: number;
                            constrainDuringPan: boolean;
                            controlsFadeAfterInactive: number;
                            controlsFadeDelay: number;
                            controlsFadeLength: number;
                            defaultZoomLevel: number;
                            immediateRender: boolean;
                            maxZoomPixelRatio: number;
                            navigatorPosition: string;
                            pageGap: number;
                            showHomeControl: boolean;
                            trimAttributionCount: number;
                            visibilityRatio: number;
                        };
                    };
                    searchFooterPanel: {
                        options: {
                            elideDetailsTermsCount: number;
                            elideResultsTermsCount: number;
                            forceImageMode: boolean;
                            pageModeEnabled: boolean;
                            positionMarkerEnabled: boolean;
                        };
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
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            instructionsEnabled: boolean;
                            shareFrameEnabled: boolean;
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
                zoomToBoundsEnabled: boolean;
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
                        thumbsCacheInvalidation: {
                            enabled: boolean;
                            paramType: string;
                        };
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
                downloadDialogue: {
                    options: {
                        confinedImageSize: number;
                        currentViewDisabledPercentage: number;
                        maxImageWidth: number;
                        optionsExplanatoryTextEnabled: boolean;
                        selectionEnabled: boolean;
                    };
                    content: {
                        allPages: string;
                        currentViewAsJpg: string;
                        currentViewAsJpgExplanation: string;
                        download: string;
                        downloadSelection: string;
                        downloadSelectionExplanation: string;
                        editSettings: string;
                        entireDocument: string;
                        entireFileAsOriginal: string;
                        individualPages: string;
                        noneAvailable: string;
                        pagingNote: string;
                        preview: string;
                        termsOfUse: string;
                        selection: string;
                        title: string;
                        wholeImageHighRes: string;
                        wholeImageHighResExplanation: string;
                        wholeImageLowResAsJpg: string;
                        wholeImageLowResAsJpgExplanation: string;
                        wholeImagesHighRes: string;
                        wholeImagesHighResExplanation: string;
                    };
                };
                footerPanel: {
                    options: {
                        autocompleteAllowWords: boolean;
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
                        centerOptionsEnabled: boolean;
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
                multiSelectDialogue: {
                    options: {
                        galleryThumbChunkedResizingEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        pageModeEnabled: boolean;
                    };
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    options: {
                        autoCompleteBoxEnabled: boolean;
                        autocompleteAllowWords: boolean;
                        galleryButtonEnabled: boolean;
                        imageSelectionBoxEnabled: boolean;
                        pageModeEnabled: boolean;
                        pagingToggleEnabled: boolean;
                    };
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
                    options: {
                        animationTime: number;
                        autoHideControls: boolean;
                        requiredStatementEnabled: boolean;
                        blendTime: number;
                        constrainDuringPan: boolean;
                        controlsFadeAfterInactive: number;
                        controlsFadeDelay: number;
                        controlsFadeLength: number;
                        defaultZoomLevel: number;
                        immediateRender: boolean;
                        maxZoomPixelRatio: number;
                        navigatorPosition: string;
                        pageGap: number;
                        showHomeControl: boolean;
                        trimAttributionCount: number;
                        visibilityRatio: number;
                    };
                };
                searchFooterPanel: {
                    options: {
                        elideDetailsTermsCount: number;
                        elideResultsTermsCount: number;
                        forceImageMode: boolean;
                        pageModeEnabled: boolean;
                        positionMarkerEnabled: boolean;
                    };
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
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        instructionsEnabled: boolean;
                        shareFrameEnabled: boolean;
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
                    zoomToBoundsEnabled: boolean;
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
                            thumbsCacheInvalidation: {
                                enabled: boolean;
                                paramType: string;
                            };
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
                    downloadDialogue: {
                        options: {
                            confinedImageSize: number;
                            currentViewDisabledPercentage: number;
                            maxImageWidth: number;
                            optionsExplanatoryTextEnabled: boolean;
                            selectionEnabled: boolean;
                        };
                        content: {
                            allPages: string;
                            currentViewAsJpg: string;
                            currentViewAsJpgExplanation: string;
                            download: string;
                            downloadSelection: string;
                            downloadSelectionExplanation: string;
                            editSettings: string;
                            entireDocument: string;
                            entireFileAsOriginal: string;
                            individualPages: string;
                            noneAvailable: string;
                            pagingNote: string;
                            preview: string;
                            selection: string;
                            termsOfUse: string;
                            title: string;
                            wholeImageHighRes: string;
                            wholeImageHighResExplanation: string;
                            wholeImageLowResAsJpg: string;
                            wholeImageLowResAsJpgExplanation: string;
                            wholeImagesHighRes: string;
                            wholeImagesHighResExplanation: string;
                        };
                    };
                    footerPanel: {
                        options: {
                            autocompleteAllowWords: boolean;
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
                            centerOptionsEnabled: boolean;
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
                    multiSelectDialogue: {
                        options: {
                            galleryThumbChunkedResizingEnabled: boolean;
                            galleryThumbChunkedResizingThreshold: number;
                            galleryThumbHeight: number;
                            galleryThumbLoadPadding: number;
                            galleryThumbWidth: number;
                            pageModeEnabled: boolean;
                        };
                        content: {
                            select: string;
                            selectAll: string;
                            title: string;
                        };
                    };
                    pagingHeaderPanel: {
                        options: {
                            autoCompleteBoxEnabled: boolean;
                            autocompleteAllowWords: boolean;
                            galleryButtonEnabled: boolean;
                            imageSelectionBoxEnabled: boolean;
                            pageModeEnabled: boolean;
                            pagingToggleEnabled: boolean;
                        };
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
                        options: {
                            animationTime: number;
                            autoHideControls: boolean;
                            requiredStatementEnabled: boolean;
                            blendTime: number;
                            constrainDuringPan: boolean;
                            controlsFadeAfterInactive: number;
                            controlsFadeDelay: number;
                            controlsFadeLength: number;
                            defaultZoomLevel: number;
                            immediateRender: boolean;
                            maxZoomPixelRatio: number;
                            navigatorPosition: string;
                            pageGap: number;
                            showHomeControl: boolean;
                            trimAttributionCount: number;
                            visibilityRatio: number;
                        };
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
                    searchFooterPanel: {
                        options: {
                            elideDetailsTermsCount: number;
                            elideResultsTermsCount: number;
                            forceImageMode: boolean;
                            pageModeEnabled: boolean;
                            positionMarkerEnabled: boolean;
                        };
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
                    shareDialogue: {
                        options: {
                            embedTemplate: string;
                            instructionsEnabled: boolean;
                            shareFrameEnabled: boolean;
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
                zoomToBoundsEnabled: boolean;
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
                        thumbsCacheInvalidation: {
                            enabled: boolean;
                            paramType: string;
                        };
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
                downloadDialogue: {
                    options: {
                        confinedImageSize: number;
                        currentViewDisabledPercentage: number;
                        maxImageWidth: number;
                        optionsExplanatoryTextEnabled: boolean;
                        selectionEnabled: boolean;
                    };
                    content: {
                        allPages: string;
                        currentViewAsJpg: string;
                        currentViewAsJpgExplanation: string;
                        download: string;
                        downloadSelection: string;
                        downloadSelectionExplanation: string;
                        editSettings: string;
                        entireDocument: string;
                        entireFileAsOriginal: string;
                        individualPages: string;
                        noneAvailable: string;
                        pagingNote: string;
                        preview: string;
                        selection: string;
                        termsOfUse: string;
                        title: string;
                        wholeImageHighRes: string;
                        wholeImageHighResExplanation: string;
                        wholeImageLowResAsJpg: string;
                        wholeImageLowResAsJpgExplanation: string;
                        wholeImagesHighRes: string;
                        wholeImagesHighResExplanation: string;
                    };
                };
                footerPanel: {
                    options: {
                        autocompleteAllowWords: boolean;
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
                        centerOptionsEnabled: boolean;
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
                multiSelectDialogue: {
                    options: {
                        galleryThumbChunkedResizingEnabled: boolean;
                        galleryThumbChunkedResizingThreshold: number;
                        galleryThumbHeight: number;
                        galleryThumbLoadPadding: number;
                        galleryThumbWidth: number;
                        pageModeEnabled: boolean;
                    };
                    content: {
                        select: string;
                        selectAll: string;
                        title: string;
                    };
                };
                pagingHeaderPanel: {
                    options: {
                        autoCompleteBoxEnabled: boolean;
                        autocompleteAllowWords: boolean;
                        galleryButtonEnabled: boolean;
                        imageSelectionBoxEnabled: boolean;
                        pageModeEnabled: boolean;
                        pagingToggleEnabled: boolean;
                    };
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
                    options: {
                        animationTime: number;
                        autoHideControls: boolean;
                        requiredStatementEnabled: boolean;
                        blendTime: number;
                        constrainDuringPan: boolean;
                        controlsFadeAfterInactive: number;
                        controlsFadeDelay: number;
                        controlsFadeLength: number;
                        defaultZoomLevel: number;
                        immediateRender: boolean;
                        maxZoomPixelRatio: number;
                        navigatorPosition: string;
                        pageGap: number;
                        showHomeControl: boolean;
                        trimAttributionCount: number;
                        visibilityRatio: number;
                    };
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
                searchFooterPanel: {
                    options: {
                        elideDetailsTermsCount: number;
                        elideResultsTermsCount: number;
                        forceImageMode: boolean;
                        pageModeEnabled: boolean;
                        positionMarkerEnabled: boolean;
                    };
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
                shareDialogue: {
                    options: {
                        embedTemplate: string;
                        instructionsEnabled: boolean;
                        shareFrameEnabled: boolean;
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
    renderDownloadDialogue(): void;
    checkForTarget(): void;
    checkForAnnotations(): void;
    annotate(annotations: AnnotationGroup[], terms?: string): void;
    groupWebAnnotationsByTarget(annotations: any): AnnotationGroup[];
    groupOpenAnnotationsByTarget(annotations: any): AnnotationGroup[];
    checkForSearchParam(): void;
    checkForRotationParam(): void;
    changeCanvas(canvasIndex: number): void;
    getViewer(): any;
    getMode(): Mode;
    getViewportBounds(): string | null;
    getViewerRotation(): number | null;
    viewRange(path: string): void;
    viewLabel(label: string): void;
    treeNodeSelected(node: TreeNode): void;
    clearAnnotations(): void;
    prevSearchResult(): void;
    nextSearchResult(): void;
    bookmark(): void;
    print(): void;
    getCroppedImageDimensions(canvas: Canvas, viewer: any): CroppedImageDimensions | null;
    getCroppedImageUri(canvas: Canvas, viewer: any): string | null;
    getConfinedImageDimensions(canvas: Canvas, width: number): Size;
    getConfinedImageUri(canvas: Canvas, width: number): string | null;
    getImageId(canvas: Canvas): string | null;
    getImageBaseUri(canvas: Canvas): string;
    getInfoUri(canvas: Canvas): string;
    getEmbedScript(template: string, width: number, height: number, zoom: string, rotation: number): string;
    isSearchEnabled(): boolean;
    isPagingSettingEnabled(): boolean;
    getAutoCompleteService(): Service | null;
    getAutoCompleteUri(): string | null;
    getSearchServiceUri(): string | null;
    search(terms: string): void;
    getSearchResults(searchUri: string, terms: string, searchResults: AnnotationGroup[], cb: (results: AnnotationGroup[]) => void): void;
    getAnnotationRects(): AnnotationRect[];
    getCurrentAnnotationRectIndex(): number;
    getTotalAnnotationRects(): number;
    isFirstAnnotationRect(): boolean;
    getLastAnnotationRectIndex(): number;
    getPrevPageIndex(canvasIndex?: number): number;
    getNextPageIndex(canvasIndex?: number): number;
    getPagedIndices(canvasIndex?: number): number[];
}
