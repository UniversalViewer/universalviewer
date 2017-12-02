export class Events {
    static namespace: string = 'mediaelementExtension.';

    static MEDIA_ENDED: string                      = Events.namespace + 'mediaEnded';
    static MEDIA_PAUSED: string                     = Events.namespace + 'mediaPaused';
    static MEDIA_PLAYED: string                     = Events.namespace + 'mediaPlayed';
}