import { Thumb } from "manifesto.js";
import { ViewingDirection } from "@iiif/vocabulary";
declare const Thumbnails: ({ onClick, paged, selected, thumbs, viewingDirection, }: {
    onClick: (thumb: Thumb) => void;
    paged: boolean;
    selected: number[];
    thumbs: Thumb[];
    viewingDirection: ViewingDirection;
}) => JSX.Element;
export default Thumbnails;
