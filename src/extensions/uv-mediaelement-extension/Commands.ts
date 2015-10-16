class Commands {
    static namespace: string = 'mediaelementExtension.';

    static MEDIA_ENDED: string                      = Commands.namespace + 'onMediaEnded';
    static MEDIA_PAUSED: string                     = Commands.namespace + 'onMediaPaused';
    static MEDIA_PLAYED: string                     = Commands.namespace + 'onMediaPlayed';
}

export = Commands;