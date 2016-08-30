// iiif-tree-component v1.0.1 https://github.com/viewdir/iiif-tree-component#readme

declare namespace IIIFComponents {
    interface ITreeComponent extends _Components.IBaseComponent {
        deselectCurrentNode(): void;
        getNodeById(id: string): Manifold.ITreeNode;
        selectNode(node: any): void;
        updateMultiSelectState(state: Manifold.MultiSelectState): void;
    }
}

declare namespace IIIFComponents {
    interface ITreeComponentOptions extends _Components.IBaseComponentOptions {
    }
}

declare namespace IIIFComponents {
    class TreeComponent extends _Components.BaseComponent implements ITreeComponent {
        options: ITreeComponentOptions;
        private _$tree;
        private _allNodes;
        private _multiSelectableNodes;
        private _selectedNode;
        private _multiSelectState;
        private _rootNode;
        constructor(options: ITreeComponentOptions);
        protected _init(): boolean;
        databind(rootNode: Manifold.ITreeNode): void;
        protected _getDefaultOptions(): ITreeComponentOptions;
        updateMultiSelectState(state: Manifold.MultiSelectState): void;
        allNodesSelected(): boolean;
        private _getMultiSelectableNodes();
        private _nodeIsMultiSelectable(node);
        private _getAllNodes();
        getMultiSelectedNodes(): Manifold.ITreeNode[];
        getNodeById(id: string): Manifold.ITreeNode;
        private _multiSelectTreeNode(node, isSelected);
        private _expandParents(node);
        private _setNodeSelected(node, selected);
        private _setNodeExpanded(node, expanded);
        private _setNodeMultiSelected(node, selected);
        private _setNodeMultiSelectEnabled(node, enabled);
        selectPath(path: string): void;
        deselectCurrentNode(): void;
        selectNode(node: any): void;
        getNodeByPath(parentNode: Manifold.ITreeNode, path: string[]): Manifold.ITreeNode;
        show(): void;
        hide(): void;
        protected _resize(): void;
    }
}
declare namespace IIIFComponents.TreeComponent {
    class Events {
        static TREE_NODE_MULTISELECTED: string;
        static TREE_NODE_SELECTED: string;
    }
}
