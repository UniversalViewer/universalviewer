import React, { useEffect, useRef, useState } from 'react';
import { TreeComponent } from '@iiif/iiif-tree-component';
import { TreeNode } from 'manifesto.js';
import { IIIFEvents } from '../../IIIFEvents';

interface TreeViewProps {
  extensionHost: {
    publish: (event: string, node: TreeNode) => void;
  };
  config?: string;
  treeData: any;
  className?: string;
}

const TreeView: React.FC<TreeViewProps> = ({ 
  extensionHost,
  config,
  treeData,
  className = 'REACT TESTING'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [treeComponent, setTreeComponent] = useState<any>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const expandedNodeIds = useRef(new Set<string>());

  useEffect(() => {
    if (treeRef.current) {
      const newTreeComponent = new TreeComponent({
        target: treeRef.current,
        data: treeData,
      });

      // Set up event listeners
      newTreeComponent.on(
        'treeNodeSelected',
        (node: TreeNode) => {
          extensionHost.publish(IIIFEvents.TREE_NODE_SELECTED, node);
        },
        false
      );

      newTreeComponent.on(
        'treeNodeMultiSelected',
        (node: TreeNode) => {
          extensionHost.publish(IIIFEvents.TREE_NODE_MULTISELECTED, node);
        },
        false
      );

      setTreeComponent(newTreeComponent);

    // Cleanup function
    return () => {
        // Clear the React state
        setTreeComponent(null);
        // Clear the reference to the DOM element
        if (treeRef.current) {
        treeRef.current.innerHTML = '';
            }
        }
    };
  }, [treeRef, treeData, extensionHost]);

  const saveState = () => {
    if (treeComponent) {
      const allNodes = treeComponent.getAllNodes();
      expandedNodeIds.current.clear();
      allNodes.forEach((node: TreeNode) => {
        if (node.expanded) {
          expandedNodeIds.current.add(node.id);
        }
      });
    }
  };

  const restoreState = () => {
    if (treeComponent) {
      const allNodes = treeComponent.getAllNodes();
      allNodes.forEach((node: TreeNode) => {
        if (expandedNodeIds.current.has(node.id)) {
          treeComponent.expandNode(node, true);
        }
      });
    }
  };

  // Public methods exposed through ref
  const publicMethods = {
    databind: () => {
      if (treeComponent) {
        saveState();
        treeComponent.set(treeData);
        restoreState();
      }
    },
    show: () => setIsOpen(true),
    hide: () => setIsOpen(false),
    selectNode: (node: TreeNode) => {
      if (treeComponent) {
        treeComponent.expandParents(node, true);
        const link = document.getElementById(`tree-link-${node.id}`);
        
        Promise.resolve().then(() => {
          treeComponent.selectNode(node);
        });
      }
    },
    expandNode: (node: TreeNode, expanded: boolean) => {
      if (treeComponent) {
        treeComponent.expandNode(node, expanded);
      }
    },
    getAllNodes: () => {
      return treeComponent?.getAllNodes() || [];
    },
    deselectCurrentNode: () => {
      if (treeComponent) {
        treeComponent.deselectCurrentNode();
      }
    },
    getNodeById: (id: string) => {
      return treeComponent?.getNodeById(id);
    }
  };

  // Use useImperativeHandle if you need to expose methods to parent components
  React.useImperativeHandle(React.forwardRef, () => publicMethods as any);

  return (
    <div 
      ref={treeRef}
      className={`iiif-tree-component ${className}`}
      style={{ display: isOpen ? 'block' : 'none' }}
    />
  );
};

export default TreeView;