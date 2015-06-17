class TreeNode {

    expanded: boolean;
    nodes: Array<TreeNode>;
    parentNode: TreeNode;
    selected: boolean;

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