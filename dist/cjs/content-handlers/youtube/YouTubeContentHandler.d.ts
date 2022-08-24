import BaseContentHandler, { EventListener } from "../../BaseContentHandler";
import { IUVOptions } from "../../UniversalViewer";
import { YouTubeData } from "./YouTubeData";
import { UVAdapter } from "@/UVAdapter";
interface YouTubeConfig {
    controls?: boolean;
}
export default class YouTubeContentHandler extends BaseContentHandler<YouTubeData> {
    options: IUVOptions;
    adapter?: UVAdapter | undefined;
    private _id;
    config: YouTubeConfig;
    constructor(options: IUVOptions, adapter?: UVAdapter | undefined, eventListeners?: EventListener[]);
    private _getYouTubeVideoId;
    private _init;
    set(data: YouTubeData): void;
    exitFullScreen(): void;
    resize(): void;
    dispose(): void;
}
export {};
