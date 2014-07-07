class TreeNode {

    nodes: Array<TreeNode>;
    selected: boolean;
    expanded: boolean;

    constructor(public label?: string, public data?: any) {
        this.nodes = [];
        if (!data) this.data = {};
    }
}

export = TreeNode;