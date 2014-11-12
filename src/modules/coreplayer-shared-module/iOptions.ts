
interface IOptions {
    labelsEnabled: boolean;
    pagingEnabled: boolean;
    theme: string;
    leftPanelEnabled: boolean;
    rightPanelEnabled: boolean;
    overrideFullScreen: boolean;

    // add these to extension-specific providers
    //preloadMoreInfo: boolean;
    //embedEnabled: boolean;
    //downloadEnabled: boolean;
    //saveToLightboxEnabled: boolean;

    //dziBaseUri: string;
    //thumbsBaseUri: string;
    //mediaBaseUri: string;
    //prefetchBaseUri: string;
    //searchBaseUri: string;
    //autoCompleteBaseUri: string;
    //moreInfoBaseUri: string;
    //loginBaseUri: string;
    //cropBaseUri: string;
    //imageBaseUri: string;
    //sectionMappings: any;
}

export = IOptions;
