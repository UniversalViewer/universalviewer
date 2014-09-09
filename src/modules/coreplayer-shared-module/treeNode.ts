class TreeNode {

    nodes: Array<TreeNode>;
    selected: boolean;
    expanded: boolean;
    parentNode: TreeNode;

    constructor(public label?: string, public data?: any) {
        this.nodes = [];
        if (!data) this.data = {};
    }

    addNode(node: TreeNode): void{
        this.nodes.push(node);
        node.parentNode = this;
    }
}

export = TreeNode;