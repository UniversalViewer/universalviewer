import { BaseView } from "./BaseView";
export declare class FooterPanel extends BaseView {
    $feedbackButton: JQuery;
    $bookmarkButton: JQuery;
    $downloadButton: JQuery;
    $moreInfoButton: JQuery;
    $shareButton: JQuery;
    $embedButton: JQuery;
    $openButton: JQuery;
    $fullScreenBtn: JQuery;
    $options: JQuery;
    constructor($element: JQuery);
    create(): void;
    updateMinimisedButtons(): void;
    updateMoreInfoButton(): void;
    updateOpenButton(): void;
    updateFullScreenButton(): void;
    updateEmbedButton(): void;
    updateShareButton(): void;
    updateDownloadButton(): void;
    updateFeedbackButton(): void;
    updateBookmarkButton(): void;
    resize(): void;
}
