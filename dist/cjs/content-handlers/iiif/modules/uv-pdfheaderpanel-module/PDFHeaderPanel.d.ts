import { HeaderPanel } from "../uv-shared-module/HeaderPanel";
export declare class PDFHeaderPanel extends HeaderPanel {
    $firstButton: JQuery;
    $lastButton: JQuery;
    $nextButton: JQuery;
    $nextOptions: JQuery;
    $prevButton: JQuery;
    $prevOptions: JQuery;
    $search: JQuery;
    $searchButton: JQuery;
    $searchText: JQuery;
    $total: JQuery;
    firstButtonEnabled: boolean;
    lastButtonEnabled: boolean;
    nextButtonEnabled: boolean;
    prevButtonEnabled: boolean;
    private _pageIndex;
    private _pdfDoc;
    constructor($element: JQuery);
    create(): void;
    render(): void;
    search(value: string): void;
    resize(): void;
}
