import { BaseView } from "../uv-shared-module/BaseView";
import { TreeNode } from "manifesto.js";
export declare class TreeView extends BaseView {
    isOpen: boolean;
    treeComponent: any;
    treeData: any;
    $tree: JQuery;
    constructor($element: JQuery);
    create(): void;
    setup(): void;
    databind(): void;
    show(): void;
    hide(): void;
    selectNode(node: TreeNode): void;
    expandNode(node: TreeNode, expanded: boolean): void;
    getAllNodes(): TreeNode[];
    deselectCurrentNode(): void;
    getNodeById(id: string): TreeNode;
    resize(): void;
}
