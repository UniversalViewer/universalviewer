
class TreeNode {

    nodes: Array<TreeNode>;
    selected: boolean;
    expanded: boolean;

    constructor(public label?: string, public type?: string, public ref?: any, public path?: string) {
        this.nodes = [];
    }
}

export = TreeNode;