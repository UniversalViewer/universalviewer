class Commands {
    static namespace: string = 'mediaelementExtension.';

    static MEDIA_ENDED: string                      = Commands.namespace + 'onMediaEnded';
    static MEDIA_PAUSED: string                     = Commands.namespace + 'onMediaPaused';
    static MEDIA_PLAYED: string                     = Commands.namespace + 'onMediaPlayed';
    static TREE_NODE_SELECTED: string               = Commands.namespace + 'onTreeNodeSelected';
}

export = Commands;