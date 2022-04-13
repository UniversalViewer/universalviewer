import React from "react";
import { Thumb } from "manifesto.js";
import { ViewingDirection } from "@iiif/vocabulary";
import cx from "classnames";

const ThumbsViewReact = ({
  paged,
  thumbs,
  viewingDirection,
}: {
  paged: boolean;
  thumbs: Thumb[];
  viewingDirection: ViewingDirection;
}) => {
  // const [thumbs, setThumbs] = useState<any>([]);

  // useEffect(() => {
  //   setThumbs([
  //     {
  //       label: "thumb 1",
  //     },
  //     {
  //       label: "thumb 2",
  //     },
  //     {
  //       label: "thumb 3",
  //     },
  //   ]);
  // }, []);

  return (
    <div className={`thumbs ${viewingDirection}`}>
      {/* {paged ? "paged" : "not paged"} */}
      {thumbs.map((thumb, index) => (
        <a
          id={`thumb${index}`}
          className={cx("thumb", {
            first: index === 0,
            placeholder: !thumb.uri,
            twoCol:
              viewingDirection === ViewingDirection.LEFT_TO_RIGHT ||
              viewingDirection === ViewingDirection.RIGHT_TO_LEFT ||
              paged,
            oneCol:
              !(
                viewingDirection === ViewingDirection.LEFT_TO_RIGHT ||
                viewingDirection === ViewingDirection.RIGHT_TO_LEFT
              ) && !paged,
          })}
          tabIndex={0}
        >
          <div
            className="wrap"
            style={{
              height: thumb.height + "px",
            }}
          ></div>
          <div className="info">
            <span className="index">{thumb.index + 1}</span>
            <span className="label" title="{{>label}}">
              {thumb.label}&nbsp;
            </span>
            <span
              className="searchResults"
              title="{{:~searchResultsTitle()}}"
            >{`todo`}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ThumbsViewReact;
