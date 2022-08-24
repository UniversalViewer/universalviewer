import { LeftPanel } from "../uv-shared-module/LeftPanel";
import { ThumbsView } from "./ThumbsView";
export declare class ResourcesLeftPanel extends LeftPanel {
    $resources: JQuery;
    $resourcesButton: JQuery;
    $resourcesView: JQuery;
    $tabs: JQuery;
    $tabsContent: JQuery;
    $thumbsButton: JQuery;
    $thumbsView: JQuery;
    $views: JQuery;
    thumbsView: ThumbsView;
    constructor($element: JQuery);
    create(): void;
    dataBind(): void;
    dataBindThumbsView(): void;
    expandFullStart(): void;
    expandFullFinish(): void;
    collapseFullStart(): void;
    collapseFullFinish(): void;
    resize(): void;
}
