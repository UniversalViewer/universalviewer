import React from "react";
import { Thumb } from "manifesto.js";
import { ViewingDirection } from "@iiif/vocabulary";
// import "@iiif/thumbnail-panel/dist/style.css";
import "./ThumbsViewCommons.css";
import {
  ThumbnailPanel,
  IIIFContentProvider,
  // useThumbnailPanelContext,
} from "@iiif/thumbnail-panel";

const Thumbnails = ({
  helper,
  onClick,
  paged,
  selected,
  thumbs,
  viewingDirection,
}: {
  helper: any;
  onClick: (thumb: Thumb) => void;
  paged: boolean;
  selected: number[];
  thumbs: Thumb[];
  viewingDirection: ViewingDirection;
}) => {
  console.log("paged", paged);
  return (
    <IIIFContentProvider>
      <ThumbnailPanel
        iiifContent={helper.manifestUri}
        orientation="vertical"
        overrides={
          {
            viewingDirection: viewingDirection,
            behavior: paged ? "paged" : "non-paged",
            thumbnailSize: 100,
          } as any
        }
        onResourceChanged={({ resourceIds }) => {
          const index = helper.getCanvasIndexById(resourceIds.current);
          onClick({
            index,
          } as Thumb);
        }}
      ></ThumbnailPanel>
    </IIIFContentProvider>
  );
};

export default Thumbnails;
