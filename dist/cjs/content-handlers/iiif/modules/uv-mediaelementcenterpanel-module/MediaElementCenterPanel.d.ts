import { CenterPanel } from "../uv-shared-module/CenterPanel";
import { IExternalResource } from "manifesto.js";
import "mediaelement/build/mediaelement-and-player";
import "mediaelement-plugins/dist/source-chooser/source-chooser";
import "mediaelement-plugins/dist/source-chooser/source-chooser.css";
export declare class MediaElementCenterPanel extends CenterPanel {
    $wrapper: JQuery;
    $container: JQuery;
    $media: JQuery;
    mediaHeight: number;
    mediaWidth: number;
    player: any;
    title: string | null;
    constructor($element: JQuery);
    create(): void;
    openMedia(resources: IExternalResource[]): Promise<void>;
    isVideo(): boolean;
    resize(): void;
}
